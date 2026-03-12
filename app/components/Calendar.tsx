"use client";

const CRONS = [
  { id: 1, name: "FTH Daily Report", schedule: "0 18 * * 1-5", human: "Every weekday at 6:00 PM ET", agent: "Business Manager", status: "active", color: "#22c55e", next: "Today 6:00 PM ET" },
  { id: 2, name: "Weekly Performance Review", schedule: "0 9 * * 1", human: "Every Monday at 9:00 AM ET", agent: "Business Manager", status: "active", color: "#3b82f6", next: "Mon Mar 9, 9:00 AM ET" },
  { id: 3, name: "Miami-Dade Lis Pendens", schedule: "0 6 * * *", human: "Every day at 6:00 AM ET", agent: "Data Agent", status: "pending", color: "#f59e0b", next: "Tomorrow 6:00 AM ET" },
  { id: 4, name: "GHL Pipeline Health Check", schedule: "0 9 * * *", human: "Every day at 9:00 AM ET", agent: "GHL Operator", status: "planned", color: "#a855f7", next: "Pending cron setup" },
  { id: 5, name: "Stale Deal Detector", schedule: "0 8 * * 1-5", human: "Every weekday at 8:00 AM ET", agent: "GHL Operator", status: "planned", color: "#e63e3e", next: "Pending cron setup" },
  { id: 6, name: "Tax Delinquent Scrape", schedule: "0 6 * 5,6 *", human: "Daily in May & June at 6:00 AM ET", agent: "Data Agent", status: "seasonal", color: "#6b6b8a", next: "May 1, 2026" },
  { id: 7, name: "Heartbeat Pulse", schedule: "*/30 * * * *", human: "Every 30 minutes", agent: "Enzo", status: "active", color: "#22c55e", next: "Every 30 min" },
];

const STATUS_COLORS: Record<string, string> = {
  active: "#22c55e",
  pending: "#f59e0b",
  planned: "#6b6b8a",
  seasonal: "#3b82f6",
};

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const TODAY = new Date();
const startOfWeek = new Date(TODAY);
startOfWeek.setDate(TODAY.getDate() - TODAY.getDay());

export default function Calendar() {
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    return d;
  });

  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>Calendar</h1>
        <p style={{ margin: "4px 0 0", color: "var(--text-muted)", fontSize: 13 }}>
          Scheduled cron jobs and proactive tasks
        </p>
      </div>

      {/* Action Required */}
      <div style={{ background: "#f59e0b11", border: "1px solid #f59e0b44", borderRadius: 8, padding: 14, marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#f59e0b" }}>⚠️ Crons Pending Activation</div>
          <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>Run in Terminal to activate Business Manager + Data Agent schedules:</div>
          <code style={{ fontSize: 12, background: "var(--surface-2)", padding: "4px 8px", borderRadius: 4, marginTop: 6, display: "inline-block", color: "#22c55e" }}>
            cat /tmp/new_crons.txt | crontab -
          </code>
        </div>
      </div>

      {/* Weekly View */}
      <div style={{ background: "var(--surface)", borderRadius: 8, border: "1px solid var(--border)", marginBottom: 24, overflow: "hidden" }}>
        <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border)", fontSize: 13, fontWeight: 600 }}>
          Week of {startOfWeek.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)" }}>
          {weekDays.map((day, i) => {
            const isToday = day.toDateString() === TODAY.toDateString();
            return (
              <div key={i} style={{
                padding: "10px 8px", borderRight: i < 6 ? "1px solid var(--border)" : "none",
                background: isToday ? "var(--accent-dim)" : "transparent"
              }}>
                <div style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: 4 }}>{DAYS[i]}</div>
                <div style={{ fontSize: 16, fontWeight: isToday ? 700 : 400, color: isToday ? "var(--accent)" : "var(--text)" }}>{day.getDate()}</div>
                <div style={{ marginTop: 6, display: "flex", flexDirection: "column", gap: 2 }}>
                  {CRONS.filter(c => {
                    if (c.status === "seasonal") return false;
                    if (c.schedule.includes("* * 1-5") && day.getDay() > 0 && day.getDay() < 6) return true;
                    if (c.schedule.includes("* * *") && !c.schedule.includes("1-5")) return true;
                    if (c.schedule.includes("* 1 ") && day.getDay() === 1) return true;
                    if (c.schedule.includes("*/30")) return true;
                    return false;
                  }).slice(0, 3).map(c => (
                    <div key={c.id} style={{
                      fontSize: 9, padding: "2px 4px", borderRadius: 3,
                      background: c.color + "22", color: c.color, overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis"
                    }}>{c.name}</div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* All Crons */}
      <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 12 }}>All Scheduled Jobs</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {CRONS.map(c => (
          <div key={c.id} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, padding: 14, display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: STATUS_COLORS[c.status], flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{c.name}</div>
              <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>{c.human} · Agent: {c.agent}</div>
            </div>
            <code style={{ fontSize: 11, color: "var(--text-muted)", background: "var(--surface-2)", padding: "3px 8px", borderRadius: 4 }}>{c.schedule}</code>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: STATUS_COLORS[c.status], textTransform: "uppercase" }}>{c.status}</div>
              <div style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 2 }}>Next: {c.next}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
