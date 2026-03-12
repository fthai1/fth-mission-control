"use client";

const PROJECTS = [
  {
    id: 1, name: "FTH Agent Ecosystem",
    description: "Build and deploy all 4 AI agents — Business Manager, Data Agent, GHL Operator, Marketing Agent",
    progress: 40, status: "active", color: "#e63e3e",
    tasks: [
      { name: "Business Manager SKILL.md + SOP", done: true },
      { name: "Data Agent SKILL.md", done: true },
      { name: "GHL Operator SKILL.md (all 37 stages)", done: true },
      { name: "Miami-Dade Public Records SOP", done: true },
      { name: "Lis Pendens Scraper (browser automation)", done: false },
      { name: "Multi-signal scraper (12 doc types)", done: false },
      { name: "GHL Operator SOP.md", done: false },
      { name: "Cron jobs activated", done: false },
      { name: "Marketing Agent plan + build", done: false },
    ],
  },
  {
    id: 2, name: "Mission Control Dashboard",
    description: "Custom Next.js dashboard at localhost:3737 — FTH visual hub for all tasks, projects, pipeline, and agents",
    progress: 70, status: "active", color: "#3b82f6",
    tasks: [
      { name: "Next.js scaffold + theme", done: true },
      { name: "Task Board (Kanban)", done: true },
      { name: "GHL Pipeline (live API)", done: true },
      { name: "Calendar (cron jobs)", done: true },
      { name: "Projects screen", done: true },
      { name: "Team screen", done: true },
      { name: "Data Status screen", done: true },
      { name: "Docs screen", done: true },
      { name: "Memory screen", done: true },
      { name: "Chat with Enzo (Gateway integration)", done: false },
      { name: "Live file links in Docs screen", done: false },
      { name: "Auto-refresh all screens", done: false },
    ],
  },
  {
    id: 3, name: "Data Pipeline — Prospect Engine",
    description: "12 motivated seller signal types → Prospect CSV → Skip Trace → Enriched CSV → Manual Review → GHL Lead import",
    progress: 25, status: "active", color: "#f59e0b",
    tasks: [
      { name: "Portal URL discovered + form mapped", done: true },
      { name: "Scrapling + Playwright installed", done: true },
      { name: "Browser automation (nav + form)", done: true },
      { name: "Register Miami-Dade portal account", done: false },
      { name: "Direct API via session cookie (Option C)", done: false },
      { name: "Multi-signal scraper (all 12 types)", done: false },
      { name: "Prospect CSV → Desktop/ENZO + workspace", done: false },
      { name: "Skip trace integration", done: false },
      { name: "Enriched CSV output", done: false },
      { name: "Broward County portal credentials", done: false },
      { name: "MLS API credentials (MIAMI MLS + BeachesMLS)", done: false },
      { name: "Invelo integration", done: false },
    ],
  },
  {
    id: 4, name: "GHL API Integration",
    description: "Full GHL v2 API — contacts, pipeline, workflows. Live at services.leadconnectorhq.com",
    progress: 75, status: "active", color: "#22c55e",
    tasks: [
      { name: "Migrated to Private Integration v2", done: true },
      { name: "Contacts API (369 contacts)", done: true },
      { name: "Opportunities API (225 opps)", done: true },
      { name: "All 4 pipelines + 37 stages mapped", done: true },
      { name: "Pipeline health script (stale detection)", done: true },
      { name: "GHL Operator SOP.md", done: false },
      { name: "GHL lead import (from enriched CSV only)", done: false },
      { name: "Stale deal follow-up (Peña Blanco + 4 others)", done: false },
    ],
  },
  {
    id: 5, name: "Skip Tracing Pipeline",
    description: "Enrich prospect CSVs with owner name, phone, mailing address before GHL import",
    progress: 0, status: "planned", color: "#f97316",
    tasks: [
      { name: "Confirm skip trace service (BatchSkipTracing / REISkip / other)", done: false },
      { name: "Get API credentials from Erik", done: false },
      { name: "Build enrichment script (Prospect CSV → Enriched CSV)", done: false },
      { name: "Test run on sample prospect list", done: false },
      { name: "Wire into full pipeline (post-scrape auto-enrich)", done: false },
    ],
  },
  {
    id: 6, name: "Broward + Palm Beach Expansion",
    description: "Extend data pipeline to Broward and Palm Beach counties",
    progress: 5, status: "planned", color: "#a855f7",
    tasks: [
      { name: "Broward clerk portal credentials", done: false },
      { name: "Broward lis pendens scraper", done: false },
      { name: "Palm Beach setup", done: false },
    ],
  },
];

export default function Projects() {
  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>Projects</h1>
        <p style={{ margin: "4px 0 0", color: "var(--text-muted)", fontSize: 13 }}>
          {PROJECTS.filter(p => p.status === "active").length} active · {PROJECTS.filter(p => p.status === "planned").length} planned
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {PROJECTS.map(p => {
          const done = p.tasks.filter(t => t.done).length;
          const total = p.tasks.length;
          return (
            <div key={p.id} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, padding: 18 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: p.color }} />
                    <span style={{ fontSize: 16, fontWeight: 700 }}>{p.name}</span>
                    <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 10, background: p.color + "22", color: p.color, textTransform: "uppercase", fontWeight: 600 }}>{p.status}</span>
                  </div>
                  <div style={{ fontSize: 13, color: "var(--text-muted)", marginLeft: 20 }}>{p.description}</div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0, marginLeft: 16 }}>
                  <div style={{ fontSize: 24, fontWeight: 700, color: p.color }}>{p.progress}%</div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{done}/{total} tasks</div>
                </div>
              </div>

              <div style={{ height: 4, background: "var(--surface-2)", borderRadius: 2, marginBottom: 14, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${p.progress}%`, background: p.color, borderRadius: 2 }} />
              </div>

              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {p.tasks.map((t, i) => (
                  <span key={i} style={{
                    fontSize: 11, padding: "3px 10px", borderRadius: 20,
                    background: t.done ? p.color + "22" : "var(--surface-2)",
                    color: t.done ? p.color : "var(--text-muted)",
                    border: `1px solid ${t.done ? p.color + "44" : "var(--border)"}`,
                  }}>
                    {t.done ? "✓ " : ""}{t.name}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
