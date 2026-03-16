import { cookies } from "next/headers";

export const MISSION_CONTROL_PASSCODE_COOKIE = "mission_control_passcode_ok";

export function getMissionControlPasscode() {
  return process.env.MISSION_CONTROL_PASSCODE || "";
}

export function isPasscodeModeEnabled() {
  return Boolean(getMissionControlPasscode());
}

export async function hasValidPasscodeCookie() {
  const cookieStore = await cookies();
  return cookieStore.get(MISSION_CONTROL_PASSCODE_COOKIE)?.value === "1";
}
