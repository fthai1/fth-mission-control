"use client";

const PROJECTS = [
  {
    id: 1,
    name: "Mission Control Trust Rebuild",
    description: "Stabilize runtime, remove stale dashboard theater, and rebuild the core surfaces around trustworthy current operational state.",
    progress: 55,
    status: "active",
    color: "#3b82f6",
    tasks: [
      { name: "Fix app-breaking parse error", done: true },
      { name: "Harden repeat restart flow on localhost:3000", done: true },
      { name: "Replace stale shared task queue", done: true },
      { name: "Align Now / Task Board / Office", done: true },
      { name: "Truth-audit Team / Projects / Docs / Memory", done: false },
      { name: "Define explicit source-of-truth boundaries per screen", done: false },
      { name: "Tighten weaker screens without damaging strong live surfaces", done: false }
    ]
  },
  {
    id: 2,
    name: "Mission Control Runtime + Access",
    description: "Keep the app serving reliably with one clean local startup path, clear fallback behavior, and no fragile startup luck.",
    progress: 65,
    status: "active",
    color: "#6b6b8a",
    tasks: [
      { name: "Canonical local direction set to localhost:3000", done: true },
      { name: "Clear stale .next state during startup", done: true },
      { name: "Safe cleanup when port 3000 is occupied", done: true },
      { name: "Passcode-first local access aligned in app behavior", done: true },
      { name: "Document clean startup path for continuity", done: false },
      { name: "Tighten PID-level shutdown hygiene", done: false }
    ]
  },
  {
    id: 3,
    name: "Agent Ecosystem Visibility",
    description: "Preserve the real permanent architecture while making runtime posture visible without fake live status theater.",
    progress: 40,
    status: "active",
    color: "#e63e3e",
    tasks: [
      { name: "Permanent architecture retained in Team", done: true },
      { name: "Office reframed around runtime posture", done: true },
      { name: "Heuristic runtime summary exposed in Now", done: true },
      { name: "Clarify planned vs active lanes honestly", done: true },
      { name: "Promote real task-force lanes from runtime activity", done: false },
      { name: "Tie lane posture more directly to current task truth", done: false }
    ]
  },
  {
    id: 4,
    name: "Workspace Docs + Memory Visibility",
    description: "Use real workspace and memory structure as the reference layer instead of frozen snapshots, fake metadata, or stale file lists.",
    progress: 35,
    status: "active",
    color: "#a855f7",
    tasks: [
      { name: "Audit Docs screen against actual root files", done: true },
      { name: "Audit Memory screen against current memory model", done: true },
      { name: "Replace stale hardcoded doc cards", done: false },
      { name: "Replace stale fake daily memory snapshots", done: false },
      { name: "Show trustworthy file/reference structure", done: false }
    ]
  },
  {
    id: 5,
    name: "GHL Pipeline Preservation",
    description: "Protect the strongest current live surface while the weaker Mission Control screens are rebuilt around real source boundaries.",
    progress: 60,
    status: "active",
    color: "#22c55e",
    tasks: [
      { name: "Identify GHL Pipeline as a preserve-and-harden surface", done: true },
      { name: "Avoid tearing down working live API visibility", done: true },
      { name: "Clarify fallback vs live state around adjacent surfaces", done: false },
      { name: "Integrate stronger task/runtime visibility around GHL", done: false }
    ]
  }
];

export default function Projects() {
  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>Projects</h1>
        <p style={{ margin: "4px 0 0", color: "var(--text-muted)", fontSize: 13 }}>
          Current Mission Control workstreams — rebuilt around actual priorities instead of frozen legacy build snapshots.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {PROJECTS.map((p) => {
          const done = p.tasks.filter((t) => t.done).length;
          const total = p.tasks.length;
          return (
            <div key={p.id} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, padding: 18 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4, flexWrap: "wrap" }}>
                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: p.color }} />
                    <span style={{ fontSize: 16, fontWeight: 700 }}>{p.name}</span>
                    <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 10, background: p.color + "22", color: p.color, textTransform: "uppercase", fontWeight: 600 }}>{p.status}</span>
                  </div>
                  <div style={{ fontSize: 13, color: "var(--text-muted)", marginLeft: 20, lineHeight: 1.45 }}>{p.description}</div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0, marginLeft: 16 }}>
                  <div style={{ fontSize: 24, fontWeight: 700, color: p.color }}>{p.progress}%</div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{done}/{total} steps</div>
                </div>
              </div>

              <div style={{ height: 4, background: "var(--surface-2)", borderRadius: 2, marginBottom: 14, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${p.progress}%`, background: p.color, borderRadius: 2 }} />
              </div>

              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {p.tasks.map((t, i) => (
                  <span
                    key={i}
                    style={{
                      fontSize: 11,
                      padding: "3px 10px",
                      borderRadius: 20,
                      background: t.done ? p.color + "22" : "var(--surface-2)",
                      color: t.done ? p.color : "var(--text-muted)",
                      border: `1px solid ${t.done ? p.color + "44" : "var(--border)"}`,
                    }}
                  >
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
