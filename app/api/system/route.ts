import { NextResponse } from "next/server";
import { getMissionControlMode, getMissionControlPublicUrl } from "@/lib/mission-control-config";
import { isSupabaseConfigured } from "@/lib/supabase";

async function timedFetch(url: string, timeoutMs: number, init?: RequestInit) {
  const start = Date.now();
  try {
    const response = await fetch(url, { ...init, signal: AbortSignal.timeout(timeoutMs) });
    return {
      status: response.ok ? "ok" : "error",
      latency: Date.now() - start,
    };
  } catch {
    return {
      status: "offline",
      latency: 0,
    };
  }
}

export async function GET() {
  try {
    const [ghl, webhook, gateway] = await Promise.all([
      timedFetch(
        "https://services.leadconnectorhq.com/opportunities/search?location_id=b80CbQkQdj8vg0uue9Ea&limit=1",
        6000,
        {
          headers: {
            Authorization: "Bearer pit-7b605592-a9bc-4f2c-a491-47694fd88bb3",
            Version: "2021-07-28",
          },
        }
      ),
      timedFetch("http://localhost:8765/health", 3000),
      timedFetch("http://127.0.0.1:18789/health", 2500),
    ]);

    return NextResponse.json({
      ghl,
      webhook,
      gateway,
      missionControl: {
        app: "online",
        mode: getMissionControlMode(),
        publicUrl: getMissionControlPublicUrl(),
        storage: isSupabaseConfigured() ? "supabase-configured" : "local-fallback",
        auth: "supabase-magic-link",
        uptimeSeconds: Math.round(process.uptime()),
      },
      timestamp: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json({ error: "System check failed" }, { status: 500 });
  }
}
