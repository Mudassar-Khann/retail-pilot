from enum import Enum
from typing import List, Optional
from pydantic import BaseModel, Field

class IntentType(str, Enum):
    KNOWLEDGE = "KNOWLEDGE"
    PRODUCT_SEARCH = "PRODUCT_SEARCH"
    OUTFIT = "OUTFIT"
    COMPARE_PRODUCTS = "COMPARE_PRODUCTS"
    PRODUCT_DETAILS = "PRODUCT_DETAILS"
    COLLECTION = "COLLECTION"
    FOLLOW_UP = "FOLLOW_UP"
    STYLE_GUIDE = "STYLE_GUIDE"

class Recommendation(BaseModel):
    product_id: int = Field(description="The numeric ID of the recommended product.")
    reason: str = Field(description="Why this product matches the user's request.")
    match_label: str = Field(description="A qualitative label like 'Excellent Match', 'Perfect for Summer', etc. Do NOT use numbers/stars or fabricated percentages.")

class OutfitItem(BaseModel):
    type: str = Field(description="The type of clothing, e.g. 'top', 'bottom', 'outerwear', 'shoes'.")
    product_id: int = Field(description="The numeric ID of the product.")

class StylistResponse(BaseModel):
    message: str = Field(description="The message to display to the user. Explain the fashion advice or why you selected these products.")
    intent: IntentType = Field(description="The detected intent of the conversation.")
    recommendations: Optional[List[Recommendation]] = Field(default=None, description="A list of recommended products, if applicable.")
    outfit: Optional[List[OutfitItem]] = Field(default=None, description="A complete outfit composition, if applicable.")

# --- API Transport Models (Enriched) ---

class ProductSummary(BaseModel):
    """Pure database data, decoupled from AI explanations."""
    product_id: int
    name: str
    thumbnail: Optional[str] = None
    price: float
    availability: str
    short_metadata: str

class EnrichedRecommendation(BaseModel):
    """Combines objective product data with AI explanations."""
    product: ProductSummary
    reason: str
    match_label: str

class EnrichedOutfitItem(BaseModel):
    """Combines objective product data with the outfit role."""
    type: str
    product: ProductSummary

class EnrichedStylistResponse(BaseModel):
    message: str
    intent: IntentType
    recommendations: Optional[List[EnrichedRecommendation]] = None
    outfit: Optional[List[EnrichedOutfitItem]] = None

# --- Streaming Event Models ---

class ToolStatusEvent(BaseModel):
    event_type: str = "TOOL_STATUS"
    status: str
    message: str
