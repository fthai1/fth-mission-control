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

// Lightweight operational activity feed — helpful context, not a system of record.
function useActivityFeed() {
  const [activities, setActivities] = useState<ActivityEntry[]>([]);
  
  useEffect(() => {
    async function loadActivities() {
      try {
        // Get GHL pipeline stats
        const res = await fetch('/api/ghl', { cache: 'no-store' });
        const data = await res.json();
        
        const newActivities: ActivityEntry[] = [
          { avatar: "enzo", timestamp: "Just now", action: `GHL Pipeline: ${data.total || 0} opportunities visible` },
          { avatar: "enzo", timestamp: "Today", action: `Contacts tracked: ${data.contacts || 0}` },
          { avatar: "enzo", timestamp: "Today", action: "Mission Control runtime is serving on localhost:3000" },
          { avatar: "enzo", timestamp: "Today", action: "Task Board is loading from the shared task dataset" },
        ];
        setActivities(newActivities);
      } catch {
        setActivities([
          { avatar: "enzo", timestamp: "Today", action: "Mission Control runtime is stable locally" },
          { avatar: "enzo", timestamp: "Today", action: "Task Board is falling back cleanly when live CRM data is unavailable" },
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
            Lightweight context · not the source of truth
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
              Current operating queue — {tasks.filter(t => t.status !== "done").length} open · {tasks.filter(t => t.status === "done").length} done
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

        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, padding: 12, marginBottom: 20, fontSize: 13, color: "var(--text-muted)", lineHeight: 1.45 }}>
          <strong style={{ color: "var(--text)" }}>Source boundary:</strong> this board is currently driven by the shared task dataset. Moving cards here updates the local UI state for the session, but does not yet persist operational truth back into a canonical backend.
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
