import re
from typing import Tuple

class InputGuardrails:
    MAX_PROMPT_LENGTH = 1000

    @classmethod
    def check_query(cls, query: str) -> Tuple[bool, str]:
        """Runs the query against all input security guardrails.
        Returns (is_safe, failure_reason)
        """
        if not query:
            return True, ""

        # 1. Extremely long prompt protection
        if len(query) > cls.MAX_PROMPT_LENGTH:
            return False, "Prompt length exceeds security threshold limit."

        # 2. XSS payload detection
        xss_patterns = [
            r"<script\b[^>]*>",
            r"javascript\s*:",
            r"onload\s*=",
            r"onerror\s*="
        ]
        for pattern in xss_patterns:
            if re.search(pattern, query, re.IGNORECASE):
                return False, "Cross-Site Scripting (XSS) pattern detected."

        # 3. SQL injection patterns (broad detection)
        sql_patterns = [
            r"\bunion\s+select\b",
            r"\bselect\b.*\bfrom\b",
            r"\bdrop\s+table\b",
            r"\bdelete\s+from\b",
            r"\binsert\s+into\b",
            r"\bupdate\b.*\bset\b"
        ]
        for pattern in sql_patterns:
            if re.search(pattern, query, re.IGNORECASE):
                return False, "SQL injection pattern detected."

        # 4. Prompt injection & Jailbreak attempts
        jailbreak_keywords = [
            "ignore previous instructions",
            "ignore the instructions",
            "bypass guardrails",
            "developer mode",
            "dan mode",
            "do anything now",
            "override role",
            "system prompt",
            "reveal system instructions",
            "show instruction",
            "reveal prompt"
        ]
        low_query = query.lower()
        if any(keyword in low_query for keyword in jailbreak_keywords):
            return False, "Prompt injection or jailbreak attempt detected."

        # 5. Role override detection
        role_override_patterns = [
            r"\byou\s+are\s+now\s+a\b",
            r"\bact\s+as\s+a\b",
            r"\broleplay\s+as\b"
        ]
        for pattern in role_override_patterns:
            if re.search(pattern, low_query):
                return False, "Role override attempt detected."

        # 6. Tool manipulation attempts
        tool_keywords = [
            "call tool",
            "invoke tool",
            "execute tool",
            "run tool",
            "bypass tool registry"
        ]
        if any(keyword in low_query for keyword in tool_keywords):
            return False, "Direct tool manipulation attempt detected."

        return True, ""
