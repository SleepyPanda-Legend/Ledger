import { auth } from "@/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import SdkDashboard from "@/components/features/sdk/SdkDashboard";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Stablecoin SDK" };

/**
 * Stablecoin SDK page — server component.
 * Fetches wallet state and transaction history, passes to the client dashboard.
 */
export default async function SdkPage() {
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

  const { organization } = membership;

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Stablecoin SDK
        </h1>
        <p className="mt-1 text-sm text-muted">
          Manage your custodial wallet, send transfers, and track transactions.
        </p>
      </div>

      <SdkDashboard
        walletAddress={organization.walletAddress}
        balance={organization.balance}
        transactions={organization.transactions}
      />
    </div>
  );
}
