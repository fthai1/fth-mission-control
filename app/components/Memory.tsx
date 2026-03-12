"use client";
import { useState } from "react";

const MEMORY_DAYS = [
  {
    date: "2026-03-03",
    label: "Today",
    entries: [
      { time: "12:28", topic: "Session Start", summary: "GHL API migration to Private Integration (services.leadconnectorhq.com). Key: pit-7b605592..." },
      { time: "12:37", topic: "Agent Review", summary: "Full ecosystem review — recommended flipping build order: GHL Operator first, then Data Agent" },
      { time: "13:14", topic: "GHL Operator Build", summary: "SKILL.md built with all 4 pipelines + 37 stage IDs. Pipeline health script created." },
      { time: "13:30", topic: "Miami-Dade SOP", summary: "Public records SOP created — portal scrape → FTP → API upgrade path. Scrapling confirmed as tool." },
      { time: "13:54", topic: "Mission Control", summary: "X video transcript received. Building FTH Mission Control — Next.js, Linear-style, 8 screens." },
    ]
  },
  {
    date: "2026-02-28",
    label: "Feb 28",
    entries: [
      { time: "09:00", topic: "Heartbeat repair", summary: "Gateway recovery, git backup refreshed, daily log created" },
      { time: "10:30", topic: "Agent #2 Planning", summary: "Data Agent research — Miami-Dade weekly dumps, lis pendens daily, probate weekly" },
      { time: "11:45", topic: "Business Manager", summary: "Agent #1 build complete — SKILL.md, SOP, config, prompts, scripts all done" },
    ]
  },
  {
    date: "2026-02-27",
    label: "Feb 27",
    entries: [
      { time: "08:15", topic: "Pipeline check", summary: "83/100 opportunities untouched >48h. Alexander Peña Blanco In Escrow stale since Feb 16." },
      { time: "09:30", topic: "Active Tasks", summary: "4 stale active offers flagged: Jonathan Avila, ARTHUR HEM, Joyce Johnson, Elizabeth Sanchez" },
      { time: "14:00", topic: "GHL webhook", summary: "Railway deploy pending. Contact-level custom fields needed for full sync." },
    ]
  },
  {
    date: "2026-02-26",
    label: "Feb 26",
    entries: [
      { time: "10:00", topic: "Agent Architecture", summary: "Erik restructured agent hierarchy — Business Manager first, Data Agent second (motivated leads critical)" },
      { time: "11:30", topic: "Build framework", summary: "Every agent needs SKILL.md + SOP.md + .skill package. Dual deliverable rule confirmed." },
    ]
  },
  {
    date: "2026-02-24",
    label: "Feb 24",
    entries: [
      { time: "All day", topic: "Infrastructure Day", summary: "OpenClaw deployed, Slack live, iMessage live, GHL connected, heartbeat running" },
      { time: "14:00", topic: "API Key Incident", summary: "GHL API key accidentally posted in Slack #ai-collab. Message deleted by Erik. Key rotated 2026-03-03." },
      { time: "16:00", topic: "Lessons", summary: "6 key lessons added to MEMORY.md. Full Disk Access config for gateway. Session.dmScope at top level." },
    ]
  },
];

const LONG_TERM = [
  { topic: "GHL API", note: "Now uses Private Integration (sub-account level). Endpoint: services.leadconnectorhq.com. Key in keys.md." },
  { topic: "Agent Build Order", note: "Business Manager ✅ → Data Agent (in progress) → GHL Operator (building) → Marketing Agent" },
  { topic: "Data Sources", note: "Miami-Dade: lis pendens daily, assessor weekly. Invelo + MLS (pending credentials). Broward (pending login)." },
  { topic: "Scrapling", note: "Python scraping library — adaptive, bypasses bot detection, MCP server for OpenClaw. pip install scrapling" },
  { topic: "Pre-Foreclosure = Lis Pendens in FL", note: "Florida has no separate NoD filing. Lis pendens IS the pre-foreclosure notice. Daily = daily pre-foreclosure." },
  { topic: "Stale Deals", note: "Alexander Peña Blanco (Escrow, 15d), Jonathan Avila, ARTHUR HEM, Joyce Johnson, Elizabeth Sanchez (all Made Offer)" },
  { topic: "Mission Control", note: "Next.js dashboard — 8 screens: Task Board, Calendar, Projects, GHL Pipeline, Team, Data Status, Docs, Memory" },
];

export default function Memory() {
  const [view, setView] = useState<"daily" | "longterm">("daily");
  const [selected, setSelected] = useState("2026-03-03");

  const day = MEMORY_DAYS.find(d => d.date === selected);

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>Memory</h1>
          <p style={{ margin: "4px 0 0", color: "var(--text-muted)", fontSize: 13 }}>Session logs and long-term context</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {(["daily", "longterm"] as const).map(v => (
            <button key={v} onClick={() => setView(v)} style={{
              padding: "6px 14px", borderRadius: 6, border: `1px solid ${view === v ? "var(--accent)" : "var(--border)"}`,
              background: view === v ? "var(--accent-dim)" : "var(--surface)",
              color: view === v ? "var(--text)" : "var(--text-muted)", cursor: "pointer", fontSize: 13
            }}>{v === "daily" ? "Daily Logs" : "Long-Term"}</button>
          ))}
        </div>
      </div>

      {view === "daily" ? (
        <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: 16 }}>
          {/* Day selector */}
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {MEMORY_DAYS.map(d => (
              <button key={d.date} onClick={() => setSelected(d.date)} style={{
                padding: "10px 12px", borderRadius: 6, border: `1px solid ${selected === d.date ? "var(--accent)" : "var(--border)"}`,
                background: selected === d.date ? "var(--accent-dim)" : "var(--surface)",
                color: selected === d.date ? "var(--text)" : "var(--text-muted)", cursor: "pointer",
                fontSize: 13, textAlign: "left",
              }}>
                <div style={{ fontWeight: selected === d.date ? 600 : 400 }}>{d.label}</div>
                <div style={{ fontSize: 10, marginTop: 2, color: "var(--text-muted)" }}>{d.entries.length} entries</div>
              </button>
            ))}
          </div>

          {/* Entries */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {day?.entries.map((e, i) => (
              <div key={i} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, padding: 14 }}>
                <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 6 }}>
                  <span style={{ fontSize: 11, color: "var(--text-muted)", background: "var(--surface-2)", padding: "2px 8px", borderRadius: 10 }}>{e.time}</span>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{e.topic}</span>
                </div>
                <div style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.5 }}>{e.summary}</div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {LONG_TERM.map((m, i) => (
            <div key={i} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, padding: 14 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#e63e3e", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>{m.topic}</div>
              <div style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.5 }}>{m.note}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
