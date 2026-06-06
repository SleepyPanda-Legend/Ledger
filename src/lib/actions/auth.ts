"use server";

import { z } from "zod";
import { hash } from "bcryptjs";
import { db } from "@/lib/db";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";

const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  orgName: z.string().min(2, "Organization name must be at least 2 characters"),
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

/**
 * Creates a new user + organization in a single transaction.
 * The user becomes the organization owner, then is signed in automatically.
 * On success, Auth.js redirects to /dashboard/onboarding.
 *
 * Returns a string error message if validation or DB write fails.
 * Throws (via Auth.js redirect) on success — callers should not expect a return value on the happy path.
 */
export async function signupAction(
  _prevState: string | null,
  formData: FormData
): Promise<string | null> {
  const raw = {
    name: formData.get("name"),
    orgName: formData.get("orgName"),
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const parsed = signupSchema.safeParse(raw);
  if (!parsed.success) {
    return parsed.error.issues[0]?.message ?? "Invalid input.";
  }

  const { name, orgName, email, password } = parsed.data;

  // Check for existing account before doing any writes
  const existing = await db.user.findUnique({ where: { email } });
  if (existing) return "An account with this email already exists.";

  const passwordHash = await hash(password, 12);

  // Slug derived from org name — lowercase, hyphens, unique via cuid suffix
  const slug = orgName.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

  await db.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: { name, email, password: passwordHash },
    });

    const org = await tx.organization.create({
      data: { name: orgName, slug: `${slug}-${user.id.slice(-6)}` },
    });

    await tx.organizationMember.create({
      data: { userId: user.id, organizationId: org.id, role: "owner" },
    });
  });

  // Sign in and redirect — Auth.js throws NEXT_REDIRECT internally
  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/dashboard/onboarding",
    });
  } catch (err) {
    // Re-throw redirect errors (NEXT_REDIRECT must propagate to Next.js)
    if (err instanceof AuthError) return "Sign-in failed after account creation. Please log in.";
    throw err;
  }

  return null;
}

/**
 * Server action wrapper for credentials login.
 * Returns an error string on failure; throws NEXT_REDIRECT on success.
 */
export async function loginAction(
  _prevState: string | null,
  formData: FormData
): Promise<string | null> {
  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: "/dashboard",
    });
  } catch (err) {
    if (err instanceof AuthError) {
      return "Invalid email or password.";
    }
    throw err;
  }

  return null;
}
