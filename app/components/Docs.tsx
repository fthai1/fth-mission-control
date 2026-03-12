"use client";
import { useState } from "react";
import fs from "fs";

const DOCS = [
  { name: "SOUL.md", category: "Core", path: "~/.openclaw/workspace/SOUL.md", updated: "2026-02-24", size: "14KB", desc: "Enzo's core identity, values, and operational principles" },
  { name: "IDENTITY.md", category: "Core", path: "~/.openclaw/workspace/IDENTITY.md", updated: "2026-02-24", size: "9KB", desc: "Enzo's presentation, Ferrari standard, voice examples" },
  { name: "MEMORY.md", category: "Core", path: "~/.openclaw/workspace/MEMORY.md", updated: "2026-03-03", size: "8KB", desc: "Living second brain — critical context, lessons, active deals" },
  { name: "AGENTS.md", category: "Core", path: "~/.openclaw/workspace/AGENTS.md", updated: "2026-03-02", size: "5KB", desc: "Agent orchestration, task routing, safety rules" },
  { name: "HEARTBEAT.md", category: "Core", path: "~/.openclaw/workspace/HEARTBEAT.md", updated: "2026-02-24", size: "25KB", desc: "Self-healing protocol, vitals, repair procedures" },
  { name: "GHL Operator SKILL.md", category: "GHL Agent", path: "skills/ghl-operator/SKILL.md", updated: "2026-03-03", size: "8KB", desc: "All 4 pipelines, 37 stage IDs, API patterns, stale thresholds" },
  { name: "Business Manager SKILL.md", category: "Business Manager", path: "skills/business-manager/SKILL.md", updated: "2026-03-02", size: "5KB", desc: "Monitoring, reporting, escalation, benchmarks" },
  { name: "Data Agent SKILL.md", category: "Data Agent", path: "skills/data-agent/SKILL.md", updated: "2026-03-02", size: "6KB", desc: "Lead discovery, Synergy format, enrichment, deduplication" },
  { name: "Miami-Dade Public Records SOP", category: "Data Agent", path: "sops/data-agent/MIAMI-DADE-PUBLIC-RECORDS-SOP.md", updated: "2026-03-03", size: "6KB", desc: "Portal scrape → FTP → API upgrade path, Scrapling setup" },
  { name: "Business Manager SOP", category: "Business Manager", path: "sops/business-manager/BUSINESS-MANAGER-SOP.md", updated: "2026-03-02", size: "4KB", desc: "Daily operations, escalation procedures, troubleshooting" },
  { name: "ENZO-TODO.md", category: "Operations", path: "~/.openclaw/workspace/ENZO-TODO.md", updated: "2026-03-03", size: "5KB", desc: "Master task tracking across all projects and agents" },
  { name: "agent-data-agent-plan.md", category: "Data Agent", path: "agent-data-agent-plan.md", updated: "2026-03-02", size: "4KB", desc: "Dataset parameters research, source schedule, discussion topics" },
  { name: "agent-business-manager-plan.md", category: "Business Manager", path: "agent-business-manager-plan.md", updated: "2026-03-02", size: "12KB", desc: "Full BM build plan, reporting templates, metrics, thresholds" },
  { name: "keys.md", category: "Infrastructure", path: "keys.md", updated: "2026-03-03", size: "2KB", desc: "API keys reference — GHL, Slack, MiniMax, Brave, Gateway" },
];

const CATEGORIES = ["All", "Core", "GHL Agent", "Data Agent", "Business Manager", "Operations", "Infrastructure"];
const CAT_COLORS: Record<string, string> = {
  "Core": "#e63e3e", "GHL Agent": "#22c55e", "Data Agent": "#f59e0b",
  "Business Manager": "#3b82f6", "Operations": "#a855f7", "Infrastructure": "#6b6b8a",
};

export default function Docs() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const filtered = DOCS.filter(d => {
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.desc.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === "All" || d.category === category;
    return matchSearch && matchCat;
  });

  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>Docs</h1>
        <p style={{ margin: "4px 0 0", color: "var(--text-muted)", fontSize: 13 }}>All workspace files, SOPs, and skill documentation</p>
      </div>

      {/* Search + Filter */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search docs..."
          style={{ flex: 1, minWidth: 200, background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)", padding: "8px 14px", borderRadius: 6, fontSize: 13 }} />
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setCategory(c)} style={{
              padding: "6px 12px", borderRadius: 6, border: `1px solid ${category === c ? (CAT_COLORS[c] || "var(--accent)") : "var(--border)"}`,
              background: category === c ? (CAT_COLORS[c] || "var(--accent)") + "22" : "var(--surface)",
              color: category === c ? "var(--text)" : "var(--text-muted)", cursor: "pointer", fontSize: 12
            }}>{c}</button>
          ))}
        </div>
      </div>

      {/* Doc Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 10 }}>
        {filtered.map((d, i) => (
          <div key={i} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, padding: 14, cursor: "pointer", transition: "border-color 0.15s" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
              <span style={{ fontSize: 13, fontWeight: 600, flex: 1, marginRight: 8 }}>{d.name}</span>
              <span style={{ fontSize: 10, fontWeight: 600, color: CAT_COLORS[d.category] || "var(--text-muted)",
                background: (CAT_COLORS[d.category] || "#6b6b8a") + "22", padding: "2px 7px", borderRadius: 10, flexShrink: 0 }}>{d.category}</span>
            </div>
            <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 8, lineHeight: 1.4 }}>{d.desc}</div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: 10, color: "var(--text-muted)" }}>Updated {d.updated}</span>
              <span style={{ fontSize: 10, color: "var(--text-muted)" }}>{d.size}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
