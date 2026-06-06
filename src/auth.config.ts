import type { NextAuthConfig } from "next-auth";

/**
 * Edge-compatible NextAuth configuration.
 *
 * This config intentionally excludes the Prisma adapter, bcryptjs, and any
 * Node.js-only imports so it can run safely inside the Vercel Edge Runtime
 * (< 1 MB bundle limit). The middleware imports only this file.
 *
 * The full auth config in `auth.ts` spreads this config and layers on the
 * Prisma adapter + Credentials provider for server-side usage.
 */
export const authConfig = {
  pages: {
    signIn: "/login",
    error: "/login",
  },
  /**
   * Providers are omitted here — they are only needed for sign-in flows
   * which happen in Node.js, not at the Edge.
   */
  providers: [],
  callbacks: {
    /**
     * Controls which requests are allowed through.
     * Dashboard routes require an authenticated session; all other paths
     * are publicly accessible.
     */
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isDashboard = nextUrl.pathname.startsWith("/dashboard");

      if (isDashboard && !isLoggedIn) {
        const loginUrl = new URL("/login", nextUrl.origin);
        loginUrl.searchParams.set("callbackUrl", nextUrl.pathname);
        return Response.redirect(loginUrl);
      }

      return true;
    },
  },
} satisfies NextAuthConfig;
