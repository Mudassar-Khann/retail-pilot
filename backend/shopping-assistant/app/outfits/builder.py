from typing import Dict, Any, Optional, List
from pydantic import BaseModel
from app.services.catalog_service import CatalogService, RichProduct
from app.knowledge.schemas import StyleProfile

class OutfitComposition(BaseModel):
    style: str
    top: Optional[RichProduct] = None
    bottom: Optional[RichProduct] = None
    outerwear: Optional[RichProduct] = None
    shoes: Optional[RichProduct] = None
    total_price: float = 0.0
    status: str = "COMPLETE"  # COMPLETE, INCOMPLETE
    missing_slots: List[str] = []

class OutfitBuilderService:
    def __init__(self, catalog_service: Optional[CatalogService] = None):
        self.catalog_service = catalog_service or CatalogService()

    def build_outfit_ensemble(self, style: str, gender: str = "Unisex", budget: Optional[float] = None, profile: Optional[StyleProfile] = None) -> OutfitComposition:
        # Load style profile if not provided
        if not profile:
            from app.knowledge.fashion_service import FashionKnowledgeService
            profile = FashionKnowledgeService().retrieve_aesthetic_guide(style)

        style_name = profile.name if profile else style

        # Retrieve all in-stock products matching the target demographic
        all_products = self.catalog_service.get_all_products()
        candidates = []
        for p in all_products:
            if p.stock <= 0:
                continue
            if gender != "Unisex" and p.gender != "Unisex" and p.gender.lower() != gender.lower():
                continue

            # Match style tag or primary style designation
            style_match = False
            if profile:
                p_styles = {s.lower() for s in p.style_tags}
                if style.lower() in p_styles or style_name.lower() in p_styles or p.primary_style.lower() == style_name.lower():
                    style_match = True
            else:
                if any(style.lower() in t.lower() for t in p.style_tags):
                    style_match = True

            if style_match:
                # Color constraint
                if profile and profile.forbidden_colors:
                    p_colors = {c.lower() for c in p.colours}
                    forbidden = {c.lower() for c in profile.forbidden_colors}
                    if p_colors & forbidden:
                        continue
                candidates.append(p)

        # Sort candidates ascending by price
        candidates = sorted(candidates, key=lambda x: x.price)

        # Allocate garments into their respective layering slots
        top = None
        bottom = None
        outerwear = None
        shoes = None

        def find_slot_candidate(garment_types: List[str], layering_role: Optional[str] = None) -> Optional[RichProduct]:
            for p in candidates:
                if p.garment_type in garment_types:
                    if layering_role and p.layering_role != layering_role:
                        continue
                    return p
            return None

        top = find_slot_candidate(["Innerwear"], "base_layer") or find_slot_candidate(["Innerwear"])
        bottom = find_slot_candidate(["Bottom"])
        outerwear = find_slot_candidate(["Outerwear"], "shell") or find_slot_candidate(["Innerwear"], "mid_layer")
        shoes = find_slot_candidate(["Footwear"])

        # Compile set and compute total price
        allocated_items = [i for i in [top, bottom, outerwear, shoes] if i is not None]
        total_price = sum(i.price for i in allocated_items)

        # Apply budget constraints
        if budget is not None and total_price > budget:
            # Exclude outerwear if price cap is violated
            if outerwear:
                total_price -= outerwear.price
                outerwear = None
            # If budget is still violated, fallback to cheapest available top/bottom
            if total_price > budget:
                pass

        # Identify missing coordinate components
        missing = []
        if not top: missing.append("top")
        if not bottom: missing.append("bottom")
        if not shoes: missing.append("shoes")

        status = "COMPLETE" if not missing else "INCOMPLETE"

        return OutfitComposition(
            style=style_name,
            top=top,
            bottom=bottom,
            outerwear=outerwear,
            shoes=shoes,
            total_price=total_price,
            status=status,
            missing_slots=missing
        )
