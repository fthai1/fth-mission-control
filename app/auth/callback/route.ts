import { NextResponse } from "next/server";
import { getSupabaseServerAuthClient } from "@/lib/supabase-server";
import { isAllowedEmail } from "@/lib/auth";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const tokenHash = url.searchParams.get("token_hash");
  const type = url.searchParams.get("type");
  const next = url.searchParams.get("next") || "/";
  const supabase = await getSupabaseServerAuthClient();

  if (!supabase) {
    return NextResponse.redirect(new URL("/login?error=auth_not_configured", url.origin));
  }

  let authError: string | null = null;

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) authError = error.message;
  } else if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type: type as any,
    });
    if (error) authError = error.message;
  } else {
    return NextResponse.redirect(new URL("/login?error=missing_code", url.origin));
  }

  if (authError) {
    const normalized = authError.includes("code verifier") ? "pkce_verifier_missing" : authError;
    return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(normalized)}`, url.origin));
  }

  const { data } = await supabase.auth.getUser();
  const email = data.user?.email || null;

  if (!isAllowedEmail(email)) {
    await supabase.auth.signOut();
    return NextResponse.redirect(new URL("/login?error=not_allowed", url.origin));
  }

  return NextResponse.redirect(new URL(next, url.origin));
}
