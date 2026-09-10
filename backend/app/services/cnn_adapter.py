from __future__ import annotations

import os
from abc import ABC, abstractmethod
from pathlib import Path
from typing import Any


class DetectionProvider(ABC):
    @abstractmethod
    def detect(self, product_id: str, product_name: str, confidence: float, source: str, images: list[str] | list[dict[str, Any]], category: str | None = None, manufacturer: str | None = None, country_of_origin: str | None = None) -> dict[str, Any]:
        raise NotImplementedError


class MockDetectionProvider(DetectionProvider):
    def detect(self, product_id: str, product_name: str, confidence: float, source: str, images: list[str] | list[dict[str, Any]], category: str | None = None, manufacturer: str | None = None, country_of_origin: str | None = None) -> dict[str, Any]:
        return {
            "product_id": product_id,
            "product_name": product_name,
            "confidence": confidence,
            "source": source,
            "category": category or "Food",
            "manufacturer": manufacturer or "Demo Manufacturer Pvt Ltd",
            "country_of_origin": country_of_origin or "India",
            "images": images,
        }


class YoloDetectionProvider(DetectionProvider):
    def __init__(self) -> None:
        model_path = os.getenv("DETECTION_MODEL_PATH")
        if not model_path or not Path(model_path).exists():
            raise RuntimeError("DETECTION_PROVIDER=yolo requires DETECTION_MODEL_PATH pointing to a YOLO model")
        try:
            from ultralytics import YOLO
        except ImportError as exc:
            raise RuntimeError("DETECTION_PROVIDER=yolo requires the ultralytics package") from exc
        self.model = YOLO(model_path)

    def detect(self, product_id: str, product_name: str, confidence: float, source: str, images: list[str] | list[dict[str, Any]], category: str | None = None, manufacturer: str | None = None, country_of_origin: str | None = None) -> dict[str, Any]:
        image_ref = images[0] if images else None
        image_path = image_ref if isinstance(image_ref, str) else (image_ref or {}).get("path")
        if not image_path:
            raise ValueError("YOLO detection requires at least one image path")

        results = self.model.predict(source=image_path, verbose=False)
        boxes = results[0].boxes if results else None
        if boxes is None or len(boxes) == 0:
            raise ValueError("YOLO did not detect a package in the uploaded image")

        best_index = int(boxes.conf.argmax().item())
        best_confidence = float(boxes.conf[best_index].item())
        class_id = int(boxes.cls[best_index].item())
        names = results[0].names
        detected_name = str(names.get(class_id, product_name)) if isinstance(names, dict) else product_name
        coordinates = [int(value) for value in boxes.xyxy[best_index].tolist()]
        return {
            "product_id": product_id,
            "product_name": detected_name,
            "confidence": best_confidence,
            "source": "yolo",
            "category": category or "Packaged Commodity",
            "manufacturer": manufacturer,
            "country_of_origin": country_of_origin,
            "images": images,
            "detection_bbox": coordinates,
        }
