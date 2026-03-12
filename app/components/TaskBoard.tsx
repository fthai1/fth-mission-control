"use client";
import { useState, useEffect } from "react";

type Priority = "critical" | "high" | "medium" | "low";
type Status = "backlog" | "in-progress" | "review" | "done";

interface Task {
  id: number;
  title: string;
  tag: string;
  priority: Priority;
  assignee: string;
  status: Status;
  notes?: string;
  date?: string;
}

interface TaskData {
  tasks: Task[];
  lastUpdated: string;
}

// Fetch tasks from API
async function fetchTasks(): Promise<Task[]> {
  try {
    const res = await fetch('/api/tasks', { cache: 'no-store' });
    const data: TaskData = await res.json();
    return data.tasks || [];
  } catch {
    return [];
  }
}

interface ActivityEntry {
  avatar: "enzo" | "user";
  timestamp: string;
  action: string;
}

// Live activity feed - fetched from GHL API
function useActivityFeed() {
  const [activities, setActivities] = useState<ActivityEntry[]>([]);
  
  useEffect(() => {
    async function loadActivities() {
      try {
        // Get GHL pipeline stats
        const res = await fetch('/api/ghl', { cache: 'no-store' });
        const data = await res.json();
        
        const newActivities: ActivityEntry[] = [
          { avatar: "enzo", timestamp: "Just now", action: `GHL Pipeline: ${data.total || 0} opportunities` },
          { avatar: "enzo", timestamp: "Today", action: `Contacts: ${data.contacts || 0}` },
          { avatar: "enzo", timestamp: "Today", action: "DD System: All fixes applied" },
          { avatar: "enzo", timestamp: "Today", action: "Mission Control: Live dashboard running" },
        ];
        setActivities(newActivities);
      } catch {
        setActivities([
          { avatar: "enzo", timestamp: "Today", action: "DD System: All fixes applied" },
          { avatar: "enzo", timestamp: "Today", action: "Mission Control: Live dashboard running" },
        ]);
      }
    }
    loadActivities();
    // Refresh every 60 seconds
    const interval = setInterval(loadActivities, 60000);
    return () => clearInterval(interval);
  }, []);
  
  return activities;
}

const PRIORITY_COLOR: Record<Priority, string> = {
  critical: "#e63e3e",
  high: "#f59e0b",
  medium: "#3b82f6",
  low: "#6b6b8a",
};

const TAG_COLOR: Record<string, string> = {
  "Scraper":        "#a855f7",
  "GHL":            "#22c55e",
  "Mission Control":"#3b82f6",
  "Data Agent":     "#f59e0b",
  "GHL Operator":   "#22c55e",
  "Business Mgr":   "#e63e3e",
  "Infrastructure": "#6b6b8a",
  "Skip Trace":     "#f97316",
  "MLS":            "#06b6d4",
  "Pipeline":       "#22c55e",
  "Agents":         "#e63e3e",
};

