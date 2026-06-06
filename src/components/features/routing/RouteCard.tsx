import { DollarSign, Zap, TrendingUp, CheckCircle } from "lucide-react";
import type { RouteOption } from "@/services/stablecoin";

interface RouteCardProps {
  route: RouteOption;
  /** Whether this route is the auto-selected best option */
  selected: boolean;
  /** Rank label shown in top-left (1st, 2nd, 3rd) */
  rank: number;
}

const TAG_CONFIG: Record<
  string,
  { label: string; icon: typeof DollarSign; className: string }
> = {
  cheapest: {
    label: "Lowest fee",
    icon: DollarSign,
    className:
      "bg-green-50 text-green-700 border-green-200 dark:bg-green-950/40 dark:text-green-400 dark:border-green-800/40",
  },
  fastest: {
    label: "Fastest",
    icon: Zap,
    className:
      "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800/40",
  },
  best_rate: {
    label: "Best rate",
    icon: TrendingUp,
    className:
      "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-400 dark:border-purple-800/40",
  },
};

const NETWORK_META: Record<string, { label: string; color: string }> = {
  ethereum: { label: "Ethereum", color: "bg-indigo-500" },
  polygon: { label: "Polygon", color: "bg-purple-500" },
  solana: { label: "Solana", color: "bg-green-500" },
};

/**
 * Single routing path card.
 * Selected (auto-best) routes get a ring highlight and a checkmark.
 * Numeric columns are right-aligned for scanability.
 */
export default function RouteCard({ route, selected, rank }: RouteCardProps) {
  const tag = route.tag ? TAG_CONFIG[route.tag] : null;
  const TagIcon = tag?.icon;
  const net = NETWORK_META[route.network] ?? {
    label: route.network,
    color: "bg-gray-400",
  };

  return (
    <div
      className={[
        "relative flex flex-col gap-4 rounded-xl border p-5 shadow-sm transition-shadow",
        selected
          ? "border-accent bg-white ring-2 ring-accent/20 dark:bg-neutral-900"
          : "border-border bg-white dark:bg-neutral-900 dark:border-white/5",
      ].join(" ")}
    >
      {/* Rank + auto-selected check */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted">
          Route {rank}
        </span>
        {selected && (
          <span className="flex items-center gap-1 text-xs font-medium text-accent">
            <CheckCircle size={12} />
            Auto-selected
          </span>
        )}
      </div>

      {/* Network pill */}
      <div className="flex items-center gap-2">
        <span className={`h-2 w-2 rounded-full ${net.color}`} />
        <span className="text-sm font-semibold text-foreground capitalize">
          {net.label}
        </span>
        {tag && TagIcon && (
          <span
            className={`ml-auto inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${tag.className}`}
          >
            <TagIcon size={10} />
            {tag.label}
          </span>
        )}
      </div>

      {/* Metrics grid */}
      <div className="grid grid-cols-3 gap-3 rounded-lg border border-border bg-[#f9f9f9] p-3 dark:bg-neutral-800/50 dark:border-white/5">
        <div className="flex flex-col gap-0.5">
          <p className="text-xs text-muted">Fee</p>
          <p className="text-sm font-semibold tabular-nums text-foreground">
            ${route.fee < 0.01 ? route.fee.toFixed(4) : route.fee.toFixed(2)}
          </p>
        </div>
        <div className="flex flex-col gap-0.5 text-center">
          <p className="text-xs text-muted">Speed</p>
          <p className="text-sm font-semibold tabular-nums text-foreground">
            ~{route.estimatedSeconds < 60
              ? `${route.estimatedSeconds}s`
              : `${Math.round(route.estimatedSeconds / 60)}m`}
          </p>
        </div>
        <div className="flex flex-col gap-0.5 text-right">
          <p className="text-xs text-muted">Rate</p>
          <p className="text-sm font-semibold tabular-nums text-foreground">
            {route.rate.toFixed(4)}
          </p>
        </div>
      </div>
    </div>
  );
}
