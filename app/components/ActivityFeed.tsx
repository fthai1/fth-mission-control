"use client";
import { useEffect, useState, useCallback } from "react";

type ActivityEvent = {
  id: string;
  ts: string;
  agent: string;
  agentId: string;
  type: string;
  title: string;
  detail?: string;
  status: "ok" | "warn" | "error" | "running";
  meta?: Record<string, unknown>;
};

const AGENT_COLORS: Record<string, string> = {
  "main":           "#e8c45a",
  "ghl-agent":      "#4fc3f7",
  "data-agent":     "#81c784",
  "marketing-agent":"#ce93d8",
  "agent-4":        "#ff8a65",
};

const AGENT_LABELS: Record<string, string> = {
  "main":           "🏎️ Enzo",
  "ghl-agent":      "G  Agent G",
  "data-agent":     "I  Agent I",
  "marketing-agent":"M  Agent M",
  "agent-4":        "D  Agent D",
};

const STATUS_COLOR: Record<string, string> = {
  ok:      "#81c784",
  warn:    "#ffb74d",
  error:   "#e57373",
  running: "#4fc3f7",
};

const STATUS_DOT: Record<string, string> = {
  ok:      "●",
  warn:    "▲",
  error:   "✕",
  running: "◌",
};

const TYPE_ICON: Record<string, string> = {
  dd:      "🔍",
  scan:    "📋",
  scraper: "🕷️",
  cron:    "⏱️",
  routing: "↗️",
  report:  "📊",
  alert:   "⚠️",
  system:  "⚙️",
};

