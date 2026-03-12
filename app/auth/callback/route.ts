import { NextResponse } from "next/server";
import { getSupabaseServerAuthClient } from "@/lib/supabase-server";
import { isAllowedEmail } from "@/lib/auth";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") || "/";
  const supabase = await getSupabaseServerAuthClient();

  if (!supabase || !code) {
    return NextResponse.redirect(new URL("/login?error=missing_code", url.origin));
  }

  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(error.message)}`, url.origin));
  }

  const { data } = await supabase.auth.getUser();
  const email = data.user?.email || null;

  if (!isAllowedEmail(email)) {
    await supabase.auth.signOut();
    return NextResponse.redirect(new URL("/login?error=not_allowed", url.origin));
  }

  return NextResponse.redirect(new URL(next, url.origin));
}
