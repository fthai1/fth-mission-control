import { NextResponse } from "next/server";
import { getTasksPayload } from "@/lib/tasks-store";

export async function GET() {
  try {
    const data = await getTasksPayload();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to load tasks" }, { status: 500 });
  }
}
