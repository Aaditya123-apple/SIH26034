#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR"

RESTART_MODE="${1:-}"

if [ "$RESTART_MODE" = "clean" ] || [ "$RESTART_MODE" = "restart" ]; then
  echo "Cleaning stale frontend build cache..."
  rm -rf "$ROOT_DIR/.next"
fi

if [ -f .env ]; then
  set -a
  . ./.env
  set +a
elif [ -f .env.example ]; then
  echo "No .env file found; loading defaults from .env.example"
  set -a
  . ./.env.example
  set +a
fi

export NEXT_PUBLIC_API_URL="${NEXT_PUBLIC_API_URL:-http://localhost:8000}"
export CORS_ALLOWED_ORIGINS="${CORS_ALLOWED_ORIGINS:-http://localhost:3000,http://127.0.0.1:3000}"
export OCR_PROVIDER="${OCR_PROVIDER:-tesseract}"
export DETECTION_PROVIDER="${DETECTION_PROVIDER:-demo}"
export DB_PATH="${DB_PATH:-$ROOT_DIR/backend/data/inspections.db}"

mkdir -p "$ROOT_DIR/backend/data" "$ROOT_DIR/logs"

check_port_in_use() {
  local port="$1"
  local service_name="$2"

  if ! command -v lsof >/dev/null 2>&1; then
    return 1
  fi

  local pid
  pid="$(lsof -tiTCP:"$port" -sTCP:LISTEN 2>/dev/null | head -n 1 || true)"
  if [ -z "$pid" ]; then
    return 1
  fi

  local cmd
  cmd="$(ps -p "$pid" -o args= 2>/dev/null || true)"
  if [[ "$cmd" == *"$ROOT_DIR"* || "$cmd" == *"uvicorn"* || "$cmd" == *"next dev"* ]]; then
    echo "$service_name is already running on port $port (PID $pid)."
    return 0
  fi

  echo "Port $port is already in use by another process: $cmd" >&2
  exit 1
}

if ! command -v npm >/dev/null 2>&1; then
  echo "Node.js/npm is required but not installed." >&2
  exit 1
fi

if [ ! -d "$ROOT_DIR/node_modules" ]; then
  echo "Installing frontend dependencies..."
  npm install --no-fund --no-audit
fi

PYTHON_BIN="${PYTHON_BIN:-$ROOT_DIR/.venv/bin/python}"
if [ ! -x "$PYTHON_BIN" ]; then
  PYTHON_BIN="$(command -v python3 || command -v python)"
fi

if [ ! -f "$ROOT_DIR/backend/requirements.txt" ]; then
  echo "Backend requirements file not found." >&2
  exit 1
fi

if [ ! -d "$ROOT_DIR/.venv" ] && [ -n "${VIRTUAL_ENV:-}" ]; then
  PYTHON_BIN="${VIRTUAL_ENV}/bin/python"
fi

if [ ! -d "$ROOT_DIR/.venv" ] || [ ! -x "$ROOT_DIR/.venv/bin/python" ]; then
  echo "Installing backend dependencies..."
  "$PYTHON_BIN" -m pip install --quiet -r "$ROOT_DIR/backend/requirements.txt"
fi

backend_pid=""
frontend_pid=""
cleanup() {
  if [ -n "${backend_pid}" ] && kill -0 "$backend_pid" 2>/dev/null; then
    echo "Stopping backend..."
    kill "$backend_pid" 2>/dev/null || true
  fi
  if [ -n "${frontend_pid}" ] && kill -0 "$frontend_pid" 2>/dev/null; then
    echo "Stopping frontend..."
    kill "$frontend_pid" 2>/dev/null || true
  fi
  exit 0
}
trap cleanup INT TERM EXIT

if [ "$RESTART_MODE" = "restart" ]; then
  echo "Restart mode enabled. Stopping stale app instances on ports 8000 and 3000..."
  if command -v lsof >/dev/null 2>&1; then
    for port in 8000 3000; do
      local_pids="$(lsof -tiTCP:"$port" -sTCP:LISTEN 2>/dev/null || true)"
      if [ -n "$local_pids" ]; then
        echo "$local_pids" | xargs -r kill -9
      fi
    done
  else
    echo "lsof is not installed; skipping forced stop."
  fi
fi

if check_port_in_use 8000 "Backend"; then
  echo "Using existing backend on http://localhost:8000"
else
  echo "Starting backend on http://localhost:8000"
  (
    cd "$ROOT_DIR"
    export CORS_ALLOWED_ORIGINS="$CORS_ALLOWED_ORIGINS"
    export OCR_PROVIDER="$OCR_PROVIDER"
    export DETECTION_PROVIDER="$DETECTION_PROVIDER"
    export DB_PATH="$DB_PATH"
    "$PYTHON_BIN" -m uvicorn backend.app.main:app --host 0.0.0.0 --port 8000
  ) >"$ROOT_DIR/logs/backend.log" 2>&1 &
  backend_pid=$!
  sleep 3
fi

if check_port_in_use 3000 "Frontend"; then
  echo "Using existing frontend on http://localhost:3000"
else
  echo "Starting frontend on http://localhost:3000"
  (
    cd "$ROOT_DIR"
    export NEXT_PUBLIC_API_URL="$NEXT_PUBLIC_API_URL"
    npm run dev -- --hostname 0.0.0.0 --port 3000
  ) >"$ROOT_DIR/logs/frontend.log" 2>&1 &
  frontend_pid=$!
  sleep 3
fi

echo "Services are ready."
echo "Backend logs: $ROOT_DIR/logs/backend.log"
echo "Frontend logs: $ROOT_DIR/logs/frontend.log"
echo "Press Ctrl+C to stop both services if you started them in this session."

if [ -n "$backend_pid" ] || [ -n "$frontend_pid" ]; then
  wait "$backend_pid" "$frontend_pid"
fi
