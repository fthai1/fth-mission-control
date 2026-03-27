"use client";
import { useState } from "react";

const DOCS = [
  { name: "SOUL.md", category: "Core", path: "~/.openclaw/workspace/SOUL.md", desc: "Core identity, mission, values, and operating standard for Enzo." },
  { name: "USER.md", category: "Core", path: "~/.openclaw/workspace/USER.md", desc: "Erik operating profile, preferences, priorities, and trust rules." },
  { name: "AGENTS.md", category: "Core", path: "~/.openclaw/workspace/AGENTS.md", desc: "Workspace operating rules, startup protocol, session logging, and execution doctrine." },
  { name: "MEMORY.md", category: "Core", path: "~/.openclaw/workspace/MEMORY.md", desc: "Curated long-term operating memory and durable business context." },
  { name: "HEARTBEAT.md", category: "Core", path: "~/.openclaw/workspace/HEARTBEAT.md", desc: "Lean heartbeat checklist for quiet monitoring and proactive alerts." },
  { name: "IDENTITY.md", category: "Core", path: "~/.openclaw/workspace/IDENTITY.md", desc: "Voice, role, and Ferrari-grade identity consistency for Enzo." },
  { name: "TOOLS.md", category: "Core", path: "~/.openclaw/workspace/TOOLS.md", desc: "Local environment notes, browser profile, host references, and non-secret routing context." },
  { name: "mission-control.md", category: "Projects", path: "~/.openclaw/workspace/memory/projects/mission-control.md", desc: "Mission Control operating model, source boundaries, trust standard, and stabilization priorities." },
  { name: "agent-ecosystem.md", category: "Projects", path: "~/.openclaw/workspace/memory/projects/agent-ecosystem.md", desc: "Permanent agent architecture, preserved value, and audit-first direction." },
  { name: "ghl-integration.md", category: "Projects", path: "~/.openclaw/workspace/memory/projects/ghl-integration.md", desc: "Durable GHL integration reference and hygiene rules." },
  { name: "infrastructure.md", category: "Projects", path: "~/.openclaw/workspace/memory/projects/infrastructure.md", desc: "Infrastructure-level references, environment direction, and operational notes." },
  { name: "proactive-systems.md", category: "Projects", path: "~/.openclaw/workspace/memory/projects/proactive-systems.md", desc: "Deeper reference for proactive execution, visibility, and system-improvement proposals." },
  { name: "crm-authority-matrix.md", category: "Operations", path: "~/.openclaw/workspace/crm-authority-matrix.md", desc: "Authority and ownership boundaries around CRM actions and responsibilities." },
  { name: "document-governance-standard.md", category: "Operations", path: "~/.openclaw/workspace/document-governance-standard.md", desc: "Rules for documentation hygiene, control, and maintenance." },
  { name: "human-vs-ai-responsibility-map.md", category: "Operations", path: "~/.openclaw/workspace/human-vs-ai-responsibility-map.md", desc: "Boundary map between human authority and AI execution lanes." },
  { name: "implementation-master-plan.md", category: "Operations", path: "~/.openclaw/workspace/implementation-master-plan.md", desc: "High-level implementation sequencing and system build direction." },
  { name: "internal-strategy-openclaw-fth.md", category: "Operations", path: "~/.openclaw/workspace/internal-strategy-openclaw-fth.md", desc: "Internal strategy framing for OpenClaw inside Fast Track Homes." },
  { name: "investor-deck-openclaw-fth.md", category: "Operations", path: "~/.openclaw/workspace/investor-deck-openclaw-fth.md", desc: "Investor-facing strategic deck content and narrative support material." },
  { name: "root-doc-cleanup-plan.md", category: "Operations", path: "~/.openclaw/workspace/root-doc-cleanup-plan.md", desc: "Cleanup and normalization plan for root operating docs." },
  { name: "system-transition-migration-plan.md", category: "Operations", path: "~/.openclaw/workspace/system-transition-migration-plan.md", desc: "Migration direction for system transitions and structural cleanup." }
];

const CATEGORIES = ["All", "Core", "Projects", "Operations"];
const CAT_COLORS: Record<string, string> = {
  Core: "#e63e3e",
  Projects: "#3b82f6",
  Operations: "#a855f7",
};

export default function Docs() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const filtered = DOCS.filter((d) => {
    const matchSearch =
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.desc.toLowerCase().includes(search.toLowerCase()) ||
      d.path.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === "All" || d.category === category;
    return matchSearch && matchCat;
  });

  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>Docs</h1>
        <p style={{ margin: "4px 0 0", color: "var(--text-muted)", fontSize: 13 }}>
          Workspace reference map — real root docs and project-memory files worth opening, not fake metadata or stale file theater.
        </p>
      </div>

      <div style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: 10,
        padding: 14,
        marginBottom: 18,
        fontSize: 13,
        color: "var(--text-muted)",
        lineHeight: 1.5,
      }}>
        <strong style={{ color: "var(--text)" }}>Source boundary:</strong> this screen is a curated reference layer built from the current workspace structure. It is not a live filesystem browser, and it should not invent freshness or file details it has not actually loaded.
      </div>

      <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search docs..."
          style={{ flex: 1, minWidth: 200, background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)", padding: "8px 14px", borderRadius: 6, fontSize: 13 }}
        />
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              style={{
                padding: "6px 12px",
                borderRadius: 6,
                border: `1px solid ${category === c ? (CAT_COLORS[c] || "var(--accent)") : "var(--border)"}`,
                background: category === c ? (CAT_COLORS[c] || "var(--accent)") + "22" : "var(--surface)",
                color: category === c ? "var(--text)" : "var(--text-muted)",
                cursor: "pointer",
                fontSize: 12,
              }}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 10 }}>
        {filtered.map((d, i) => (
          <div key={i} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, padding: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8, gap: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 600, flex: 1 }}>{d.name}</span>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  color: CAT_COLORS[d.category] || "var(--text-muted)",
                  background: (CAT_COLORS[d.category] || "#6b6b8a") + "22",
                  padding: "2px 7px",
                  borderRadius: 10,
                  flexShrink: 0,
                }}
              >
                {d.category}
              </span>
            </div>
            <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 10, lineHeight: 1.45 }}>{d.desc}</div>
            <div style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "monospace", lineHeight: 1.4, wordBreak: "break-all" }}>{d.path}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
