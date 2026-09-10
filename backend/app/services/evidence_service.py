from __future__ import annotations

from typing import Any


class EvidenceService:
    def generate(self, findings: list[dict[str, Any]], declarations: list[dict[str, Any]]) -> list[dict[str, Any]]:
        evidence: list[dict[str, Any]] = []
        declaration_map = {item["field"]: item for item in declarations}

        for finding in findings:
            field = finding["rule_name"]
            declaration = declaration_map.get(field.lower().replace(" ", "_"))
            if not declaration and finding.get("evidence"):
                evidence.append(
                    {
                        "image": finding["evidence"].get("image"),
                        "field": field,
                        "bbox": finding["evidence"].get("bbox"),
                        "text": finding.get("detected_value") or "Not detected",
                        "confidence": finding.get("confidence", 0.0),
                        "rule_id": finding.get("rule_id"),
                        "result": finding.get("result"),
                    }
                )
                continue

            if declaration:
                evidence.append(
                    {
                        "image": declaration.get("image"),
                        "field": declaration["field"],
                        "bbox": declaration.get("bbox"),
                        "text": declaration.get("normalised_value") or declaration.get("value"),
                        "confidence": declaration.get("confidence", 0.0),
                        "rule_id": finding.get("rule_id"),
                        "result": finding.get("result"),
                    }
                )

        return evidence
