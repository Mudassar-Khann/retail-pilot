from typing import Dict, Any, List, Optional
from pydantic import BaseModel, Field

class SessionPreferences(BaseModel):
    preferred_style: Optional[str] = None
    liked_colors: List[str] = Field(default_factory=list)
    disliked_colors: List[str] = Field(default_factory=list)
    budget_limit: Optional[float] = None
    size_profile: Dict[str, str] = Field(default_factory=dict)
    viewed_products: List[int] = Field(default_factory=list)
    rejected_recommendations: List[int] = Field(default_factory=list)
    liked_products: List[int] = Field(default_factory=list)
    current_goal: Optional[str] = None

class MemoryService:
    _sessions: Dict[str, SessionPreferences] = {}

    @classmethod
    def get_session_memory(cls, session_id: str) -> SessionPreferences:
        if session_id not in cls._sessions:
            cls._sessions[session_id] = SessionPreferences()
        return cls._sessions[session_id]

    @classmethod
    def update_preferences(cls, session_id: str, updates: Dict[str, Any]):
        memory = cls.get_session_memory(session_id)
        for key, val in updates.items():
            if hasattr(memory, key):
                if isinstance(val, list):
                    current_list = getattr(memory, key)
                    for item in val:
                        if item not in current_list:
                            current_list.append(item)
                elif isinstance(val, dict):
                    current_dict = getattr(memory, key)
                    current_dict.update(val)
                else:
                    setattr(memory, key, val)

    @classmethod
    def clear_session(cls, session_id: str):
        if session_id in cls._sessions:
            del cls._sessions[session_id]
