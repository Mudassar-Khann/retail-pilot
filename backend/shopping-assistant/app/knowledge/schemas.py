from pydantic import BaseModel, Field
from typing import List, Optional

class StyleProfile(BaseModel):
    name: str = Field(description="Name of the fashion style aesthetic")
    philosophy: str = Field(description="Philosophy or guide description")
    preferred_colors: List[str] = Field(default_factory=list, description="List of preferred colors")
    forbidden_colors: List[str] = Field(default_factory=list, description="List of colors to avoid")
    formality: str = Field(description="Occasion or formality level designation")
    fabrics: List[str] = Field(default_factory=list, description="Preferred materials and textures")
    layering_pattern: List[str] = Field(default_factory=list, description="Order of coordinates layering")
    shoes: List[str] = Field(default_factory=list, description="Preferred footwear silhouettes")
    accessories: List[str] = Field(default_factory=list, description="Preferred accessories")
    compatible_categories: List[str] = Field(default_factory=list, description="Compatible catalog categories")
