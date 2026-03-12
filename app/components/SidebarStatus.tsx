"use client";

import { useEffect, useState } from "react";

type Check = {
  status: string;
  latency: number;
};

type SystemHealth = {
  ghl: Check;
  webhook: Check;
  gateway: Check;
  missionControl?: {
    app: string;
    mode: string;
    publicUrl?: string;
    uptimeSeconds: number;
  };
  timestamp?: string;
};

const emptyHealth: SystemHealth = {
  ghl: { status: "unknown", latency: 0 },
  webhook: { status: "unknown", latency: 0 },
  gateway: { status: "unknown", latency: 0 },
  missionControl: { app: "unknown", mode: "unknown", publicUrl: "", uptimeSeconds: 0 },
};

function colorFor(status: string) {
  switch (status) {
    case "ok":
    case "online":
      return "#22c55e";
    case "degraded":
    case "warning":
      return "#f59e0b";
    case "offline":
    case "error":
      return "#ef4444";
    default:
      return "#94a3b8";
  }
}

export default function SidebarStatus() {
  const [health, setHealth] = useState<SystemHealth>(emptyHealth);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const response = await fetch("/api/system", { cache: "no-store" });
        const data = await response.json();
        if (!cancelled) setHealth(data);
      } catch {
        if (!cancelled) setHealth(emptyHealth);
      }
    };

    load();
    const timer = setInterval(load, 15000);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, []);

  return (
    <div style={{ padding: "12px 16px", borderTop: "1px solid var(--border)", display: "grid", gap: 12 }}>
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--green)" }} />
          <span style={{ fontSize: 11, color: "var(--text-muted)" }}>Enzo Online</span>
        </div>
        <div style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 4 }}>
          Miami, FL · {new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", timeZone: "America/New_York" })} ET
        </div>
      </div>

      <div style={{ background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 12, padding: 10, display: "grid", gap: 8 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "center" }}>
          <span style={{ fontSize: 10, textTransform: "uppercase", color: "var(--text-muted)", fontWeight: 700 }}>Runtime Health</span>
          <span style={{ fontSize: 10, color: "var(--text-muted)" }}>{health.timestamp ? new Date(health.timestamp).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }) : "—"}</span>
        </div>
        <HealthRow
          label="Mission Control"
          status={health.missionControl?.app || "unknown"}
          detail={health.missionControl?.publicUrl || health.missionControl?.mode || "unknown"}
        />
        <HealthRow label="Gateway" status={health.gateway.status} detail={formatLatency(health.gateway.latency)} />
        <HealthRow label="GHL" status={health.ghl.status} detail={formatLatency(health.ghl.latency)} />
        <HealthRow label="Webhook" status={health.webhook.status} detail={formatLatency(health.webhook.latency)} />
      </div>
    </div>
  );
}

function HealthRow({ label, status, detail }: { label: string; status: string; detail: string }) {
  const color = colorFor(status);
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 8, alignItems: "center" }}>
      <div>
        <div style={{ fontSize: 11, color: "var(--text)" }}>{label}</div>
        <div style={{ fontSize: 10, color: "var(--text-muted)" }}>{detail}</div>
      </div>
      <span
        style={{
          fontSize: 10,
          fontWeight: 700,
          textTransform: "uppercase",
          color,
          border: `1px solid ${color}33`,
          background: `${color}14`,
          padding: "4px 7px",
          borderRadius: 999,
        }}
      >
        {status}
      </span>
    </div>
  );
}

function formatLatency(latency: number) {
  return latency ? `${latency} ms` : "No response";
}
