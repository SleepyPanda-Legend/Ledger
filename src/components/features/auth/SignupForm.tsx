"use client";

import { useActionState } from "react";
import Link from "next/link";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { signupAction } from "@/lib/actions/auth";

/**
 * Signup form — collects name, organization name, email, and password.
 * On success, the server action creates the user + org and redirects to onboarding.
 */
export default function SignupForm() {
  const [error, action, isPending] = useActionState(signupAction, null);

  return (
    <div className="w-full max-w-sm">
      <div className="rounded-2xl border border-border bg-white p-8 shadow-sm">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Create account
          </h1>
          <p className="mt-1.5 text-sm text-muted">
            Launch your stablecoin product in minutes.
          </p>
        </div>

        <form action={action} className="flex flex-col gap-4">
          <Input
            label="Your name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Jane Smith"
            required
          />
          <Input
            label="Organization name"
            name="orgName"
            type="text"
            autoComplete="organization"
            placeholder="Acme Bank"
            hint="This becomes your workspace name."
            required
          />
          <Input
            label="Work email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="jane@acmebank.com"
            required
          />
          <Input
            label="Password"
            name="password"
            type="password"
            autoComplete="new-password"
            placeholder="Min. 8 characters"
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
            className="mt-2 w-full rounded-xl"
          >
            Create account
          </Button>
        </form>
      </div>

      <p className="mt-6 text-center text-sm text-muted">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-foreground underline-offset-4 hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
