import { NextResponse } from "next/server";
import { MISSION_CONTROL_PASSCODE_COOKIE } from "@/lib/mission-control-passcode";

export async function POST(request: Request) {
  const response = NextResponse.redirect(new URL("/login", request.url));
  response.cookies.set({
    name: MISSION_CONTROL_PASSCODE_COOKIE,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    path: "/",
    maxAge: 0,
  });
  return response;
}
