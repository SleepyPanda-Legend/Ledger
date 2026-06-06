import { auth } from "@/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import RoutingDashboard from "@/components/features/routing/RoutingDashboard";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Smart Routing" };

/**
 * Smart Routing page — server component.
 * Fetches transaction history so the decision log is populated on first render.
 * Route comparison panel runs entirely client-side via mock service.
 */
export default async function RoutingPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const membership = await db.organizationMember.findFirst({
    where: { userId: session.user.id },
    include: {
      organization: {
        include: {
          transactions: { orderBy: { createdAt: "desc" } },
        },
      },
    },
  });

  if (!membership) redirect("/dashboard/onboarding");

  const transactions = membership.organization.transactions.map((tx) => ({
    id: tx.id,
    toAddress: tx.toAddress,
    asset: tx.asset,
    amount: tx.amount,
    network: tx.network,
    fee: tx.fee,
    status: tx.status,
    routeId: tx.routeId,
    createdAt: tx.createdAt,
  }));

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Smart Routing
        </h1>
        <p className="mt-1 text-sm text-muted">
          Compare routing paths and inspect every automated routing decision.
        </p>
      </div>

      <RoutingDashboard transactions={transactions} />
    </div>
  );
}
