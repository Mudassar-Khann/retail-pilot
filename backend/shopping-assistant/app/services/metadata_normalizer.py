from enum import Enum
from typing import List, Set

class CanonicalMaterial(str, Enum):
    COTTON = "Cotton"
    WOOL = "Wool"
    LINEN = "Linen"
    LEATHER = "Leather"
    DENIM = "Denim"
    CASHMERE = "Cashmere"
    CORDUROY = "Corduroy"
    TWEED = "Tweed"
    SILK = "Silk"
    PREMIUM_BLEND = "Premium Blend"

class CanonicalFit(str, Enum):
    SLIM = "Slim"
    REGULAR = "Regular Fit"
    RELAXED = "Relaxed"
    OVERSIZED = "Oversized / Relaxed"
    WIDE = "Wide"
    STRUCTURED = "Structured / Tailored"

class CanonicalOccasion(str, Enum):
    CASUAL = "Casual"
    SMART_CASUAL = "Smart Casual"
    BUSINESS = "Business"
    FORMAL = "Formal"
    SEMI_FORMAL_RESORT = "Semi-Formal / Resort Wear"
    OUTDOOR_TECHNICAL = "Outdoor / Technical Active"
    URBAN_DAILY = "Urban / Daily Casual"
    GENERAL = "General Wear"

class MetadataNormalizer:
    # Synonym mappings for Material
    MATERIAL_SYNONYMS = {
        CanonicalMaterial.COTTON: [
            "cotton", "heavyweight cotton", "premium cotton", "organic cotton",
            "combed cotton", "cotton popover", "pima cotton", "fleece", "jersey"
        ],
        CanonicalMaterial.WOOL: [
            "wool", "carded wool", "extra fine wool", "shawl knit", "merino"
        ],
        CanonicalMaterial.CASHMERE: ["cashmere", "pure cashmere"],
        CanonicalMaterial.LINEN: ["linen", "linen blend", "flax"],
        CanonicalMaterial.LEATHER: ["leather", "suede", "calfskin"],
        CanonicalMaterial.DENIM: ["denim", "denim pants", "selvedge denim"],
        CanonicalMaterial.CORDUROY: ["corduroy", "ribbed corduroy"],
        CanonicalMaterial.TWEED: ["tweed", "harris tweed"],
        CanonicalMaterial.SILK: ["silk", "mulberry silk"]
    }

    # Synonym mappings for Fit
    FIT_SYNONYMS = {
        CanonicalFit.OVERSIZED: ["oversized", "slouchy", "boxy", "relaxed", "loose", "wide-legged", "wide"],
        CanonicalFit.STRUCTURED: ["tailored", "structured", "slim", "fitted", "tapered"]
    }

    @classmethod
    def normalize_material(cls, name: str, description: str) -> str:
        text = (name + " " + description).lower()

        # Check synonyms
        for material, synonyms in cls.MATERIAL_SYNONYMS.items():
            for synonym in synonyms:
                if synonym in text:
                    return material.value
        return CanonicalMaterial.PREMIUM_BLEND.value

    @classmethod
    def normalize_fit(cls, name: str, description: str) -> str:
        text = (name + " " + description).lower()

        # Check synonyms
        for fit, synonyms in cls.FIT_SYNONYMS.items():
            for synonym in synonyms:
                if synonym in text:
                    return fit.value
        return CanonicalFit.REGULAR.value

    @classmethod
    def normalize_occasion(cls, category: str, style_tags: List[str]) -> str:
        styles = {s.lower().strip() for s in style_tags}

        if "old money" in styles or "quiet luxury" in styles:
            return CanonicalOccasion.SEMI_FORMAL_RESORT.value
        if "techwear" in styles:
            return CanonicalOccasion.OUTDOOR_TECHNICAL.value
        if "streetwear" in styles:
            return CanonicalOccasion.URBAN_DAILY.value

        return CanonicalOccasion.GENERAL.value

    @classmethod
    def normalize_colours(cls, color_str: str) -> List[str]:
        # Split and normalize color terms
        if not color_str:
            return []
        parts = [c.strip().capitalize() for c in color_str.split(",") if c.strip()]
        return parts
