from __future__ import annotations

from typing import Any

from backend.app.rules_loader import get_ruleset_metadata


class RuleEngine:
    def evaluate(self, declarations: list[dict[str, Any]], product_name: str, source: str) -> tuple[list[dict[str, Any]], list[str], list[str], str, str]:
        metadata = get_ruleset_metadata()
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

            if rule["required"]:
                if declaration is None:
                    result = "VIOLATION"
                    explanation = f"Required declaration '{field}' is missing."
                    violations.append(rule["name"])
                    expected_value = "Present"
                else:
                    result = "PASS"
                    explanation = f"Required declaration '{field}' detected with acceptable confidence."
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
