from __future__ import annotations

import logging
from typing import Literal, Optional

from google.adk.agents import Agent
from google.adk.models import Gemini
from google.genai import types
from pydantic import BaseModel, Field, field_validator

from app.config import Config
from app.products.models import Product
from app.products.repository import ProductRepository

logger = logging.getLogger(__name__)

INCOMPLETE_ALIGNMENT_RATING = "Incomplete Ensemble"
INCOMPLETE_CRITIQUE = "Drape an additional coordinates layer to evaluate alignment."


class StyleScoreRequest(BaseModel):
    top_id: Optional[int] = Field(default=None, ge=1)
    bottom_id: Optional[int] = Field(default=None, ge=1)
    gender: Literal["male", "female"] = "male"

    @field_validator("gender", mode="before")
    @classmethod
    def normalize_gender(cls, value: str) -> str:
        if not isinstance(value, str):
            return "male"
        lowered = value.strip().lower()
        return lowered if lowered in {"male", "female"} else "male"


class StyleScoreResult(BaseModel):
    compatibility_score: int = Field(ge=0, le=100)
    alignment_rating: str
    critique: str


STYLE_SCORING_INSTRUCTION = """You are the RetailPilot StyleScoringAgent, a strict master fashion critic.
Evaluate the compatibility between a top garment and a bottom garment with exacting taste.

You must analyze:
- Color Harmony: Do the shades balance elegantly or clash?
- Fabric Weight & Texture: Do the material heft and surface treatments support one another?
- Aesthetic Alignment: Do the garments belong to the same refined styling language?

Return only valid JSON matching this schema:
{
  "compatibility_score": int,
  "alignment_rating": string,
  "critique": string
}

Rules:
- compatibility_score must be an integer from 0 to 100.
- alignment_rating should be a concise luxury-fashion phrase in title case.
- critique must be exactly 2 sentences.
- Be specific, poetic, and discerning, never generic.
"""

StyleScoringAgent = Agent(
    name="style_scoring_agent",
    model=Gemini(
        model="gemini-2.5-flash",
        retry_options=types.HttpRetryOptions(attempts=2),
        client_kwargs={"api_key": Config.AI.GEMINI_API_KEY},
    ),
    instruction=STYLE_SCORING_INSTRUCTION,
)


def incomplete_style_score() -> StyleScoreResult:
    return StyleScoreResult(
        compatibility_score=0,
        alignment_rating=INCOMPLETE_ALIGNMENT_RATING,
        critique=INCOMPLETE_CRITIQUE,
    )


def score_style_compatibility(
    top_id: Optional[int],
    bottom_id: Optional[int],
    gender: str,
    repository: Optional[ProductRepository] = None,
    outerwear_id: Optional[int] = None,
    shoes_id: Optional[int] = None,
) -> StyleScoreResult:
    repo = repository or ProductRepository()

    if top_id is None or bottom_id is None:
        return incomplete_style_score()

    top = repo.get_by_id(top_id)
    bottom = repo.get_by_id(bottom_id)
    if top is None or bottom is None:
        return incomplete_style_score()

    outerwear = repo.get_by_id(outerwear_id) if outerwear_id is not None else None
    shoes = repo.get_by_id(shoes_id) if shoes_id is not None else None

    try:
        score = _score_with_gemini(top=top, bottom=bottom, gender=gender, outerwear=outerwear, shoes=shoes)
        if score is not None:
            return score
    except Exception as exc:
        logger.warning("Structured style scoring failed, using local fallback: %s", exc)

    return _heuristic_style_score(top=top, bottom=bottom, outerwear=outerwear, shoes=shoes)


def _score_with_gemini(
    top: Product,
    bottom: Product,
    gender: str,
    outerwear: Optional[Product] = None,
    shoes: Optional[Product] = None,
) -> Optional[StyleScoreResult]:
    api_key = Config.AI.GEMINI_API_KEY
    if not api_key or "YOUR_GOOGLE_AI_STUDIO_API_KEY" in api_key or "mock" in api_key.lower():
        return None

    model = StyleScoringAgent.model
    if not isinstance(model, Gemini):
        return None

    response = model.api_client.models.generate_content(
        model="gemini-2.5-flash",
        contents=_build_scoring_prompt(top=top, bottom=bottom, gender=gender, outerwear=outerwear, shoes=shoes),
        config=types.GenerateContentConfig(
            system_instruction=STYLE_SCORING_INSTRUCTION,
            response_mime_type="application/json",
            response_schema=StyleScoreResult,
            temperature=0.35,
        ),
    )

    if isinstance(response.parsed, StyleScoreResult):
        return response.parsed

    text = response.text or ""
    if text.strip():
        return StyleScoreResult.model_validate_json(text)
    return None


def _build_scoring_prompt(
    top: Product,
    bottom: Product,
    gender: str,
    outerwear: Optional[Product] = None,
    shoes: Optional[Product] = None,
) -> str:
    prompt = f"Model gender: {gender}\n"
    prompt += f"Top garment:\n{top.model_dump_json(indent=2)}\n\n"
    prompt += f"Bottom garment:\n{bottom.model_dump_json(indent=2)}\n\n"
    if outerwear:
        prompt += f"Outerwear:\n{outerwear.model_dump_json(indent=2)}\n\n"
    if shoes:
        prompt += f"Shoes:\n{shoes.model_dump_json(indent=2)}\n\n"
    prompt += "Judge the ensemble with disciplined luxury-fashion standards."
    return prompt


