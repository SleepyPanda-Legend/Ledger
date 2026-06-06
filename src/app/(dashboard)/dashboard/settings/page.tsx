import { auth } from "@/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import ApiKeyPanel from "@/components/features/settings/ApiKeyPanel";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Settings" };

/**
 * Organization settings page.
 * Displays org name, API key management, and member list.
 * Sensitive API key rendered in a dedicated client component for copy/reveal UX.
 */
export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const membership = await db.organizationMember.findFirst({
    where: { userId: session.user.id },
    include: {
      organization: {
        include: { members: { include: { user: true } } },
      },
    },
  });

  if (!membership) redirect("/dashboard/onboarding");

  const { organization } = membership;

  return (
    <div className="flex flex-col gap-8 max-w-2xl">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Settings</h1>
        <p className="mt-1 text-sm text-muted">Manage your organization and API credentials.</p>
      </div>

      {/* Org details */}
      <section className="rounded-xl border border-border bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-sm font-semibold text-foreground">Organization</h2>
        <div className="flex flex-col gap-1">
          <p className="text-xs font-medium text-muted uppercase tracking-widest">Name</p>
          <p className="text-sm font-medium text-foreground">{organization.name}</p>
        </div>
        <div className="mt-4 flex flex-col gap-1">
          <p className="text-xs font-medium text-muted uppercase tracking-widest">Slug</p>
          <p className="font-mono text-sm text-foreground">{organization.slug}</p>
        </div>
      </section>

      {/* API Key */}
      <ApiKeyPanel apiKey={organization.apiKey} />

      {/* Members */}
      <section className="rounded-xl border border-border bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-sm font-semibold text-foreground">Team members</h2>
        <div className="flex flex-col divide-y divide-border">
          {organization.members.map((m) => (
            <div key={m.id} className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-medium text-foreground">{m.user.name ?? m.user.email}</p>
                <p className="text-xs text-muted">{m.user.email}</p>
              </div>
              <span className="rounded-full border border-border px-3 py-0.5 text-xs font-medium capitalize text-muted">
                {m.role}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
