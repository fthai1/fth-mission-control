"use client";

import { FormEvent, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";

export default function LoginClient() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [message, setMessage] = useState("");
  const next = useMemo(() => searchParams.get("next") || "/", [searchParams]);
  const authError = searchParams.get("error");

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setStatus("sending");
    setMessage("");

    try {
      const supabase = getSupabaseBrowserClient();
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
        },
      });

      if (error) throw error;
      setStatus("sent");
      setMessage("Magic link sent. Open it from your email on this device.");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Failed to send login link.");
    }
  };

  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24, background: "var(--background)" }}>
      <section style={{ width: "100%", maxWidth: 460, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 18, padding: 24, display: "grid", gap: 18 }}>
        <div>
          <div style={{ fontSize: 13, textTransform: "uppercase", color: "var(--text-muted)", fontWeight: 700 }}>Private operator access</div>
          <h1 style={{ margin: "8px 0 0", fontSize: 28 }}>Mission Control login</h1>
          <p style={{ margin: "10px 0 0", color: "var(--text-muted)", lineHeight: 1.5 }}>
            Mission Control is now private. Sign in with an approved Fast Track Homes operator email to continue.
          </p>
        </div>

        <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
          <label style={{ display: "grid", gap: 8 }}>
            <span style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase" }}>Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="erik@fasttrackbuys.com"
              style={{ width: "100%", background: "var(--background)", color: "var(--text)", border: "1px solid var(--border)", borderRadius: 12, padding: "12px 14px", fontFamily: "inherit", fontSize: 14 }}
            />
          </label>

          <button
            type="submit"
            disabled={!email || status === "sending"}
            style={{ background: "var(--accent)", color: "white", border: "1px solid var(--accent)", borderRadius: 12, padding: "12px 14px", fontWeight: 700, cursor: !email || status === "sending" ? "not-allowed" : "pointer", opacity: !email || status === "sending" ? 0.65 : 1 }}
          >
            {status === "sending" ? "Sending..." : "Send magic link"}
          </button>
        </form>

        <div style={{ fontSize: 13, color: status === "error" || authError ? "#fca5a5" : status === "sent" ? "#86efac" : "var(--text-muted)", minHeight: 20 }}>
          {message || formatLoginMessage(authError)}
        </div>
      </section>
    </main>
  );
}

function formatLoginMessage(error: string | null) {
  if (error === "not_allowed") return "That email is not on the approved operator allowlist.";
  if (error === "missing_code") return "Login link was incomplete. Request a fresh magic link.";
  if (error === "pkce_verifier_missing") return "This magic-link session expired or opened without its original login state. Request a fresh link and open it in the same browser/profile.";
  if (error === "over_email_send_rate_limit") return "Email rate limit exceeded. Wait a few minutes before requesting another magic link.";
  if (error === "auth_not_configured") return "Mission Control auth is not configured correctly.";
  if (error) return `Login error: ${error}`;
  return "Approved users only. Anonymous access is blocked.";
}
