import os
# Set a dummy API key before config is loaded to satisfy startup validation
os.environ["GEMINI_API_KEY"] = "AIzaSyD-mock-test-key"
os.environ["DATABASE_URL"] = "sqlite:///test_shopping_assistant.db"

import pytest
from app.config import Config
from app.products.repository import ProductRepository
from app.products.service import ProductService, ProductSearchResult
from app.products.seed import CATALOG_SEED_VERSION

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

def test_curated_keyword_queries(test_service):
    """Verify Sprint 2.1 editorial products are searchable by descriptive keywords."""
    floral = test_service.search_catalog({"keyword": "floral corduroy jacket"})
    assert any(p.id == 2008 for p in floral.products)

    tapestry = test_service.search_catalog({"keyword": "tapestry"})
    assert any(p.id in {2001, 2004, 2008, 2009} for p in tapestry.products)

    embroidery = test_service.search_catalog({"keyword": "embroidery"})
    assert any(p.id == 2006 for p in embroidery.products)

def test_catalog_seed_version_forces_reseed(test_repo):
    """Verify a stale seed version triggers a catalog rebuild on next repository init."""
    with test_repo._get_connection() as conn:
        conn.execute(
            """
            INSERT INTO app_metadata (key, value)
            VALUES ('catalog_seed_version', 'stale-version')
            ON CONFLICT(key) DO UPDATE SET value = excluded.value
            """
        )
        conn.execute("DELETE FROM products WHERE id = 2008")
        conn.commit()

    refreshed_repo = ProductRepository()
    refreshed = refreshed_repo.get_by_id(2008)

    assert refreshed is not None
    with refreshed_repo._get_connection() as conn:
        version = conn.execute(
            "SELECT value FROM app_metadata WHERE key = 'catalog_seed_version'"
        ).fetchone()[0]
    assert version == CATALOG_SEED_VERSION
