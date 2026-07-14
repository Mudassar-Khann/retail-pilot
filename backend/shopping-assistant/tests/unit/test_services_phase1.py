import os
import json
from pathlib import Path
import pytest
from app.config import Config
from app.products.repository import ProductRepository
from app.services.catalog_service import CatalogService
from app.services.inventory_service import InventoryService

from app.services.metadata_normalizer import MetadataNormalizer, CanonicalMaterial, CanonicalFit, CanonicalOccasion

@pytest.fixture(scope="function")
def test_repo(tmp_path):
    db_file = tmp_path / "test_products_phase1.db"
    Config.Database.DATABASE_URL = f"sqlite:///{db_file}"
    return ProductRepository()

@pytest.fixture(scope="function")
def catalog_service(test_repo):
    return CatalogService(repository=test_repo)

@pytest.fixture(scope="function")
def inventory_service(test_repo):
    return InventoryService(repository=test_repo)

def test_style_profiles_loaded():
    """Verify that JSON style profiles are present, valid JSON, and contain required fields."""
    app_dir = Path(__file__).parent.parent.parent / "app"
    profiles_dir = app_dir / "knowledge" / "profiles"

    assert profiles_dir.exists(), f"Profiles directory not found at {profiles_dir}"

    required_keys = ["name", "philosophy", "preferred_colors", "forbidden_colors", "formality", "fabrics", "compatible_categories"]

    for filename in ["old_money.json", "streetwear.json", "techwear.json"]:
        filepath = profiles_dir / filename
        assert filepath.exists(), f"Profile file {filename} not found at {filepath}"

        with open(filepath, "r", encoding="utf-8") as f:
            profile_data = json.load(f)

        for key in required_keys:
            assert key in profile_data, f"Key '{key}' missing in style profile {filename}"
        assert profile_data["name"].lower() in filename.replace(".json", "").replace("_", " ").lower()

def test_catalog_service_mapping(catalog_service):
    """Verify that CatalogService maps database products to the RichProduct schema correctly."""
    products = catalog_service.get_all_products()
    assert len(products) > 0

    p = products[0]
    # Verify rich fields
    assert p.id is not None
    assert isinstance(p.slug, str)
    assert len(p.slug) > 0
    assert p.title is not None
    assert p.product_url == f"/product/{p.id}"
    assert isinstance(p.colours, list)
    assert len(p.colours) > 0
    assert isinstance(p.available_sizes, list)
    assert len(p.available_sizes) > 0
    assert isinstance(p.related_products, list)
    assert p.id not in p.related_products  # Should not relate to itself

def test_metadata_normalizer_and_synonyms():
    """Verify material, fit, and occasion normalization and synonym dictionaries."""
    # Material checks
    assert MetadataNormalizer.normalize_material("Shirt", "Crafted from soft cotton popover") == CanonicalMaterial.COTTON.value
    assert MetadataNormalizer.normalize_material("Shirt", "Organic combed cotton fabric") == CanonicalMaterial.COTTON.value
    assert MetadataNormalizer.normalize_material("Shawl Knit", "Heavyweight carded wool blend") == CanonicalMaterial.WOOL.value
    assert MetadataNormalizer.normalize_material("Chinos", "Linen blend fabric") == CanonicalMaterial.LINEN.value
    assert MetadataNormalizer.normalize_material("Jeans", "Durable denim pants") == CanonicalMaterial.DENIM.value
    assert MetadataNormalizer.normalize_material("Knit", "Cashmere blend") == CanonicalMaterial.CASHMERE.value

    # Fit checks
    assert MetadataNormalizer.normalize_fit("Oversized T-shirt", "Loose drop shoulder drape") == CanonicalFit.OVERSIZED.value
    assert MetadataNormalizer.normalize_fit("Tailored Blazer", "Structured fit silhouette") == CanonicalFit.STRUCTURED.value
    assert MetadataNormalizer.normalize_fit("Regular Trousers", "Standard cut") == CanonicalFit.REGULAR.value

    # Occasion checks
    assert MetadataNormalizer.normalize_occasion("Jackets", ["Old Money", "Casual"]) == CanonicalOccasion.SEMI_FORMAL_RESORT.value
    assert MetadataNormalizer.normalize_occasion("Hoodies", ["Techwear"]) == CanonicalOccasion.OUTDOOR_TECHNICAL.value
    assert MetadataNormalizer.normalize_occasion("T-Shirts", ["Streetwear"]) == CanonicalOccasion.URBAN_DAILY.value
    assert MetadataNormalizer.normalize_occasion("T-Shirts", ["Casual"]) == CanonicalOccasion.GENERAL.value


def test_inventory_service(inventory_service, test_repo):
    """Verify InventoryService stock queries and availability checkers."""
    raw_products = test_repo.get_all()
    assert len(raw_products) > 0

    p = raw_products[0]
    stock = inventory_service.get_stock(p.id)
    assert stock == p.stock_quantity

    is_in_stock = inventory_service.is_in_stock(p.id)
    assert is_in_stock == (p.stock_quantity > 0)

    status = inventory_service.get_availability_status(p.id)
    expected_status = "In Stock" if p.stock_quantity > 0 else "Out of Stock"
    assert status == expected_status

    # Non-existent product
    assert inventory_service.get_stock(99999) == 0
    assert not inventory_service.is_in_stock(99999)
    assert inventory_service.get_availability_status(99999) == "Out of Stock"
