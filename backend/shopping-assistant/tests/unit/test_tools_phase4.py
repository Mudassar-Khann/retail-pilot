import pytest
from app.config import Config
from app.products.repository import ProductRepository
from app.tools.registry import ToolRegistry
from app.tools import (
    search_catalog, check_item_stock, get_product_details,
    build_outfit_ensemble, generate_product_route_link
)

@pytest.fixture(scope="module", autouse=True)
def setup_test_db():
    Config.Database.DATABASE_URL = "sqlite:///test_shopping_assistant.db"
    # Ensure database is self-seeded
    ProductRepository()

def test_tool_registry():
    """Verify that ToolRegistry stores tool functions and metadata."""
    assert "search_catalog" in ToolRegistry.list_tools()
    assert "check_item_stock" in ToolRegistry.list_tools()
    assert "get_product_details" in ToolRegistry.list_tools()
    assert "build_outfit_ensemble" in ToolRegistry.list_tools()
    assert "generate_product_route_link" in ToolRegistry.list_tools()

    meta = ToolRegistry.get_tool_metadata("search_catalog")
    assert meta is not None
    assert meta["permissions"] == ["read_catalog"]
    assert meta["required_services"] == ["CatalogService"]

def test_search_catalog_tool():
    """Verify that search_catalog tool returns formatted candidate list."""
    res = search_catalog(style="Old Money")
    assert "Product ID:" in res
    assert "Old Money" in res

    no_res = search_catalog(keyword="nonexistentgarmentnameXYZ")
    assert "No products found" in no_res

def test_check_item_stock_tool():
    """Verify that check_item_stock tool returns stock status details."""
    res = check_item_stock(product_id=2001)
    assert "Product ID 2001" in res
    assert "items available" in res

def test_get_product_details_tool():
    """Verify that get_product_details tool returns structured spec text."""
    res = get_product_details(product_id=2001)
    assert "Title: " in res
    assert "Brand: " in res
    assert "Route: /product/2001" in res

    not_found = get_product_details(product_id=99999)
    assert "not found" in not_found

def test_build_outfit_ensemble_tool():
    """Verify that build_outfit_ensemble tool returns a structured outfit string."""
    res = build_outfit_ensemble(style="Old Money", gender="Men", budget=500.0)
    assert "Aesthetic Outfit: Old Money" in res
    assert "Total Ensemble Price:" in res

def test_generate_product_route_link_tool():
    """Verify that generate_product_route_link tool returns exact url link."""
    res = generate_product_route_link(product_id=2001)
    assert "Product Link: /product/2001" in res

    not_found = generate_product_route_link(product_id=99999)
    assert "not found" in not_found
