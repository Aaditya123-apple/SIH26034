from __future__ import annotations

import os
import re
import shutil
from abc import ABC, abstractmethod
from typing import Any


class OCRProvider(ABC):
    @abstractmethod
    def extract_text(self, image: str | dict[str, Any]) -> list[dict[str, Any]]:
        raise NotImplementedError


class DemoOCRProvider(OCRProvider):
    def extract_text(self, image: str | dict[str, Any]) -> list[dict[str, Any]]:
        image_ref = image if isinstance(image, dict) else {"path": image}
        path = image_ref.get("path") or image_ref.get("url") or "demo-image.jpg"

        demo_entries = [
            {"text": "Aashirvaad Atta", "confidence": 0.98, "bbox": [200, 120, 560, 170]},
            {"text": "MRP ₹499", "confidence": 0.96, "bbox": [760, 430, 1050, 470]},
            {"text": "Net Qty 5 kg", "confidence": 0.94, "bbox": [210, 500, 430, 545]},
            {"text": "Manufactured by: Aashirvaad Foods Pvt Ltd", "confidence": 0.92, "bbox": [160, 610, 660, 660]},
            {"text": "Best before 12/2027", "confidence": 0.91, "bbox": [170, 700, 440, 740]},
            {"text": "Consumer Care: 1800-123-456", "confidence": 0.88, "bbox": [180, 760, 520, 800]},
            {"text": "Made in India", "confidence": 0.95, "bbox": [170, 840, 380, 870]},
        ]

        if "missing" in path.lower() or "demo-bad" in path.lower():
            return [
                {"text": "Aashirvaad Atta", "confidence": 0.97, "bbox": [210, 120, 540, 170]},
                {"text": "Net Qty 5 kg", "confidence": 0.91, "bbox": [210, 500, 430, 545]},
                {"text": "Manufactured by: Aashirvaad Foods Pvt Ltd", "confidence": 0.90, "bbox": [160, 610, 660, 660]},
                {"text": "Best before 12/2027", "confidence": 0.89, "bbox": [170, 700, 440, 740]},
            ]

        if "low" in path.lower():
            return [
                {"text": "Aashirvaad Atta", "confidence": 0.89, "bbox": [210, 120, 540, 170]},
                {"text": "MRP ₹499", "confidence": 0.51, "bbox": [760, 430, 1050, 470]},
                {"text": "Net Qty 5 kg", "confidence": 0.7, "bbox": [210, 500, 430, 545]},
                {"text": "Made in India", "confidence": 0.73, "bbox": [170, 840, 380, 870]},
            ]

        return demo_entries


class TesseractOCRProvider(OCRProvider):
    def __init__(self) -> None:
        if shutil.which("tesseract") is None:
            raise RuntimeError("OCR_PROVIDER=tesseract requires the native tesseract binary")
        try:
            import pytesseract
        except ImportError as exc:
            raise RuntimeError("OCR_PROVIDER=tesseract requires the pytesseract package") from exc
        self.pytesseract = pytesseract

    def extract_text(self, image: str | dict[str, Any]) -> list[dict[str, Any]]:
        image_ref = image if isinstance(image, dict) else {"path": image}
        path = image_ref.get("path") or image_ref.get("url")
        if not path:
            return []
        try:
            from PIL import Image
            data = self.pytesseract.image_to_data(Image.open(path), output_type=self.pytesseract.Output.DICT)
        except Exception as exc:
            raise RuntimeError(f"Tesseract could not read {path}: {exc}") from exc

        results: list[dict[str, Any]] = []
        for index, text in enumerate(data.get("text", [])):
            value = str(text).strip()
            if not value:
                continue
            confidence = max(float(data["conf"][index]), 0.0) / 100
            left = int(data["left"][index])
            top = int(data["top"][index])
            width = int(data["width"][index])
            height = int(data["height"][index])
            results.append({
                "text": value,
                "confidence": confidence,
                "bbox": [left, top, left + width, top + height],
                "image": image_ref.get("url"),
            })
        return results


class OCRService:
    def __init__(self) -> None:
        provider = os.getenv("OCR_PROVIDER", "demo").lower()
        self.provider: OCRProvider = TesseractOCRProvider() if provider == "tesseract" else DemoOCRProvider()

    def extract_text(self, image: str | dict[str, Any]) -> list[dict[str, Any]]:
        return self.provider.extract_text(image)
