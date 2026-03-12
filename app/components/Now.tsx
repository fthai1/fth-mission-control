"use client";
import { useEffect, useState } from "react";

type SystemState = {
  ghl?: { status: string; latency: number };
  webhook?: { status: string; latency: number };
  gateway?: { status: string; latency: number };
  timestamp?: string;
};

type Task = {
  id: number;
  title: string;
  tag: string;
  priority: "critical" | "high" | "medium" | "low";
  assignee: string;
  status: "backlog" | "in-progress" | "review" | "done";
  notes?: string;
  date?: string;
};

type RuntimeAgent = {
  id: string;
  name: string;
  emoji: string;
  role: string;
  status: "active" | "recent" | "stale" | "idle";
  note: string;
  ageMinutes: number | null;
  lastAssistantText?: string;
};

type RuntimeState = {
  agents?: RuntimeAgent[];
  blockers?: { id: string; name: string; issue: string; ageMinutes: number | null }[];
  summary?: { activeCount: number; staleCount: number; idleCount: number; totalAgents: number };
  timestamp?: string;
};

function Pill({ label, color }: { label: string; color: string }) {
  return (
    <span style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      padding: "4px 8px",
      borderRadius: 999,
      fontSize: 11,
      fontWeight: 700,
      color,
      background: `${color}22`,
      border: `1px solid ${color}44`,
      textTransform: "uppercase",
      letterSpacing: "0.04em",
    }}>{label}</span>
  );
}

