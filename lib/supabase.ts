import { createClient } from "@supabase/supabase-js";

function requireEnv(name: string) {
  const value = process.env[name];
  return value && value.trim() ? value : null;
}

export function getSupabaseServerClient() {
  const url = requireEnv("NEXT_PUBLIC_SUPABASE_URL");
  const key = requireEnv("SUPABASE_SERVICE_ROLE_KEY") || requireEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY");

  if (!url || !key) return null;

  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export function isSupabaseConfigured() {
  return Boolean(requireEnv("NEXT_PUBLIC_SUPABASE_URL") && (requireEnv("SUPABASE_SERVICE_ROLE_KEY") || requireEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY")));
}
