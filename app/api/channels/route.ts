import { NextResponse } from "next/server";
import {
  appendMany,
  getChannel,
  newMessageId,
  normalizeAgentId,
  runAgentTurn,
  type AgentId,
} from "@/lib/mission-control-chat";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const agent = normalizeAgentId(searchParams.get("agent"));
  const channel = await getChannel(agent);
  return NextResponse.json(channel);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const agent = normalizeAgentId(body?.agent) as AgentId;
    const text = String(body?.text || "").trim();

    if (!text) {
      return NextResponse.json({ error: "Message text is required." }, { status: 400 });
    }

    const operatorMessage = {
      id: newMessageId("operator"),
      author: "operator",
      text,
      ts: new Date().toISOString(),
      status: "sent" as const,
    };

    const result = await runAgentTurn(agent, text);

    const agentMessage = {
      id: newMessageId(agent),
      author: agent,
      text: result.replyText,
      ts: new Date().toISOString(),
      status: result.ok ? ("completed" as const) : ("error" as const),
      meta: {
        transport: "openclaw-agent-cli",
        ok: result.ok,
      },
    };

    const channel = await appendMany(agent, [operatorMessage, agentMessage]);

    return NextResponse.json({ ok: result.ok, channel, sent: operatorMessage, reply: agentMessage });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to send channel message.",
      },
      { status: 500 }
    );
  }
}
