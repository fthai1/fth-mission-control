import fs from "node:fs";
import path from "node:path";
import { getSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase";

export type TaskRecord = {
  id: number;
  title: string;
  tag: string;
  priority: string;
  assignee: string;
  status: string;
  notes?: string;
  date?: string;
};

export type TaskPayload = {
  tasks: TaskRecord[];
  lastUpdated: string;
};

function localTasksPath() {
  return path.join(process.cwd(), "app/api/tasks.json");
}

function loadLocalTasks(): TaskPayload {
  const fileContent = fs.readFileSync(localTasksPath(), "utf8");
  return JSON.parse(fileContent) as TaskPayload;
}

async function loadSupabaseTasks(): Promise<TaskPayload | null> {
  const supabase = getSupabaseServerClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("mission_control_tasks")
    .select("id,title,tag,priority,assignee,status,notes,date")
    .order("id", { ascending: true });

  if (error) {
    console.error("[tasks-store] Supabase read failed:", error.message);
    return null;
  }

  return {
    tasks: (data || []) as TaskRecord[],
    lastUpdated: new Date().toISOString(),
  };
}

export async function getTasksPayload(): Promise<TaskPayload> {
  if (isSupabaseConfigured()) {
    const remote = await loadSupabaseTasks();
    if (remote) return remote;
  }
  return loadLocalTasks();
}
