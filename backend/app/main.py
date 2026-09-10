from __future__ import annotations

import os
import asyncio
import uuid
from pathlib import Path

from fastapi import BackgroundTasks, FastAPI, File, Form, HTTPException, UploadFile, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from backend.app.database import init_db
from backend.app.models import DetectionEvent
from backend.app.rules_loader import get_ruleset_metadata
from backend.app.services.inspection_service import InspectionService

app = FastAPI(title="Legal Metrology AI API", version="1.0.0")
UPLOAD_DIR = Path(os.getenv("UPLOAD_DIR", "backend/data/uploads"))
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
app.mount("/media", StaticFiles(directory=UPLOAD_DIR), name="media")
allowed_origins = [
    origin.strip()
    for origin in os.getenv(
        "CORS_ALLOWED_ORIGINS",
        "http://localhost:3000,http://127.0.0.1:3000",
    ).split(",")
    if origin.strip()
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

inspection_service = InspectionService()
init_db()


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/api/detections")
def create_detection(event: DetectionEvent) -> dict:
    inspection = inspection_service.create_detection_inspection(event.model_dump())
    return inspection_service.process_inspection(inspection["inspection_id"])


def process_uploaded_inspection(inspection_id: str) -> None:
    try:
        inspection_service.process_inspection(inspection_id)
    except Exception as exc:
        inspection_service.fail_inspection(inspection_id, str(exc))


@app.post("/api/inspections/upload", status_code=202)
async def upload_inspection(
    background_tasks: BackgroundTasks,
    image: UploadFile = File(...),
    product_name: str = Form("Live Package"),
) -> dict:
    allowed_types = {"image/jpeg", "image/png", "image/webp"}
    if image.content_type not in allowed_types:
        raise HTTPException(status_code=415, detail="Only JPEG, PNG, and WebP images are supported")

    contents = await image.read()
    if not contents or len(contents) > 10 * 1024 * 1024:
        raise HTTPException(status_code=413, detail="Image must be between 1 byte and 10 MB")

    suffix = Path(image.filename or "capture.jpg").suffix.lower() or ".jpg"
    stored_name = f"{uuid.uuid4().hex}{suffix}"
    stored_path = UPLOAD_DIR / stored_name
    stored_path.write_bytes(contents)

    inspection = inspection_service.create_detection_inspection(
        {
            "product_id": f"LIVE-{uuid.uuid4().hex[:8].upper()}",
            "product_name": product_name.strip() or "Live Package",
            "confidence": 0.9,
            "source": "camera_upload",
            "images": [{"path": str(stored_path), "url": f"/media/{stored_name}"}],
        }
    )
    background_tasks.add_task(process_uploaded_inspection, inspection["inspection_id"])
    return {
        "inspection_id": inspection["inspection_id"],
        "status": inspection["status"],
        "processing_stage": inspection["processing_stage"],
        "image_url": f"/media/{stored_name}",
    }


@app.get("/api/inspections")
def list_inspections() -> list[dict]:
    return inspection_service.get_all_inspections()


@app.get("/api/inspections/{inspection_id}")
def get_inspection(inspection_id: str) -> dict:
    try:
        return inspection_service.get_inspection_detail(inspection_id)
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@app.websocket("/ws/inspections/{inspection_id}")
async def inspection_updates(websocket: WebSocket, inspection_id: str) -> None:
    await websocket.accept()
    try:
        while True:
            inspection = inspection_service.get_inspection_detail(inspection_id)
            await websocket.send_json(
                {
                    "inspection_id": inspection_id,
                    "status": inspection["status"],
                    "processing_stage": inspection["processing_stage"],
                    "overall_compliance": inspection["overall_compliance"],
                    "inspection": inspection,
                }
            )
            if inspection["processing_stage"] == "COMPLETED" or inspection["status"] == "FAILED":
                break
            await asyncio.sleep(0.35)
    except (ValueError, WebSocketDisconnect):
        await websocket.close(code=1008)


@app.get("/api/inspections/{inspection_id}/declarations")
def get_declarations(inspection_id: str) -> dict:
    try:
        inspection = inspection_service.get_inspection_detail(inspection_id)
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    return {"inspection_id": inspection_id, "declarations": inspection.get("declarations", [])}


@app.get("/api/inspections/{inspection_id}/rules")
def get_rules(inspection_id: str) -> dict:
    try:
        inspection = inspection_service.get_inspection_detail(inspection_id)
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    return {"inspection_id": inspection_id, "rule_results": inspection.get("rule_results", [])}


@app.get("/api/inspections/{inspection_id}/evidence")
def get_evidence(inspection_id: str) -> dict:
    try:
        inspection = inspection_service.get_inspection_detail(inspection_id)
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    return {"inspection_id": inspection_id, "evidence": inspection.get("evidence", [])}


@app.get("/api/inspections/{inspection_id}/report")
def get_report(inspection_id: str) -> dict:
    try:
        inspection = inspection_service.get_inspection_detail(inspection_id)
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    return {"inspection_id": inspection_id, "report": inspection.get("report")}


@app.get("/api/dashboard/stats")
def dashboard_stats() -> dict:
    inspections = inspection_service.get_all_inspections()
    return build_dashboard_stats(inspections)


def build_dashboard_stats(inspections: list[dict]) -> dict:
    total = len(inspections)
    pass_count = sum(1 for item in inspections if item.get("overall_compliance") == "PASS")
    violation_count = sum(1 for item in inspections if item.get("overall_compliance") == "VIOLATION")
    warning_count = sum(1 for item in inspections if item.get("overall_compliance") == "WARNING")
    review_count = sum(1 for item in inspections if item.get("overall_compliance") == "REQUIRES_REVIEW")
    return {
        "total_inspections": total,
        "pass_count": pass_count,
        "violation_count": violation_count,
        "warning_count": warning_count,
        "review_count": review_count,
        "compliance_rate": round((pass_count / total) * 100, 1) if total else 0,
    }


@app.get("/api/dashboard/overview")
def dashboard_overview() -> dict:
    inspections = inspection_service.get_all_inspections()
    return {
        "stats": build_dashboard_stats(inspections),
        "inspections": inspections,
    }


@app.get("/api/products")
def get_products() -> list[str]:
    inspections = inspection_service.get_all_inspections()
    return sorted({item.get("product_name") for item in inspections if item.get("product_name")})


@app.get("/api/rules")
def get_ruleset() -> dict:
    return get_ruleset_metadata()
