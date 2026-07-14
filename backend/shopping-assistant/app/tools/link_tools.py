from app.tools.registry import ToolRegistry
from app.services.catalog_service import CatalogService

catalog_service = CatalogService()

@ToolRegistry.register(
    name="generate_product_route_link",
    description="Generate a secure clickable route URL link for a product ID.",
    permissions=["read_catalog"],
    required_services=["CatalogService"]
)
def generate_product_route_link(product_id: int) -> str:
    p = catalog_service.get_product_by_id(product_id)
    if not p:
        return f"Product ID {product_id} was not found."
    return f"Product Link: {p.product_url}"
