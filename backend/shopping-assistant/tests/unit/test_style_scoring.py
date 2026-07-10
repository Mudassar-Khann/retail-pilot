import os

os.environ["GEMINI_API_KEY"] = "AIzaSyD-mock-test-key"
os.environ["DATABASE_URL"] = "sqlite:///test_style_scoring.db"

import pytest

from app.config import Config
from app.agents.style_scoring import (
    INCOMPLETE_ALIGNMENT_RATING,
    INCOMPLETE_CRITIQUE,
    score_style_compatibility,
)
from app.products.repository import ProductRepository


@pytest.fixture(scope="function")
def test_repo(tmp_path):
    db_file = tmp_path / "test_style_scoring.db"
    Config.Database.DATABASE_URL = f"sqlite:///{db_file}"
    return ProductRepository()


def test_style_score_incomplete_without_bottom(test_repo):
    result = score_style_compatibility(top_id=2001, bottom_id=None, gender="male", repository=test_repo)
    assert result.compatibility_score == 0
    assert result.alignment_rating == INCOMPLETE_ALIGNMENT_RATING
    assert result.critique == INCOMPLETE_CRITIQUE


def test_style_score_incomplete_with_unknown_product(test_repo):
    result = score_style_compatibility(top_id=9999, bottom_id=2004, gender="male", repository=test_repo)
    assert result.compatibility_score == 0
    assert result.alignment_rating == INCOMPLETE_ALIGNMENT_RATING


def test_style_score_returns_structured_heuristic_result(test_repo):
    result = score_style_compatibility(top_id=2001, bottom_id=2004, gender="male", repository=test_repo)
    assert 0 <= result.compatibility_score <= 100
    assert result.alignment_rating
    assert result.critique.count(".") >= 2


def test_style_score_penalizes_aesthetic_tension(test_repo):
    refined = score_style_compatibility(top_id=2001, bottom_id=2004, gender="male", repository=test_repo)
    discordant = score_style_compatibility(top_id=2006, bottom_id=19, gender="male", repository=test_repo)
    assert refined.compatibility_score > discordant.compatibility_score
