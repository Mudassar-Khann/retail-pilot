import re
from typing import List, Dict, Any
from app.planner.schemas import IntentType, ExecutionStep, ExecutionPlan

class ExecutionPlanner:
    @staticmethod
    def parse_arguments(query: str) -> Dict[str, Any]:
        text = query.lower()
        args = {}

        # Parse product ID (matches any 4-to-6 digit sequence)
        prod_match = re.search(r'\b(\d{4,6})\b', text)
        if prod_match:
            args["product_id"] = int(prod_match.group(1))

        # Parse order ID
        order_match = re.search(r'\b(1\d{3})\b', text)
        if order_match:
            args["order_id"] = int(order_match.group(1))

        # Parse budget / max price
        budget_match = re.search(r'(?:under|below|max|budget of)\s+\$?(\d+)', text)
        if budget_match:
            args["max_price"] = float(budget_match.group(1))

        # Parse style
        for style in ["old money", "streetwear", "techwear", "quiet luxury", "minimalist"]:
            if style in text:
                args["style"] = style.title()
                break

        # Parse category
        categories = {
            "hoodie": "Hoodies", "hoodies": "Hoodies",
            "tee": "T-Shirts", "t-shirt": "T-Shirts", "t-shirts": "T-Shirts",
            "shirt": "Shirts", "shirts": "Shirts",
            "jacket": "Jackets", "jackets": "Jackets",
            "chinos": "Chinos", "pants": "Chinos", "trousers": "Chinos",
            "shoes": "Shoes", "sneakers": "Shoes"
        }
        for kw, cat in categories.items():
            if kw in text:
                args["category"] = cat
                break

        # Parse color
        colors = ["black", "white", "navy", "camel", "cream", "olive", "beige", "gray"]
        for c in colors:
            if c in text:
                args["color"] = c.capitalize()
                break

        return args

    @classmethod
    def plan(cls, session_id: str, query: str, intents: List[IntentType], confidence: float) -> ExecutionPlan:
        steps = []
        requires_llm = True

        args = cls.parse_arguments(query)

        for intent in intents:
            if intent == IntentType.GREETING:
                pass

            elif intent == IntentType.FASHION_EDUCATION:
                style_name = args.get("style", "Old Money")
                steps.append(ExecutionStep(
                    service_name="FashionKnowledgeService",
                    method="retrieve_aesthetic_guide",
                    arguments={"aesthetic_name": style_name}
                ))

            elif intent == IntentType.PRODUCT_SEARCH:
                filters = {}
                if "category" in args: filters["category"] = args["category"]
                if "style" in args: filters["style"] = args["style"]
                if "color" in args: filters["color"] = args["color"]
                if "max_price" in args: filters["max_price"] = args["max_price"]

                steps.append(ExecutionStep(
                    service_name="CatalogService",
                    method="search_catalog",
                    arguments={"filters": filters}
                ))

            elif intent == IntentType.OUTFIT_REQUEST:
                style_name = args.get("style", "Old Money")
                gender = "Unisex"
                if "women" in query.lower() or "female" in query.lower():
                    gender = "Women"
                elif "men" in query.lower() or "male" in query.lower():
                    gender = "Men"

                steps.append(ExecutionStep(
                    service_name="OutfitBuilderService",
                    method="build_outfit_ensemble",
                    arguments={
                        "style": style_name,
                        "gender": gender,
                        "budget": args.get("max_price")
                    }
                ))

            elif intent == IntentType.PRODUCT_DETAILS:
                prod_id = args.get("product_id", 2001)
                steps.append(ExecutionStep(
                    service_name="CatalogService",
                    method="get_product_by_id",
                    arguments={"product_id": prod_id}
                ))

            elif intent == IntentType.INVENTORY_QUERY:
                prod_id = args.get("product_id", 2001)
                steps.append(ExecutionStep(
                    service_name="InventoryService",
                    method="get_availability_status",
                    arguments={"product_id": prod_id}
                ))

            elif intent == IntentType.ORDER_SUPPORT:
                order_id = args.get("order_id")
                if order_id:
                    if any(w in query.lower() for w in ["return", "refund"]):
                        steps.append(ExecutionStep(
                            service_name="OrderSupportAgent",
                            method="flag_order_return",
                            arguments={"order_id": order_id}
                        ))
                    else:
                        steps.append(ExecutionStep(
                            service_name="OrderSupportAgent",
                            method="query_order_status",
                            arguments={"order_id": order_id}
                        ))
                else:
                    pass

        return ExecutionPlan(
            session_id=session_id,
            query=query,
            intents=intents,
            steps=steps,
            confidence_score=confidence,
            requires_llm=requires_llm
        )
