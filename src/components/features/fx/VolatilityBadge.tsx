import type { Volatility } from "@/lib/utils/fx-mock";

interface VolatilityBadgeProps {
  volatility: Volatility;
}

const CONFIG: Record<
  Volatility,
  { label: string; className: string; dot: string }
> = {
  low: {
    label: "Low volatility",
    className:
      "bg-green-50 text-green-700 border border-green-200 dark:bg-green-950/40 dark:text-green-400 dark:border-green-800/50",
    dot: "bg-green-500",
  },
  medium: {
    label: "Medium volatility",
    className:
      "bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800/50",
    dot: "bg-amber-500",
  },
  high: {
    label: "High volatility",
    className:
      "bg-red-50 text-red-700 border border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-800/50",
    dot: "bg-red-500",
  },
};

/**
 * Volatility signal badge — low / medium / high.
 * Color semantics follow the Ledger design system: green = safe, amber = caution, red = risk.
 */
export default function VolatilityBadge({ volatility }: VolatilityBadgeProps) {
  const { label, className, dot } = CONFIG[volatility];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${className}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
      {label}
    </span>
  );
}
