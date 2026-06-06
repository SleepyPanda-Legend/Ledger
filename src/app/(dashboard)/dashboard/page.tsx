import { auth } from "@/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { APP_NAME } from "@/lib/constants";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Overview" };

/**
 * Dashboard overview — entry point after login.
 * Placeholder stat cards for now; real data wired in Epic 9 (Analytics Hub).
 * Users without an org are routed to onboarding.
 */
export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const membership = await db.organizationMember.findFirst({
    where: { userId: session.user.id },
    include: { organization: { include: { transactions: true } } },
  });

  if (!membership) redirect("/dashboard/onboarding");

  const { organization } = membership;
  const txCount = organization.transactions.length;
  const totalVolume = organization.transactions.reduce((s, t) => s + t.amount, 0);

  const stats = [
    { label: "Total volume", value: `$${totalVolume.toLocaleString("en-US", { minimumFractionDigits: 2 })}`, sub: "USDC equivalent" },
    { label: "Transactions", value: txCount.toLocaleString(), sub: "All time" },
    { label: "Active assets", value: "1", sub: "USDC" },
    { label: "Environment", value: "Sandbox", sub: "Switch in settings" },
  ];

  return (
    <div className="flex flex-col gap-8">
      {/* Page title */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Overview
        </h1>
        <p className="mt-1 text-sm text-muted">
          Welcome to {APP_NAME}, {organization.name}.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, value, sub }) => (
          <div
            key={label}
            className="rounded-xl border border-border bg-white p-5 shadow-sm"
          >
            <p className="text-xs font-medium text-muted uppercase tracking-widest">
              {label}
            </p>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
              {value}
            </p>
            <p className="mt-1 text-xs text-subtle">{sub}</p>
          </div>
        ))}
      </div>

      {/* Empty state — transactions table populated in Epic 4 */}
      <div className="rounded-xl border border-border bg-white p-10 text-center shadow-sm">
        <p className="text-sm font-medium text-foreground">No transactions yet</p>
        <p className="mt-1.5 text-sm text-muted">
          Transactions will appear here once you start sending or receiving stablecoins.
        </p>
      </div>
    </div>
  );
}
