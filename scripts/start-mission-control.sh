#!/bin/zsh
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
PORT="${PORT:-3000}"
HOSTNAME_VALUE="${HOSTNAME:-0.0.0.0}"
MODE="${MISSION_CONTROL_START_MODE:-dev}"
LOG_DIR="${MISSION_CONTROL_LOG_DIR:-$ROOT_DIR/logs}"
mkdir -p "$LOG_DIR"

cd "$ROOT_DIR"

echo "[mission-control] root=$ROOT_DIR mode=$MODE host=$HOSTNAME_VALUE port=$PORT"

if [[ "$MODE" == "prod" ]]; then
  npm run build
  exec npm run start -- --hostname "$HOSTNAME_VALUE" --port "$PORT" 2>&1 | tee -a "$LOG_DIR/mission-control.log"
else
  exec npm run dev -- --hostname "$HOSTNAME_VALUE" --port "$PORT" 2>&1 | tee -a "$LOG_DIR/mission-control-dev.log"
fi