def _heuristic_style_score(
    top: Product,
    bottom: Product,
    outerwear: Optional[Product] = None,
    shoes: Optional[Product] = None,
) -> StyleScoreResult:
    score = 44

    top_styles = {tag.strip().lower() for tag in top.style_tags}
    bottom_styles = {tag.strip().lower() for tag in bottom.style_tags}
    shared_styles = top_styles & bottom_styles
    score += min(len(shared_styles) * 18, 36)

    # Outerwear synergy
    if outerwear:
        outer_styles = {tag.strip().lower() for tag in outerwear.style_tags}
        shared_outer = outer_styles & (top_styles | bottom_styles)
        score += min(len(shared_outer) * 8, 16)
        if outerwear.collection_name and (outerwear.collection_name == top.collection_name or outerwear.collection_name == bottom.collection_name):
            score += 6

    # Shoes synergy
    if shoes:
        shoes_styles = {tag.strip().lower() for tag in shoes.style_tags}
        shared_shoes = shoes_styles & (top_styles | bottom_styles)
        score += min(len(shared_shoes) * 8, 12)
        if shoes.collection_name and (shoes.collection_name == top.collection_name or shoes.collection_name == bottom.collection_name):
            score += 4

    if top.collection_name and bottom.collection_name and top.collection_name == bottom.collection_name:
        score += 12

    if _colors_harmonize(top.color, bottom.color):
        score += 14
    else:
        score -= 8

    # Check colors for outerwear/shoes too
    if outerwear and _colors_harmonize(outerwear.color, bottom.color):
        score += 4
    if shoes and _colors_harmonize(shoes.color, bottom.color):
        score += 4

    if _weights_align(top.description, bottom.description):
        score += 10
    else:
        score -= 6

    if _textures_sing_together(top.description, bottom.description):
        score += 8

    score = max(0, min(100, score))
    rating = _alignment_rating(score)
    critique = _critique_for(top=top, bottom=bottom, shared_styles=shared_styles, score=score)
    return StyleScoreResult(
        compatibility_score=score,
        alignment_rating=rating,
        critique=critique,
    )


def _colors_harmonize(top_color: str, bottom_color: str) -> bool:
    quiet_neutrals = {
        "black",
        "charcoal",
        "charcoalgray",
        "grey",
        "white",
        "cream",
        "navy",
        "olive",
        "olive drab",
        "beige",
        "camel",
        "tan",
        "burgundy",
        "indigo",
    }
    normalized_top = top_color.strip().lower()
    normalized_bottom = bottom_color.strip().lower()
    if normalized_top == normalized_bottom:
        return True
    if normalized_top in quiet_neutrals and normalized_bottom in quiet_neutrals:
        return True
    pairs = {
        ("burgundy", "olive"),
        ("cream", "olive"),
        ("navy", "cream"),
        ("charcoal", "olive"),
        ("indigo", "cream"),
    }
    return (normalized_top, normalized_bottom) in pairs or (normalized_bottom, normalized_top) in pairs


def _weights_align(top_description: str, bottom_description: str) -> bool:
    heavy_words = ("heavy", "heavyweight", "wool", "corduroy", "tapestry", "quilted", "canvas", "fleece", "rib-knit")
    light_words = ("lightweight", "linen", "popover", "soft", "draped")

    top_heavy = any(word in top_description.lower() for word in heavy_words)
    bottom_heavy = any(word in bottom_description.lower() for word in heavy_words)
    top_light = any(word in top_description.lower() for word in light_words)
    bottom_light = any(word in bottom_description.lower() for word in light_words)

    if top_heavy and bottom_heavy:
        return True
    if top_light and bottom_light:
        return True
    return not (top_heavy and bottom_light) and not (top_light and bottom_heavy)


def _textures_sing_together(top_description: str, bottom_description: str) -> bool:
    rich_terms = ("embroidered", "jacquard", "tapestry", "rib-knit", "corduroy")
    top_rich = any(word in top_description.lower() for word in rich_terms)
    bottom_rich = any(word in bottom_description.lower() for word in rich_terms)
    return top_rich == bottom_rich or (top_rich and "corduroy" in bottom_description.lower())


def _alignment_rating(score: int) -> str:
    if score >= 90:
        return "Elite Tailored Harmony"
    if score >= 75:
        return "Quiet Luxury Accord"
    if score >= 60:
        return "Considered Contrast"
    if score >= 40:
        return "Aesthetic Tension"
    return "Aesthetic Dissonance"


def _critique_for(top: Product, bottom: Product, shared_styles: set[str], score: int) -> str:
    top_phrase = f"the {top.color.lower()} {top.name.lower()}"
    bottom_phrase = f"the {bottom.color.lower()} {bottom.name.lower()}"
    style_phrase = (
        f" Their shared {next(iter(shared_styles))} instinct gives the pairing a coherent spine."
        if shared_styles
        else " Their styling languages pull in different directions, so the ensemble needs a firmer editorial anchor."
    )

    if score >= 75:
        return (
            f"{top_phrase.capitalize()} lands gracefully beside {bottom_phrase}, with the color register and material weight feeling intentionally composed rather than accidental."
            f"{style_phrase}"
        )

    if score >= 50:
        return (
            f"{top_phrase.capitalize()} and {bottom_phrase} create a workable contrast, though one piece is clearly carrying more of the visual authority."
            " Tightening the palette or repeating one tactile note would make the dialogue feel more polished."
        )

    return (
        f"{top_phrase.capitalize()} struggles against {bottom_phrase}, as the palette and fabric tempo never quite settle into the same rhythm."
        " Shift either the texture weight or the styling language so the outfit reads as a deliberate composition instead of two competing ideas."
    )
