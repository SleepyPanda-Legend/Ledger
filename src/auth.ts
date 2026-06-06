import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import { db } from "@/lib/db";

/**
 * Zod schema for credentials login payload.
 * Validated before any DB call — prevents malformed inputs reaching Prisma.
 */
const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

/**
 * Auth.js v5 configuration.
 *
 * Uses JWT strategy so Credentials provider works correctly with the
 * Prisma adapter (database sessions require OAuth, not credentials).
 *
 * Exports:
 *  - handlers  → mounted at /api/auth/[...nextauth]
 *  - auth      → used as middleware and in Server Components
 *  - signIn / signOut → called from Server Actions
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = credentialsSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const { email, password } = parsed.data;

        const user = await db.user.findUnique({ where: { email } });
        if (!user || !user.password) return null;

        // Dynamic import keeps bcryptjs out of the edge runtime bundle
        const { compare } = await import("bcryptjs");
        const valid = await compare(password, user.password);
        if (!valid) return null;

        return { id: user.id, email: user.email, name: user.name };
      },
    }),
  ],
  callbacks: {
    /**
     * Attaches user ID to the JWT so it's available in sessions
     * without an extra DB round-trip per request.
     */
    jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    session({ session, token }) {
      if (token.id) session.user.id = token.id as string;
      return session;
    },
  },
});
