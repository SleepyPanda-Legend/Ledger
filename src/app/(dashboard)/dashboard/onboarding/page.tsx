import { auth } from "@/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import OnboardingWizard from "@/components/features/onboarding/OnboardingWizard";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Set up your workspace" };

/**
 * Onboarding page — fetches the user's organization and API key server-side,
 * then passes them to the client wizard component.
 * Redirects to /dashboard if the user has no org (edge case guard).
 */
export default async function OnboardingPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const membership = await db.organizationMember.findFirst({
    where: { userId: session.user.id },
    include: { organization: true },
  });

  if (!membership) redirect("/dashboard");

  const { organization } = membership;

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f9f9f9] px-6 py-16">
      <div className="w-full max-w-lg">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            Set up your workspace
          </h1>
          <p className="mt-2 text-sm text-muted">
            Takes less than two minutes.
          </p>
        </div>
        <OnboardingWizard
          apiKey={organization.apiKey}
          orgName={organization.name}
        />
      </div>
    </div>
  );
}
