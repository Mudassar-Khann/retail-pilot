from typing import List, Dict, Any, Optional
from pydantic import BaseModel
from app.services.catalog_service import RichProduct
from app.knowledge.schemas import StyleProfile

class ScoredRecommendation(BaseModel):
    product: RichProduct
    score: float
    reasons: List[str]

class RecommendationResult(BaseModel):
    items: List[ScoredRecommendation]

class RecommendationEngine:
    @staticmethod
    def score_product(product: RichProduct, profile: Optional[StyleProfile], filters: Dict[str, Any]) -> ScoredRecommendation:
        score = 0.0
        reasons = []

        # 1. Style Match
        matched_style = False
        if profile:
            # Check compatibility
            p_style = product.style_tags[0].lower() if product.style_tags else ""
            if p_style == profile.name.lower() or product.primary_style.lower() == profile.name.lower():
                score += 15.0
                reasons.append("Matches requested style profile")
                matched_style = True
        elif filters.get("style"):
            target_style = filters["style"].lower()
            if any(target_style in tag.lower() for tag in product.style_tags):
                score += 15.0
                reasons.append("Matches requested style filter")
                matched_style = True

        # 2. Category Match
        if filters.get("category"):
            if product.category.lower() == filters["category"].lower():
                score += 10.0
                reasons.append("Matches target clothing category")

        # 3. Color Harmony
        if profile and profile.preferred_colors:
            p_colors = {c.lower() for c in product.colours}
            pref_colors = {c.lower() for c in profile.preferred_colors}
            intersect = p_colors & pref_colors
            if intersect:
                score += 15.0
                reasons.append(f"Coordinates with preferred colors: {', '.join(intersect)}")

            forbidden = {c.lower() for c in profile.forbidden_colors}
            if p_colors & forbidden:
                score -= 20.0
                reasons.append("Contains style profile forbidden colors")

        # 4. Material Synergy
        if profile and profile.fabrics:
            p_material = product.material.lower()
            pref_fabrics = {f.lower() for f in profile.fabrics}
            if p_material in pref_fabrics:
                score += 10.0
                reasons.append(f"Crafted from premium aesthetic material: {product.material}")

        # 5. Stock Level Check
        if product.stock > 20:
            score += 5.0
            reasons.append("Excellent inventory availability")
        elif product.stock > 0:
            score += 2.0
            reasons.append("Limited stock remaining")
        else:
            score -= 50.0
            reasons.append("Out of stock")

        # 6. Price Preference Match
        max_price = filters.get("max_price")
        if max_price is not None:
            if product.price <= float(max_price):
                score += 5.0
                reasons.append("Fits within requested budget limit")
            else:
                score -= 15.0
                reasons.append("Exceeds requested budget limit")

        return ScoredRecommendation(
            product=product,
            score=score,
            reasons=reasons
        )

    @classmethod
    def rank_products(cls, products: List[RichProduct], profile: Optional[StyleProfile], filters: Dict[str, Any]) -> RecommendationResult:
        scored = [cls.score_product(p, profile, filters) for p in products]
        # Sort desc by score
        scored_sorted = sorted(scored, key=lambda x: x.score, reverse=True)
        return RecommendationResult(items=scored_sorted)
