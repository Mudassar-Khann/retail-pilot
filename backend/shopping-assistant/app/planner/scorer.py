from typing import List
from app.planner.schemas import IntentType

class ConfidenceScorer:
    @staticmethod
    def calculate_confidence(query: str, intents: List[IntentType]) -> float:
        text = query.lower()
        if not text:
            return 1.0

        score = 0.85

        # Highly specific patterns trigger high confidence
        high_indicators = [
            "what is", "explain", "history of", "how to style",
            "order #", "track my order", "return request", "refund",
            "style me for", "outfit for", "in stock", "available size"
        ]
        if any(ind in text for ind in high_indicators):
            score = 0.95

        # Vague terms reduce confidence
        low_indicators = [
            "maybe", "dont know", "not sure", "something", "whatever",
            "anything", "random", "cool", "okay", "stuff"
        ]
        if any(ind in text for ind in low_indicators):
            score = 0.60

        return score
