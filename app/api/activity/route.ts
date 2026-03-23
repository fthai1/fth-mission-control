import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const ACTIVITY_FILE = path.join(process.cwd(), "data", "activity.json");

export type ActivityEvent = {
  id: string;
  ts: string;       // ISO timestamp
  agent: string;    // "Enzo" | "Agent G" | "Agent I" | "Agent M" | "Agent D"
  agentId: string;  // "main" | "ghl-agent" | "data-agent" | "marketing-agent" | "agent-4"
  type: string;     // "dd" | "scan" | "scraper" | "cron" | "routing" | "report" | "alert" | "system"
  title: string;
  detail?: string;
  status: "ok" | "warn" | "error" | "running";
  meta?: Record<string, unknown>;
};

function readEvents(): ActivityEvent[] {
  try {
    if (!fs.existsSync(ACTIVITY_FILE)) return [];
    const raw = fs.readFileSync(ACTIVITY_FILE, "utf-8");
    return JSON.parse(raw) as ActivityEvent[];
  } catch {
    return [];
  }
}

function writeEvents(events: ActivityEvent[]) {
  fs.mkdirSync(path.dirname(ACTIVITY_FILE), { recursive: true });
  fs.writeFileSync(ACTIVITY_FILE, JSON.stringify(events, null, 2));
}

// GET — return last N events (default 50)
export async function GET(request: Request) {
  const url = new URL(request.url);
  const limit = parseInt(url.searchParams.get("limit") || "50");
  const agentId = url.searchParams.get("agent");
  const type = url.searchParams.get("type");

  let events = readEvents();

  if (agentId) events = events.filter(e => e.agentId === agentId);
  if (type) events = events.filter(e => e.type === type);

  // newest first
  events = events.sort((a, b) => new Date(b.ts).getTime() - new Date(a.ts).getTime());
  events = events.slice(0, limit);

  return NextResponse.json({ events, total: events.length });
}

// POST — agents write activity events here
export async function POST(request: Request) {
  try {
    const body = await request.json() as Partial<ActivityEvent>;

    if (!body.agent || !body.title) {
      return NextResponse.json({ error: "agent and title required" }, { status: 400 });
    }

    const event: ActivityEvent = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      ts: new Date().toISOString(),
      agent: body.agent,
      agentId: body.agentId || "main",
      type: body.type || "system",
      title: body.title,
      detail: body.detail,
      status: body.status || "ok",
      meta: body.meta,
    };

    const events = readEvents();
    events.push(event);

    // keep last 500 events
    const trimmed = events
      .sort((a, b) => new Date(b.ts).getTime() - new Date(a.ts).getTime())
      .slice(0, 500);

    writeEvents(trimmed);

    return NextResponse.json({ ok: true, id: event.id });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