function timeAgo(ts: string): string {
  const diff = Math.floor((Date.now() - new Date(ts).getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function formatTime(ts: string): string {
  return new Date(ts).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "America/New_York",
  });
}

const FILTERS = ["All", "Enzo", "Agent G", "Agent I", "Agent M", "Agent D"];
const TYPE_FILTERS = ["All Types", "dd", "scan", "scraper", "cron", "routing", "report", "alert"];

export default function ActivityFeed() {
  const [events, setEvents] = useState<ActivityEvent[]>([]);
  const [filter, setFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [lastCount, setLastCount] = useState(0);
  const [newFlash, setNewFlash] = useState(false);

  const fetchEvents = useCallback(async () => {
    try {
      const res = await fetch("/api/activity?limit=100", { cache: "no-store" });
      const data = await res.json();
      const incoming = data.events || [];
      if (incoming.length > lastCount && lastCount > 0) {
        setNewFlash(true);
        setTimeout(() => setNewFlash(false), 1500);
      }
      setLastCount(incoming.length);
      setEvents(incoming);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [lastCount]);

  useEffect(() => {
    fetchEvents();
    const interval = setInterval(fetchEvents, 15000);
    return () => clearInterval(interval);
  }, [fetchEvents]);

  const agentIdMap: Record<string, string> = {
    "Enzo":    "main",
    "Agent G": "ghl-agent",
    "Agent I": "data-agent",
    "Agent M": "marketing-agent",
    "Agent D": "agent-4",
  };

  const filtered = events.filter(e => {
    const agentOk = filter === "All" || e.agentId === agentIdMap[filter];
    const typeOk = typeFilter === "All Types" || e.type === typeFilter;
    return agentOk && typeOk;
  });

  return (
    <div style={{ fontFamily: "'Inter', monospace", color: "#e0e0e0", minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 20, fontWeight: 700, color: "#e8c45a" }}>Agent Activity Feed</span>
          {newFlash && (
            <span style={{ fontSize: 11, color: "#4fc3f7", fontWeight: 700, animation: "pulse 1s" }}>
              ● NEW
            </span>
          )}
        </div>
        <button
          onClick={fetchEvents}
          style={{ background: "#1e1e1e", border: "1px solid #333", color: "#aaa", padding: "4px 12px", borderRadius: 6, cursor: "pointer", fontSize: 12 }}
        >
          ↻ Refresh
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        {FILTERS.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: "4px 12px",
              borderRadius: 999,
              border: `1px solid ${filter === f ? "#e8c45a" : "#333"}`,
              background: filter === f ? "#e8c45a22" : "#1a1a1a",
              color: filter === f ? "#e8c45a" : "#888",
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >{f}</button>
        ))}
        <div style={{ width: 1, background: "#333", margin: "0 4px" }} />
        {TYPE_FILTERS.map(t => (
          <button
            key={t}
            onClick={() => setTypeFilter(t)}
            style={{
              padding: "4px 12px",
              borderRadius: 999,
              border: `1px solid ${typeFilter === t ? "#4fc3f7" : "#333"}`,
              background: typeFilter === t ? "#4fc3f722" : "#1a1a1a",
              color: typeFilter === t ? "#4fc3f7" : "#888",
              fontSize: 11,
              cursor: "pointer",
            }}
          >{TYPE_ICON[t] || ""} {t}</button>
        ))}
      </div>

      {/* Event count */}
      <div style={{ fontSize: 11, color: "#555", marginBottom: 12 }}>
        {filtered.length} events {filter !== "All" || typeFilter !== "All Types" ? "(filtered)" : ""}
      </div>

      {/* Feed */}
      {loading ? (
        <div style={{ color: "#555", padding: 40, textAlign: "center" }}>Loading activity...</div>
      ) : filtered.length === 0 ? (
        <div style={{ color: "#444", padding: 40, textAlign: "center", border: "1px dashed #333", borderRadius: 8 }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>⚡</div>
          <div>No activity yet — agents will post here as they work</div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {filtered.map(event => {
            const color = AGENT_COLORS[event.agentId] || "#888";
            const isExpanded = expanded === event.id;
            return (
              <div
                key={event.id}
                onClick={() => setExpanded(isExpanded ? null : event.id)}
                style={{
                  background: "#141414",
                  border: `1px solid ${isExpanded ? color + "66" : "#222"}`,
                  borderLeft: `3px solid ${color}`,
                  borderRadius: 6,
                  padding: "10px 14px",
                  cursor: event.detail ? "pointer" : "default",
                  transition: "border-color 0.15s",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  {/* Status dot */}
                  <span style={{ color: STATUS_COLOR[event.status], fontSize: 13, width: 14 }}>
                    {STATUS_DOT[event.status]}
                  </span>

                  {/* Type icon */}
                  <span style={{ fontSize: 13, width: 18 }}>{TYPE_ICON[event.type] || "•"}</span>

                  {/* Agent badge */}
                  <span style={{
                    fontSize: 10,
                    fontWeight: 700,
                    color,
                    background: `${color}18`,
                    border: `1px solid ${color}33`,
                    padding: "2px 7px",
                    borderRadius: 999,
                    whiteSpace: "nowrap",
                  }}>
                    {AGENT_LABELS[event.agentId] || event.agent}
                  </span>

                  {/* Title */}
                  <span style={{ fontSize: 13, fontWeight: 500, flex: 1, color: "#ddd" }}>
                    {event.title}
                  </span>

                  {/* Time */}
                  <span style={{ fontSize: 11, color: "#555", whiteSpace: "nowrap" }}>
                    {formatTime(event.ts)} · {timeAgo(event.ts)}
                  </span>

                  {/* Expand arrow */}
                  {event.detail && (
                    <span style={{ color: "#444", fontSize: 11 }}>{isExpanded ? "▲" : "▼"}</span>
                  )}
                </div>

                {/* Expanded detail */}
                {isExpanded && event.detail && (
                  <div style={{
                    marginTop: 10,
                    paddingTop: 10,
                    borderTop: "1px solid #222",
                    fontSize: 12,
                    color: "#aaa",
                    whiteSpace: "pre-wrap",
                    lineHeight: 1.6,
                  }}>
                    {event.detail}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
