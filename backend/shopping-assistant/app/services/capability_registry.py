from typing import Dict, Any

class CapabilityRegistry:
    _registry: Dict[str, Any] = {}

    @classmethod
    def register_service(cls, name: str, instance: Any):
        cls._registry[name] = instance

    @classmethod
    def get_service(cls, name: str) -> Any:
        return cls._registry.get(name)

    @classmethod
    def list_capabilities(cls) -> list:
        return list(cls._registry.keys())
