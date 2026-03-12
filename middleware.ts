import { NextResponse, type NextRequest } from "next/server";
import { isAllowedEmail } from "@/lib/auth";
import { updateSession } from "@/lib/supabase-middleware";

const PUBLIC_PATH_PREFIXES = ["/login", "/auth/callback", "/_next", "/favicon.ico"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  try {
    if (PUBLIC_PATH_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))) {
      const sessionResult = updateSession(request);
      if (sessionResult instanceof NextResponse) return sessionResult;
      return sessionResult.response;
    }

    const sessionResult = updateSession(request);
    if (sessionResult instanceof NextResponse) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    const { supabase, response } = sessionResult;
    const { data, error } = await supabase.auth.getUser();

    if (error) {
      console.error("[mission-control-auth] middleware getUser failed:", error.message);
      const url = new URL("/login", request.url);
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }

    const email = data.user?.email || null;

    if (!email || !isAllowedEmail(email)) {
      const url = new URL("/login", request.url);
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }

    return response;
  } catch (error) {
    console.error("[mission-control-auth] middleware failure:", error);

    if (PUBLIC_PATH_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))) {
      return NextResponse.next({ request });
    }

    const url = new URL("/login", request.url);
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
