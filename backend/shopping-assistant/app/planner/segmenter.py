import re
from typing import List

class QuerySegmenter:
    @staticmethod
    def segment(query: str) -> List[str]:
        if not query:
            return []

        # Split on conjunction boundaries and punctuation
        split_pattern = r"\b(?:and|but|also|then|as well as)\b|[,;\.]"
        parts = re.split(split_pattern, query, flags=re.IGNORECASE)

        segments = [p.strip() for p in parts if p.strip()]
        return segments if segments else [query]
