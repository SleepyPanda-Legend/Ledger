import { TrendingUp, TrendingDown, Minus, Brain } from "lucide-react";
import type { FxRate, Recommendation } from "@/lib/utils/fx-mock";

interface AiRecommendationCardProps {
  rates: FxRate[];
}

const RECOMMENDATION_CONFIG: Record<
  Recommendation,
  {
    label: string;
    description: string;
    icon: typeof TrendingUp;
    className: string;
    iconClass: string;
  }
> = {
  convert: {
    label: "Good time to convert",
    description: "Market conditions are favourable",
    icon: TrendingUp,
    className:
      "border-green-200 bg-green-50 dark:border-green-800/40 dark:bg-green-950/30",
    iconClass: "text-success",
  },
  hold: {
    label: "Hold — high volatility window",
    description: "Wait for volatility to normalise",
    icon: TrendingDown,
    className:
      "border-red-200 bg-red-50 dark:border-red-800/40 dark:bg-red-950/30",
    iconClass: "text-danger",
  },
  monitor: {
    label: "Monitor closely",
    description: "Moderate risk — timing matters",
    icon: Minus,
    className:
      "border-amber-200 bg-amber-50 dark:border-amber-800/40 dark:bg-amber-950/30",
    iconClass: "text-warning",
  },
};

/**
 * AI Recommendation card — surfaces the engine's signal per FX pair.
 * Signals are mocked at MVP; real ML model ships post-MVP.
 * Layout: 3 recommendation rows stacked in a single card.
 */
export default function AiRecommendationCard({
  rates,
}: AiRecommendationCardProps) {
  return (
    <div className="rounded-xl border border-border bg-white shadow-sm dark:bg-neutral-900 dark:border-white/5">
      {/* Card header */}
      <div className="flex items-center gap-2.5 border-b border-border px-5 py-4 dark:border-white/5">
        <Brain size={15} className="text-accent" />
        <span className="text-sm font-semibold text-foreground">
          AI Signal Engine
        </span>
        <span className="ml-auto rounded-full bg-accent/10 px-2 py-0.5 text-xs font-medium text-accent">
          Mock · MVP
        </span>
      </div>

      {/* One row per pair */}
      <div className="divide-y divide-border dark:divide-white/5">
        {rates.map((r) => {
          const config = RECOMMENDATION_CONFIG[r.recommendation];
          const Icon = config.icon;
          return (
            <div key={r.pair} className="flex items-start gap-4 px-5 py-4">
              {/* Signal icon */}
              <div
                className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border ${config.className}`}
              >
                <Icon size={14} className={config.iconClass} />
              </div>

              {/* Text content */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted">
                    {r.pair}
                  </p>
                </div>
                <p className="mt-0.5 text-sm font-medium text-foreground">
                  {config.label}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-muted">
                  {r.recommendationReason}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
