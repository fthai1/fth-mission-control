"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";

export default function LoginClient() {
  const searchParams = useSearchParams();
  const next = useMemo(() => searchParams.get("next") || "/", [searchParams]);
  const authError = searchParams.get("error");

  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24, background: "var(--background)" }}>
      <section style={{ width: "100%", maxWidth: 460, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 18, padding: 24, display: "grid", gap: 18 }}>
        <div>
          <div style={{ fontSize: 13, textTransform: "uppercase", color: "var(--text-muted)", fontWeight: 700 }}>Private operator access</div>
          <h1 style={{ margin: "8px 0 0", fontSize: 28 }}>Mission Control passcode</h1>
          <p style={{ margin: "10px 0 0", color: "var(--text-muted)", lineHeight: 1.5 }}>
            Enter the private Fast Track Homes passcode to open Mission Control. This replaces the old magic-link flow for faster private access.
          </p>
        </div>

        <form action="/api/passcode-login" method="post" style={{ display: "grid", gap: 12 }}>
          <input type="hidden" name="next" value={next} />
          <label style={{ display: "grid", gap: 8 }}>
            <span style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase" }}>Passcode</span>
            <input
              type="password"
              name="passcode"
              required
              autoFocus
              placeholder="Enter Mission Control passcode"
              style={{ width: "100%", background: "var(--background)", color: "var(--text)", border: "1px solid var(--border)", borderRadius: 12, padding: "12px 14px", fontFamily: "inherit", fontSize: 14 }}
            />
          </label>

          <button
            type="submit"
            style={{ background: "var(--accent)", color: "white", border: "1px solid var(--accent)", borderRadius: 12, padding: "12px 14px", fontWeight: 700, cursor: "pointer" }}
          >
            Unlock Mission Control
          </button>
        </form>

        <div style={{ fontSize: 13, color: authError ? "#fca5a5" : "var(--text-muted)", minHeight: 20 }}>
          {formatLoginMessage(authError)}
        </div>
      </section>
    </main>
  );
}

function formatLoginMessage(error: string | null) {
  if (error === "invalid_passcode") return "That passcode is incorrect.";
  if (error === "passcode_not_configured") return "Mission Control passcode is not configured yet.";
  if (error === "invalid_request") return "Login request was invalid. Try again.";
  return "Private passcode access only.";
}