export default function Now() {
  const [system, setSystem] = useState<SystemState>({});
  const [tasks, setTasks] = useState<Task[]>([]);
  const [runtime, setRuntime] = useState<RuntimeState>({});

  useEffect(() => {
    async function load() {
      try {
        const [systemRes, tasksRes, runtimeRes] = await Promise.all([
          fetch("/api/system", { cache: "no-store" }),
          fetch("/api/tasks", { cache: "no-store" }),
          fetch("/api/runtime", { cache: "no-store" }),
        ]);
        const systemJson = await systemRes.json();
        const tasksJson = await tasksRes.json();
        const runtimeJson = await runtimeRes.json();
        setSystem(systemJson || {});
        setTasks(tasksJson.tasks || []);
        setRuntime(runtimeJson || {});
      } catch {
        // leave defaults
      }
    }
    load();
    const interval = setInterval(load, 20000);
    return () => clearInterval(interval);
  }, []);

  const inProgress = tasks.filter(t => t.status === "in-progress");
  const nextUp = tasks.filter(t => t.status === "backlog").slice(0, 4);
  const done = tasks.filter(t => t.status === "done").slice(-4).reverse();
  const blockers = (runtime.blockers || []).slice(0, 4);
  const agents = runtime.agents || [];

  const statusColor = (status?: string) => {
    if (status === "ok") return "#22c55e";
    if (status === "offline") return "#e63e3e";
    if (status === "error") return "#f59e0b";
    return "#6b7280";
  };

  const runtimeColor = (status?: string) => {
    if (status === "active") return "#22c55e";
    if (status === "recent") return "#3b82f6";
    if (status === "stale") return "#f59e0b";
    return "#6b7280";
  };

  return (
    <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 18 }}>
      <div>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800 }}>Now</h1>
        <p style={{ margin: "6px 0 0", color: "var(--text-muted)", fontSize: 13 }}>
          Minimal operator view — current lane, system state, blockers, next actions.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr 1fr 1fr", gap: 12 }}>
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, padding: 16 }}>
          <div style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Current Lane</div>
          <div style={{ fontSize: 20, fontWeight: 800, marginTop: 8 }}>Mission Control runtime visibility</div>
          <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 8, lineHeight: 1.45 }}>
            Turn Mission Control into a live oversight surface: real agent session state, stale-lane detection, blockers, and current execution truth.
          </div>
        </div>
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, padding: 16 }}>
          <div style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase" }}>Gateway</div>
          <div style={{ marginTop: 10 }}><Pill label={system.gateway?.status || "unknown"} color={statusColor(system.gateway?.status)} /></div>
          <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 8 }}>{system.gateway?.latency ?? 0} ms</div>
        </div>
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, padding: 16 }}>
          <div style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase" }}>GHL</div>
          <div style={{ marginTop: 10 }}><Pill label={system.ghl?.status || "unknown"} color={statusColor(system.ghl?.status)} /></div>
          <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 8 }}>{system.ghl?.latency ?? 0} ms</div>
        </div>
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, padding: 16 }}>
          <div style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase" }}>Runtime</div>
          <div style={{ marginTop: 10 }}><Pill label={`${runtime.summary?.activeCount || 0} active`} color="#22c55e" /></div>
          <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 8 }}>{runtime.summary?.staleCount || 0} stale lanes</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.15fr 1fr 1fr", gap: 12 }}>
        <section style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, padding: 16 }}>
          <div style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Live Agent Sessions</div>
          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 10 }}>
            {agents.length ? agents.map(agent => (
              <div key={agent.id} style={{ border: "1px solid var(--border)", borderRadius: 8, padding: 12, background: "var(--surface-2)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center" }}>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>{agent.emoji} {agent.name}</div>
                  <Pill label={agent.status} color={runtimeColor(agent.status)} />
                </div>
                <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 6 }}>{agent.role}</div>
                <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 6 }}>{agent.note}</div>
                {agent.lastAssistantText && (
                  <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 8, fontStyle: "italic", lineHeight: 1.45 }}>
                    “{agent.lastAssistantText.slice(0, 160)}{agent.lastAssistantText.length > 160 ? "…" : ""}”
                  </div>
                )}
              </div>
            )) : <div style={{ color: "var(--text-muted)", fontSize: 13 }}>No runtime session data loaded.</div>}
          </div>
        </section>

        <section style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, padding: 16 }}>
          <div style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Top Blockers</div>
          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 10 }}>
            {blockers.length ? blockers.map(blocker => (
              <div key={blocker.id} style={{ borderBottom: "1px solid var(--border)", paddingBottom: 10 }}>
                <div style={{ fontSize: 13, fontWeight: 700 }}>{blocker.name}</div>
                <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4, lineHeight: 1.45 }}>{blocker.issue}</div>
              </div>
            )) : <div style={{ color: "var(--text-muted)", fontSize: 13 }}>No stale agent blockers detected right now.</div>}
          </div>
        </section>

        <section style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, padding: 16 }}>
          <div style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Next Up</div>
          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 10 }}>
            {nextUp.map(task => (
              <div key={task.id} style={{ borderBottom: "1px solid var(--border)", paddingBottom: 10 }}>
                <div style={{ fontSize: 13, fontWeight: 700 }}>{task.title}</div>
                <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>{task.tag}</div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr 1fr", gap: 12 }}>
        <section style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, padding: 16 }}>
          <div style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>In Progress</div>
          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 10 }}>
            {inProgress.length ? inProgress.map(task => (
              <div key={task.id} style={{ border: "1px solid var(--border)", borderRadius: 8, padding: 12, background: "var(--surface-2)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>{task.title}</div>
                  <Pill label={task.priority} color={task.priority === "critical" ? "#e63e3e" : task.priority === "high" ? "#f59e0b" : task.priority === "medium" ? "#3b82f6" : "#6b7280"} />
                </div>
                <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 6 }}>{task.tag} · {task.assignee}</div>
                {task.notes && <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 6 }}>{task.notes}</div>}
              </div>
            )) : <div style={{ color: "var(--text-muted)", fontSize: 13 }}>No active tasks loaded.</div>}
          </div>
        </section>

        <section style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, padding: 16 }}>
          <div style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Operator Notes</div>
          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 10, fontSize: 13, color: "var(--text-muted)" }}>
            <div>• Mission Control now reads local OpenClaw session truth.</div>
            <div>• Stale-lane detection is active for oversight.</div>
            <div>• Next backend step: sync task truth and lane transcripts from the same live source.</div>
            <div>• Latest runtime timestamp: {runtime.timestamp ? new Date(runtime.timestamp).toLocaleString() : "—"}</div>
          </div>
        </section>

        <section style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, padding: 16 }}>
          <div style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>System Timestamp</div>
          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 10, fontSize: 13, color: "var(--text-muted)" }}>
            <div>System: {system.timestamp ? new Date(system.timestamp).toLocaleString() : "—"}</div>
            <div>Runtime: {runtime.timestamp ? new Date(runtime.timestamp).toLocaleString() : "—"}</div>
          </div>
        </section>
      </div>

      <section style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, padding: 16 }}>
        <div style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Recently Done</div>
        <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
          {done.map(task => (
            <div key={task.id} style={{ background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 8, padding: 12 }}>
              <div style={{ fontSize: 13, fontWeight: 700 }}>{task.title}</div>
              <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>{task.tag}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
