import fs from "node:fs";
import path from "node:path";

export type RuntimeAgentId = "main" | "business-manager" | "data-agent" | "ghl-agent";

export type RuntimeAgentSummary = {
  id: RuntimeAgentId;
  name: string;
  emoji: string;
  role: string;
  workspace: string;
  status: "active" | "recent" | "stale" | "idle";
  note: string;
  lastUpdatedAt: string | null;
  ageMinutes: number | null;
  sessionId: string | null;
  sessionCount: number;
  lastUserText?: string;
  lastAssistantText?: string;
};

const AGENTS: Omit<RuntimeAgentSummary, "status" | "note" | "lastUpdatedAt" | "ageMinutes" | "sessionId" | "sessionCount" | "lastUserText" | "lastAssistantText">[] = [
  {
    id: "main",
    name: "Enzo",
    emoji: "🏎️",
    role: "Coordinator / Mission Control / Final Review",
    workspace: "~/.openclaw/workspace",
  },
  {
    id: "business-manager",
    name: "Business Manager",
    emoji: "📊",
    role: "Oversight / Summaries / Exception reporting",
    workspace: "~/.openclaw/workspace-business-manager",
  },
  {
    id: "data-agent",
    name: "Data Agent",
    emoji: "🔍",
    role: "Scraper health / Data reliability / Source monitoring",
    workspace: "~/.openclaw/workspace-data-agent",
  },
  {
    id: "ghl-agent",
    name: "GHL Agent",
    emoji: "⚙️",
    role: "CRM ops / Pipeline monitoring / Workflow QA",
    workspace: "~/.openclaw/workspace-ghl-agent",
  },
];

function agentsRoot() {
  return path.join(process.env.HOME || "", ".openclaw", "agents");
}

function safeReadDir(dir: string) {
  try {
    return fs.readdirSync(dir);
  } catch {
    return [];
  }
}

function readLastLines(filePath: string, maxLines = 80) {
  try {
    const raw = fs.readFileSync(filePath, "utf8");
    const lines = raw.trim().split("\n");
    return lines.slice(-maxLines);
  } catch {
    return [] as string[];
  }
}

function extractTextFromMessage(entry: any) {
  const content = entry?.message?.content;
  if (!Array.isArray(content)) return "";
  return content
    .filter((part: any) => part?.type === "text" && typeof part?.text === "string")
    .map((part: any) => part.text.trim())
    .filter(Boolean)
    .join("\n")
    .trim();
}

function classifyAge(ageMinutes: number | null): RuntimeAgentSummary["status"] {
  if (ageMinutes == null) return "idle";
  if (ageMinutes <= 15) return "active";
  if (ageMinutes <= 180) return "recent";
  return "stale";
}

function noteFor(summary: {
  status: RuntimeAgentSummary["status"];
  ageMinutes: number | null;
  sessionCount: number;
  lastAssistantText?: string;
}) {
  if (summary.status === "idle") return "No session transcript found yet.";
  if (summary.status === "active") return `Live within the last ${Math.max(1, Math.round(summary.ageMinutes || 0))} min.`;
  if (summary.status === "recent") return `Updated ${Math.round(summary.ageMinutes || 0)} min ago.`;
  const text = summary.lastAssistantText?.slice(0, 120);
  return text ? `Stale runtime. Last visible output: ${text}` : `Stale runtime. Last update ${Math.round(summary.ageMinutes || 0)} min ago.`;
}

export function getRuntimeSummary() {
  const base = agentsRoot();
  const now = Date.now();

  const agents = AGENTS.map((agent) => {
    const sessionDir = path.join(base, agent.id, "sessions");
    const files = safeReadDir(sessionDir)
      .filter((name) => name.endsWith(".jsonl"))
      .map((name) => {
        const filePath = path.join(sessionDir, name);
        let mtimeMs = 0;
        try {
          mtimeMs = fs.statSync(filePath).mtimeMs;
        } catch {}
        return { name, filePath, mtimeMs };
      })
      .sort((a, b) => b.mtimeMs - a.mtimeMs);

    const latest = files[0];
    let lastUpdatedAt: string | null = latest ? new Date(latest.mtimeMs).toISOString() : null;
    let ageMinutes: number | null = latest ? Math.max(0, Math.round((now - latest.mtimeMs) / 60000)) : null;
    let lastUserText = "";
    let lastAssistantText = "";

    if (latest) {
      for (const line of readLastLines(latest.filePath).reverse()) {
        try {
          const parsed = JSON.parse(line);
          if (!lastAssistantText && parsed?.type === "message" && parsed?.message?.role === "assistant") {
            lastAssistantText = extractTextFromMessage(parsed);
          }
          if (!lastUserText && parsed?.type === "message" && parsed?.message?.role === "user") {
            lastUserText = extractTextFromMessage(parsed);
          }
          if (lastAssistantText && lastUserText) break;
        } catch {
          continue;
        }
      }
    }

    const status = classifyAge(ageMinutes);
    return {
      ...agent,
      status,
      note: noteFor({ status, ageMinutes, sessionCount: files.length, lastAssistantText }),
      lastUpdatedAt,
      ageMinutes,
      sessionId: latest?.name.replace(/\.jsonl$/, "") || null,
      sessionCount: files.length,
      lastUserText: lastUserText || undefined,
      lastAssistantText: lastAssistantText || undefined,
    } satisfies RuntimeAgentSummary;
  });

  const activeCount = agents.filter((agent) => agent.status === "active").length;
  const staleAgents = agents.filter((agent) => agent.status === "stale");

  return {
    timestamp: new Date().toISOString(),
    summary: {
      activeCount,
      staleCount: staleAgents.length,
      idleCount: agents.filter((agent) => agent.status === "idle").length,
      totalAgents: agents.length,
    },
    blockers: staleAgents.map((agent) => ({
      id: agent.id,
      name: agent.name,
      issue: agent.note,
      ageMinutes: agent.ageMinutes,
    })),
    agents,
  };
}
