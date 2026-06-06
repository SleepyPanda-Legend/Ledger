import { auth } from "@/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import AnalyticsDashboard from "@/components/features/analytics/AnalyticsDashboard";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Analytics" };

/**
 * Analytics Hub page — server component.
 * Fetches all org transactions and passes them to the client dashboard.
 * All date filtering, grouping, and aggregation runs client-side.
 */
export default async function AnalyticsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const membership = await db.organizationMember.findFirst({
    where: { userId: session.user.id },
    include: {
      organization: {
        include: {
          transactions: { orderBy: { createdAt: "asc" } },
        },
      },
    },
  });

  if (!membership) redirect("/dashboard/onboarding");

  const transactions = membership.organization.transactions.map((tx) => ({
    id: tx.id,
    asset: tx.asset,
    amount: tx.amount,
    fee: tx.fee,
    network: tx.network,
    status: tx.status,
    toAddress: tx.toAddress,
    fromAddress: tx.fromAddress,
    createdAt: tx.createdAt,
  }));

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Analytics
        </h1>
        <p className="mt-1 text-sm text-muted">
          Volume, asset mix, and corridor performance across your transactions.
        </p>
      </div>

      <AnalyticsDashboard transactions={transactions} />
    </div>
  );
}
