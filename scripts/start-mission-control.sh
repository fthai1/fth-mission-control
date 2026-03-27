#!/bin/zsh
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
PORT="${PORT:-3000}"
HOSTNAME_VALUE="${HOSTNAME:-0.0.0.0}"
MODE="${MISSION_CONTROL_START_MODE:-dev}"
LOG_DIR="${MISSION_CONTROL_LOG_DIR:-$ROOT_DIR/logs}"
FORCE_RESTART="${MISSION_CONTROL_FORCE_RESTART:-1}"
mkdir -p "$LOG_DIR"

cd "$ROOT_DIR"

echo "[mission-control] root=$ROOT_DIR mode=$MODE host=$HOSTNAME_VALUE port=$PORT"

cleanup_next_state() {
  if [[ -d "$ROOT_DIR/.next" ]]; then
    rm -rf "$ROOT_DIR/.next"
  fi
}

port_in_use() {
  python3 - <<'PY' "$HOSTNAME_VALUE" "$PORT"
import socket, sys
host = sys.argv[1]
port = int(sys.argv[2])
family = socket.AF_INET6 if ":" in host and host != "0.0.0.0" else socket.AF_INET
sock = socket.socket(family, socket.SOCK_STREAM)
sock.settimeout(0.5)
try:
    result = sock.connect_ex((host, port))
    print("1" if result == 0 else "0")
except Exception:
    print("0")
finally:
    sock.close()
PY
}

kill_stale_mission_control() {
  local patterns=(
    "next dev --hostname $HOSTNAME_VALUE --port $PORT"
    "next start --hostname $HOSTNAME_VALUE --port $PORT"
    "$ROOT_DIR"
  )

  for pattern in "${patterns[@]}"; do
    if pgrep -f "$pattern" >/dev/null 2>&1; then
      echo "[mission-control] terminating stale process pattern: $pattern"
      pkill -f "$pattern" >/dev/null 2>&1 || true
    fi
  done

  sleep 1
}

ensure_port_available() {
  if [[ "$FORCE_RESTART" != "1" ]]; then
    return 0
  fi

  local used
  used="$(port_in_use)"
  if [[ "$used" == "1" ]]; then
    echo "[mission-control] port $PORT appears busy on $HOSTNAME_VALUE; attempting safe cleanup"
    kill_stale_mission_control
  fi

  used="$(port_in_use)"
  if [[ "$used" == "1" ]]; then
    echo "[mission-control] port $PORT is still busy after cleanup; aborting start"
    exit 1
  fi
}

cleanup_next_state
ensure_port_available

if [[ "$MODE" == "prod" ]]; then
  npm run build
  exec npm run start -- --hostname "$HOSTNAME_VALUE" --port "$PORT" 2>&1 | tee -a "$LOG_DIR/mission-control.log"
else
  exec npm run dev -- --hostname "$HOSTNAME_VALUE" --port "$PORT" 2>&1 | tee -a "$LOG_DIR/mission-control-dev.log"
fi
