"use client";
import { useState, useEffect } from "react";

type AgentStatus = "working" | "idle" | "planned";

interface Agent {
  id: string;
  name: string;
  emoji: string;
  role: string;
  status: AgentStatus;
  task: string;
  position: { row: number; col: number };
}

const AGENTS: Agent[] = [
  {
    id: "main",
    name: "Enzo",
    emoji: "🏎️",
    role: "Coordinator / Mission Control",
    status: "working",
    task: "Integrating Team and Office with the real OpenClaw agent backbone",
    position: { row: 1, col: 1 },
  },
  {
    id: "business-manager",
    name: "Business Manager",
    emoji: "📊",
    role: "Oversight & Reporting",
    status: "idle",
    task: "Ready to take summaries, exception review, and cross-agent monitoring",
    position: { row: 0, col: 2 },
  },
  {
    id: "data-agent",
    name: "Data Agent",
    emoji: "🔍",
    role: "Data Reliability",
    status: "idle",
    task: "Ready for scraper repair, run validation, and source monitoring tasks",
    position: { row: 2, col: 1 },
  },
  {
    id: "ghl-agent",
    name: "GHL Agent",
    emoji: "⚙️",
    role: "CRM Operations",
    status: "idle",
    task: "Ready for pipeline health, stale lead review, and workflow QA tasks",
    position: { row: 1, col: 3 },
  },
  {
    id: "marketing-agent",
    name: "Marketing Agent",
    emoji: "📣",
    role: "Marketing Department",
    status: "working",
    task: "Building brand system, website optimization lane, campaign ops, property marketing sheets, and social media operating system",
    position: { row: 2, col: 2 },
  },
  {
    id: "task-force-lanes",
    name: "Task-Force Lanes",
    emoji: "🧩",
    role: "Temporary sub-agents / execution lanes",
    status: "planned",
    task: "Spawn under permanent agents as needed; Office shows runtime, Team shows architecture",
    position: { row: 0, col: 0 },
  },
];

const STATUS_COLOR: Record<AgentStatus, string> = {
  working: "#22c55e",
  idle: "#f59e0b",
  planned: "#6b6b8a",
};

const STATUS_LABEL: Record<AgentStatus, string> = {
  working: "Working",
  idle: "Ready",
  planned: "Standby",
};

function useET() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const tick = () =>
      setTime(
        new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          timeZone: "America/New_York",
        })
      );
    tick();
    const iv = setInterval(tick, 1000);
    return () => clearInterval(iv);
  }, []);
  return time;
}

function PulseRing({ color }: { color: string }) {
  return (
    <div style={{ position: "absolute", inset: -6, borderRadius: 12, pointerEvents: "none" }}>
      <style>{`
        @keyframes desk-pulse {
          0%   { opacity: 0.7; transform: scale(1); }
          70%  { opacity: 0;   transform: scale(1.35); }
          100% { opacity: 0;   transform: scale(1.35); }
        }
        @keyframes bubble-in {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes status-blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.3; }
        }
        @keyframes live-dot {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.2; }
        }
      `}</style>
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 12,
          border: `2px solid ${color}`,
          animation: "desk-pulse 2s ease-out infinite",
        }}
      />
    </div>
  );
}

function ActivityBubble({ task }: { task: string }) {
  return (
    <div
      style={{
        position: "absolute",
        bottom: "calc(100% + 8px)",
        left: "50%",
        transform: "translateX(-50%)",
        background: "rgba(13,17,23,0.95)",
        border: "1px solid #c9a22755",
        borderRadius: 8,
        padding: "6px 10px",
        fontSize: 10,
        color: "#c9a227",
        whiteSpace: "nowrap",
        maxWidth: 240,
        overflow: "hidden",
        textOverflow: "ellipsis",
        animation: "bubble-in 0.3s ease-out",
        zIndex: 10,
        boxShadow: "0 2px 12px rgba(0,0,0,0.5)",
        pointerEvents: "none",
      }}
    >
      <span style={{ marginRight: 4, animation: "status-blink 1.5s infinite" }}>●</span>
      {task}
      <div
        style={{
          position: "absolute",
          top: "100%",
          left: "50%",
          transform: "translateX(-50%)",
          width: 0,
          height: 0,
          borderLeft: "5px solid transparent",
          borderRight: "5px solid transparent",
          borderTop: "5px solid #c9a22755",
        }}
      />
    </div>
  );
}

