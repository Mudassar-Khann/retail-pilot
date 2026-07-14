import re

class QueryNormalizer:
    @staticmethod
    def normalize(query: str) -> str:
        if not query:
            return ""
        # Clean extra whitespace
        text = " ".join(query.strip().split())
        # Convert to lowercase
        text = text.lower()
        # Keep letters, numbers, spaces, hyphens, and hashes
        text = re.sub(r"[^\w\s#\-]", "", text)
        return text
