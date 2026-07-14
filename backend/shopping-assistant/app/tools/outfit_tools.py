from typing import Optional, List
from app.tools.registry import ToolRegistry
from app.outfits.builder import OutfitBuilderService

outfit_builder = OutfitBuilderService()

@ToolRegistry.register(
    name="build_outfit_ensemble",
    description="Assemble a coordinate outfit ensemble (Top, Bottom, Outerwear, Shoes) matching a style, gender, and budget.",
    permissions=["read_catalog"],
    required_services=["OutfitBuilderService"]
)
def build_outfit_ensemble(style: str, gender: str = "Unisex", budget: Optional[float] = None) -> str:
    res = outfit_builder.build_outfit_ensemble(style, gender, budget)

    lines = [f"Aesthetic Outfit: {res.style}", f"Status: {res.status}"]
    if res.top:
        lines.append(f"- Top: {res.top.title} (${res.top.price}) [ID: {res.top.id}]")
    if res.bottom:
        lines.append(f"- Bottom: {res.bottom.title} (${res.bottom.price}) [ID: {res.bottom.id}]")
    if res.outerwear:
        lines.append(f"- Outerwear: {res.outerwear.title} (${res.outerwear.price}) [ID: {res.outerwear.id}]")
    if res.shoes:
        lines.append(f"- Shoes: {res.shoes.title} (${res.shoes.price}) [ID: {res.shoes.id}]")

    lines.append(f"Total Ensemble Price: ${res.total_price:.2f}")
    if res.missing_slots:
        lines.append(f"Missing items: {', '.join(res.missing_slots)}")

    return "\n".join(lines)
