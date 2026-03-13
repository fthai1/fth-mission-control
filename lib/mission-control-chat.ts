import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { getSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase";

const execFileAsync = promisify(execFile);

export type AgentId = "main" | "business-manager" | "data-agent" | "ghl-agent" | "marketing-agent";

export type ChatMessage = {
  id: string;
  author: string;
  text: string;
  ts: string;
  status?: "sent" | "running" | "completed" | "error";
  meta?: Record<string, string | number | boolean | null>;
};

export type ChannelRecord = {
  summary: string;
  messages: ChatMessage[];
};

const DATA_DIR = path.join(process.cwd(), "data");
const CHAT_STORE_PATH = path.join(DATA_DIR, "mission-control-chat.json");

const seedChannels: Record<AgentId, ChannelRecord> = {
  main: {
    summary: "Primary operator lane for Enzo and Mission Control.",
    messages: [
      { id: "m1", author: "system", text: "Permanent-agent backbone is live.", ts: "2026-03-11T20:00:00Z" },
      { id: "m2", author: "enzo", text: "Mission Control Team and Office are now aligned to the real agent architecture.", ts: "2026-03-11T20:45:00Z" },
    ],
  },
  "business-manager": {
    summary: "Oversight lane for summaries, exception reporting, and cross-agent review.",
    messages: [
      { id: "bm1", author: "system", text: "Business Manager workspace and root-doc scaffold created.", ts: "2026-03-11T18:59:00Z" },
    ],
  },
  "data-agent": {
    summary: "Data lane for scraper health, source monitoring, and pipeline reliability.",
    messages: [
      { id: "da1", author: "system", text: "Data Agent workspace and root-doc scaffold created.", ts: "2026-03-11T18:59:30Z" },
      { id: "da2", author: "system", text: "Miami-Dade weekly path hardened; lis pendens reliability follow-up remains available for delegation.", ts: "2026-03-11T19:05:00Z" },
    ],
  },
  "ghl-agent": {
    summary: "CRM lane for pipeline monitoring, workflow QA, and recurring reports.",
    messages: [
      { id: "ga1", author: "system", text: "GHL Agent workspace and root-doc scaffold created.", ts: "2026-03-11T19:00:00Z" },
    ],
  },
  "marketing-agent": {
    summary: "Standalone marketing department owner for branding, website optimization, campaign buildouts, property marketing sheets, and social media.",
    messages: [
      { id: "ma1", author: "system", text: "Marketing Agent workspace and first-pass operating artifacts created.", ts: "2026-03-13T18:00:00Z" },
    ],
  },
};

function cloneSeed() {
  return JSON.parse(JSON.stringify(seedChannels)) as Record<AgentId, ChannelRecord>;
}

async function ensureLocalChatStore() {
  await mkdir(DATA_DIR, { recursive: true });
  try {
    await readFile(CHAT_STORE_PATH, "utf8");
  } catch {
    await writeFile(CHAT_STORE_PATH, JSON.stringify(cloneSeed(), null, 2));
  }
}

async function loadLocalChatStore() {
  await ensureLocalChatStore();
  const raw = await readFile(CHAT_STORE_PATH, "utf8");
  return JSON.parse(raw) as Record<AgentId, ChannelRecord>;
}

async function saveLocalChatStore(store: Record<AgentId, ChannelRecord>) {
  await ensureLocalChatStore();
  await writeFile(CHAT_STORE_PATH, JSON.stringify(store, null, 2));
}

async function ensureSupabaseSeed() {
  const supabase = getSupabaseServerClient();
  if (!supabase) return false;

  const seedRows = Object.entries(seedChannels).map(([agentId, channel]) => ({
    agent_id: agentId,
    summary: channel.summary,
  }));

  const { error: channelError } = await supabase
    .from("mission_control_channels")
    .upsert(seedRows, { onConflict: "agent_id", ignoreDuplicates: true });

  if (channelError) {
    console.error("[mission-control-chat] Supabase channel seed failed:", channelError.message);
    return false;
  }

  const messageRows = Object.entries(seedChannels).flatMap(([agentId, channel]) =>
    channel.messages.map((message) => ({
      id: message.id,
      agent_id: agentId,
      author: message.author,
      text: message.text,
      ts: message.ts,
      status: message.status || null,
      meta: message.meta || null,
    }))
  );

  const { error: messageError } = await supabase
    .from("mission_control_messages")
    .upsert(messageRows, { onConflict: "id", ignoreDuplicates: true });

  if (messageError) {
    console.error("[mission-control-chat] Supabase message seed failed:", messageError.message);
    return false;
  }

  return true;
}

async function getSupabaseChannel(agent: AgentId): Promise<ChannelRecord | null> {
  const supabase = getSupabaseServerClient();
  if (!supabase) return null;

  await ensureSupabaseSeed();

  const [{ data: channelRow, error: channelError }, { data: messageRows, error: messageError }] = await Promise.all([
    supabase.from("mission_control_channels").select("summary").eq("agent_id", agent).maybeSingle(),
    supabase
      .from("mission_control_messages")
      .select("id,author,text,ts,status,meta")
      .eq("agent_id", agent)
      .order("ts", { ascending: true }),
  ]);

  if (channelError || messageError) {
    console.error("[mission-control-chat] Supabase read failed:", channelError?.message || messageError?.message);
    return null;
  }

  return {
    summary: channelRow?.summary || seedChannels[agent].summary,
    messages: (messageRows || []) as ChatMessage[],
  };
}

async function appendManySupabase(agent: AgentId, messages: ChatMessage[]) {
  const supabase = getSupabaseServerClient();
  if (!supabase) return null;

  await ensureSupabaseSeed();

  const rows = messages.map((message) => ({
    id: message.id,
    agent_id: agent,
    author: message.author,
    text: message.text,
    ts: message.ts,
    status: message.status || null,
    meta: message.meta || null,
  }));

  const { error } = await supabase.from("mission_control_messages").insert(rows);
  if (error) {
    console.error("[mission-control-chat] Supabase append failed:", error.message);
    return null;
  }

  return getSupabaseChannel(agent);
}

export function normalizeAgentId(value: string | null | undefined): AgentId {
  if (value === "business-manager" || value === "data-agent" || value === "ghl-agent" || value === "marketing-agent") return value;
  return "main";
}

export async function appendMessage(agent: AgentId, message: ChatMessage) {
  return appendMany(agent, [message]);
}

export async function appendMany(agent: AgentId, messages: ChatMessage[]) {
  if (isSupabaseConfigured()) {
    const remote = await appendManySupabase(agent, messages);
    if (remote) return remote;
  }

  const store = await loadLocalChatStore();
  store[agent].messages.push(...messages);
  await saveLocalChatStore(store);
  return store[agent];
}

export async function getChannel(agent: AgentId) {
  if (isSupabaseConfigured()) {
    const remote = await getSupabaseChannel(agent);
    if (remote) return remote;
  }

  const store = await loadLocalChatStore();
  return store[agent] || store.main;
}

export async function runAgentTurn(agent: AgentId, message: string) {
  const args = ["agent", "--agent", agent, "--message", message, "--json", "--timeout", "600"];
  try {
    const { stdout, stderr } = await execFileAsync("openclaw", args, {
      cwd: process.cwd(),
      timeout: 610_000,
      maxBuffer: 10 * 1024 * 1024,
    });

    const parsed = safeParseJson(stdout);
    const replyText = extractReplyText(parsed, stdout, stderr);

    return {
      ok: true,
      stdout,
      stderr,
      parsed,
      replyText,
    };
  } catch (error) {
    const err = error as { stdout?: string; stderr?: string; message?: string };
    return {
      ok: false,
      stdout: err.stdout || "",
      stderr: err.stderr || "",
      parsed: safeParseJson(err.stdout || ""),
      replyText: extractReplyText(safeParseJson(err.stdout || ""), err.stdout || "", err.stderr || err.message || "Agent run failed."),
      error: err.message || "Agent run failed.",
    };
  }
}

function safeParseJson(value: string) {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function extractReplyText(parsed: any, stdout: string, fallback: string) {
  if (typeof parsed?.reply === "string" && parsed.reply.trim()) return parsed.reply.trim();
  if (typeof parsed?.text === "string" && parsed.text.trim()) return parsed.text.trim();
  if (typeof parsed?.message === "string" && parsed.message.trim()) return parsed.message.trim();

  if (Array.isArray(parsed?.result?.payloads)) {
    const payloadText = parsed.result.payloads.find((item: any) => typeof item?.text === "string" && item.text.trim())?.text;
    if (payloadText) return payloadText.trim();
  }

  if (Array.isArray(parsed?.payloads)) {
    const payloadText = parsed.payloads.find((item: any) => typeof item?.text === "string" && item.text.trim())?.text;
    if (payloadText) return payloadText.trim();
  }

  if (Array.isArray(parsed?.messages)) {
    const lastText = [...parsed.messages].reverse().find((item: any) => typeof item?.text === "string" && item.text.trim());
    if (lastText?.text) return lastText.text.trim();
  }

  const trimmed = stdout.trim();
  if (trimmed && !trimmed.startsWith("{")) return trimmed;
  return fallback.trim() || "No reply text returned.";
}

export function newMessageId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
}
