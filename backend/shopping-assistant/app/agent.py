# ruff: noqa
# Copyright 2026 Google LLC
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     https://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

import os
import google.auth
from google.adk.agents import Agent
from google.adk.apps import App
from google.adk.models import Gemini
from google.genai import types

from app.config import Config
from app.tools import search_products

# Fail fast if configuration is invalid
Config.validate()

# Set up application environment defaults
try:
    _, project_id = google.auth.default()
except Exception:
    project_id = Config.App.GOOGLE_CLOUD_PROJECT or "mock-project-id"

os.environ["GOOGLE_CLOUD_PROJECT"] = project_id
os.environ["GOOGLE_CLOUD_LOCATION"] = Config.App.GOOGLE_CLOUD_LOCATION
os.environ["GOOGLE_GENAI_USE_VERTEXAI"] = Config.App.GOOGLE_GENAI_USE_VERTEXAI

# Create the root agent for the Shopping Assistant
root_agent = Agent(
    name="shopping_assistant",
    model=Gemini(
        model=Config.AI.MODEL_NAME,
        retry_options=types.HttpRetryOptions(attempts=3),
        client_kwargs={
            "api_key": Config.AI.GEMINI_API_KEY
        }
    ),
    instruction="""You are the RetailPilot AI Shopping Assistant.
You help customers search the product catalog for clothes, shoes, or accessories, and give fashion styling advice.
Aesthetics supported by the catalog: Old Money, Streetwear, Minimalist, Korean Fashion, Techwear.
Always use the search_products tool to find actual products. Do not guess or make up products.
Inform users of available sizing options, colors, brands, and prices of items you recommend.
""",
    tools=[search_products],
)

app = App(
    root_agent=root_agent,
    name="app",
)
