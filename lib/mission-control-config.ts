const DEFAULT_ALLOWED_DEV_ORIGINS = [
  "postphlogistic-undetrimentally-sharan.ngrok-free.dev",
  "localhost:3000",
  "127.0.0.1:3000",
];

function normalizeOrigin(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return "";
  return trimmed.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

export function getAllowedDevOrigins() {
  const envValues = (process.env.MISSION_CONTROL_ALLOWED_DEV_ORIGINS || "")
    .split(",")
    .map(normalizeOrigin)
    .filter(Boolean);

  return Array.from(new Set([...DEFAULT_ALLOWED_DEV_ORIGINS, ...envValues]));
}

export function getMissionControlPublicUrl() {
  const raw =
    process.env.MISSION_CONTROL_PUBLIC_URL ||
    process.env.NEXT_PUBLIC_MISSION_CONTROL_URL ||
    "http://localhost:3000";

  return raw.replace(/\/$/, "");
}

export function getMissionControlMode() {
  return process.env.MISSION_CONTROL_RUNTIME_MODE || process.env.NODE_ENV || "development";
}
