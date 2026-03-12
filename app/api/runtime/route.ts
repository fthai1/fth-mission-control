import { NextResponse } from "next/server";
import { getRuntimeSummary } from "@/lib/runtime";

export async function GET() {
  return NextResponse.json(getRuntimeSummary());
}
