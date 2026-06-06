import { PrismaClient } from "@prisma/client";

/**
 * Prisma client singleton.
 *
 * Production: stored at module scope — evaluated once per process lifetime.
 *
 * Development: NOT cached on globalThis. Turbopack hot-reloads re-evaluate
 * this module on each change, which creates a fresh PrismaClient that picks
 * up any schema changes from `prisma generate`. Caching the old client on
 * globalThis would prevent the new model delegates (e.g. alertConfig) from
 * ever being available until a full server restart.
 * SQLite has no meaningful connection-pool limit, so fresh clients per
 * hot-reload are safe. Postgres dev setups should restart the server after
 * a migration regardless.
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db =
  process.env.NODE_ENV === "production"
    ? (globalForPrisma.prisma ??
        (globalForPrisma.prisma = new PrismaClient({ log: ["error"] })))
    : new PrismaClient({ log: ["query", "error", "warn"] });
