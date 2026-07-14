from app.planner.schemas import IntentType

class IntentClassifier:
    @staticmethod
    def classify_segment(segment: str) -> IntentType:
        text = segment.strip().lower()
        if not text:
            return IntentType.GENERAL_CHAT

        # 1. Greetings
        if any(w in text for w in ["hello", "hi", "hey", "greetings", "good morning", "good afternoon"]):
            return IntentType.GREETING

        # 2. Order Support
        if any(w in text for w in ["order", "return", "refund", "track", "support", "status", "cancel"]):
            return IntentType.ORDER_SUPPORT

        # 3. Fashion Education / Knowledge
        if any(w in text for w in ["what is", "explain", "history of", "how to style", "tell me about", "philosophy of", "meaning of"]):
            return IntentType.FASHION_EDUCATION

        # 4. Outfit Request
        if any(w in text for w in ["outfit", "wear with", "coordinate", "look", "ensemble", "style me"]):
            return IntentType.OUTFIT_REQUEST

        # 5. Inventory Query
        if any(w in text for w in ["in stock", "available", "stock count", "sizes in stock", "do you have size"]):
            return IntentType.INVENTORY_QUERY

        # 6. Product Details
        if any(w in text for w in ["details of", "material of", "care instructions", "specs of", "made of"]):
            return IntentType.PRODUCT_DETAILS

        # 7. Comparison
        if any(w in text for w in ["compare", "difference between", "versus", "vs"]):
            return IntentType.COMPARISON

        # 8. Recommendation
        if any(w in text for w in ["recommend", "suggest", "pair with", "synergize"]):
            return IntentType.RECOMMENDATION

        # 9. Product Search
        if any(w in text for w in ["find", "search", "show me", "get me", "buy"]):
            return IntentType.PRODUCT_SEARCH

        return IntentType.PRODUCT_SEARCH
