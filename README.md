# Fast Track Homes — Mission Control

Operator dashboard for Fast Track Homes LLC.

## Runtime goals
- Local-first development on the Mac mini
- Stable remote access through an explicit public URL / tunnel
- Clean path to hosted deployment on Vercel + Supabase
- Fewer brittle one-off edits when the remote origin changes

## Local start
```bash
cd ~/Desktop/ENZO/fth-mission-control
cp .env.example .env.local   # first time only
chmod +x scripts/start-mission-control.sh
./scripts/start-mission-control.sh
```

Default behavior:
- runs `next dev`
- binds to `0.0.0.0:3000`
- writes logs under `./logs/`

## Production-style local start
```bash
MISSION_CONTROL_START_MODE=prod ./scripts/start-mission-control.sh
```

## Environment variables
Create `.env.local` from `.env.example`.

```env
MISSION_CONTROL_PUBLIC_URL=http://localhost:3000
MISSION_CONTROL_RUNTIME_MODE=development
MISSION_CONTROL_ALLOWED_DEV_ORIGINS=mc.fasttrackbuys.com,my-current-tunnel.ngrok-free.dev
```

### Notes
- `MISSION_CONTROL_ALLOWED_DEV_ORIGINS` is comma-separated.
- You can paste hostnames with or without `https://`.
- This reduces remote-dev friction when the tunnel or domain changes.

## Health surfaces
- `GET /api/system` → gateway / GHL / webhook / Mission Control runtime summary
- `GET /api/runtime` → permanent-agent runtime snapshot

## Current deployment direction
- Hosting: **Vercel**
- Database/backbone: **Supabase**
- Primary domain target: **mc.fasttrackbuys.com**

## Next phase focus
1. Replace local JSON persistence with Supabase-backed state
2. Move from tunnel-dependent remote access to first-class hosted deployment
3. Add durable auth/session handling for operator access
