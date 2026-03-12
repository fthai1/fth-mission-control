"use client";

const PIPELINE_STEPS = [
  { step: 1, name: "Scrape", desc: "Public records portal → raw filings", status: "building", color: "#f59e0b" },
  { step: 2, name: "Prospect CSV", desc: "Raw data saved to workspace + Desktop/ENZO", status: "building", color: "#f59e0b" },
  { step: 3, name: "Skip Trace", desc: "Append owner name, phone, mailing address", status: "pending", color: "#6b6b8a" },
  { step: 4, name: "Enriched CSV", desc: "Qualified prospect with full contact info", status: "pending", color: "#6b6b8a" },
  { step: 5, name: "Manual Review", desc: "Erik/Anthony approves list for GHL", status: "pending", color: "#6b6b8a" },
  { step: 6, name: "GHL Lead Import", desc: "Approved prospects become leads in pipeline", status: "pending", color: "#6b6b8a" },
];

const SOURCES = [
  // Daily
  { name: "Lis Pendens",              code: "LIS",   county: "Miami-Dade", schedule: "Daily 6AM",   priority: "🔴 Critical", status: "building",      method: "Playwright browser automation",    lastRun: "Not yet",     nextRun: "Pending account registration" },
  { name: "Certificate of Title",     code: "CTI",   county: "Miami-Dade", schedule: "Daily 6AM",   priority: "🔴 Critical", status: "pending",       method: "Same scraper, doc code swap",       lastRun: "—",           nextRun: "After scraper fixed" },
  // Weekly
  { name: "Probate & Administration", code: "PAD",   county: "Miami-Dade", schedule: "Weekly Mon",  priority: "🟠 High",     status: "pending",       method: "Same scraper, doc code swap",       lastRun: "—",           nextRun: "After scraper fixed" },
  { name: "Probate Distribution",     code: "PRO",   county: "Miami-Dade", schedule: "Weekly Mon",  priority: "🟠 High",     status: "pending",       method: "Same scraper, doc code swap",       lastRun: "—",           nextRun: "After scraper fixed" },
  { name: "Dissolution of Marriage",  code: "DOM",   county: "Miami-Dade", schedule: "Weekly Mon",  priority: "🟠 High",     status: "pending",       method: "Same scraper, doc code swap",       lastRun: "—",           nextRun: "After scraper fixed" },
  { name: "Bankruptcy",               code: "BAN",   county: "Miami-Dade", schedule: "Weekly Mon",  priority: "🟠 High",     status: "pending",       method: "Same scraper, doc code swap",       lastRun: "—",           nextRun: "After scraper fixed" },
  { name: "Federal Tax Lien",         code: "FTL",   county: "Miami-Dade", schedule: "Weekly Mon",  priority: "🟡 Medium",   status: "pending",       method: "Same scraper, doc code swap",       lastRun: "—",           nextRun: "After scraper fixed" },
  { name: "Notice of Tax Lien",       code: "NTL",   county: "Miami-Dade", schedule: "Weekly Mon",  priority: "🟡 Medium",   status: "pending",       method: "Same scraper, doc code swap",       lastRun: "—",           nextRun: "After scraper fixed" },
  { name: "Lien",                     code: "LIE",   county: "Miami-Dade", schedule: "Weekly Mon",  priority: "🟡 Medium",   status: "pending",       method: "Same scraper, doc code swap",       lastRun: "—",           nextRun: "After scraper fixed" },
  { name: "Judgment",                 code: "JUD",   county: "Miami-Dade", schedule: "Weekly Mon",  priority: "🟡 Medium",   status: "pending",       method: "Same scraper, doc code swap",       lastRun: "—",           nextRun: "After scraper fixed" },
  { name: "Any Lien/Judgment",        code: "LNJUD", county: "Miami-Dade", schedule: "Weekly Mon",  priority: "🟡 Medium",   status: "pending",       method: "Same scraper, doc code swap",       lastRun: "—",           nextRun: "After scraper fixed" },
  { name: "Cancellation Lis Pendens", code: "CLP",   county: "Miami-Dade", schedule: "Weekly Mon",  priority: "🟡 Medium",   status: "pending",       method: "Same scraper, doc code swap",       lastRun: "—",           nextRun: "After scraper fixed" },
  // Other sources
  { name: "Broward Lis Pendens",      code: "LIS",   county: "Broward",    schedule: "Daily 6AM",   priority: "🔴 Critical", status: "blocked",       method: "Portal (credentials needed)",       lastRun: "—",           nextRun: "Pending credentials" },
  { name: "MIAMI MLS (expired/DOM)",  code: "MLS",   county: "South FL",   schedule: "Weekly",      priority: "🟠 High",     status: "pending-creds", method: "Bridge Interactive RESO API",        lastRun: "—",           nextRun: "Pending credentials" },
  { name: "BeachesMLS",               code: "MLS",   county: "Palm Beach", schedule: "Weekly",      priority: "🟠 High",     status: "pending-creds", method: "Spark/Trestle API",                  lastRun: "—",           nextRun: "Pending credentials" },
  { name: "Invelo",                   code: "—",     county: "All",        schedule: "On demand",   priority: "🟡 Medium",   status: "pending-creds", method: "API or CSV export",                  lastRun: "—",           nextRun: "Pending credentials" },
  { name: "Skip Tracing",             code: "—",     county: "All",        schedule: "Post-scrape", priority: "🔴 Critical", status: "pending-creds", method: "TBD — Erik to confirm service",      lastRun: "—",           nextRun: "Pending service selection" },
];

