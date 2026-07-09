import os
import sys
from pathlib import Path
from dotenv import load_dotenv

# Find .env relative to the project root (app's parent directory)
APP_DIR = Path(__file__).parent.resolve()
PROJECT_ROOT = APP_DIR.parent
ENV_PATH = PROJECT_ROOT / ".env"

# Load the environment variables from the .env file if it exists
if ENV_PATH.exists():
    load_dotenv(dotenv_path=ENV_PATH)
else:
    load_dotenv()

class Config:
    class AI:
        GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
        MODEL_NAME = os.getenv("MODEL_NAME", "gemini-flash-latest")
        TEMPERATURE = float(os.getenv("TEMPERATURE", "0.7"))

    class Database:
        DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///shopping_assistant.db")

    class Logging:
        LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO")

    class App:
        APP_ENV = os.getenv("APP_ENV", "development")
        GOOGLE_CLOUD_PROJECT = os.getenv("GOOGLE_CLOUD_PROJECT")
        GOOGLE_CLOUD_LOCATION = os.getenv("GOOGLE_CLOUD_LOCATION", "global")
        GOOGLE_GENAI_USE_VERTEXAI = os.getenv("GOOGLE_GENAI_USE_VERTEXAI", "True")
        LOGS_BUCKET_NAME = os.getenv("LOGS_BUCKET_NAME")
        ALLOW_ORIGINS = os.getenv("ALLOW_ORIGINS", "*")

    @classmethod
    def validate(cls):
        """Validates that critical configurations are present and not placeholders."""
        key = cls.AI.GEMINI_API_KEY

        # We only validate the API key if we're not running in a test mode or if it's explicitly required.
        # However, to meet "fail fast during startup" requirements, we raise a ValueError when missing or placeholder.
        if not key or key.strip() == "" or "YOUR_GOOGLE_AI_STUDIO_API_KEY" in key:
            print("\n" + "=" * 80, file=sys.stderr)
            print("CRITICAL CONFIGURATION ERROR:", file=sys.stderr)
            print("  Missing or unconfigured GEMINI_API_KEY environment variable.", file=sys.stderr)
            print(f"  Please configure a valid Google AI Studio API key in:\n  {ENV_PATH}", file=sys.stderr)
            print("  You can obtain an API key from Google AI Studio (https://aistudio.google.com/).", file=sys.stderr)
            print("=" * 80 + "\n", file=sys.stderr)
            raise ValueError(
                "Missing GEMINI_API_KEY. Configure it in your .env file or environment variables."
            )
