import { z } from "zod";

/**
 * Server-side environment schema.
 * Validated at boot — if a required var is missing the app crashes immediately
 * with a clear error rather than a cryptic runtime failure later.
 *
 * NEVER import this in client components — it contains server-only secrets.
 */
const serverSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]),
  DATABASE_URL: z.string().min(1),
  AUTH_SECRET: z
    .string()
    .min(32, "AUTH_SECRET must be at least 32 characters"),
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),
});

/**
 * Client-safe environment schema.
 * Only NEXT_PUBLIC_ prefixed values belong here.
 */
const clientSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),
});

/**
 * Validates and returns typed server env vars.
 * Called once at module load — fails fast if config is invalid.
 */
function validateServerEnv() {
  const result = serverSchema.safeParse(process.env);

  if (!result.success) {
    const formatted = result.error.format();
    console.error("❌ Invalid environment variables:", JSON.stringify(formatted, null, 2));
    throw new Error("Invalid environment configuration. Check logs above.");
  }

  return result.data;
}

/**
 * Validates client-safe env vars.
 * Safe to call in both server and client contexts.
 */
function validateClientEnv() {
  const result = clientSchema.safeParse({
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  });

  if (!result.success) {
    console.error("❌ Invalid client environment variables:", result.error.format());
    throw new Error("Invalid client environment configuration.");
  }

  return result.data;
}

/** Typed, validated server environment — server components and API routes only */
export const serverEnv = validateServerEnv();

/** Typed, validated client environment — safe everywhere */
export const clientEnv = validateClientEnv();