function Desk({ agent, isHovered, onHover, onLeave }: {
  agent: Agent;
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
}) {
  const isPlanned = agent.status === "planned";
  const isWorking = agent.status === "working";
  const statusColor = STATUS_COLOR[agent.status];

  return (
    <div
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      style={{
        gridRow: agent.position.row + 1,
        gridColumn: agent.position.col + 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 8,
      }}
    >
      <div style={{ position: "relative", display: "inline-flex", flexDirection: "column", alignItems: "center" }}>
        {isWorking && <ActivityBubble task={agent.task} />}

        <div
          style={{
            position: "relative",
            background: isPlanned
              ? "rgba(30,35,45,0.4)"
              : isWorking
              ? "rgba(34,197,94,0.06)"
              : "rgba(30,35,45,0.8)",
            border: `1px solid ${isPlanned ? "#2a2f3a" : isWorking ? "#22c55e44" : "#2a2f3a"}`,
            borderRadius: 10,
            padding: "14px 16px 10px",
            textAlign: "center",
            opacity: isPlanned ? 0.55 : 1,
            transition: "all 0.2s",
            minWidth: 136,
            boxShadow: isWorking ? "0 0 20px rgba(34,197,94,0.12)" : "none",
          }}
        >
          {isWorking && <PulseRing color={statusColor} />}

          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 6,
              right: 6,
              height: 6,
              background: isPlanned ? "#1e232e" : "#1a2030",
              borderRadius: "0 0 6px 6px",
              borderTop: `2px solid ${isPlanned ? "#2a2f3a" : "#22344a"}`,
            }}
          />

          <div style={{ fontSize: 32, marginBottom: 6, filter: isPlanned ? "grayscale(0.4)" : "none" }}>
            {agent.emoji}
          </div>

          <div style={{ fontSize: 11, fontWeight: 700, color: isPlanned ? "#7b7f90" : "var(--text)", marginBottom: 2 }}>
            {agent.name}
          </div>

          <div style={{ fontSize: 9, color: isPlanned ? "#656a79" : "var(--text-muted)", marginBottom: 8, letterSpacing: "0.04em" }}>
            {agent.role}
          </div>

          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            background: `${statusColor}18`,
            border: `1px solid ${statusColor}44`,
            borderRadius: 20,
            padding: "2px 8px",
            fontSize: 9,
            color: statusColor,
            fontWeight: 600,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}>
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: statusColor, display: "inline-block", animation: isWorking ? "status-blink 1.5s infinite" : "none" }} />
            {STATUS_LABEL[agent.status]}
          </div>

          {!isWorking && isHovered && (
            <div style={{
              position: "absolute",
              bottom: "calc(100% + 8px)",
              left: "50%",
              transform: "translateX(-50%)",
              background: "rgba(13,17,23,0.95)",
              border: "1px solid var(--border)",
              borderRadius: 8,
              padding: "6px 10px",
              fontSize: 10,
              color: "var(--text-muted)",
              whiteSpace: "nowrap",
              maxWidth: 240,
              overflow: "hidden",
              textOverflow: "ellipsis",
              animation: "bubble-in 0.2s ease-out",
              zIndex: 10,
              boxShadow: "0 2px 12px rgba(0,0,0,0.5)",
              pointerEvents: "none",
            }}>
              {agent.task}
            </div>
          )}
        </div>

        <div style={{
          marginTop: 4,
          fontSize: 8,
          color: isPlanned ? "#454b5b" : "#3a4050",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          fontFamily: "monospace",
        }}>
          DESK-{agent.id.slice(0, 3).toUpperCase()}
        </div>
      </div>
    </div>
  );
}

function WaterCooler() {
  return (
    <div style={{ gridRow: 3, gridColumn: 4, display: "flex", justifyContent: "center", alignItems: "center" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, opacity: 0.7 }}>
        <div style={{ fontSize: 28, background: "rgba(30,35,45,0.6)", border: "1px solid #1e2535", borderRadius: 8, padding: "8px 12px" }}>💧</div>
        <div style={{ fontSize: 9, color: "#3a4050", letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "monospace" }}>
          Task Force Hub
        </div>
      </div>
    </div>
  );
}

export default function Office() {
  const time = useET();
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div style={{ minHeight: "100%", background: "#0d1117", padding: 24, position: "relative", fontFamily: "inherit" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: `
          linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)
        `, backgroundSize: "40px 40px", pointerEvents: "none", zIndex: 0 }} />

      <div style={{ position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "var(--text)" }}>🏢 Office</h1>
            <p style={{ margin: "4px 0 0", color: "var(--text-muted)", fontSize: 13 }}>
              Runtime view — permanent agents at their desks, temporary lanes/task forces under them.
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(13,17,23,0.8)", border: "1px solid #22c55e44", borderRadius: 20, padding: "6px 14px", backdropFilter: "blur(8px)" }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#22c55e", animation: "live-dot 1.5s ease-in-out infinite" }} />
            <span style={{ fontSize: 11, color: "#22c55e", fontWeight: 700, letterSpacing: "0.08em" }}>LIVE</span>
            <span style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "monospace" }}>{time} ET</span>
          </div>
        </div>

        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, padding: 16, marginBottom: 18 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Runtime Rule</div>
          <div style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.5 }}>
            Office shows <strong style={{ color: "var(--text)" }}>live ownership and runtime posture</strong>. Permanent agents sit here as departments; temporary lanes and sub-agents are task-force units that should spawn under them as needed.
          </div>
        </div>

        <div style={{ background: "rgba(13,17,23,0.7)", border: "1px solid #1e2535", borderRadius: 16, padding: 32, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, borderRadius: 16, border: "1px solid #c9a22720", pointerEvents: "none" }} />
          <div style={{ position: "absolute", top: 10, left: 16, fontSize: 9, color: "#2a3040", fontFamily: "monospace", letterSpacing: "0.12em", textTransform: "uppercase" }}>
            FTH-HQ · RUNTIME FLOOR
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gridTemplateRows: "repeat(3, 160px)", gap: 16, marginTop: 16 }}>
            {AGENTS.map(agent => (
              <Desk
                key={agent.id}
                agent={agent}
                isHovered={hovered === agent.id}
                onHover={() => setHovered(agent.id)}
                onLeave={() => setHovered(null)}
              />
            ))}
            <WaterCooler />
          </div>
        </div>

        <div style={{ display: "flex", gap: 20, marginTop: 20, padding: "12px 16px", background: "rgba(30,35,45,0.4)", border: "1px solid #1e2535", borderRadius: 10, width: "fit-content" }}>
          {(["working", "idle", "planned"] as AgentStatus[]).map(s => (
            <div key={s} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: STATUS_COLOR[s] }} />
              <span style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "capitalize" }}>{STATUS_LABEL[s]}</span>
            </div>
          ))}
          <div style={{ fontSize: 11, color: "#2a3040", marginLeft: 8 }}>· hover non-working desks to see current ownership posture</div>
        </div>
      </div>
    </div>
  );
}
