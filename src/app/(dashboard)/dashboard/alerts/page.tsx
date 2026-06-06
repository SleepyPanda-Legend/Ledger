import { auth } from "@/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import AlertConfigCard from "@/components/features/alerts/AlertConfigCard";
import AlertHistory from "@/components/features/alerts/AlertHistory";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Alerts" };

/** Default alert config rows to seed for a new org (idempotent via upsert). */
const DEFAULT_CONFIGS = [
  { type: "rate_threshold", asset: "USDC/EUR", threshold: 0.91, enabled: true },
  { type: "rate_threshold", asset: "USDC/GBP", threshold: 0.77, enabled: true },
  { type: "rate_threshold", asset: "USDC/USD", threshold: 0.999, enabled: false },
  { type: "volatility_spike", asset: "USDC/EUR", threshold: null, enabled: true },
  { type: "volatility_spike", asset: "USDC/GBP", threshold: null, enabled: true },
  { type: "volatility_spike", asset: "USDC/USD", threshold: null, enabled: false },
];

/**
 * Alerts page — server component.
 * Seeds default alert configs on first visit so the configuration panel is never empty.
 * Fetches alerts and configs in parallel.
 */
export default async function AlertsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const membership = await db.organizationMember.findFirst({
    where: { userId: session.user.id },
    include: { organization: true },
  });
  if (!membership) redirect("/dashboard/onboarding");

  const orgId = membership.organizationId;

  // Seed default configs on first visit (upsert = safe to call every time)
  const existingCount = await db.alertConfig.count({ where: { organizationId: orgId } });
  if (existingCount === 0) {
    await db.alertConfig.createMany({
      data: DEFAULT_CONFIGS.map((c) => ({ ...c, organizationId: orgId })),
    });
  }

  // Fetch alerts + configs in parallel
  const [alerts, configs] = await Promise.all([
    db.alert.findMany({
      where: { organizationId: orgId },
      orderBy: { createdAt: "desc" },
    }),
    db.alertConfig.findMany({
      where: { organizationId: orgId },
      orderBy: [{ asset: "asc" }, { type: "asc" }],
    }),
  ]);

  // Group configs: rate_threshold first, then volatility_spike
  const rateConfigs = configs.filter((c) => c.type === "rate_threshold");
  const spikeConfigs = configs.filter((c) => c.type === "volatility_spike");

  return (
    <div className="flex flex-col gap-8">
      {/* Page title */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Alerts
        </h1>
        <p className="mt-1 text-sm text-muted">
          Configure rate and volatility thresholds. Receive in-app notifications
          when they are crossed.
        </p>
      </div>

      {/* Alert configuration */}
      <section className="flex flex-col gap-4">
        <div>
          <h2 className="text-base font-semibold text-foreground">
            Rate threshold alerts
          </h2>
          <p className="mt-0.5 text-xs text-muted">
            Get notified when an exchange rate drops below your set level.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rateConfigs.map((c) => (
            <AlertConfigCard key={c.id} config={c} />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <div>
          <h2 className="text-base font-semibold text-foreground">
            Volatility spike alerts
          </h2>
          <p className="mt-0.5 text-xs text-muted">
            Get notified when a pair's volatility is classified as High.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {spikeConfigs.map((c) => (
            <AlertConfigCard key={c.id} config={c} />
          ))}
        </div>
      </section>

      {/* Alert history */}
      <section className="flex flex-col gap-3">
        <div>
          <h2 className="text-base font-semibold text-foreground">History</h2>
          <p className="mt-0.5 text-xs text-muted">
            All fired alerts — mark as read or dismiss individually.
          </p>
        </div>
        <AlertHistory alerts={alerts} />
      </section>
    </div>
  );
}
