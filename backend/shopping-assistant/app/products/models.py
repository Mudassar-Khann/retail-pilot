from pydantic import BaseModel, Field
from typing import List, Optional

class Product(BaseModel):
    id: int = Field(description="Unique product identifier")
    name: str = Field(description="Product name")
    description: str = Field(description="Detailed product description including fabric or fit")
    brand: str = Field(description="Product brand or designer label")
    category: str = Field(description="General category (e.g., T-Shirts, Hoodies, Jeans, Shoes)")
    style_tags: List[str] = Field(description="Fashion aesthetic tags (e.g. Old Money, Streetwear, Minimalist, Techwear, Korean Fashion)")
    color: str = Field(description="Primary color of the product")
    size_options: List[str] = Field(description="Available sizing options (e.g. S, M, L, XL)")
    price: float = Field(description="Retail price in USD")
    gender: str = Field(description="Target gender (Men, Women, Unisex)")
    season: str = Field(description="Target season (Spring, Summer, Fall, Winter, All-Season)")
    stock_quantity: int = Field(description="Number of items currently available in inventory")
    image_path: Optional[str] = Field(default=None, description="Path to the product image asset")
