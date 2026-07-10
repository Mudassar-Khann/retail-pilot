import re
from typing import Optional, Dict, Any
from google.adk.agents import Agent
from google.adk.models import Gemini
from google.adk.workflow import Workflow, Edge, FunctionNode, START
from google.adk import Event
from google.genai import types

from app.config import Config
from app.products.service import ProductService
from app.products.repository import ProductRepository

# 1. Define ProductLookupTool
def ProductLookupTool(
    style: Optional[str] = None,
    category: Optional[str] = None,
    color: Optional[str] = None,
    max_price: Optional[float] = None
) -> str:
    """Queries the SQLite database for matching clothes.
    
    Args:
        style: Fashion style aesthetic (e.g., 'Old Money', 'Streetwear', 'Minimalist', 'Techwear', 'Korean Fashion').
        category: General clothing category (e.g., 'T-Shirts', 'Shirts', 'Hoodies', 'Jackets', 'Jeans', 'Cargo Pants', 'Chinos', 'Shoes').
        color: Primary color.
        max_price: Maximum price.
    """
    filters = {}
    if style: filters["style"] = style
    if category: filters["category"] = category
    if color: filters["color"] = color
    if max_price: filters["max_price"] = max_price
    
    cleaned = {k: v for k, v in filters.items() if v is not None}
    
    service = ProductService()
    res = service.search_catalog(cleaned)
    if not res.products:
        return "No products found matching these filters."
        
    output = []
    for p in res.products:
        output.append(
            f"Product ID: {p.id} | Name: {p.name} | Brand: {p.brand} | Category: {p.category} | "
            f"Style: {','.join(p.style_tags)} | Color: {p.color} | Price: ${p.price}"
        )
    return "\n".join(output)

# 2. Define Node A: Analyze Query & Graph Router Decision
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
        style = None
        if "money" in text or "quiet" in text or "luxury" in text:
            style = "Old Money"
        elif "street" in text:
            style = "Streetwear"
        elif "tech" in text or "gorp" in text:
            style = "Techwear"
        elif "minim" in text:
            style = "Minimalist"
        elif "korean" in text or "seoul" in text:
            style = "Korean Fashion"
            
        return Event(
            route="styling",
            output={"user_query": node_input, "detected_style": style}
        )

node_a = FunctionNode(name="analyze_query", func=analyze_query)

# 3. Define Node B: Execute ProductLookupTool
def execute_lookup(node_input: dict) -> dict:
    style = node_input.get("detected_style")
    
    tops_info = ProductLookupTool(style=style, category="T-Shirts")
    if "No products found" in tops_info:
        tops_info = ProductLookupTool(style=style, category="Shirts")
        
    bottoms_info = ProductLookupTool(style=style, category="Jeans")
    if "No products found" in bottoms_info:
        bottoms_info = ProductLookupTool(style=style, category="Cargo Pants")
        if "No products found" in bottoms_info:
            bottoms_info = ProductLookupTool(style=style, category="Chinos")
            
    return {
        "user_query": node_input.get("user_query"),
        "style": style,
        "tops_found": tops_info,
        "bottoms_found": bottoms_info
    }

node_b = FunctionNode(name="execute_lookup", func=execute_lookup)

def execute_tryon(product_id: int) -> str:
    """
    Drapes the specified clothing item on the mannequin. Use this tool when the user
    explicitly asks to 'try on', 'drape', 'wear', 'visualize', or 'put on' a specific garment,
    or asks to see a recommended outfit combination.
    """
    return f"Successfully queued try-on action for Product ID {product_id}."

# 4. Define Node C: StylistAgent
StylistAgent = Agent(
    name="stylist_agent",
    model=Gemini(
        model=Config.AI.MODEL_NAME,
        retry_options=types.HttpRetryOptions(attempts=3),
        client_kwargs={
            "api_key": Config.AI.GEMINI_API_KEY
        }
    ),
    instruction="""You are the RetailPilot AI Personal Stylist.
Act as a high-end fashion consultant with a refined, restrained, and poetic voice.
You help customers build outfits matching their requested aesthetic.

You will receive an input dictionary containing:
- "user_query": The user's original request.
- "style": The detected style aesthetic.
- "tops_found": Available tops in that style.
- "bottoms_found": Available bottoms in that style.

Recommend ONE specific Top and ONE specific Bottom from the available items.
List the product name, brand, color, and price for the recommended items.
Explain why they pair well together according to the brand's aesthetic.

You can also use the execute_tryon tool to drape any recommended or requested garment onto the mannequin.

CRITICAL: At the very end of your response, you MUST append a structured layout coordinate block exactly in this format on a new line:
`[WEAR_OUTFIT: top_id, bottom_id]`
Replace top_id and bottom_id with the actual numerical IDs of the recommended top and bottom products.
Do not format this tag inside markdown code blocks. Just write it as raw text.
""",
    tools=[ProductLookupTool, execute_tryon]
)

# 5. Define Order Support Tools
def query_order_status(order_id: int) -> str:
    """Queries the database for order transaction details and status.
    
    Args:
        order_id: The numerical 4-digit order number (e.g. 1001).
    """
    repo = ProductRepository()
    order = repo.get_order(order_id)
    if not order:
        return f"Order #{order_id} was not found in our records."
        
    top_name = "None"
    bottom_name = "None"
    if order.top_product_id:
        top_item = repo.get_by_id(order.top_product_id)
        if top_item: top_name = top_item.name
    if order.bottom_product_id:
        bottom_item = repo.get_by_id(order.bottom_product_id)
        if bottom_item: bottom_name = bottom_item.name
        
    return (
        f"Order ID: {order.id} | Top: {top_name} | Bottom: {bottom_name} | "
        f"Total: ${order.total_price:.2f} | Status: {order.order_status} | "
        f"Purchase Date: {order.created_at}"
    )

def flag_order_return(order_id: int) -> str:
    """Initiates a return request for the given order, shifting its state to awaiting review.
    
    Args:
        order_id: The numerical 4-digit order number (e.g. 1001).
    """
    repo = ProductRepository()
    order = repo.get_order(order_id)
    if not order:
        return f"Order #{order_id} was not found."
    if order.order_status == "returned":
        return f"Order #{order_id} has already been returned and refunded."
    if order.order_status == "awaiting_return_approval":
        return f"Order #{order_id} is already pending return approval from staff."
        
    repo.update_order_status(order_id, "awaiting_return_approval")
    return (
        f"Return request initiated for Order #{order_id}. "
        "Status updated to: awaiting_return_approval. "
        "This return is now suspended pending review by staff at the Curator Curation Desk."
    )

# 6. Define OrderSupportAgent Node (Node D)
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
Act as a refined, polite, and helpful assistant.
You help customers query their orders and request returns or refunds.

You will receive an input dictionary containing:
- "user_query": The user's request.
- "order_id": The extracted order ID (if any).

Use the query_order_status tool to check order details.
Use the flag_order_return tool if the user explicitly wants to return or refund their order.

If they initiate a return, explain that refunds require manual curation review by staff at the Curation Desk and their request is now pending approval.
Always maintain a restrained, elegant tone.
""",
    tools=[query_order_status, flag_order_return]
)

# 7. Build Multi-Agent Routing Workflow
edges = [
    Edge(from_node=START, to_node=node_a),
    Edge(from_node=node_a, to_node=node_b, route="styling"),
    Edge(from_node=node_b, to_node=StylistAgent),
    Edge(from_node=node_a, to_node=OrderSupportAgent, route="order_support")
]

stylist_workflow = Workflow(
    name="stylist_workflow",
    edges=edges
)
