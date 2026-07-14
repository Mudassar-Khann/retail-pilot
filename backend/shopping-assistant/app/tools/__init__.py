from app.tools.registry import ToolRegistry
from app.tools.catalog_tools import search_catalog, check_item_stock, get_product_details
from app.tools.outfit_tools import build_outfit_ensemble
from app.tools.link_tools import generate_product_route_link

# Alias for backward compatibility
search_products = search_catalog
