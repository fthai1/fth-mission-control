import { NextResponse } from "next/server";
import { MISSION_CONTROL_PASSCODE_COOKIE, getMissionControlPasscode } from "@/lib/mission-control-passcode";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const passcode = String(formData.get("passcode") || "");
    const next = String(formData.get("next") || "/");

    if (!getMissionControlPasscode()) {
      return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent("passcode_not_configured")}`, request.url));
    }

    if (passcode !== getMissionControlPasscode()) {
      return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent("invalid_passcode")}&next=${encodeURIComponent(next)}`, request.url));
    }

    const response = NextResponse.redirect(new URL(next.startsWith("/") ? next : "/", request.url));
    response.cookies.set({
      name: MISSION_CONTROL_PASSCODE_COOKIE,
      value: "1",
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      path: "/",
      maxAge: 60 * 60 * 12,
    });
    return response;
  } catch {
    return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent("invalid_request")}`, request.url));
  }
}
