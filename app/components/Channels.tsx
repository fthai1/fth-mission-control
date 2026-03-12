"use client";
import { useEffect, useMemo, useState, type ReactNode } from "react";

type Agent = {
  id: string;
  name: string;
  emoji: string;
  role: string;
  status: string;
  workspace: string;
  note: string;
};

type Message = {
  id: string;
  author: string;
  text: string;
  ts: string;
};

type ChannelData = {
  summary: string;
  messages: Message[];
};

const QUICK_PROMPTS: Record<string, string[]> = {
  main: [
    "Give me the current top priorities and blockers.",
    "Summarize what changed since yesterday.",
    "Prepare the next delegation pass across permanent agents.",
  ],
  "business-manager": [
    "Review cross-agent blockers and exception risk.",
    "Summarize open loops that need executive attention.",
    "Draft a daily management snapshot.",
  ],
  "data-agent": [
    "Audit scraper reliability and list immediate fixes.",
    "Summarize county-source health and failed runs.",
    "Prioritize the next data hardening tasks.",
  ],
  "ghl-agent": [
    "Review stale opportunities and workflow risks.",
    "Summarize pipeline exceptions needing action.",
    "List the next CRM automation tasks.",
  ],
};

const NEXT_ACTIONS: Record<string, string[]> = {
  main: [
    "Coordinate permanent-agent delegation",
    "Keep Mission Control task truth current",
    "Drive the next product/build milestone",
  ],
  "business-manager": [
    "Own summaries and exception review",
    "Monitor cross-agent outputs",
    "Escalate blockers cleanly",
  ],
  "data-agent": [
    "Own source monitoring and scraper reliability",
    "Pressure-test lis pendens reliability lane",
    "Protect prospect pipeline integrity",
  ],
  "ghl-agent": [
    "Own pipeline monitoring and stale-opportunity review",
    "Audit workflows and reporting reliability",
    "Tighten CRM operating cadence",
  ],
};

function statusColor(status: string) {
  switch (status) {
    case "working":
      return "#22c55e";
    case "ready":
      return "#3b82f6";
    case "planned":
      return "#f59e0b";
    default:
      return "#94a3b8";
  }
}

function formatAuthor(author: string) {
  if (author === "enzo") return "Enzo";
  if (author === "system") return "System";
  if (author === "operator") return "Operator";
  if (author === "business-manager") return "Business Manager";
  if (author === "data-agent") return "Data Agent";
  if (author === "ghl-agent") return "GHL Agent";
  return author;
}

