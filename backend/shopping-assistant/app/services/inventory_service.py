from typing import Optional
from app.products.repository import ProductRepository

class InventoryService:
    def __init__(self, repository: Optional[ProductRepository] = None):
        self.repository = repository or ProductRepository()

    def get_stock(self, product_id: int) -> int:
        p = self.repository.get_by_id(product_id)
        return p.stock_quantity if p else 0

    def is_in_stock(self, product_id: int) -> bool:
        return self.get_stock(product_id) > 0

    def get_availability_status(self, product_id: int) -> str:
        return "In Stock" if self.is_in_stock(product_id) else "Out of Stock"
