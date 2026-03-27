"use client";

const MISSION = "Build a self-reliant Fast Track Homes operating layer that improves visibility, preserves useful work, reduces manual drag on Erik, and supports revenue-producing execution through better systems.";

const HUMANS = [
  { name: "Erik", role: "COO/CTO/CFO — Primary Interface", emoji: "👤", note: "Primary operating interface; focused on decisions, relationships, negotiation, and company direction." },
  { name: "Anthony", role: "CEO — Decision Authority", emoji: "👤", note: "Strategic authority and business leadership." },
];

const AGENTS = [
  {
    id: "main",
    name: "Enzo",
    role: "Coordinator / Mission Control / Final Review",
    model: "OpenAI Codex GPT-5.4",
    workspace: "~/.openclaw/workspace",
    status: "active-core",
    color: "#e63e3e",
    emoji: "🏎️",
    capabilities: ["Strategy", "Mission Control", "Escalation", "Cross-system coordination", "Final review"],
    tier: "primary",
  },
  {
    id: "business-manager",
    name: "Business Manager",
    role: "Oversight / Summaries / Exception reporting",
    model: "OpenAI Codex GPT-5.4",
    workspace: "~/.openclaw/workspace-business-manager",
    status: "architected",
    color: "#22c55e",
    emoji: "📊",
    capabilities: ["Oversight", "Summaries", "Exception reporting", "Benchmark review"],
    tier: "agent",
  },
  {
    id: "data-agent",
    name: "Data Agent",
    role: "Scraper health / Data reliability / Source monitoring",
    model: "OpenAI Codex GPT-5.4",
    workspace: "~/.openclaw/workspace-data-agent",
    status: "architected",
    color: "#f59e0b",
    emoji: "🔍",
    capabilities: ["Source monitoring", "Scraper ops", "Output validation", "Pipeline reliability"],
    tier: "agent",
  },
  {
    id: "ghl-agent",
    name: "GHL Agent",
    role: "CRM ops / Pipeline monitoring / Workflow QA",
    model: "OpenAI Codex GPT-5.4",
    workspace: "~/.openclaw/workspace-ghl-agent",
    status: "architected",
    color: "#3b82f6",
    emoji: "⚙️",
    capabilities: ["Pipeline health", "Workflow QA", "Stale review", "CRM reporting"],
    tier: "agent",
  },
  {
    id: "marketing-agent",
    name: "Marketing Agent",
    role: "Marketing department lane",
    model: "OpenAI Codex GPT-5.4",
    workspace: "~/.openclaw/workspace-marketing-agent",
    status: "planned",
    color: "#ec4899",
    emoji: "📣",
    capabilities: ["Brand system", "Website optimization", "Campaigns", "Property marketing", "Social media"],
    tier: "agent",
  },
  {
    id: "future-agents",
    name: "Future Agents",
    role: "Expandable architecture for new departments",
    model: "TBD per agent",
    workspace: "Additive workspaces by department",
    status: "expandable",
    color: "#a855f7",
    emoji: "🧩",
    capabilities: ["Underwriting", "Disposition", "Appointments", "Other future departments"],
    tier: "future",
  },
];

const STATUS_COLORS: Record<string, string> = {
  "active-core": "#22c55e",
  architected: "#3b82f6",
  planned: "#f59e0b",
  expandable: "#a855f7",
};

const STATUS_LABELS: Record<string, string> = {
  "active-core": "active core",
  architected: "architected",
  planned: "planned",
  expandable: "expandable",
};

export default function Team() {
  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>Team</h1>
        <p style={{ margin: "4px 0 0", color: "var(--text-muted)", fontSize: 13 }}>
          Permanent architecture view — stable ownership structure, not a fake runtime monitor.
        </p>
      </div>

      <div style={{ background: "#e63e3e11", border: "1px solid #e63e3e44", borderRadius: 10, padding: 18, marginBottom: 18 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#e63e3e", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>🎯 Mission</div>
        <div style={{ fontSize: 14, lineHeight: 1.6, color: "var(--text)" }}>{MISSION}</div>
      </div>

      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, padding: 16, marginBottom: 24 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>Architecture Rule</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, fontSize: 13, color: "var(--text-muted)" }}>
          <div>
            <div style={{ fontWeight: 700, color: "var(--text)", marginBottom: 6 }}>Team = Permanent Architecture</div>
            <div>Use this screen for durable human and agent ownership. It should stay stable unless the architecture itself changes.</div>
          </div>
          <div>
            <div style={{ fontWeight: 700, color: "var(--text)", marginBottom: 6 }}>Office = Runtime Posture</div>
            <div>Runtime freshness, live lanes, and temporary task-force activity belong in Office and Now, not here.</div>
          </div>
        </div>
      </div>

      <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 10 }}>Humans</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12, marginBottom: 24 }}>
        {HUMANS.map((h, i) => (
          <div key={i} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, padding: 14, display: "flex", gap: 12, alignItems: "center" }}>
            <div style={{ fontSize: 28 }}>{h.emoji}</div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700 }}>{h.name}</div>
              <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{h.role}</div>
              <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4, lineHeight: 1.4 }}>{h.note}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 10 }}>Permanent Agents</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {AGENTS.map((a, i) => (
          <div key={i} style={{ background: "var(--surface)", border: `1px solid ${a.tier === "primary" ? a.color + "44" : "var(--border)"}`, borderRadius: 8, padding: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <div style={{ fontSize: 28 }}>{a.emoji}</div>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 15, fontWeight: 700 }}>{a.name}</span>
                    <span style={{ fontSize: 10, fontWeight: 700, color: STATUS_COLORS[a.status], textTransform: "uppercase", background: STATUS_COLORS[a.status] + "22", padding: "2px 7px", borderRadius: 10 }}>
                      {STATUS_LABELS[a.status]}
                    </span>
                  </div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>{a.role}</div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>Model: {a.model} · Workspace: {a.workspace}</div>
                </div>
              </div>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
              {a.capabilities.map((cap, j) => (
                <span key={j} style={{ fontSize: 11, padding: "2px 8px", borderRadius: 10, background: a.color + "15", color: a.color, border: `1px solid ${a.color}33` }}>
                  {cap}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