const STATUS_META: Record<string, { label: string; color: string }> = {
  active:         { label: "Active",            color: "#22c55e" },
  building:       { label: "Building",          color: "#f59e0b" },
  pending:        { label: "Pending",           color: "#6b6b8a" },
  blocked:        { label: "Blocked",           color: "#e63e3e" },
  "pending-creds":{ label: "Needs Credentials", color: "#a855f7" },
};

export default function DataStatus() {
  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>Data Status</h1>
        <p style={{ margin: "4px 0 0", color: "var(--text-muted)", fontSize: 13 }}>
          Prospect engine — 17 sources · 12 motivated seller signal types
        </p>
      </div>

      {/* Pipeline Flow */}
      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, padding: 18, marginBottom: 24 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 14 }}>Pipeline Architecture</div>
        <div style={{ display: "flex", alignItems: "center", gap: 0, flexWrap: "wrap" }}>
          {PIPELINE_STEPS.map((s, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center" }}>
              <div style={{ background: s.color + "22", border: `1px solid ${s.color}44`, borderRadius: 8, padding: "8px 12px", textAlign: "center", minWidth: 100 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: s.color }}>{s.step}. {s.name}</div>
                <div style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 2, lineHeight: 1.3 }}>{s.desc}</div>
              </div>
              {i < PIPELINE_STEPS.length - 1 && (
                <div style={{ color: "var(--text-muted)", fontSize: 18, padding: "0 4px" }}>→</div>
              )}
            </div>
          ))}
        </div>
        <div style={{ marginTop: 12, fontSize: 11, color: "var(--text-muted)", background: "var(--surface-2)", padding: "8px 12px", borderRadius: 6 }}>
          ⚠️ <strong style={{ color: "var(--text)" }}>Prospect ≠ Lead.</strong> Raw scrape data = prospects (CSV only). GHL only receives skip-traced, manually reviewed leads. Never import raw prospects directly.
        </div>
      </div>

      {/* Summary Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12, marginBottom: 24 }}>
        {[
          { label: "Total Sources",   value: SOURCES.length.toString(),                                              color: "var(--blue)" },
          { label: "Building",        value: SOURCES.filter(s => s.status === "building").length.toString(),          color: "var(--yellow)" },
          { label: "Active Signals",  value: "12",                                                                    color: "#22c55e" },
          { label: "Blocked",         value: SOURCES.filter(s => s.status === "blocked").length.toString(),           color: "var(--accent)" },
          { label: "Needs Creds",     value: SOURCES.filter(s => s.status === "pending-creds").length.toString(),     color: "#a855f7" },
        ].map((s, i) => (
          <div key={i} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, padding: 14 }}>
            <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>{s.label}</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* CSV Storage Info */}
      <div style={{ background: "#22c55e11", border: "1px solid #22c55e33", borderRadius: 8, padding: 14, marginBottom: 20 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: "#22c55e", marginBottom: 6 }}>📁 CSV Storage (Both Locations, Always)</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Workspace: <code style={{ color: "#22c55e", background: "var(--surface-2)", padding: "1px 6px", borderRadius: 3 }}>~/.openclaw/workspace/data/prospects/</code></div>
          <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Backup: <code style={{ color: "#22c55e", background: "var(--surface-2)", padding: "1px 6px", borderRadius: 3 }}>~/Desktop/ENZO/prospects/</code></div>
        </div>
        <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 8 }}>Filename format: <code style={{ color: "var(--text)", background: "var(--surface-2)", padding: "1px 6px", borderRadius: 3 }}>YYYY-MM-DD-[DOC_CODE]-miami-dade.csv</code></div>
      </div>

      {/* Source List */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {SOURCES.map((s, i) => {
          const meta = STATUS_META[s.status];
          return (
            <div key={i} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, padding: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                    <span style={{ fontSize: 13, fontWeight: 600 }}>{s.name}</span>
                    <code style={{ fontSize: 10, background: "var(--surface-2)", padding: "1px 6px", borderRadius: 4, color: "var(--text-muted)" }}>{s.code}</code>
                    <span style={{ fontSize: 10, fontWeight: 700, color: meta.color, background: meta.color + "22", padding: "1px 7px", borderRadius: 10, textTransform: "uppercase" }}>{meta.label}</span>
                    <span style={{ fontSize: 10, color: "var(--text-muted)" }}>{s.priority}</span>
                    <span style={{ fontSize: 10, background: "var(--surface-2)", color: "var(--text-muted)", padding: "1px 6px", borderRadius: 10 }}>{s.county}</span>
                  </div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{s.method} · {s.schedule}</div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0, marginLeft: 12 }}>
                  <div style={{ fontSize: 11, color: "var(--text-muted)" }}>Last: <span style={{ color: "var(--text)" }}>{s.lastRun}</span></div>
                  <div style={{ fontSize: 11, color: meta.color, marginTop: 2 }}>{s.nextRun}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
