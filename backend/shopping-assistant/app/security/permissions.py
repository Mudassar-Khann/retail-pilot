from typing import List, Dict, Any
from app.planner.schemas import ExecutionPlan, IntentType
from app.tools.registry import ToolRegistry

class ToolPermissionValidator:
    TOOL_INTENT_MAP = {
        "search_catalog": [IntentType.PRODUCT_SEARCH, IntentType.RECOMMENDATION],
        "check_item_stock": [IntentType.INVENTORY_QUERY],
        "get_product_details": [IntentType.PRODUCT_DETAILS],
        "build_outfit_ensemble": [IntentType.OUTFIT_REQUEST],
        "generate_product_route_link": [
            IntentType.PRODUCT_SEARCH, IntentType.PRODUCT_DETAILS,
            IntentType.RECOMMENDATION, IntentType.OUTFIT_REQUEST
        ]
    }

    @classmethod
    def validate_plan_permissions(cls, plan: ExecutionPlan) -> bool:
        """Enforces tool access controls checking allowed intents and permissions."""
        for step in plan.steps:
            tool_name = step.method
            meta = ToolRegistry.get_tool_metadata(tool_name)
            if not meta:
                continue

            # 1. Intent boundary check
            allowed_intents = cls.TOOL_INTENT_MAP.get(tool_name, [])
            if not any(intent in allowed_intents for intent in plan.intents):
                return False

            # 2. Scope permission boundaries
            req_perms = meta.get("permissions", [])
            granted_perms = ["read_catalog"]
            if any(intent == IntentType.INVENTORY_QUERY for intent in plan.intents):
                granted_perms.append("read_inventory")

            if not all(perm in granted_perms for perm in req_perms):
                return False

        return True
