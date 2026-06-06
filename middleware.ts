import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";

/**
 * Route protection middleware.
 *
 * Uses only the Edge-compatible `authConfig` (no Prisma, no bcryptjs) to keep
 * the Edge Function bundle well under Vercel's 1 MB limit. Authentication
 * logic (redirect on unauthenticated dashboard access) lives in the
 * `authorized` callback inside `authConfig`.
 *
 * The matcher deliberately excludes static assets and the Next.js build output
 * to avoid running the middleware on every resource request.
 */
export const { auth: middleware } = NextAuth(authConfig);

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
