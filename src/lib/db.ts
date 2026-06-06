import { PrismaClient } from "@prisma/client";

/**
 * Singleton Prisma client instance.
 *
 * In development, Next.js hot-reload would create a new PrismaClient on every
 * module re-evaluation, quickly exhausting the database connection pool.
 * We store the instance on the global object to survive hot-reloads.
 *
 * In production, module scope is sufficient — the singleton is created once.
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}
