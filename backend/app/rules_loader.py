from __future__ import annotations

import json
from datetime import date
from pathlib import Path
from typing import Any

from .config import RULES_PATH


def load_rules() -> dict:
    with open(RULES_PATH, "r", encoding="utf-8") as f:
        return json.load(f)


def get_ruleset_metadata() -> dict:
    rules = load_rules()
    return {
        "ruleset": rules.get("ruleset"),
        "version": rules.get("version"),
        "source": rules.get("source"),
        "rules": rules.get("rules", []),
    }


def resolve_rules(
    *,
    jurisdiction: str = "IN",
    product_type: str = "packaged_commodity",
    is_imported: bool = False,
    inspection_date: str | None = None,
) -> dict[str, Any]:
    metadata = get_ruleset_metadata()
    target_date = date.fromisoformat(inspection_date) if inspection_date else date.today()
    selected = []
    for rule in metadata["rules"]:
        jurisdictions = rule.get("jurisdictions", ["*"])
        product_types = rule.get("product_types", ["*"])
        effective_from = date.fromisoformat(rule["effective_from"]) if rule.get("effective_from") else None
        effective_until = date.fromisoformat(rule["effective_until"]) if rule.get("effective_until") else None
        import_requirement = rule.get("imported")
        if jurisdiction not in jurisdictions and "*" not in jurisdictions:
            continue
        if product_type not in product_types and "*" not in product_types:
            continue
        if effective_from and target_date < effective_from:
            continue
        if effective_until and target_date > effective_until:
            continue
        if import_requirement is not None and import_requirement != is_imported:
            continue
        selected.append(rule)
    return {**metadata, "rules": selected}
