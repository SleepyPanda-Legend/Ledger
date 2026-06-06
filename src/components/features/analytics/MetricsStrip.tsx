import { TrendingUp, ArrowUpRight, Wallet, DollarSign } from "lucide-react";
import type { SummaryMetrics } from "@/lib/utils/analytics";

interface MetricsStripProps {
  metrics: SummaryMetrics;
}

/**
 * Four-card summary metrics strip.
 * Numeric values are right-formatted per Ledger design standards.
 */
export default function MetricsStrip({ metrics }: MetricsStripProps) {
  const cards = [
    {
      label: "Total volume",
      value: `$${metrics.totalVolume.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      sub: "USDC equivalent",
      icon: TrendingUp,
      iconClass: "text-accent",
    },
    {
      label: "Transactions",
      value: metrics.txCount.toLocaleString(),
      sub: "Settled + confirmed",
      icon: ArrowUpRight,
      iconClass: "text-success",
    },
    {
      label: "Active wallets",
      value: metrics.activeWallets.toLocaleString(),
      sub: "Unique recipients",
      icon: Wallet,
      iconClass: "text-purple-500",
    },
    {
      label: "Avg. fee",
      value:
        metrics.avgFee < 0.01
          ? `$${metrics.avgFee.toFixed(4)}`
          : `$${metrics.avgFee.toFixed(2)}`,
      sub: "Per transaction",
      icon: DollarSign,
      iconClass: "text-warning",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map(({ label, value, sub, icon: Icon, iconClass }) => (
        <div
          key={label}
          className="rounded-xl border border-border bg-white p-5 shadow-sm dark:bg-neutral-900 dark:border-white/5"
        >
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium uppercase tracking-widest text-muted">
              {label}
            </p>
            <Icon size={14} className={iconClass} />
          </div>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-foreground tabular-nums">
            {value}
          </p>
          <p className="mt-1 text-xs text-subtle">{sub}</p>
        </div>
      ))}
    </div>
  );
}
