"use client";
import { useState } from "react";

const DAILY_MEMORY = [
  {
    date: "2026-03-27",
    label: "Mar 27",
    entries: [
      { time: "Morning", topic: "Mission Control restart recovery", summary: "Fixed the app-breaking parse failure, hardened repeat startup on localhost:3000, and got Mission Control serving again behind passcode access." },
      { time: "Morning", topic: "Task truth pass", summary: "Replaced the stale investor-demo task queue with the current Mission Control trust-rebuild priorities." },
      { time: "Morning", topic: "Surface alignment", summary: "Now and Office were rewritten toward honest runtime posture, clearer blockers, and less fake dashboard theater." }
    ]
  },
  {
    date: "2026-03-26",
    label: "Mar 26",
    entries: [
      { time: "All day", topic: "Root doctrine cleanup", summary: "USER.md, AGENTS.md, MEMORY.md, TOOLS.md, HEARTBEAT.md, and IDENTITY.md were compressed, sharpened, and mirrored." },
      { time: "All day", topic: "Memory normalization", summary: "Daily logs were normalized to memory/YYYY-MM-DD.md and deeper project files were cleaned and rebuilt." },
      { time: "All day", topic: "Mission Control audit", summary: "Mission Control was confirmed worth preserving, but runtime instability and stale hardcoded surface content were identified as the main blockers." }
    ]
  }
];

const LONG_TERM = [
  { topic: "Memory model", note: "Daily logs belong in memory/YYYY-MM-DD.md. Durable cross-session context belongs in MEMORY.md. Project detail belongs in memory/projects/." },
  { topic: "Mission Control rule", note: "Mission Control should be a trusted visibility hub, not a fake omniscient dashboard full of stale hardcoded snapshots." },
  { topic: "Source boundaries", note: "GHL is CRM execution truth. Root docs define doctrine and continuity. Mission Control should visualize truth where appropriate, not silently fork competing truth." },
  { topic: "Current priority", note: "The active Mission Control focus is runtime stability, task truth, and rebuilding key screens around trustworthy current state." },
  { topic: "Trust standard", note: "The main screens must start reliably, label fallback honestly, and stop presenting old snapshots as if they are live." }
];

export default function Memory() {
  const [view, setView] = useState<"daily" | "longterm">("daily");
  const [selected, setSelected] = useState("2026-03-27");

  const day = DAILY_MEMORY.find((d) => d.date === selected);

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>Memory</h1>
          <p style={{ margin: "4px 0 0", color: "var(--text-muted)", fontSize: 13 }}>
            Memory reference view — current memory model and representative continuity, not a raw browser for every note.
          </p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {(["daily", "longterm"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              style={{
                padding: "6px 14px",
                borderRadius: 6,
                border: `1px solid ${view === v ? "var(--accent)" : "var(--border)"}`,
                background: view === v ? "var(--accent-dim)" : "var(--surface)",
                color: view === v ? "var(--text)" : "var(--text-muted)",
                cursor: "pointer",
                fontSize: 13,
              }}
            >
              {v === "daily" ? "Daily Logs" : "Long-Term"}
            </button>
          ))}
        </div>
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
        <strong style={{ color: "var(--text)" }}>Source boundary:</strong> this screen should summarize the memory system honestly. It should reference the real structure — daily logs, long-term memory, and project memory — without pretending a handful of hardcoded cards are the entire system of record.
      </div>

      {view === "daily" ? (
        <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 16 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {DAILY_MEMORY.map((d) => (
              <button
                key={d.date}
                onClick={() => setSelected(d.date)}
                style={{
                  padding: "10px 12px",
                  borderRadius: 6,
                  border: `1px solid ${selected === d.date ? "var(--accent)" : "var(--border)"}`,
                  background: selected === d.date ? "var(--accent-dim)" : "var(--surface)",
                  color: selected === d.date ? "var(--text)" : "var(--text-muted)",
                  cursor: "pointer",
                  fontSize: 13,
                  textAlign: "left",
                }}
              >
                <div style={{ fontWeight: selected === d.date ? 600 : 400 }}>{d.label}</div>
                <div style={{ fontSize: 10, marginTop: 2, color: "var(--text-muted)" }}>{d.entries.length} entries</div>
              </button>
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {day?.entries.map((e, i) => (
              <div key={i} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, padding: 14 }}>
                <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 6, flexWrap: "wrap" }}>
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
