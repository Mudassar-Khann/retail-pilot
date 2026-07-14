import pytest
from pathlib import Path
from app.planner import (
    IntentType, QueryNormalizer, IntentClassifier,
    QuerySegmenter, ConfidenceScorer, ExecutionPlanner,
    ExecutionValidator
)
from app.knowledge import FashionKnowledgeService

def test_query_normalizer():
    """Verify that QueryNormalizer sanitizes and cleans inputs."""
    assert QueryNormalizer.normalize("  Old Money   Shirts! ") == "old money shirts"
    assert QueryNormalizer.normalize("Find me order #1005.") == "find me order #1005"
    assert QueryNormalizer.normalize("") == ""

def test_intent_classifier():
    """Verify that IntentClassifier maps text segments to intents."""
    assert IntentClassifier.classify_segment("hello there") == IntentType.GREETING
    assert IntentClassifier.classify_segment("what is quiet luxury?") == IntentType.FASHION_EDUCATION
    assert IntentClassifier.classify_segment("find a jacket") == IntentType.PRODUCT_SEARCH
    assert IntentClassifier.classify_segment("return order #1005") == IntentType.ORDER_SUPPORT
    assert IntentClassifier.classify_segment("is it in stock?") == IntentType.INVENTORY_QUERY
    assert IntentClassifier.classify_segment("compare item a and item b") == IntentType.COMPARISON

def test_query_segmenter():
    """Verify that QuerySegmenter splits compound queries on boundaries."""
    segments = QuerySegmenter.segment("Explain techwear and show me black pants under $100")
    assert len(segments) == 2
    assert "Explain techwear" in segments[0]
    assert "show me black pants under" in segments[1]

def test_confidence_scorer():
    """Verify that ConfidenceScorer scores queries correctly."""
    assert ConfidenceScorer.calculate_confidence("explain street style", [IntentType.FASHION_EDUCATION]) == 0.95
    assert ConfidenceScorer.calculate_confidence("something cool maybe", [IntentType.PRODUCT_SEARCH]) == 0.60
    assert ConfidenceScorer.calculate_confidence("regular text", [IntentType.PRODUCT_SEARCH]) == 0.85

def test_execution_planner():
    """Verify that ExecutionPlanner parses arguments and compiles steps."""
    plan = ExecutionPlanner.plan(
        session_id="test_sess",
        query="what is old money and show me navy shirts under 150",
        intents=[IntentType.FASHION_EDUCATION, IntentType.PRODUCT_SEARCH],
        confidence=0.95
    )

    assert plan.session_id == "test_sess"
    assert len(plan.steps) == 2

    step1 = plan.steps[0]
    assert step1.service_name == "FashionKnowledgeService"
    assert step1.method == "retrieve_aesthetic_guide"
    assert step1.arguments == {"aesthetic_name": "Old Money"}

    step2 = plan.steps[1]
    assert step2.service_name == "CatalogService"
    assert step2.method == "search_catalog"
    assert step2.arguments["filters"]["style"] == "Old Money"
    assert step2.arguments["filters"]["color"] == "Navy"
    assert step2.arguments["filters"]["category"] == "Shirts"
    assert step2.arguments["filters"]["max_price"] == 150.0

def test_execution_validator():
    """Verify that ExecutionValidator blocks invalid IDs or SQL injections."""
    plan_ok = ExecutionPlanner.plan(
        session_id="test",
        query="show product 2002",
        intents=[IntentType.PRODUCT_DETAILS],
        confidence=0.95
    )
    assert ExecutionValidator.validate(plan_ok)

    # Try invalid ID bounds
    plan_bad_id = ExecutionPlanner.plan(
        session_id="test",
        query="show product 999999",
        intents=[IntentType.PRODUCT_DETAILS],
        confidence=0.95
    )
    # The planner parses 999999 as ID but validator must reject
    assert not ExecutionValidator.validate(plan_bad_id)

    # Try SQL Injection string
    plan_sql = ExecutionPlanner.plan(
        session_id="test",
        query="show product union select * from products",
        intents=[IntentType.PRODUCT_DETAILS],
        confidence=0.95
    )
    assert not ExecutionValidator.validate(plan_sql)

def test_fashion_knowledge_service():
    """Verify that FashionKnowledgeService retrieves style profiles from JSON files."""
    svc = FashionKnowledgeService()

    guide = svc.retrieve_aesthetic_guide("Old Money")
    assert guide is not None
    assert guide.name == "Old Money"
    assert len(guide.preferred_colors) > 0

    non_existent = svc.retrieve_aesthetic_guide("Futuristic Cyberpunk")
    assert non_existent is None
