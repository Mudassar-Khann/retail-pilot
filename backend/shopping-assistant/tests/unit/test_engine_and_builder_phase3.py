import pytest
from pathlib import Path
from app.config import Config
from app.products.repository import ProductRepository
from app.services.catalog_service import CatalogService
from app.knowledge import FashionKnowledgeService
from app.recommendation.engine import RecommendationEngine
from app.outfits.builder import OutfitBuilderService
from app.services.capability_registry import CapabilityRegistry
from app.services.memory_service import MemoryService

@pytest.fixture(scope="function")
def test_repo(tmp_path):
    db_file = tmp_path / "test_products_phase3.db"
    Config.Database.DATABASE_URL = f"sqlite:///{db_file}"
    return ProductRepository()

@pytest.fixture(scope="function")
def catalog_service(test_repo):
    return CatalogService(repository=test_repo)

@pytest.fixture(scope="function")
def outfit_builder(catalog_service):
    return OutfitBuilderService(catalog_service=catalog_service)

def test_recommendation_engine(catalog_service):
    """Verify that RecommendationEngine scores and ranks products deterministically."""
    products = catalog_service.get_all_products()
    assert len(products) > 0

    # Retrieve style profile for Old Money
    profile = FashionKnowledgeService().retrieve_aesthetic_guide("Old Money")
    assert profile is not None

    # Rank candidates with Old Money profile and style filter
    filters = {"style": "Old Money", "max_price": 200.0}
    res = RecommendationEngine.rank_products(products, profile, filters)

    assert len(res.items) > 0
    first_recommendation = res.items[0]

    # Assert score and reasons are compiled
    assert first_recommendation.score > -50.0  # Should not be penalized as out-of-stock
    assert len(first_recommendation.reasons) > 0
    assert any("style" in r.lower() for r in first_recommendation.reasons)

def test_outfit_builder(outfit_builder):
    """Verify OutfitBuilderService composes coordinate ensembles deterministically."""
    # Compose Old Money outfit
    outfit = outfit_builder.build_outfit_ensemble("Old Money", gender="Men", budget=500.0)

    assert outfit.style == "Old Money"

    # Verify slot assignments
    if outfit.top:
        assert outfit.top.garment_type == "Innerwear"
    if outfit.bottom:
        assert outfit.bottom.garment_type == "Bottom"
    if outfit.outerwear:
        assert outfit.outerwear.garment_type in ["Outerwear", "Innerwear"]
    if outfit.shoes:
        assert outfit.shoes.garment_type == "Footwear"

    assert outfit.total_price >= 0.0

def test_capability_registry():
    """Verify that CapabilityRegistry tracks active services."""
    # Register dummy service
    dummy_instance = "DummyCatalog"
    CapabilityRegistry.register_service("CatalogService", dummy_instance)

    assert CapabilityRegistry.get_service("CatalogService") == dummy_instance
    assert "CatalogService" in CapabilityRegistry.list_capabilities()

def test_memory_service():
    """Verify that MemoryService manages session preferences safely."""
    sess1 = "session_1"
    sess2 = "session_2"

    # Update sess1
    MemoryService.update_preferences(sess1, {"preferred_style": "Techwear", "liked_colors": ["Black"]})
    # Update sess2
    MemoryService.update_preferences(sess2, {"preferred_style": "Old Money"})

    mem1 = MemoryService.get_session_memory(sess1)
    mem2 = MemoryService.get_session_memory(sess2)

    assert mem1.preferred_style == "Techwear"
    assert "Black" in mem1.liked_colors
    assert mem2.preferred_style == "Old Money"
    assert "Black" not in mem2.liked_colors

    # Clear sess1
    MemoryService.clear_session(sess1)
    assert MemoryService.get_session_memory(sess1).preferred_style is None
