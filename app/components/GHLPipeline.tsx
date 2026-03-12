"use client";
import { useState, useEffect, useCallback } from "react";

const PIPELINE_ORDER = [
  "v7mNIEAZfIi3ddoF9oh7",
  "Ar9I3e1u5EbwcjiyIUQS",
  "xGV27E7HqkPWpiLQ1KPg",
  "81XkO1LDYpM0ivC85Ey0",
];

const PIPELINE_COLORS: Record<string, string> = {
  "v7mNIEAZfIi3ddoF9oh7": "#e63e3e",
  "Ar9I3e1u5EbwcjiyIUQS": "#22c55e",
  "xGV27E7HqkPWpiLQ1KPg": "#3b82f6",
  "81XkO1LDYpM0ivC85Ey0": "#a855f7",
};

type Pipeline = {
  id: string;
  name: string;
  total: number;
  stages: { id: string; name: string; count: number }[];
};

type StaleDeal = {
  id: string;
  name: string;
  contactName: string;
  contactPhone: string;
  pipeline: string;
  stage: string;
  days: number;
  severity: "critical" | "high";
};

type Summary = {
  totalOpportunities: number;
  totalOpen: number;
  totalWon: number;
  totalContacts: number;
  staleCount: number;
  criticalStale: number;
};

type GHLData = {
  success: boolean;
  lastRefresh: string;
  summary: Summary;
  pipelines: Pipeline[];
  staleDeals: StaleDeal[];
  error?: string;
};