export default function Channels() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [active, setActive] = useState("main");
  const [channel, setChannel] = useState<ChannelData>({ summary: "", messages: [] });
  const [draft, setDraft] = useState("");
  const [search, setSearch] = useState("");
  const [localMessages, setLocalMessages] = useState<Record<string, Message[]>>({});
  const [isSending, setIsSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/agents", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => setAgents(data.agents || []))
      .catch(() => setAgents([]));
  }, []);

  useEffect(() => {
    fetch(`/api/channels?agent=${active}`, { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => setChannel(data || { summary: "", messages: [] }))
      .catch(() => setChannel({ summary: "", messages: [] }));
  }, [active]);

  const filteredAgents = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return agents;
    return agents.filter((agent) => {
      const haystack = `${agent.name} ${agent.role} ${agent.note} ${agent.workspace}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [agents, search]);

  const activeAgent = agents.find((a) => a.id === active);
  const mergedMessages = [...channel.messages, ...(localMessages[active] || [])].sort(
    (a, b) => new Date(a.ts).getTime() - new Date(b.ts).getTime()
  );
  const quickPrompts = QUICK_PROMPTS[active] || QUICK_PROMPTS.main;
  const nextActions = NEXT_ACTIONS[active] || NEXT_ACTIONS.main;

  const sendDraft = async () => {
    const text = draft.trim();
    if (!text || isSending) return;

    const optimisticMessage: Message = {
      id: `local-${active}-${Date.now()}`,
      author: "operator",
      text,
      ts: new Date().toISOString(),
    };

    setSendError(null);
    setIsSending(true);
    setLocalMessages((prev) => ({
      ...prev,
      [active]: [...(prev[active] || []), optimisticMessage],
    }));
    setDraft("");

    try {
      const response = await fetch("/api/channels", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agent: active, text }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || "Failed to send message.");
      }

      setChannel(data.channel || { summary: "", messages: [] });
      setLocalMessages((prev) => ({
        ...prev,
        [active]: [],
      }));
    } catch (error) {
      setSendError(error instanceof Error ? error.message : "Failed to send message.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div
      style={{
        padding: 24,
        display: "grid",
        gridTemplateColumns: "280px minmax(0, 1fr) 320px",
        gap: 16,
        minHeight: "100%",
      }}
    >
      <section
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: 16,
          padding: 16,
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}
      >
        <div>
          <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>Agent Inbox</h1>
          <p style={{ margin: "6px 0 0", color: "var(--text-muted)", fontSize: 13 }}>
            Operator-facing communication surface for the permanent-agent backbone.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 10,
          }}
        >
          <MetricCard label="Permanent lanes" value={String(agents.length || 0)} />
          <MetricCard label="Local drafts" value={String(Object.values(localMessages).reduce((n, list) => n + list.length, 0))} />
        </div>

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search agents, roles, or workspaces..."
          style={{
            width: "100%",
            background: "var(--background)",
            color: "var(--text)",
            border: "1px solid var(--border)",
            borderRadius: 10,
            padding: "10px 12px",
            fontFamily: "inherit",
            fontSize: 13,
          }}
        />

        <div style={{ display: "flex", flexDirection: "column", gap: 10, minHeight: 0, overflow: "auto" }}>
          {filteredAgents.map((agent) => {
            const isActive = active === agent.id;
            const msgCount = (channel.messages.length && isActive ? channel.messages.length : 0) + (localMessages[agent.id]?.length || 0);
            return (
              <button
                key={agent.id}
                onClick={() => setActive(agent.id)}
                style={{
                  textAlign: "left",
                  background: isActive ? "var(--accent-dim)" : "var(--surface-2)",
                  border: `1px solid ${isActive ? "var(--accent)" : "var(--border)"}`,
                  borderRadius: 12,
                  padding: 12,
                  color: "var(--text)",
                  cursor: "pointer",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
                  <div style={{ fontWeight: 700 }}>{agent.emoji} {agent.name}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span
                      style={{
                        fontSize: 10,
                        textTransform: "uppercase",
                        color: statusColor(agent.status),
                        fontWeight: 700,
                      }}
                    >
                      {agent.status}
                    </span>
                    <span
                      style={{
                        fontSize: 10,
                        borderRadius: 999,
                        padding: "2px 7px",
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid var(--border)",
                        color: "var(--text-muted)",
                      }}
                    >
                      {msgCount} msgs
                    </span>
                  </div>
                </div>
                <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>{agent.role}</div>
                <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 6 }}>{agent.note}</div>
              </button>
            );
          })}
        </div>
      </section>

      <section
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: 16,
          minHeight: 720,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <div style={{ borderBottom: "1px solid var(--border)", padding: 18 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start", flexWrap: "wrap" }}>
            <div>
              <div style={{ fontSize: 20, fontWeight: 700 }}>
                {activeAgent ? `${activeAgent.emoji} ${activeAgent.name}` : "Agent Channel"}
              </div>
              <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 4 }}>{activeAgent?.role}</div>
              <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 8 }}>{channel.summary}</div>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <Badge text={activeAgent?.status || "unknown"} color={statusColor(activeAgent?.status || "")} />
              <Badge text="Permanent agent" color="#8b5cf6" />
              <Badge text={`${mergedMessages.length} timeline items`} color="#64748b" />
            </div>
          </div>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 14 }}>
            {quickPrompts.map((prompt) => (
              <button
                key={prompt}
                onClick={() => setDraft(prompt)}
                style={{
                  background: "var(--surface-2)",
                  border: "1px solid var(--border)",
                  color: "var(--text)",
                  borderRadius: 999,
                  padding: "7px 10px",
                  fontSize: 12,
                  cursor: "pointer",
                }}
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        <div style={{ flex: 1, overflow: "auto", padding: 18, display: "flex", flexDirection: "column", gap: 12, background: "linear-gradient(180deg, rgba(255,255,255,0.01), rgba(255,255,255,0))" }}>
          {mergedMessages.length === 0 ? (
            <div style={{ color: "var(--text-muted)", fontSize: 13 }}>No activity in this lane yet.</div>
          ) : (
            mergedMessages.map((msg) => {
              const isOperator = msg.author === "operator";
              const isSystem = msg.author === "system";
              return (
                <div
                  key={msg.id}
                  style={{
                    alignSelf: isOperator ? "flex-end" : "stretch",
                    maxWidth: isOperator ? "78%" : "100%",
                    background: isOperator ? "rgba(59,130,246,0.14)" : isSystem ? "rgba(245,158,11,0.08)" : "var(--surface-2)",
                    border: `1px solid ${isOperator ? "rgba(59,130,246,0.45)" : isSystem ? "rgba(245,158,11,0.25)" : "var(--border)"}`,
                    borderRadius: 14,
                    padding: 14,
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center", marginBottom: 6 }}>
                    <div style={{ fontSize: 10, color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>
                      {formatAuthor(msg.author)}
                    </div>
                    <div style={{ fontSize: 10, color: "var(--text-muted)" }}>
                      {new Date(msg.ts).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                  <div style={{ fontSize: 13, color: "var(--text)", lineHeight: 1.5, whiteSpace: "pre-wrap" }}>{msg.text}</div>
                </div>
              );
            })
          )}
        </div>

        <div style={{ borderTop: "1px solid var(--border)", padding: 18 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 8 }}>
            <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
              Send live operator messages into the permanent-agent lanes through OpenClaw, with replies persisted into Mission Control.
            </div>
            <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{draft.trim().length} chars</div>
          </div>
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={`Message ${activeAgent?.name || "agent"}...`}
            style={{
              width: "100%",
              minHeight: 110,
              resize: "vertical",
              background: "var(--background)",
              color: "var(--text)",
              border: `1px solid ${sendError ? "#ef4444" : "var(--border)"}`,
              borderRadius: 12,
              padding: 12,
              fontFamily: "inherit",
              fontSize: 13,
              lineHeight: 1.5,
            }}
          />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12, gap: 12, flexWrap: "wrap" }}>
            <div style={{ fontSize: 11, color: sendError ? "#fca5a5" : "var(--text-muted)" }}>
              {sendError ? `Send failed: ${sendError}` : isSending ? "Sending through OpenClaw now..." : "Current mode: live OpenClaw send + Mission Control transcript persistence."}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={() => setDraft("")}
                style={{
                  background: "transparent",
                  color: "var(--text-muted)",
                  border: "1px solid var(--border)",
                  borderRadius: 10,
                  padding: "9px 12px",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Clear
              </button>
              <button
                onClick={sendDraft}
                disabled={!draft.trim() || isSending}
                style={{
                  background: draft.trim() && !isSending ? "var(--accent)" : "var(--accent-dim)",
                  color: "white",
                  border: "1px solid var(--accent)",
                  borderRadius: 10,
                  padding: "9px 14px",
                  fontWeight: 700,
                  cursor: draft.trim() && !isSending ? "pointer" : "not-allowed",
                  opacity: draft.trim() && !isSending ? 1 : 0.65,
                }}
              >
                {isSending ? "Sending..." : "Send to lane"}
              </button>
            </div>
          </div>
        </div>
      </section>

      <aside
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: 16,
          padding: 16,
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}
      >
        <Panel title="Lane snapshot">
          <div style={{ display: "grid", gap: 10 }}>
            <SnapshotRow label="Workspace" value={activeAgent?.workspace || "—"} />
            <SnapshotRow label="Role" value={activeAgent?.role || "—"} />
            <SnapshotRow label="Status" value={activeAgent?.status || "—"} valueColor={statusColor(activeAgent?.status || "")} />
            <SnapshotRow label="Note" value={activeAgent?.note || "—"} />
          </div>
        </Panel>

        <Panel title="Next actions">
          <ul style={{ margin: 0, paddingLeft: 18, color: "var(--text)", display: "grid", gap: 8 }}>
            {nextActions.map((item) => (
              <li key={item} style={{ fontSize: 13, lineHeight: 1.45 }}>{item}</li>
            ))}
          </ul>
        </Panel>

        <Panel title="Upgrade notes">
          <div style={{ display: "grid", gap: 8, fontSize: 13, color: "var(--text-muted)" }}>
            <div>✅ Real permanent-agent inbox layout</div>
            <div>✅ Searchable lane list + richer header state</div>
            <div>✅ Usable composer with live OpenClaw send</div>
            <div>✅ Mission Control transcript persistence per permanent lane</div>
            <div>⏳ Next backend step: live session status + history sync</div>
            <div>⏳ Next UX step: inbox threads, unread state, agent activity stream</div>
          </div>
        </Panel>
      </aside>
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 12, padding: 12 }}>
      <div style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase" }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 700, marginTop: 4 }}>{value}</div>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section style={{ background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 14, padding: 14 }}>
      <div style={{ fontWeight: 700, marginBottom: 10, color: "var(--text)" }}>{title}</div>
      {children}
    </section>
  );
}

function SnapshotRow({
  label,
  value,
  valueColor,
}: {
  label: string;
  value: string;
  valueColor?: string;
}) {
  return (
    <div style={{ display: "grid", gap: 4 }}>
      <div style={{ fontSize: 10, textTransform: "uppercase", color: "var(--text-muted)" }}>{label}</div>
      <div style={{ fontSize: 13, color: valueColor || "var(--text)", lineHeight: 1.45 }}>{value}</div>
    </div>
  );
}

function Badge({ text, color }: { text: string; color: string }) {
  return (
    <span
      style={{
        padding: "6px 10px",
        borderRadius: 999,
        border: `1px solid ${color}33`,
        background: `${color}14`,
        color,
        fontSize: 11,
        fontWeight: 700,
        textTransform: "uppercase",
      }}
    >
      {text}
    </span>
  );
}
