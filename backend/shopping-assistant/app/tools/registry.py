from typing import Dict, Any, List, Callable, Optional

class ToolRegistry:
    _registry: Dict[str, Dict[str, Any]] = {}

    @classmethod
    def register(cls, name: str, description: str, permissions: List[str], required_services: List[str]):
        def decorator(func: Callable):
            cls._registry[name] = {
                "func": func,
                "description": description,
                "permissions": permissions,
                "required_services": required_services,
                "status": "healthy"
            }
            return func
        return decorator

    @classmethod
    def get_tool(cls, name: str) -> Optional[Callable]:
        entry = cls._registry.get(name)
        return entry["func"] if entry else None

    @classmethod
    def list_tools(cls) -> List[str]:
        return list(cls._registry.keys())

    @classmethod
    def get_tool_metadata(cls, name: str) -> Optional[Dict[str, Any]]:
        return cls._registry.get(name)
