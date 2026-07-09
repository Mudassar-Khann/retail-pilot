import os
# Set a dummy API key before config is loaded to satisfy startup validation
os.environ["GEMINI_API_KEY"] = "AIzaSyD-mock-test-key"
os.environ["DATABASE_URL"] = "sqlite:///test_shopping_assistant.db"

import pytest
from app.config import Config
from app.products.models import Product
from app.products.repository import ProductRepository
from app.products.service import ProductService, ProductSearchResult

@pytest.fixture(scope="function")
def test_repo(tmp_path):
    # Use an in-memory or temporary database for unit testing
    db_file = tmp_path / "test_products.db"
    Config.Database.DATABASE_URL = f"sqlite:///{db_file}"
    repo = ProductRepository()
    return repo

@pytest.fixture(scope="function")
def test_service(test_repo):
    return ProductService(repository=test_repo)

def test_repo_initialization_and_seeding(test_repo):
    """Verify database schema creation and self-seeding."""
    products = test_repo.get_all()
    assert len(products) >= 30
    assert any(p.brand == "Belgravia Tailors" for p in products)
    assert any(p.category == "Hoodies" for p in products)

def test_get_by_id(test_repo):
    """Verify retrieving a single product by ID."""
    p = test_repo.get_by_id(1)
    assert p is not None
    assert p.id == 1
    assert p.name == "Classic Heavyweight Cotton Tee"

    non_existent = test_repo.get_by_id(999)
    assert non_existent is None

def test_search_by_keyword(test_service):
    """Verify keyword filtering on name and description."""
    res = test_service.search_catalog({"keyword": "Heavyweight"})
    assert res.total_count >= 1
    assert any("Heavyweight" in p.name for p in res.products)

    res_desc = test_service.search_catalog({"keyword": "vintage wash"})
    assert res_desc.total_count >= 1
    assert any("vintage wash" in p.description.lower() for p in res_desc.products)

def test_search_by_category(test_service):
    """Verify filtering by category (case-insensitive)."""
    res = test_service.search_catalog({"category": "jackets"})
    assert res.total_count > 0
    assert all(p.category == "Jackets" for p in res.products)

def test_search_by_brand(test_service):
    """Verify filtering by brand (case-insensitive)."""
    res = test_service.search_catalog({"brand": "systema tech"})
    assert res.total_count > 0
    assert all(p.brand == "Systema Tech" for p in res.products)

def test_search_by_style(test_service):
    """Verify filtering by fashion style tag."""
    res = test_service.search_catalog({"style": "Old Money"})
    assert res.total_count > 0
    assert all("Old Money" in p.style_tags for p in res.products)

def test_search_by_price_range(test_service):
    """Verify min_price and max_price filtering."""
    res = test_service.search_catalog({"min_price": 50.0, "max_price": 100.0})
    assert res.total_count > 0
    assert all(50.0 <= p.price <= 100.0 for p in res.products)

def test_search_multi_filter_combination(test_service):
    """Verify combining multiple filters together."""
    filters = {
        "category": "Shoes",
        "style": "Techwear",
        "max_price": 250.0
    }
    res = test_service.search_catalog(filters)
    assert res.total_count > 0
    for p in res.products:
        assert p.category == "Shoes"
        assert "Techwear" in p.style_tags
        assert p.price <= 250.0

def test_search_invalid_price_filters(test_service):
    """Verify validation handles negative prices and incorrect bounds."""
    # Negative price
    res = test_service.search_catalog({"min_price": -10.0})
    assert res.total_count == 0
    assert "cannot be negative" in res.message

    # Min price > Max price
    res2 = test_service.search_catalog({"min_price": 100.0, "max_price": 50.0})
    assert res2.total_count == 0
    assert "cannot be greater than maximum price" in res2.message

def test_search_empty_results(test_service):
    """Verify search returns empty list when no matches found."""
    res = test_service.search_catalog({"keyword": "NonexistentBrandOrItemXYZ"})
    assert res.total_count == 0
    assert len(res.products) == 0
