from typing import Optional
from app.products.service import ProductService, ProductSearchResult

def search_products(
    keyword: Optional[str] = None,
    category: Optional[str] = None,
    brand: Optional[str] = None,
    style: Optional[str] = None,
    color: Optional[str] = None,
    season: Optional[str] = None,
    gender: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
) -> ProductSearchResult:
    """Searches the product catalog for clothes, shoes, or accessories matching the given filters.

    All arguments are optional. The model can combine multiple filters.

    Args:
        keyword: General text query matching product names or descriptions (e.g., "oversized", "black", "hoodie").
        category: Exact category of clothing (e.g., "T-Shirts", "Shirts", "Hoodies", "Jackets", "Jeans", "Cargo Pants", "Chinos", "Shoes", "Accessories").
        brand: The brand name of the clothing (e.g. "Belgravia Tailors", "Systema Tech", "AetherStreet", "Loom & Craft", "K-Wave Studio").
        style: The fashion aesthetic tag (e.g., "Old Money", "Streetwear", "Minimalist", "Techwear", "Korean Fashion").
        color: The primary color (e.g. "Black", "White", "Beige", "Navy", "Camel", "Cream", "Olive", "Sage Green").
        season: The target season (e.g. "Summer", "Winter", "Spring", "Fall", "All-Season").
        gender: Target gender (e.g., "Men", "Women", "Unisex").
        min_price: Minimum retail price in USD.
        max_price: Maximum retail price in USD.

    Returns:
        ProductSearchResult: A strongly-typed search result.
    """
    filters = {
        "keyword": keyword,
        "category": category,
        "brand": brand,
        "style": style,
        "color": color,
        "season": season,
        "gender": gender,
        "min_price": min_price,
        "max_price": max_price,
    }
    # Filter out None values
    cleaned_filters = {k: v for k, v in filters.items() if v is not None}

    service = ProductService()
    return service.search_catalog(cleaned_filters)
