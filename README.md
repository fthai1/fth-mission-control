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
Mission Control is now intended to run behind **Supabase Auth**.

### Required env
```env
MISSION_CONTROL_ALLOWED_EMAILS=erik@fasttrackbuys.com
```

### Auth flow
- `/login` is the public entrypoint
- users sign in via Supabase magic link
- middleware blocks anonymous access to the app and API routes
- only emails in `MISSION_CONTROL_ALLOWED_EMAILS` are allowed through

### Supabase dashboard setup
In Supabase Auth settings:
- enable **Email** provider
- enable **magic link / OTP email login**
- add your site URL / redirect URL:
  - `https://mc.fasttrackbuys.com/auth/callback`
  - `http://localhost:3000/auth/callback` (for local dev)

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