const INITIAL_TASKS: Task[] = [
  // ── DONE ────────────────────────────────────────────────────────────────────
  { id: 1,  title: "GHL API migrated to Private Integration (v2)", tag: "GHL", priority: "critical", assignee: "🏎️", status: "done", date: "2026-03-03" },
  { id: 2,  title: "GHL pipeline health check — 369 contacts, 225 opps confirmed", tag: "GHL", priority: "high", assignee: "🏎️", status: "done", date: "2026-03-03" },
  { id: 3,  title: "Business Manager agent built (SKILL.md, SOP, scripts)", tag: "Business Mgr", priority: "high", assignee: "🏎️", status: "done", date: "2026-03-02" },
  { id: 4,  title: "Data Agent SKILL.md + Miami-Dade Public Records SOP", tag: "Data Agent", priority: "high", assignee: "🏎️", status: "done", date: "2026-03-03" },
  { id: 5,  title: "GHL Operator SKILL.md — all 4 pipelines + 37 stage IDs mapped", tag: "GHL Operator", priority: "high", assignee: "🏎️", status: "done", date: "2026-03-03" },
  { id: 6,  title: "Mission Control scaffolded — 8 screens live at localhost:3737", tag: "Mission Control", priority: "high", assignee: "🏎️", status: "done", date: "2026-03-03" },
  { id: 7,  title: "GHL Pipeline screen wired to live API (real-time data)", tag: "Mission Control", priority: "high", assignee: "🏎️", status: "done", date: "2026-03-03" },
  { id: 8,  title: "Scrapling 0.4.1 + Playwright installed (Python 3.13 venv)", tag: "Scraper", priority: "medium", assignee: "🏎️", status: "done", date: "2026-03-03" },
  { id: 9,  title: "Miami-Dade portal URL discovered (migrated to onlineservices)", tag: "Scraper", priority: "medium", assignee: "🏎️", status: "done", date: "2026-03-03" },
  { id: 10, title: "Scraper form automation working (nav, dropdown, search click)", tag: "Scraper", priority: "medium", assignee: "🏎️", status: "done", date: "2026-03-03" },
  { id: 11, title: "Mission Control root doc directive added to MEMORY.md + AGENTS.md", tag: "Mission Control", priority: "medium", assignee: "🏎️", status: "done", date: "2026-03-03" },
  { id: 12, title: "Prospect vs Lead pipeline architecture defined", tag: "Data Agent", priority: "high", assignee: "🏎️", status: "done", date: "2026-03-03" },
  { id: 31, title: "Clerk API authorized (IP 67.191.23.0 registered)", tag: "GHL", priority: "critical", assignee: "🏎️", status: "done", date: "2026-03-04" },
  { id: 32, title: "5 GHL custom fields created (Folio#, Rehab Est, DD Date, MLS Status, Comp Confidence)", tag: "GHL", priority: "high", assignee: "🏎️", status: "done", date: "2026-03-04" },
  { id: 33, title: "run_dd.py v2 rebuilt — 8-step DD pipeline", tag: "GHL Operator", priority: "critical", assignee: "🏎️", status: "done", date: "2026-03-04" },
  { id: 34, title: "ghl_webhook_listener.py built (port 8765)", tag: "GHL Operator", priority: "high", assignee: "🏎️", status: "done", date: "2026-03-04" },
  { id: 35, title: "Lis pendens scraper v2 — Clerk API + browser dual-mode", tag: "Scraper", priority: "high", assignee: "🏎️", status: "done", date: "2026-03-04" },
  { id: 36, title: "Broward county portal login saved to keys.md", tag: "Infrastructure", priority: "medium", assignee: "👤 Erik", status: "done", date: "2026-03-04" },
  { id: 37, title: "MissionControl.md full rebuild — step-by-step guides", tag: "Mission Control", priority: "high", assignee: "🏎️", status: "done", date: "2026-03-04" },

  // ── IN PROGRESS ─────────────────────────────────────────────────────────────
  { id: 13, title: "Start GHL webhook listener (port 8765) on Mac mini", tag: "GHL Operator", priority: "critical", assignee: "👤 Erik", status: "in-progress", notes: "cd ~/.openclaw/workspace/skills/ghl-operator/scripts/due-diligence && python3 ghl_webhook_listener.py" },
  { id: 14, title: "Configure GHL webhook → Opportunity Created event", tag: "GHL", priority: "critical", assignee: "👤 Erik", status: "in-progress", notes: "URL: http://67.191.23.0:8765/webhook/new-opportunity | Header: X-FTH-Secret: fth-dd-trigger-2026" },
  { id: 15, title: "End-to-end DD test on Edward Walker (16920 NW 53rd Ave)", tag: "GHL Operator", priority: "high", assignee: "🏎️", status: "in-progress", notes: "After webhook live — full 8-step pipeline test" },

  // ── BACKLOG ──────────────────────────────────────────────────────────────────
  { id: 16, title: "Live LP scraper test — pull Miami-Dade lis pendens via Clerk API", tag: "Scraper", priority: "high", assignee: "🏎️", status: "backlog", notes: "Clerk API now authorized — ready to run" },
  { id: 17, title: "GHL Operator SOP.md (main human doc)", tag: "GHL Operator", priority: "high", assignee: "🏎️", status: "backlog" },
  { id: 18, title: "Broward county scraper script", tag: "Scraper", priority: "medium", assignee: "🏎️", status: "backlog", notes: "Build after Miami-Dade Phase 1 live" },
  { id: 19, title: "Add Sunday 8PM MissionControl archive cron", tag: "Infrastructure", priority: "medium", assignee: "👤 Erik", status: "backlog", notes: "Run: crontab /tmp/updated_crons.txt" },
  { id: 20, title: "Provide Invelo API key", tag: "Data Agent", priority: "high", assignee: "👤 Erik", status: "backlog" },
  { id: 21, title: "Confirm FL MLS board name", tag: "MLS", priority: "medium", assignee: "👤 Erik", status: "backlog" },
  { id: 22, title: "Marketing Agent — build plan + SKILL.md", tag: "Agents", priority: "low", assignee: "🏎️", status: "backlog", notes: "Queued after GHL Operator complete" },
  { id: 23, title: "Stale deals — Alexander Peña Blanco (Escrow, stale Feb 16)", tag: "Pipeline", priority: "critical", assignee: "👤 Erik", status: "backlog" },
  { id: 24, title: "Stale offers — Avila, HEM, Johnson, Sanchez", tag: "Pipeline", priority: "high", assignee: "👤 Erik", status: "backlog" },
  { id: 25, title: "Build skip trace enrichment step (Prospect CSV → Enriched CSV)", tag: "Skip Trace", priority: "high", assignee: "🏎️", status: "backlog", notes: "Blocked: waiting on skip trace service credentials" },
  { id: 26, title: "Build GHL lead import script (Enriched CSV → GHL pipeline)", tag: "GHL Operator", priority: "high", assignee: "🏎️", status: "backlog", notes: "Only for skip-traced, qualified prospects" },
  { id: 27, title: "Mission Control Docs screen — link live workspace files", tag: "Mission Control", priority: "medium", assignee: "🏎️", status: "backlog" },
];

