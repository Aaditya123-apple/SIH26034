from __future__ import annotations

import re
from typing import Any

from backend.app.normalization import normalize_country, normalize_date, normalize_numeric_value, normalize_quantity


class DeclarationExtractor:
    def extract(self, ocr_results: list[dict[str, Any]]) -> list[dict[str, Any]]:
        declarations: list[dict[str, Any]] = []
        for item in ocr_results:
            text = str(item.get("text", "")).strip()
            if not text:
                continue
            field = self._detect_field(text)
            if field is None:
                continue
            declarations.append(
                {
                    "field": field,
                    "value": text,
                    "normalised_value": self._normalise(field, text),
                    "confidence": float(item.get("confidence", 0.0)),
                    "status": "detected",
                    "source": "ocr",
                    "bbox": item.get("bbox"),
                    "image": item.get("image"),
                }
            )
        return declarations

    def _detect_field(self, text: str) -> str | None:
        lower = text.lower()
        if "mrp" in lower:
            return "mrp"
        if (
            re.search(r"\bnet\s*(qty|quantity)\b", lower)
            or re.search(r"\bqty\b", lower)
            or re.search(r"\b\d+(?:\.\d+)?\s*(kg|g|mg|l|ml)\b", lower)
        ):
            return "net_quantity"
        if "manufactured by" in lower or "packer" in lower or "manufacturer" in lower:
            return "manufacturer"
        if "best before" in lower or "mfd" in lower or "packed" in lower or "date" in lower:
            return "packing_date"
        if "consumer care" in lower or "customer care" in lower or "helpline" in lower:
            return "consumer_care"
        if "made in" in lower or "country" in lower or "india" in lower:
            return "country_of_origin"
        if "atta" in lower or "rice" in lower or "soap" in lower or "biscuits" in lower:
            return "product_name"
        return None

    def _normalise(self, field: str, text: str) -> str | None:
        if field == "mrp":
            return normalize_numeric_value(text)
        if field == "net_quantity":
            return normalize_quantity(text)
        if field == "packing_date":
            return normalize_date(text)
        if field == "country_of_origin":
            return normalize_country(text)
        return text
