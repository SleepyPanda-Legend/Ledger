import { auth } from "@/auth";
import { NextResponse } from "next/server";

/**
 * Route protection middleware.
 *
 * All paths under /dashboard/* require an active session.
 * Unauthenticated requests are redirected to /login with a `callbackUrl`
 * so users land back where they intended after signing in.
 *
 * The matcher deliberately excludes static assets and API routes to avoid
 * unnecessary auth checks on every resource request.
 */
export default auth((req) => {
  const { nextUrl, auth: session } = req;
  const isLoggedIn = !!session;
  const isDashboard = nextUrl.pathname.startsWith("/dashboard");

  if (isDashboard && !isLoggedIn) {
    const loginUrl = new URL("/login", nextUrl.origin);
    loginUrl.searchParams.set("callbackUrl", nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - _next/static  (Next.js build output)
     * - _next/image   (image optimisation)
     * - favicon.ico
     * - public assets (svg, png, jpg, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
