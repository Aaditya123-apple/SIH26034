from __future__ import annotations

import json
import sqlite3
from typing import Any

from .config import DB_PATH


SCHEMA = """
CREATE TABLE IF NOT EXISTS inspections (
    inspection_id TEXT PRIMARY KEY,
    payload TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS audit_events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    inspection_id TEXT NOT NULL,
    event_type TEXT NOT NULL,
    event_data TEXT NOT NULL,
    created_at TEXT NOT NULL
);
"""


def init_db() -> None:
    with sqlite3.connect(DB_PATH) as conn:
        conn.executescript(SCHEMA)


def get_connection() -> sqlite3.Connection:
    init_db()
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def save_inspection(inspection: dict[str, Any]) -> None:
    with get_connection() as conn:
        conn.execute(
            """
            INSERT INTO inspections (inspection_id, payload, created_at, updated_at)
            VALUES (?, ?, ?, ?)
            ON CONFLICT(inspection_id) DO UPDATE SET
                payload = excluded.payload,
                updated_at = excluded.updated_at
            """,
            (
                inspection["inspection_id"],
                json.dumps(inspection),
                inspection["created_at"],
                inspection["updated_at"],
            ),
        )
        conn.commit()


def get_inspection(inspection_id: str) -> dict[str, Any] | None:
    with get_connection() as conn:
        row = conn.execute(
            "SELECT payload FROM inspections WHERE inspection_id = ?",
            (inspection_id,),
        ).fetchone()
    if row is None:
        return None
    return json.loads(row["payload"])


def list_inspections() -> list[dict[str, Any]]:
    with get_connection() as conn:
        rows = conn.execute(
            "SELECT payload FROM inspections ORDER BY updated_at DESC"
        ).fetchall()
    return [json.loads(row["payload"]) for row in rows]


def add_audit_event(inspection_id: str, event_type: str, event_data: dict[str, Any]) -> None:
    with get_connection() as conn:
        conn.execute(
            "INSERT INTO audit_events (inspection_id, event_type, event_data, created_at) VALUES (?, ?, ?, datetime('now'))",
            (inspection_id, event_type, json.dumps(event_data)),
        )
        conn.commit()


def get_audit_events(inspection_id: str) -> list[dict[str, Any]]:
    with get_connection() as conn:
        rows = conn.execute(
            "SELECT event_type, event_data, created_at FROM audit_events WHERE inspection_id = ? ORDER BY created_at ASC",
            (inspection_id,),
        ).fetchall()
    return [
        {
            "event_type": row["event_type"],
            "event_data": json.loads(row["event_data"]),
            "created_at": row["created_at"],
        }
        for row in rows
    ]
