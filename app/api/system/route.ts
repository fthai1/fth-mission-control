import { NextResponse } from "next/server";
import {
  getGhlApiKey,
  getGhlBaseUrl,
  getGhlLocationId,
  getGhlVersion,
  getMissionControlAuthMode,
  getMissionControlMode,
  getMissionControlPublicUrl,
} from "@/lib/mission-control-config";
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

async function getGhlHealth() {
  const apiKey = getGhlApiKey();
  const locationId = getGhlLocationId();
  if (!apiKey || !locationId) {
    return { status: "unconfigured", latency: 0 };
  }

  return timedFetch(
    `${getGhlBaseUrl()}/opportunities/search?location_id=${locationId}&limit=1`,
    6000,
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Version: getGhlVersion(),
      },
    }
  );
}

export async function GET() {
  try {
    const [ghl, webhook, gateway] = await Promise.all([
      getGhlHealth(),
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
        auth: getMissionControlAuthMode(),
        uptimeSeconds: Math.round(process.uptime()),
      },
      timestamp: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json({ error: "System check failed" }, { status: 500 });
  }
}
