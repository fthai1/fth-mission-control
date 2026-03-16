import { NextResponse, type NextRequest } from "next/server";
import { MISSION_CONTROL_PASSCODE_COOKIE, getMissionControlPasscode } from "@/lib/mission-control-passcode";

const PUBLIC_PATH_PREFIXES = ["/login", "/auth/logout", "/api/passcode-login", "/_next", "/favicon.ico"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (PUBLIC_PATH_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))) {
    return NextResponse.next({ request });
  }

  const configuredPasscode = getMissionControlPasscode();
  if (!configuredPasscode) {
    const url = new URL("/login", request.url);
    url.searchParams.set("error", "passcode_not_configured");
    return NextResponse.redirect(url);
  }

  const hasAccess = request.cookies.get(MISSION_CONTROL_PASSCODE_COOKIE)?.value === "1";
  if (!hasAccess) {
    const url = new URL("/login", request.url);
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next({ request });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