export default function GHLPipeline() {
  const [data, setData] = useState<GHLData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState(PIPELINE_ORDER[0]);
  const [lastRefresh, setLastRefresh] = useState<string>("");

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/ghl");
      const json: GHLData = await res.json();
      if (!json.success) throw new Error(json.error || "API error");
      setData(json);
      setLastRefresh(new Date(json.lastRefresh).toLocaleTimeString("en-US", {
        hour: "2-digit", minute: "2-digit", timeZone: "America/New_York"
      }));
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    // Auto-refresh every 5 minutes
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchData]);

  // Sort pipelines in preferred order
  const sortedPipelines = data?.pipelines.slice().sort((a, b) => {
    return PIPELINE_ORDER.indexOf(a.id) - PIPELINE_ORDER.indexOf(b.id);
  }) || [];

  const activePipeline = sortedPipelines.find(p => p.id === selected);

  return (
    <div style={{ padding: 24 }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>GHL Pipeline</h1>
          <p style={{ margin: "4px 0 0", color: "var(--text-muted)", fontSize: 13 }}>
            {loading ? "Fetching live data..." : `Live · Refreshed ${lastRefresh} ET`}
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={fetchData} disabled={loading} style={{
            background: "var(--surface)", border: "1px solid var(--border)",
            color: loading ? "var(--text-muted)" : "var(--text)",
            padding: "6px 14px", borderRadius: 6, cursor: loading ? "not-allowed" : "pointer", fontSize: 13
          }}>
            {loading ? "↻ Loading..." : "↻ Refresh"}
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: error ? "#e63e3e" : "#22c55e" }} />
            <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
              {error ? "API Error" : "GHL Connected"}
            </span>
          </div>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div style={{ background: "#e63e3e11", border: "1px solid #e63e3e44", borderRadius: 8, padding: 14, marginBottom: 20 }}>
          <span style={{ color: "#e63e3e", fontSize: 13 }}>⚠️ {error}</span>
        </div>
      )}

      {/* Loading Skeleton */}
      {loading && !data && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[1,2,3].map(i => (
            <div key={i} style={{ height: 60, background: "var(--surface)", borderRadius: 8, border: "1px solid var(--border)", opacity: 0.5 }} />
          ))}
        </div>
      )}

      {data && (
        <>
          {/* Summary Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12, marginBottom: 24 }}>
            {[
              { label: "Total Contacts",    value: data.summary.totalContacts.toLocaleString(), color: "#3b82f6" },
              { label: "Opportunities",     value: data.summary.totalOpportunities.toLocaleString(), color: "#22c55e" },
              { label: "Open",              value: data.summary.totalOpen.toLocaleString(), color: "var(--text)" },
              { label: "🚨 Stale Leads",    value: data.summary.staleCount.toString(), color: data.summary.staleCount > 0 ? "#e63e3e" : "#22c55e" },
              { label: "🔴 Critical",       value: data.summary.criticalStale.toString(), color: data.summary.criticalStale > 0 ? "#e63e3e" : "#22c55e" },
            ].map((s, i) => (
              <div key={i} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, padding: 14 }}>
                <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>{s.label}</div>
                <div style={{ fontSize: 22, fontWeight: 700, color: s.color }}>{s.value}</div>
              </div>
            ))}
          </div>

          {/* Stale Deals */}
          {data.staleDeals.length > 0 && (
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 10 }}>
                🚨 Stale Deals — Action Required ({data.staleDeals.length})
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6, maxHeight: 260, overflowY: "auto" }}>
                {data.staleDeals.map((deal, i) => (
                  <div key={i} style={{
                    background: "var(--surface)",
                    border: `1px solid ${deal.severity === "critical" ? "#e63e3e44" : "#f59e0b44"}`,
                    borderRadius: 6, padding: "10px 14px",
                    display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1, minWidth: 0 }}>
                      <span style={{
                        fontSize: 11, fontWeight: 700, flexShrink: 0,
                        color: deal.severity === "critical" ? "#e63e3e" : "#f59e0b",
                      }}>
                        {deal.severity === "critical" ? "🔴" : "🟡"} {deal.days}d
                      </span>
                      <span style={{ fontSize: 13, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {deal.name}
                      </span>
                      <span style={{ fontSize: 11, color: "var(--text-muted)", flexShrink: 0 }}>
                        {deal.stage}
                      </span>
                    </div>
                    <span style={{
                      fontSize: 10, color: "var(--text-muted)", flexShrink: 0,
                      background: "var(--surface-2)", padding: "2px 8px", borderRadius: 10
                    }}>
                      {deal.pipeline.split(" ").slice(1).join(" ")}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pipeline Tabs */}
          <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
            {sortedPipelines.map(p => {
              const color = PIPELINE_COLORS[p.id] || "#6b6b8a";
              return (
                <button key={p.id} onClick={() => setSelected(p.id)} style={{
                  padding: "7px 16px", borderRadius: 6,
                  border: `1px solid ${selected === p.id ? color : "var(--border)"}`,
                  background: selected === p.id ? color + "22" : "var(--surface)",
                  color: selected === p.id ? "var(--text)" : "var(--text-muted)",
                  cursor: "pointer", fontSize: 13, fontWeight: selected === p.id ? 600 : 400,
                  display: "flex", alignItems: "center", gap: 8,
                }}>
                  {p.name}
                  <span style={{
                    background: selected === p.id ? color + "33" : "var(--surface-2)",
                    color: selected === p.id ? color : "var(--text-muted)",
                    padding: "1px 7px", borderRadius: 10, fontSize: 11, fontWeight: 700
                  }}>{p.total}</span>
                </button>
              );
            })}
          </div>

          {/* Stage Breakdown */}
          {activePipeline && (
            <div style={{ background: "var(--surface)", borderRadius: 8, border: "1px solid var(--border)", padding: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 14, color: PIPELINE_COLORS[activePipeline.id] }}>
                {activePipeline.name} — Stage Breakdown
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 8 }}>
                {activePipeline.stages.map((stage, i) => (
                  <div key={i} style={{
                    background: "var(--surface-2)", borderRadius: 6, padding: "10px 12px",
                    border: "1px solid var(--border)"
                  }}>
                    <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 6, lineHeight: 1.3 }}>{stage.name}</div>
                    <div style={{ fontSize: 22, fontWeight: 700, color: PIPELINE_COLORS[activePipeline.id] || "var(--text)" }}>
                      {stage.count}
                    </div>
                  </div>
                ))}
                {/* Zero-count message */}
                {activePipeline.stages.length === 0 && (
                  <div style={{ color: "var(--text-muted)", fontSize: 13, padding: 8, gridColumn: "1/-1" }}>No open opportunities in this pipeline.</div>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
