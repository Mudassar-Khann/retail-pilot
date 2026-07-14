class SecurityValidationError(Exception):
    def __init__(self, message: str):
        super().__init__(message)
        self.message = message

class SecurityFallbackHandler:
    @staticmethod
    def get_premium_fallback() -> str:
        return (
            "I apologize, but I cannot fulfill this request as stated. "
            "Please feel free to ask about our Timeless collections, styling guidance, or order status."
        )
