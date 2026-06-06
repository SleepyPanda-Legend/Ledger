import type { FxRate } from "@/lib/utils/fx-mock";
import VolatilityBadge from "./VolatilityBadge";
import RateSparkline from "./RateSparkline";

interface RateCardProps {
  rate: FxRate;
}

/**
 * Displays a single FX pair rate with volatility signal and 7-day sparkline.
 * Positive delta shown in green, negative in red — consistent with fintech conventions.
 */
export default function RateCard({ rate }: RateCardProps) {
  const isUp = rate.change24h >= 0;
  const changeColor = isUp ? "text-success" : "text-danger";
  const changePrefix = isUp ? "▲" : "▼";

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border bg-white p-5 shadow-sm dark:bg-neutral-900 dark:border-white/5">
      {/* Header row */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-muted">
            {rate.pair}
          </p>
          <p className="mt-1.5 text-3xl font-semibold tracking-tight text-foreground tabular-nums">
            {rate.rate.toFixed(4)}
          </p>
        </div>

        {/* Sparkline aligned to the right */}
        <div className="mt-1">
          <RateSparkline data={rate.history} width={96} height={40} />
        </div>
      </div>

      {/* 24h change */}
      <div className="flex items-center gap-3">
        <span className={`text-sm font-medium tabular-nums ${changeColor}`}>
          {changePrefix} {Math.abs(rate.change24h).toFixed(3)}%
        </span>
        <span className="text-xs text-subtle">24h change</span>
      </div>

      {/* Volatility badge */}
      <VolatilityBadge volatility={rate.volatility} />
    </div>
  );
}
