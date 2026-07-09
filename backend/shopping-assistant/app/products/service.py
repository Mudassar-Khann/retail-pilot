from typing import Dict, Any, List
from pydantic import BaseModel, Field
from app.products.models import Product
from app.products.repository import ProductRepository
import logging

logger = logging.getLogger(__name__)

class ProductSearchResult(BaseModel):
    products: List[Product] = Field(default_factory=list, description="List of products matching the search criteria")
    total_count: int = Field(description="Total number of matching products found")
    message: str = Field(description="Descriptive status or error message")

class ProductService:
    def __init__(self, repository: ProductRepository = None):
        self.repository = repository or ProductRepository()

    def search_catalog(self, filters: Dict[str, Any]) -> ProductSearchResult:
        """Validates search input, normalizes queries, and searches the product catalog.

        Args:
            filters: A dictionary of filters containing optional keys:
                - keyword (str)
                - category (str)
                - brand (str)
                - style (str)
                - color (str)
                - season (str)
                - gender (str)
                - min_price (float/int)
                - max_price (float/int)

        Returns:
            ProductSearchResult: A strongly typed search result.
        """
        logger.info(f"Received search request with filters: {filters}")

        # 1. Normalize and validate input values
        normalized_filters: Dict[str, Any] = {}
        errors = []

        # Validate price ranges
        min_price = filters.get("min_price")
        max_price = filters.get("max_price")

        if min_price is not None:
            try:
                min_price_val = float(min_price)
                if min_price_val < 0:
                    errors.append("Minimum price cannot be negative.")
                else:
                    normalized_filters["min_price"] = min_price_val
            except (ValueError, TypeError):
                errors.append("Minimum price must be a valid number.")

        if max_price is not None:
            try:
                max_price_val = float(max_price)
                if max_price_val < 0:
                    errors.append("Maximum price cannot be negative.")
                else:
                    normalized_filters["max_price"] = max_price_val
            except (ValueError, TypeError):
                errors.append("Maximum price must be a valid number.")

        if min_price is not None and max_price is not None:
            if "min_price" in normalized_filters and "max_price" in normalized_filters:
                if normalized_filters["min_price"] > normalized_filters["max_price"]:
                    errors.append("Minimum price cannot be greater than maximum price.")

        # Clean string filters
        string_fields = ["keyword", "category", "brand", "style", "color", "season", "gender"]
        for field in string_fields:
            val = filters.get(field)
            if val is not None:
                if isinstance(val, str):
                    cleaned = val.strip()
                    if cleaned:
                        normalized_filters[field] = cleaned
                else:
                    errors.append(f"{field} must be a string value.")

        # Return errors if validation fails
        if errors:
            err_msg = "Validation failed: " + "; ".join(errors)
            logger.warning(err_msg)
            return ProductSearchResult(
                products=[],
                total_count=0,
                message=err_msg
            )

        # 2. Query Repository
        try:
            products = self.repository.search_products(normalized_filters)
            count = len(products)
            msg = f"Found {count} products matching your criteria."
            logger.info(msg)
            return ProductSearchResult(
                products=products,
                total_count=count,
                message=msg
            )
        except Exception as e:
            err_msg = f"An unexpected error occurred during database search: {e}"
            logger.error(err_msg)
            return ProductSearchResult(
                products=[],
                total_count=0,
                message="Unable to search the product catalog due to an internal system error."
            )
