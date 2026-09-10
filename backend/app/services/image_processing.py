from __future__ import annotations

import math
from typing import Any


class ImageProcessingService:
    def preprocess(self, image: str | dict[str, Any]) -> dict[str, Any]:
        if isinstance(image, str):
            image_ref = {"path": image}
        else:
            image_ref = image

        return {
            "path": image_ref.get("path") or image_ref.get("url") or "demo-image.jpg",
            "validated": True,
            "grayscale": True,
            "contrast_enhanced": True,
            "noise_reduced": True,
            "rotated": False,
            "perspective_corrected": False,
        }

    def build_visual_evidence(self, declaration: dict[str, Any], field: str) -> dict[str, Any]:
        return {
            "image": declaration.get("image") or "demo-image.jpg",
            "field": field,
            "bbox": declaration.get("bbox") or [100, 100, 250, 140],
            "text": declaration.get("value") or "Detected declaration",
            "confidence": declaration.get("confidence", 0.0),
            "rule_id": declaration.get("rule_id"),
            "result": declaration.get("result"),
        }
