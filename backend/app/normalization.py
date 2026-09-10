from __future__ import annotations

import re
from typing import Any


def normalize_numeric_value(value: Any) -> str | None:
    if value is None:
        return None
    text = str(value).strip()
    if not text:
        return None
    text = text.replace("₹", "").replace("Rs", "").replace("rs", "")
    text = text.replace(",", "")
    text = re.sub(r"[^0-9.]+", " ", text).strip()
    if not text:
        return None
    return text


def normalize_quantity(value: Any) -> str | None:
    if value is None:
        return None
    text = str(value).strip().lower()
    if not text:
        return None
    text = text.replace("net qty", "").replace("net quantity", "")
    text = text.replace("qty", "").replace("gm", " g").replace("gms", " g").replace("kg", " kg")
    text = re.sub(r"\s+", " ", text).strip()
    text = text.replace(" ", " ")
    return text or None


def normalize_date(value: Any) -> str | None:
    if value is None:
        return None
    text = str(value).strip()
    return text or None


def normalize_country(value: Any) -> str | None:
    if value is None:
        return None
    text = str(value).strip()
    if not text:
        return None
    return text


def parse_float(value: Any) -> float | None:
    text = normalize_numeric_value(value)
    if text is None:
        return None
    try:
        return float(text)
    except ValueError:
        return None
