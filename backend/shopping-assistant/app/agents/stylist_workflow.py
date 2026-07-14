import re
from typing import Optional, Dict, Any, List
from google.adk.agents import Agent
from google.adk.models import Gemini
from google.adk.workflow import Workflow, Edge, FunctionNode, START
from google.adk import Event
from google.genai import types

from app.config import Config
from app.products.service import ProductService
from app.products.repository import ProductRepository
from app.agents.recommendation_engine import RecommendationEngine
from app.agents.schemas import StylistResponse, IntentType

# 1. Define ProductLookupTool
def search_products(
    keyword: Optional[str] = None,
    category: Optional[str] = None,
    style: Optional[str] = None,
    color: Optional[str] = None,
    season: Optional[str] = None,
    max_price: Optional[float] = None
) -> str:
    """Queries the database for matching products and ranks them using objective signals.
    Use this tool whenever the user asks for clothing recommendations or outfit building.

    Args:
        keyword: General search terms.
        category: General clothing category (e.g., 'T-Shirts', 'Shirts', 'Hoodies', 'Jackets', 'Jeans', 'Cargo Pants', 'Chinos', 'Shoes').
        style: Fashion style aesthetic (e.g., 'Old Money', 'Streetwear', 'Minimalist', 'Techwear', 'Korean Fashion').
        color: Primary color.
        season: Season (e.g., 'Summer', 'Winter', 'All').
        max_price: Maximum price.
    """
    filters = {}
    if keyword: filters["keyword"] = keyword
    if style: filters["style"] = style
    if category: filters["category"] = category
    if color: filters["color"] = color
    if season: filters["season"] = season
    if max_price: filters["max_price"] = max_price

    cleaned = {k: v for k, v in filters.items() if v is not None}

    service = ProductService()
    res = service.search_catalog(cleaned)
    if not res.products:
        return "No products found matching these filters."

    # Rank candidates using Recommendation Engine
    top_candidates = RecommendationEngine.get_top_candidates(res.products, cleaned, limit=5)

    output = []
    for p in top_candidates:
        output.append(
            f"Product ID: {p.id} | Name: {p.name} | Brand: {p.brand} | Category: {p.category} | "
            f"Style: {','.join(p.style_tags)} | Color: {p.color} | Price: ${p.price} | Stock: {p.stock_quantity}"
        )
    return "\n".join(output)

# 2. Define Node A: Analyze Query & Router
def analyze_query(node_input: str) -> Event:
    text = node_input.lower()
    is_order = any(x in text for x in ["order", "return", "refund", "purchase", "support"])

    # Check for 4-digit order number (e.g. 1001, #1005)
    order_id_match = re.search(r'\b(1\d{3})\b', text)
    order_id = int(order_id_match.group(1)) if order_id_match else None
    if order_id:
        is_order = True

    if is_order:
        return Event(
            route="order_support",
            output={"user_query": node_input, "order_id": order_id}
        )
    else:
        return Event(
            route="styling",
            output=node_input
        )

node_a = FunctionNode(name="analyze_query", func=analyze_query)

# 3. Define StylistAgent (JSON Structured Output)
StylistAgent = Agent(
    name="stylist_agent",
    model=Gemini(
        model=Config.AI.MODEL_NAME,
        retry_options=types.HttpRetryOptions(attempts=3),
        client_kwargs={
            "api_key": Config.AI.GEMINI_API_KEY
        },
        generate_content_kwargs={
            "response_mime_type": "application/json",
            "response_schema": StylistResponse.model_json_schema()
        }
    ),
    instruction="""You are the RetailPilot AI Personal Stylist.
Act as a high-end fashion consultant.
You MUST output ONLY valid JSON matching the requested schema.

Workflow:
1. If the user asks for fashion knowledge/advice (e.g. "What is Old Money?"), DO NOT search for products. Return intent="KNOWLEDGE" with your advice in "message".
2. If the user asks for products or outfits, YOU MUST call `search_products` to find available inventory.
3. After searching, generate recommendations based on the returned top candidates.
4. Explain WHY they pair well together according to the aesthetic. Do not invent products.

Use the `IntentType` enum:
- PRODUCT_SEARCH: For recommending items.
- OUTFIT: For building complete looks.
- KNOWLEDGE: For general advice without products.
""",
    tools=[search_products]
)

# 4. Define Order Support Tools
def query_order_status(order_id: int) -> str:
    repo = ProductRepository()
    order = repo.get_order(order_id)
    if not order:
        return f"Order #{order_id} was not found in our records."

    return f"Order ID: {order.id} | Total: ${order.total_price:.2f} | Status: {order.order_status} | Purchase Date: {order.created_at}"

def flag_order_return(order_id: int) -> str:
    repo = ProductRepository()
    order = repo.get_order(order_id)
    if not order:
        return f"Order #{order_id} was not found."
    if order.order_status == "returned":
        return f"Order #{order_id} has already been returned."
    if order.order_status == "awaiting_return_approval":
        return f"Order #{order_id} is already pending return approval."

    repo.update_order_status(order_id, "awaiting_return_approval")
    return f"Return request initiated for Order #{order_id}."

OrderSupportAgent = Agent(
    name="order_support_agent",
    model=Gemini(
        model=Config.AI.MODEL_NAME,
        retry_options=types.HttpRetryOptions(attempts=3),
        client_kwargs={
            "api_key": Config.AI.GEMINI_API_KEY
        }
    ),
    instruction="""You are the RetailPilot Order Support Agent.
Act as a refined, polite assistant. You help query orders and request returns.
Use `query_order_status` and `flag_order_return`. Maintain an elegant tone.
""",
    tools=[query_order_status, flag_order_return]
)

# 5. Build Workflow Graph
edges = [
    Edge(from_node=START, to_node=node_a),
    Edge(from_node=node_a, to_node=StylistAgent, route="styling"),
    Edge(from_node=node_a, to_node=OrderSupportAgent, route="order_support")
]

stylist_workflow = Workflow(
    name="stylist_workflow",
    edges=edges
)
