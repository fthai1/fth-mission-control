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
- current auth mode is **Option A: passcode-first local access**

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
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

### Notes
- `MISSION_CONTROL_ALLOWED_DEV_ORIGINS` is comma-separated.
- You can paste hostnames with or without `https://`.
- Supabase is now the preferred hosted persistence layer.
- The app currently uses **Supabase when configured** and **falls back to local JSON** if the env or tables are not ready yet.

## Health surfaces
- `GET /api/system` → gateway / GHL / webhook / Mission Control runtime summary
- `GET /api/runtime` → permanent-agent runtime snapshot

`/api/system` now also reports whether Mission Control is running on `supabase-configured` storage or `local-fallback` mode.

## Supabase setup
1. Create the project in Supabase
2. Add Vercel env vars:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
3. In Supabase SQL editor, run:
   - `supabase/schema.sql`
4. Redeploy on Vercel

## Private access / auth
Mission Control is currently running under **Option A: passcode-first local access**.
Supabase remains the preferred persistence backbone and the planned future auth direction, but auth migration is intentionally deferred until runtime and trust-critical screens are stable.

### Required env
```env
MISSION_CONTROL_PASSCODE=
MISSION_CONTROL_ALLOWED_EMAILS=erik@fasttrackbuys.com
```

### Current auth flow
- `/login` is the public entrypoint
- operator enters the configured Mission Control passcode
- middleware blocks anonymous access to the app and API routes
- a passcode cookie grants temporary local access

### Planned future auth direction
After stabilization:
- migrate login flow to Supabase Auth / magic link
- keep allowed-email restrictions in place
- align hosted deployment around Supabase-backed auth once the app is operationally trustworthy

### Current Supabase-backed surfaces
- Agent inbox channel metadata + message transcript persistence
- Task board task feed

### Current fallback behavior
If Supabase env vars are missing or the tables are not ready, Mission Control keeps serving from local JSON/file storage instead of failing hard.

## Current deployment direction
- Hosting: **Vercel**
- Database/backbone: **Supabase**
- Primary domain target: **mc.fasttrackbuys.com**

## Next phase focus
1. Replace remaining local JSON / file persistence with Supabase-backed state
2. Add write/update flows for tasks instead of read-only feed fallback
3. Move from dev-session dependence toward more persistent runtime startup
4. Add durable auth/session handling for operator access
