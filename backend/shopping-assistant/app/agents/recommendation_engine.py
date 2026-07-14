from typing import List, Dict, Any, Optional
from pydantic import BaseModel
from app.products.models import Product

class ScoringConfig(BaseModel):
    exact_style_weight: float = 15.0
    category_match_weight: float = 10.0
    high_stock_weight: float = 5.0
    in_stock_weight: float = 2.0
    out_of_stock_penalty: float = -20.0
    price_match_weight: float = 5.0

class RecommendationEngine:
    """
    Ranks products based on objective signals (style match, stock, price, etc.)
    using a configurable scoring system.
    """

    @staticmethod
    def rank_products(products: List[Product], criteria: Dict[str, Any], config: Optional[ScoringConfig] = None) -> List[Product]:
        cfg = config or ScoringConfig()

        def score(product: Product) -> float:
            s = 0.0

            # Style similarity
            if criteria.get("style"):
                target_style = criteria["style"].lower()
                if any(target_style in tag.lower() for tag in product.style_tags):
                    s += cfg.exact_style_weight

            # Category exact match
            if criteria.get("category"):
                if product.category.lower() == criteria["category"].lower():
                    s += cfg.category_match_weight

            # Stock availability
            if product.stock_quantity > 20:
                s += cfg.high_stock_weight
            elif product.stock_quantity > 0:
                s += cfg.in_stock_weight
            else:
                s += cfg.out_of_stock_penalty

            # Price range fit
            max_price = criteria.get("max_price")
            if max_price is not None:
                if product.price <= float(max_price):
                    s += cfg.price_match_weight

            # Qualitative similarity logic (placeholder for extended metadata checking)
            keyword = criteria.get("keyword")
            if keyword:
                if keyword.lower() in product.name.lower() or keyword.lower() in product.description.lower():
                    s += 8.0

            return s

        ranked = sorted(products, key=score, reverse=True)
        return ranked

    @staticmethod
    def get_top_candidates(products: List[Product], criteria: Dict[str, Any], limit: int = 5, config: Optional[ScoringConfig] = None) -> List[Product]:
        ranked = RecommendationEngine.rank_products(products, criteria, config)
        return ranked[:limit]
