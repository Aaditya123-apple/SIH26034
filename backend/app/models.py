from __future__ import annotations

from enum import Enum
from typing import Any

from pydantic import BaseModel, Field


class InspectionStatus(str, Enum):
    DETECTED = "DETECTED"
    PROCESSING = "PROCESSING"
    OCR_EXTRACTING = "OCR_EXTRACTING"
    VALIDATING = "VALIDATING"
    GENERATING_EVIDENCE = "GENERATING_EVIDENCE"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"
    REQUIRES_REVIEW = "REQUIRES_REVIEW"


class ComplianceState(str, Enum):
    PASS = "PASS"
    WARNING = "WARNING"
    VIOLATION = "VIOLATION"
    REQUIRES_REVIEW = "REQUIRES_REVIEW"


class DetectionEvent(BaseModel):
    product_id: str = Field(..., min_length=1)
    product_name: str = Field(..., min_length=1)
    confidence: float = Field(..., ge=0.0, le=1.0)
    source: str = Field(default="cnn")
    category: str | None = None
    manufacturer: str | None = None
    country_of_origin: str | None = None
    images: list[str] | list[dict[str, Any]] = Field(default_factory=list)


class Declaration(BaseModel):
    field: str
    value: str | None = None
    normalised_value: str | None = None
    confidence: float = 0.0
    status: str = "detected"
    source: str = "ocr"
    bbox: list[int] | None = None


class RuleResult(BaseModel):
    rule_id: str
    rule_name: str
    requirement: str
    detected_value: str | None = None
    expected_value: str | None = None
    result: str
    explanation: str
    evidence: dict[str, Any] | None = None
    confidence: float = 0.0
    rule_version: str = "2026.09"


class EvidenceItem(BaseModel):
    image: str | None = None
    field: str
    bbox: list[int] | None = None
    text: str | None = None
    confidence: float = 0.0
    rule_id: str | None = None
    result: str | None = None


class InspectionRecord(BaseModel):
    inspection_id: str
    product_id: str
    product_name: str
    detection_source: str
    detection_confidence: float
    timestamp: str
    status: InspectionStatus
    processing_stage: str
    overall_compliance: ComplianceState
    images: list[str] | list[dict[str, Any]]
    declarations: list[Declaration] = Field(default_factory=list)
    rule_results: list[RuleResult] = Field(default_factory=list)
    violations: list[str] = Field(default_factory=list)
    warnings: list[str] = Field(default_factory=list)
    evidence: list[EvidenceItem] = Field(default_factory=list)
    report: dict[str, Any] | None = None
    rule_set: str = "Legal Metrology (Packaged Commodities) Rules"
    rule_version: str = "2026.09"
    created_at: str
    updated_at: str
