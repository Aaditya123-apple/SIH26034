from __future__ import annotations

import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
PROJECT_ROOT = BASE_DIR.parent
RULES_PATH = PROJECT_ROOT / "rules" / "rules.json"
DB_PATH = Path(os.getenv("DB_PATH", str(BASE_DIR / "data" / "inspections.db")))

DB_PATH.parent.mkdir(parents=True, exist_ok=True)
