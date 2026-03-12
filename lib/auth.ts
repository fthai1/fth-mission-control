const DEFAULT_ALLOWED_EMAILS = ["erik@fasttrackbuys.com"];

function parseCsv(value: string | undefined) {
  return (value || "")
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
}

export function getAllowedEmails() {
  const configured = parseCsv(process.env.MISSION_CONTROL_ALLOWED_EMAILS);
  return Array.from(new Set([...(configured.length ? configured : DEFAULT_ALLOWED_EMAILS)]));
}

export function isAllowedEmail(email: string | null | undefined) {
  if (!email) return false;
  return getAllowedEmails().includes(email.trim().toLowerCase());
}

export function getAuthRedirectUrl() {
  return `${(process.env.MISSION_CONTROL_PUBLIC_URL || "http://localhost:3000").replace(/\/$/, "")}/auth/callback`;
}
