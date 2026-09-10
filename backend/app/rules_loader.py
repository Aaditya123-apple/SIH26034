from __future__ import annotations

import json
from pathlib import Path

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
