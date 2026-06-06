"use client";

import { useActionState } from "react";
import Link from "next/link";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { loginAction } from "@/lib/actions/auth";

/**
 * Login form — client component so useActionState can wire the server action.
 * Error messages surface from the server; no client-side validation to avoid
 * state divergence between client and server.
 */
export default function LoginForm() {
  const [error, action, isPending] = useActionState(loginAction, null);

  return (
    <div className="w-full max-w-sm">
      {/* Card */}
      <div className="rounded-2xl border border-border bg-white p-8 shadow-sm">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Sign in
          </h1>
          <p className="mt-1.5 text-sm text-muted">
            Welcome back to Ledger.
          </p>
        </div>

        <form action={action} className="flex flex-col gap-5">
          <Input
            label="Email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            required
          />
          <Input
            label="Password"
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            required
          />

          {error && (
            <p className="rounded-lg bg-danger/8 px-4 py-3 text-sm text-danger" role="alert">
              {error}
            </p>
          )}

          <Button
            type="submit"
            variant="primary"
            size="md"
            loading={isPending}
            className="mt-1 w-full rounded-xl"
          >
            Sign in
          </Button>
        </form>
      </div>

      {/* Sign-up link */}
      <p className="mt-6 text-center text-sm text-muted">
        No account?{" "}
        <Link
          href="/signup"
          className="font-medium text-foreground underline-offset-4 hover:underline"
        >
          Create one
        </Link>
      </p>
    </div>
  );
}
