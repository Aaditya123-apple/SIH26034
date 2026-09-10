from __future__ import annotations

import uuid
import os
from datetime import datetime, timezone
from typing import Any

from backend.app.database import add_audit_event, get_audit_events, get_inspection, list_inspections, save_inspection
from backend.app.services.cnn_adapter import (
    CNNDetectionProvider,
    DetectionProvider,
    MockDetectionProvider,
    YoloDetectionProvider,
)
from backend.app.services.declaration_extractor import DeclarationExtractor
from backend.app.services.evidence_service import EvidenceService
from backend.app.services.image_processing import ImageProcessingService
from backend.app.services.ocr_service import OCRService
from backend.app.services.rule_engine import RuleEngine


class InspectionService:
    def __init__(self):
        provider = os.getenv("DETECTION_PROVIDER", "demo").lower()
        if provider in {"demo", "mock"}:
            self.cnn_provider: DetectionProvider = MockDetectionProvider()
        elif provider == "cnn":
            self.cnn_provider = CNNDetectionProvider()
        elif provider == "yolo":
            self.cnn_provider = YoloDetectionProvider()
        else:
            raise ValueError(
                "Unsupported DETECTION_PROVIDER value. Use one of: demo, mock, cnn, yolo."
            )
        self.image_service = ImageProcessingService()
        self.ocr_service = OCRService()
        self.declaration_extractor = DeclarationExtractor()
        self.rule_engine = RuleEngine()
        self.evidence_service = EvidenceService()

    def create_detection_inspection(self, event: dict[str, Any]) -> dict[str, Any]:
        ts = datetime.now(timezone.utc).isoformat()
        inspection_id = f"INSP-{uuid.uuid4().hex[:8].upper()}"
        detection = self.cnn_provider.detect(
            event.get("product_id") or f"PROD-{uuid.uuid4().hex[:8].upper()}",
            event.get("product_name") or "Demo Product",
            float(event.get("confidence", 0.9)),
            event.get("source") or "cnn",
            event.get("images") or [],
            event.get("category"),
            event.get("manufacturer"),
            event.get("country_of_origin"),
        )

        inspection = {
            "inspection_id": inspection_id,
            "product_id": detection["product_id"],
            "product_name": detection["product_name"],
            "detection_source": detection["source"],
            "detection_confidence": float(detection["confidence"]),
            "detection_bbox": detection.get("detection_bbox"),
            "jurisdiction": event.get("jurisdiction", "IN"),
            "product_type": event.get("product_type") or event.get("category") or "packaged_commodity",
            "is_imported": bool(event.get("is_imported", False)),
            "inspection_date": event.get("inspection_date") or ts[:10],
            "timestamp": ts,
            "status": "DETECTED",
            "processing_stage": "DETECTED",
            "overall_compliance": "PASS",
            "images": detection["images"],
            "declarations": [],
            "rule_results": [],
            "violations": [],
            "warnings": [],
            "evidence": [],
            "report": None,
            "rule_set": "Legal Metrology (Packaged Commodities) Rules",
            "rule_version": "2026.09",
            "created_at": ts,
            "updated_at": ts,
        }
        save_inspection(inspection)
        add_audit_event(inspection_id, "detection_created", {"source": detection["source"], "product_name": detection["product_name"]})
        return inspection

    def process_inspection(self, inspection_id: str) -> dict[str, Any]:
        inspection = get_inspection(inspection_id)
        if inspection is None:
            raise ValueError(f"Inspection {inspection_id} not found")

        inspection["status"] = "PROCESSING"
        inspection["processing_stage"] = "IMAGE_PROCESSING"
        inspection["updated_at"] = datetime.now(timezone.utc).isoformat()
        save_inspection(inspection)
        add_audit_event(inspection_id, "image_processing", {"images_count": len(inspection.get("images", []))})

        prepared_images = [self.image_service.preprocess(img) for img in inspection.get("images", [])]
        ocr_results = []
        for img in prepared_images:
            ocr_results.extend(self.ocr_service.extract_text(img))

        inspection["status"] = "OCR_EXTRACTING"
        inspection["processing_stage"] = "OCR_EXTRACTING"
        inspection["updated_at"] = datetime.now(timezone.utc).isoformat()
        declarations = self.declaration_extractor.extract(ocr_results)
        inspection["declarations"] = declarations
        save_inspection(inspection)
        add_audit_event(inspection_id, "ocr_completed", {"ocr_entries": len(ocr_results)})

        findings, violations, warnings, overall, rule_version = self.rule_engine.evaluate(
            declarations,
            inspection["product_name"],
            inspection["detection_source"],
            jurisdiction=inspection.get("jurisdiction", "IN"),
            product_type=inspection.get("product_type", "packaged_commodity"),
            is_imported=inspection.get("is_imported", False),
            inspection_date=inspection.get("inspection_date"),
        )

        inspection["status"] = "VALIDATING"
        inspection["processing_stage"] = "RULE_EVALUATION"
        inspection["rule_results"] = findings
        inspection["violations"] = violations
        inspection["warnings"] = warnings
        inspection["overall_compliance"] = overall
        inspection["rule_version"] = rule_version
        save_inspection(inspection)
        add_audit_event(inspection_id, "rules_evaluated", {"count": len(findings)})

        evidence = self.evidence_service.generate(findings, declarations)
        inspection["evidence"] = evidence
        inspection["status"] = "GENERATING_EVIDENCE"
        inspection["processing_stage"] = "GENERATING_EVIDENCE"
        save_inspection(inspection)
        add_audit_event(inspection_id, "evidence_generated", {"count": len(evidence)})

        if overall in {"VIOLATION", "REQUIRES_REVIEW"}:
            inspection["status"] = overall
            inspection["processing_stage"] = "COMPLETED"
        else:
            inspection["status"] = "COMPLETED"
            inspection["processing_stage"] = "COMPLETED"

        inspection["updated_at"] = datetime.now(timezone.utc).isoformat()
        inspection["report"] = self.generate_report(inspection)
        save_inspection(inspection)
        add_audit_event(inspection_id, "report_generated", {"report_id": inspection["inspection_id"]})
        return inspection

    def generate_report(self, inspection: dict[str, Any]) -> dict[str, Any]:
        return {
            "inspection_id": inspection["inspection_id"],
            "product_name": inspection["product_name"],
            "product_id": inspection["product_id"],
            "status": inspection["overall_compliance"],
            "rule_version": inspection["rule_version"],
            "violations": inspection["violations"],
            "warnings": inspection["warnings"],
            "declarations": inspection["declarations"],
            "evidence": inspection["evidence"],
            "generated_at": datetime.now(timezone.utc).isoformat(),
        }

    def get_all_inspections(self) -> list[dict[str, Any]]:
        return list_inspections()

    def fail_inspection(self, inspection_id: str, error: str) -> None:
        inspection = get_inspection(inspection_id)
        if inspection is None:
            return
        inspection["status"] = "FAILED"
        inspection["processing_stage"] = "FAILED"
        inspection["warnings"] = [f"Processing failed: {error}"]
        inspection["updated_at"] = datetime.now(timezone.utc).isoformat()
        save_inspection(inspection)
        add_audit_event(inspection_id, "processing_failed", {"error": error})

    def get_inspection_detail(self, inspection_id: str) -> dict[str, Any]:
        inspection = get_inspection(inspection_id)
        if inspection is None:
            raise ValueError(f"Inspection {inspection_id} not found")
        inspection["audit_events"] = get_audit_events(inspection_id)
        return inspection
