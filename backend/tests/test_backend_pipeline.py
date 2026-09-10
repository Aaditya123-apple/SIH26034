from __future__ import annotations

import os

from backend.app.services.inspection_service import InspectionService
from backend.app.services.declaration_extractor import DeclarationExtractor
from backend.app.rules_loader import resolve_rules


def test_detection_creates_inspection():
    service = InspectionService()
    event = {
        "product_id": "PROD-ALPHA",
        "product_name": "Alpha Atta",
        "confidence": 0.96,
        "source": "cnn",
        "images": ["demo-image.jpg"],
    }
    inspection = service.create_detection_inspection(event)
    assert inspection["inspection_id"].startswith("INSP-")
    assert inspection["product_name"] == "Alpha Atta"


def test_cnn_alias_uses_compatible_detection_provider(monkeypatch):
    monkeypatch.setenv("DETECTION_PROVIDER", "cnn")
    service = InspectionService()
    assert service.cnn_provider.__class__.__name__ == "CNNDetectionProvider"


def test_rule_engine_passes_for_mrp_and_quantity():
    service = InspectionService()
    declarations = [
        {"field": "product_name", "value": "Alpha Atta", "confidence": 0.98, "bbox": [1, 2, 3, 4]},
        {"field": "manufacturer", "value": "Alpha Foods Pvt Ltd", "confidence": 0.95, "bbox": [1, 2, 3, 4]},
        {"field": "net_quantity", "value": "5 kg", "normalised_value": "5 kg", "confidence": 0.94, "bbox": [1, 2, 3, 4]},
        {"field": "mrp", "value": "₹499", "normalised_value": "499", "confidence": 0.96, "bbox": [1, 2, 3, 4]},
        {"field": "packing_date", "value": "12/2027", "confidence": 0.92, "bbox": [1, 2, 3, 4]},
        {"field": "consumer_care", "value": "1800-123-456", "confidence": 0.88, "bbox": [1, 2, 3, 4]},
    ]
    findings, violations, warnings, overall, _ = service.rule_engine.evaluate(declarations, "Alpha Atta", "cnn")
    assert overall == "PASS"
    assert violations == []


def test_missing_consumer_care_is_violation():
    service = InspectionService()
    declarations = [
        {"field": "product_name", "value": "Beta Atta", "confidence": 0.98},
        {"field": "manufacturer", "value": "Beta Foods", "confidence": 0.97},
        {"field": "net_quantity", "value": "5 kg", "normalised_value": "5 kg", "confidence": 0.94},
        {"field": "mrp", "value": "₹490", "normalised_value": "490", "confidence": 0.96},
        {"field": "packing_date", "value": "12/2027", "confidence": 0.91},
    ]
    findings, violations, warnings, overall, _ = service.rule_engine.evaluate(declarations, "Beta Atta", "cnn")
    assert overall == "VIOLATION"
    assert any(item["rule_name"] == "Consumer-care declaration" for item in findings)


def test_low_confidence_requires_review():
    service = InspectionService()
    declarations = [
        {"field": "product_name", "value": "Gamma Atta", "confidence": 0.9},
        {"field": "manufacturer", "value": "Gamma Foods", "confidence": 0.84},
        {"field": "net_quantity", "value": "5 kg", "normalised_value": "5 kg", "confidence": 0.75},
        {"field": "mrp", "value": "₹390", "normalised_value": "390", "confidence": 0.51},
        {"field": "packing_date", "value": "12/2027", "confidence": 0.9},
        {"field": "consumer_care", "value": "1800-123-456", "confidence": 0.9},
    ]
    findings, violations, warnings, overall, _ = service.rule_engine.evaluate(declarations, "Gamma Atta", "cnn")
    assert overall == "REQUIRES_REVIEW"


def test_declaration_extractor_does_not_classify_arbitrary_text_as_quantity():
    declarations = DeclarationExtractor().extract(
        [{"text": "Authorised Signatory", "confidence": 0.9, "bbox": [1, 2, 3, 4]}]
    )
    assert declarations == []


def test_rule_resolver_filters_by_context_and_effective_date():
    current = resolve_rules(
        jurisdiction="IN",
        product_type="food",
        inspection_date="2026-09-10",
    )
    assert len(current["rules"]) == 8

    unsupported = resolve_rules(
        jurisdiction="US",
        product_type="food",
        inspection_date="2026-09-10",
    )
    assert unsupported["rules"] == []

    before_effective_date = resolve_rules(
        jurisdiction="IN",
        product_type="food",
        inspection_date="2023-12-31",
    )
    assert before_effective_date["rules"] == []


def test_rule_engine_rejects_invalid_quantity_and_contact():
    service = InspectionService()
    declarations = [
        {"field": "product_name", "value": "Test Product", "confidence": 0.9},
        {"field": "manufacturer", "value": "Test Foods", "confidence": 0.9},
        {"field": "net_quantity", "value": "five", "confidence": 0.9},
        {"field": "mrp", "value": "499", "confidence": 0.9},
        {"field": "packing_date", "value": "12/2027", "confidence": 0.9},
        {"field": "consumer_care", "value": "not a phone number", "confidence": 0.9},
    ]
    findings, violations, _, overall, _ = service.rule_engine.evaluate(
        declarations,
        "Test Product",
        "ocr",
        jurisdiction="IN",
        product_type="food",
        inspection_date="2026-09-10",
    )
    assert overall == "VIOLATION"
    assert "Net quantity" in violations
    assert "Consumer-care declaration" in violations
    assert any(item["effective_from"] == "2024-07-01" for item in findings)