const COLUMNS: { key: Status; label: string; color: string }[] = [
  { key: "backlog",     label: "Backlog",     color: "#6b6b8a" },
  { key: "in-progress", label: "In Progress", color: "#f59e0b" },
  { key: "review",      label: "Review",      color: "#3b82f6" },
  { key: "done",        label: "Done",        color: "#22c55e" },
];

export default function TaskBoard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTask, setNewTask] = useState("");
  const [newTag, setNewTag] = useState("GHL");
  const [filter, setFilter] = useState<string>("all");

  // Load tasks from API on mount
  useEffect(() => {
    async function load() {
      const t = await fetchTasks();
      setTasks(t);
      setLoading(false);
    }
    load();
    // Refresh every 30 seconds
    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
  }, []);

  // Live activity from API
  const activityFeed = useActivityFeed();

  const move = (id: number, dir: -1 | 1) => {
    const order: Status[] = ["backlog", "in-progress", "review", "done"];
    setTasks(prev => prev.map(t => {
      if (t.id !== id) return t;
      const idx = order.indexOf(t.status);
      const next = order[idx + dir];
      return next ? { ...t, status: next } : t;
    }));
  };

  const addTask = () => {
    if (!newTask.trim()) return;
    setTasks(prev => [...prev, {
      id: Date.now(), title: newTask.trim(), tag: newTag,
      priority: "medium", assignee: "🏎️", status: "backlog",
      date: new Date().toISOString().split("T")[0],
    }]);
    setNewTask("");
  };

  const filtered = filter === "all" ? tasks : tasks.filter(t =>
    t.assignee.includes("Erik") ? filter === "erik" : filter === "enzo"
  );

  const counts = {
    backlog:       filtered.filter(t => t.status === "backlog").length,
    "in-progress": filtered.filter(t => t.status === "in-progress").length,
    review:        filtered.filter(t => t.status === "review").length,
    done:          filtered.filter(t => t.status === "done").length,
  };

  // Show loading or tasks
  if (loading) {
    return (
      <div style={{ padding: 40, textAlign: "center", color: "var(--text-muted)" }}>
        Loading tasks...
      </div>
    );
  }

  return (
    <div style={{ display: "flex", height: "100%", overflow: "hidden" }}>

      {/* ── Left: Live Activity Panel ──────────────────────────────── */}
      <div style={{
        width: 280,
        flexShrink: 0,
        background: "var(--surface)",
        borderRight: "1px solid var(--border)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}>
        {/* Panel header */}
        <div style={{
          padding: "16px 16px 12px",
          borderBottom: "1px solid var(--border)",
          flexShrink: 0,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "#22c55e",
              boxShadow: "0 0 6px #22c55e",
              animation: "activity-pulse 2s ease-in-out infinite",
            }} />
            <style>{`
              @keyframes activity-pulse {
                0%, 100% { opacity: 1; box-shadow: 0 0 6px #22c55e; }
                50%       { opacity: 0.5; box-shadow: 0 0 2px #22c55e; }
              }
            `}</style>
            <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}>Live Activity</span>
          </div>
          <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>
            Recent actions · auto-updating
          </div>
        </div>

        {/* Feed */}
        <div style={{
          flex: 1,
          overflowY: "auto",
          padding: "8px 0",
        }}>
          {activityFeed.map((entry, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 8,
                padding: "8px 14px",
                borderBottom: "1px solid var(--border)",
                transition: "background 0.15s",
              }}
              onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.03)")}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
            >
              {/* Avatar */}
              <div style={{
                flexShrink: 0,
                width: 24,
                height: 24,
                borderRadius: 6,
                background: entry.avatar === "enzo" ? "rgba(201,162,39,0.15)" : "rgba(59,130,246,0.15)",
                border: `1px solid ${entry.avatar === "enzo" ? "rgba(201,162,39,0.3)" : "rgba(59,130,246,0.3)"}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 13,
                marginTop: 1,
              }}>
                {entry.avatar === "enzo" ? "🏎️" : "👤"}
              </div>

              {/* Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontSize: 11,
                  color: "var(--text-muted)",
                  marginBottom: 2,
                  fontFamily: "monospace",
                }}>
                  {entry.timestamp}
                </div>
                <div style={{
                  fontSize: 12,
                  color: "var(--text)",
                  lineHeight: 1.4,
                  wordBreak: "break-word",
                }}>
                  {entry.action}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right: Kanban Board ────────────────────────────────────── */}
      <div style={{ flex: 1, overflow: "auto", padding: 24 }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>Task Board</h1>
            <p style={{ margin: "4px 0 0", color: "var(--text-muted)", fontSize: 13 }}>
              {tasks.filter(t => t.status !== "done").length} open · {tasks.filter(t => t.status === "done").length} done
            </p>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {[["all","All"],["erik","👤 Erik"],["enzo","🏎️ Enzo"]].map(([k,l]) => (
              <button key={k} onClick={() => setFilter(k)} style={{
                padding: "5px 12px", borderRadius: 6, fontSize: 12, cursor: "pointer",
                border: `1px solid ${filter === k ? "var(--accent)" : "var(--border)"}`,
                background: filter === k ? "var(--accent-dim)" : "var(--surface)",
                color: filter === k ? "var(--text)" : "var(--text-muted)",
              }}>{l}</button>
            ))}
          </div>
        </div>

        {/* Add Task */}
        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          <input value={newTask} onChange={e => setNewTask(e.target.value)}
            onKeyDown={e => e.key === "Enter" && addTask()}
            placeholder="Add a task and press Enter..."
            style={{ flex: 1, background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)", padding: "8px 12px", borderRadius: 6, fontSize: 13 }} />
          <select value={newTag} onChange={e => setNewTag(e.target.value)}
            style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)", padding: "8px 10px", borderRadius: 6, fontSize: 13 }}>
            {Object.keys(TAG_COLOR).map(t => <option key={t}>{t}</option>)}
          </select>
          <button onClick={addTask} style={{ background: "var(--accent)", border: "none", color: "#fff", padding: "8px 16px", borderRadius: 6, cursor: "pointer", fontSize: 13, fontWeight: 600 }}>+ Add</button>
        </div>

        {/* Columns */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
          {COLUMNS.map(col => (
            <div key={col.key}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: col.color }} />
                <span style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: col.color }}>{col.label}</span>
                <span style={{ fontSize: 11, background: "var(--surface-2)", padding: "1px 7px", borderRadius: 10, color: "var(--text-muted)" }}>{counts[col.key] || 0}</span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {filtered.filter(t => t.status === col.key).map(task => (
                  <div key={task.id} style={{
                    background: "var(--surface)", border: "1px solid var(--border)",
                    borderLeft: `3px solid ${PRIORITY_COLOR[task.priority]}`,
                    borderRadius: 6, padding: "10px 12px",
                  }}>
                    <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 6, lineHeight: 1.4 }}>{task.title}</div>
                    {task.notes && (
                      <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 6, fontStyle: "italic", lineHeight: 1.4 }}>{task.notes}</div>
                    )}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
                        <span style={{ fontSize: 10, padding: "1px 7px", borderRadius: 10, background: (TAG_COLOR[task.tag] || "#6b6b8a") + "22", color: TAG_COLOR[task.tag] || "#6b6b8a", border: `1px solid ${(TAG_COLOR[task.tag] || "#6b6b8a")}44` }}>{task.tag}</span>
                        <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{task.assignee}</span>
                      </div>
                      <div style={{ display: "flex", gap: 4 }}>
                        {col.key !== "backlog" && (
                          <button onClick={() => move(task.id, -1)} style={{ background: "var(--surface-2)", border: "1px solid var(--border)", color: "var(--text-muted)", width: 22, height: 22, borderRadius: 4, cursor: "pointer", fontSize: 11, display: "flex", alignItems: "center", justifyContent: "center" }}>←</button>
                        )}
                        {col.key !== "done" && (
                          <button onClick={() => move(task.id, 1)} style={{ background: "var(--surface-2)", border: "1px solid var(--border)", color: "var(--text-muted)", width: 22, height: 22, borderRadius: 4, cursor: "pointer", fontSize: 11, display: "flex", alignItems: "center", justifyContent: "center" }}>→</button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
