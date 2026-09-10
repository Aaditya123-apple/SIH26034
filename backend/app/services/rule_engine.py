from __future__ import annotations

from typing import Any

import re
from datetime import date
from backend.app.rules_loader import resolve_rules


class RuleEngine:
    def evaluate(self, declarations: list[dict[str, Any]], product_name: str, source: str, *, jurisdiction: str = "IN", product_type: str = "packaged_commodity", is_imported: bool = False, inspection_date: str | None = None) -> tuple[list[dict[str, Any]], list[str], list[str], str, str]:
        metadata = resolve_rules(jurisdiction=jurisdiction, product_type=product_type, is_imported=is_imported, inspection_date=inspection_date)
        rule_set = metadata["ruleset"]
        rule_version = metadata["version"]
        fields = {item["field"]: item for item in declarations}
        findings: list[dict[str, Any]] = []
        violations: list[str] = []
        warnings: list[str] = []

        for rule in metadata["rules"]:
            field = rule["field"]
            declaration = fields.get(field)
            result = "NOT_APPLICABLE"
            explanation = "Rule not applicable"
            detected_value = None
            expected_value = None
            confidence = 0.0
            evidence = None

            if declaration:
                detected_value = declaration.get("normalised_value") or declaration.get("value")
                confidence = float(declaration.get("confidence", 0.0))
                evidence = {
                    "field": field,
                    "bbox": declaration.get("bbox"),
                    "image": declaration.get("image"),
                }

            validation_errors = self._validate(rule.get("validation", []), detected_value)
            if rule["required"] and declaration is None:
                result = "VIOLATION"
                explanation = f"Required declaration '{field}' is missing."
                violations.append(rule["name"])
                expected_value = "Present"
            elif rule["required"] and validation_errors:
                result = "VIOLATION"
                explanation = f"Declaration '{field}' failed validation: {', '.join(validation_errors)}."
                violations.append(rule["name"])
                expected_value = ", ".join(rule.get("validation", []))
            elif rule["required"]:
                result = "PASS"
                explanation = f"Required declaration '{field}' detected and validated."
            else:
                if declaration is None:
                    result = "NOT_APPLICABLE"
                    explanation = f"Optional declaration '{field}' not applicable."
                else:
                    result = "PASS"
                    explanation = f"Optional declaration '{field}' detected."

            if declaration and confidence < 0.6 and field != "product_name":
                result = "REQUIRES_REVIEW"
                warnings.append(f"Low confidence for {field}")
                explanation = f"Detected value for '{field}' has low OCR confidence and requires human review."

            if result == "PASS":
                status_text = "Passed"
            elif result == "VIOLATION":
                status_text = "Violation"
            elif result == "REQUIRES_REVIEW":
                status_text = "Requires review"
            else:
                status_text = "Not applicable"

            findings.append({
                "rule_id": rule["id"],
                "rule_name": rule["name"],
                "requirement": rule["name"],
                "detected_value": detected_value,
                "expected_value": expected_value or ("Present" if rule["required"] else "Optional"),
                "result": result,
                "explanation": explanation,
                "evidence": evidence,
                "confidence": confidence,
                "rule_version": rule_version,
                "source": metadata.get("source"),
                "effective_from": rule.get("effective_from"),
                "jurisdiction": jurisdiction,
                "product_type": product_type,
                "status_text": status_text,
            })

        final_result = "PASS"
        if any(item["result"] == "VIOLATION" for item in findings):
            final_result = "VIOLATION"
        elif any(item["result"] == "REQUIRES_REVIEW" for item in findings):
            final_result = "REQUIRES_REVIEW"
        elif any(item["result"] == "WARNING" for item in findings):
            final_result = "WARNING"

        return findings, violations, warnings, final_result, rule_version

    def _validate(self, validations: list[str], value: str | None) -> list[str]:
        if value is None:
            return []
        text = str(value).strip()
        errors: list[str] = []
        if "numeric" in validations and not re.search(r"\d", text):
            errors.append("numeric")
        if "unit" in validations and not re.search(r"\b(kg|g|mg|l|ml| litre|liter|litre)\b", text.lower()):
            errors.append("unit")
        if "date" in validations and not re.search(r"\b(\d{1,2}[/-]\d{1,2}[/-]\d{2,4}|\d{1,2}[/-]\d{4}|\d{4}[/-]\d{1,2}|\d{1,2}[- ](?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z -]*\d{2,4})\b", text.lower()):
            errors.append("date")
        if "contact" in validations and not re.search(r"(?:\+?\d[\d ()-]{7,}\d)", text):
            errors.append("contact")
        return errors
