import { NextResponse } from "next/server";
import { getSupabaseServerAuthClient } from "@/lib/supabase-server";

export async function POST(request: Request) {
  const supabase = await getSupabaseServerAuthClient();
  if (supabase) await supabase.auth.signOut();
  return NextResponse.redirect(new URL("/login", request.url), 303);
}
