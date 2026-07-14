import re
from typing import List, Dict, Any, Optional
from app.services.catalog_service import CatalogService, RichProduct

class OutputGuardrails:
    def __init__(self, catalog_service: Optional[CatalogService] = None):
        self.catalog_service = catalog_service or CatalogService()

    def validate_and_sanitize_product(self, product: RichProduct) -> Optional[RichProduct]:
        """Validates product fields for grounding, routing, and price correctness."""
        # 1. Grounding check: verify existence in catalog
        db_p = self.catalog_service.get_product_by_id(product.id)
        if not db_p:
            return None

        # 2. Stock correctness
        if product.stock < 0:
            return None

        # 3. Price boundary check
        if product.price <= 0.0:
            return None

        # 4. Link pattern verification
        if not re.match(r"^/product/\d+$", product.product_url):
            return None

        return product

    def filter_recommendations(self, products: List[RichProduct]) -> List[RichProduct]:
        """Filters a candidate list, stripping out anything violating catalog safety rules."""
        sanitized = []
        for p in products:
            val = self.validate_and_sanitize_product(p)
            if val:
                sanitized.append(val)
        return sanitized
