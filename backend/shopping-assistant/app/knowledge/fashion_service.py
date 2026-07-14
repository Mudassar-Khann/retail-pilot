import os
import json
from pathlib import Path
from typing import Optional
from app.knowledge.schemas import StyleProfile

class FashionKnowledgeService:
    def __init__(self, profiles_dir: Optional[Path] = None):
        if profiles_dir:
            self.profiles_dir = profiles_dir
        else:
            app_dir = Path(__file__).parent.parent.resolve()
            self.profiles_dir = app_dir / "knowledge" / "profiles"

    def retrieve_aesthetic_guide(self, aesthetic_name: str) -> Optional[StyleProfile]:
        norm_name = aesthetic_name.lower().replace(" ", "_")
        filepath = self.profiles_dir / f"{norm_name}.json"

        if not filepath.exists():
            # Loose match check
            for p in self.profiles_dir.glob("*.json"):
                if norm_name in p.name.lower() or p.name.lower().replace(".json", "") in norm_name:
                    filepath = p
                    break

        if not filepath.exists():
            return None

        with open(filepath, "r", encoding="utf-8") as f:
            data = json.load(f)
            return StyleProfile.model_validate(data)
