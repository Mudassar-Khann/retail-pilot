from enum import Enum
from typing import List, Dict, Any
from pydantic import BaseModel, Field

class IntentType(str, Enum):
    GREETING = "GREETING"
    FASHION_EDUCATION = "FASHION_EDUCATION"
    PRODUCT_SEARCH = "PRODUCT_SEARCH"
    PRODUCT_DETAILS = "PRODUCT_DETAILS"
    INVENTORY_QUERY = "INVENTORY_QUERY"
    OUTFIT_REQUEST = "OUTFIT_REQUEST"
    RECOMMENDATION = "RECOMMENDATION"
    COMPARISON = "COMPARISON"
    ORDER_SUPPORT = "ORDER_SUPPORT"
    GENERAL_CHAT = "GENERAL_CHAT"

class ExecutionStep(BaseModel):
    service_name: str = Field(description="Name of the service to run (e.g. CatalogService, FashionKnowledgeService)")
    method: str = Field(description="Method name to invoke")
    arguments: Dict[str, Any] = Field(default_factory=dict, description="Arguments to pass to the method")

class ExecutionPlan(BaseModel):
    session_id: str
    query: str
    intents: List[IntentType]
    steps: List[ExecutionStep]
    confidence_score: float
    requires_llm: bool
