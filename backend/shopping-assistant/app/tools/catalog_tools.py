from typing import Optional, Dict, Any, List
from app.tools.registry import ToolRegistry
from app.services.catalog_service import CatalogService
from app.services.inventory_service import InventoryService

catalog_service = CatalogService()
inventory_service = InventoryService()

@ToolRegistry.register(
    name="search_catalog",
    description="Search the product catalog for garments matching category, style, color, price range, etc.",
    permissions=["read_catalog"],
    required_services=["CatalogService"]
)
def search_catalog(
    keyword: Optional[str] = None,
    category: Optional[str] = None,
    style: Optional[str] = None,
    color: Optional[str] = None,
    season: Optional[str] = None,
    max_price: Optional[float] = None
) -> str:
    """Queries the database for matching products and formats them into a simplified string format."""
    filters = {}
    if keyword: filters["keyword"] = keyword
    if category: filters["category"] = category
    if style: filters["style"] = style
    if color: filters["color"] = color
    if season: filters["season"] = season
    if max_price: filters["max_price"] = max_price

    products = catalog_service.search_catalog(filters)
    if not products:
        return "No products found matching these filters."

    lines = []
    for p in products:
        lines.append(
            f"Product ID: {p.id} | Name: {p.title} | Brand: {p.brand} | Category: {p.category} | "
            f"Style: {','.join(p.style_tags)} | Color: {','.join(p.colours)} | Price: ${p.price} | Stock: {p.stock} | Route: {p.product_url}"
        )
    return "\n".join(lines)

@ToolRegistry.register(
    name="check_item_stock",
    description="Check the stock quantity and availability status of a product by ID.",
    permissions=["read_inventory"],
    required_services=["InventoryService"]
)
def check_item_stock(product_id: int) -> str:
    stock = inventory_service.get_stock(product_id)
    status = inventory_service.get_availability_status(product_id)
    return f"Product ID {product_id} has {stock} items available. Status: {status}"

@ToolRegistry.register(
    name="get_product_details",
    description="Retrieve all structured details of a product by its numeric ID.",
    permissions=["read_catalog"],
    required_services=["CatalogService"]
)
def get_product_details(product_id: int) -> str:
    p = catalog_service.get_product_by_id(product_id)
    if not p:
        return f"Product ID {product_id} was not found."
    return (
        f"Product ID: {p.id}\n"
        f"Title: {p.title}\n"
        f"Brand: {p.brand}\n"
        f"Category: {p.category}\n"
        f"Description: {p.description}\n"
        f"Material: {p.material}\n"
        f"Fit: {p.fit}\n"
        f"Colors: {', '.join(p.colours)}\n"
        f"Sizes: {', '.join(p.available_sizes)}\n"
        f"Price: ${p.price}\n"
        f"Stock: {p.stock}\n"
        f"Route: {p.product_url}"
    )
