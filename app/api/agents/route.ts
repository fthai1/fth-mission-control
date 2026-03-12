import { NextResponse } from "next/server";
import { getRuntimeSummary } from "@/lib/runtime";

export async function GET() {
  const runtime = getRuntimeSummary();

  const statusMap: Record<string, string> = {
    active: "working",
    recent: "ready",
    stale: "stale",
    idle: "idle",
  };

  const agents = runtime.agents.map((agent) => ({
    id: agent.id,
    name: agent.name,
    emoji: agent.emoji,
    role: agent.role,
    status: statusMap[agent.status] || agent.status,
    workspace: agent.workspace,
    note: agent.note,
    lastUpdatedAt: agent.lastUpdatedAt,
    ageMinutes: agent.ageMinutes,
    sessionCount: agent.sessionCount,
  }));

  return NextResponse.json({ agents, timestamp: runtime.timestamp, summary: runtime.summary });
}
