#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP_DIR="$REPO_ROOT/part4/hbnb"
VENV_DIR="$APP_DIR/.venv"
PYTHON_BIN="$VENV_DIR/bin/python"

if [[ ! -d "$APP_DIR" ]]; then
  echo "Error: Part 4 backend folder not found at $APP_DIR"
  exit 1
fi

cd "$APP_DIR"

if [[ ! -x "$PYTHON_BIN" ]]; then
  echo "Creating virtual environment..."
  python3 -m venv .venv
fi

echo "Installing/updating dependencies..."
"$PYTHON_BIN" -m ensurepip --upgrade >/dev/null 2>&1 || true
"$PYTHON_BIN" -m pip install --upgrade pip >/dev/null
"$PYTHON_BIN" -m pip install -r requirements.txt >/dev/null

if command -v lsof >/dev/null 2>&1; then
  mapfile -t pids < <(lsof -t -iTCP:5000 -sTCP:LISTEN -n -P 2>/dev/null | sort -u)
  if [[ ${#pids[@]} -gt 0 ]]; then
    for pid in "${pids[@]}"; do
      cwd="$(readlink -f "/proc/$pid/cwd" 2>/dev/null || true)"
      if [[ "$cwd" == "$APP_DIR"* ]]; then
        echo "Stopping existing Part 4 process (PID $pid)..."
        kill "$pid" || true
      else
        echo "Port 5000 is in use by another process (PID $pid)."
        echo "Stop it manually, or run this app on another port."
        exit 1
      fi
    done
    sleep 1
  fi
fi

echo "Starting Part 4 backend at http://127.0.0.1:5000"
exec "$PYTHON_BIN" run.py