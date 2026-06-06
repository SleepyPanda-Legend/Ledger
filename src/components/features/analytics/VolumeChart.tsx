import type { ChartPoint, Granularity } from "@/lib/utils/analytics";

interface VolumeChartProps {
  points: ChartPoint[];
  granularity: Granularity;
  onGranularityChange: (g: Granularity) => void;
}

const GRANULARITY_LABELS: Record<Granularity, string> = {
  daily: "Daily",
  weekly: "Weekly",
  monthly: "Monthly",
};

const SVG_W = 600;
const SVG_H = 160;
const PAD_L = 48;
const PAD_R = 8;
const PAD_T = 12;
const PAD_B = 28;

/**
 * SVG bar chart for transaction volume.
 * No chart library — keeps the bundle lean.
 * Bars are accent-colored; tooltip-style value shown above hovered bar via <title>.
 */
export default function VolumeChart({
  points,
  granularity,
  onGranularityChange,
}: VolumeChartProps) {
  const maxVol = Math.max(...points.map((p) => p.volume), 1);
  const plotW = SVG_W - PAD_L - PAD_R;
  const plotH = SVG_H - PAD_T - PAD_B;
  const barCount = points.length;
  const gap = 4;
  const barW = barCount > 0 ? Math.max(4, plotW / barCount - gap) : 8;

  // Y-axis tick values (0, 50%, 100%)
  const yTicks = [0, maxVol * 0.5, maxVol];

  const isEmpty = points.every((p) => p.volume === 0);

  return (
    <div className="rounded-xl border border-border bg-white shadow-sm dark:bg-neutral-900 dark:border-white/5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-5 py-4 dark:border-white/5">
        <p className="text-sm font-semibold text-foreground">
          Transaction volume
        </p>
        {/* Granularity toggle */}
        <div className="flex gap-1">
          {(["daily", "weekly", "monthly"] as Granularity[]).map((g) => (
            <button
              key={g}
              onClick={() => onGranularityChange(g)}
              className={[
                "rounded-md px-3 py-1 text-xs font-medium transition-colors duration-150",
                granularity === g
                  ? "bg-foreground text-background"
                  : "text-muted hover:text-foreground",
              ].join(" ")}
            >
              {GRANULARITY_LABELS[g]}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="px-5 py-4">
        {isEmpty ? (
          <div
            className="flex items-center justify-center"
            style={{ height: SVG_H }}
          >
            <p className="text-sm text-muted">
              No settled transactions in this period.
            </p>
          </div>
        ) : (
          <svg
            viewBox={`0 0 ${SVG_W} ${SVG_H}`}
            className="w-full"
            style={{ height: SVG_H }}
            aria-label="Transaction volume bar chart"
          >
            {/* Y-axis gridlines + labels */}
            {yTicks.map((tick, i) => {
              const y = PAD_T + plotH - (tick / maxVol) * plotH;
              return (
                <g key={i}>
                  <line
                    x1={PAD_L}
                    y1={y}
                    x2={SVG_W - PAD_R}
                    y2={y}
                    stroke="var(--border)"
                    strokeWidth="1"
                    strokeDasharray={tick === 0 ? "0" : "3 3"}
                  />
                  <text
                    x={PAD_L - 6}
                    y={y + 4}
                    textAnchor="end"
                    fontSize="10"
                    fill="var(--fg-subtle)"
                  >
                    {tick === 0
                      ? "0"
                      : tick >= 1000
                        ? `${(tick / 1000).toFixed(0)}k`
                        : tick.toFixed(0)}
                  </text>
                </g>
              );
            })}

            {/* Bars */}
            {points.map((p, i) => {
              const barH = Math.max(2, (p.volume / maxVol) * plotH);
              const x =
                PAD_L + i * (plotW / barCount) + (plotW / barCount - barW) / 2;
              const y = PAD_T + plotH - barH;

              return (
                <g key={p.label + i}>
                  <rect
                    x={x}
                    y={y}
                    width={barW}
                    height={barH}
                    rx="3"
                    fill="var(--accent)"
                    opacity="0.85"
                    className="transition-opacity hover:opacity-100"
                  >
                    <title>
                      {p.label}: $
                      {p.volume.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                      })}{" "}
                      ({p.count} tx)
                    </title>
                  </rect>

                  {/* X-axis label */}
                  <text
                    x={x + barW / 2}
                    y={SVG_H - 6}
                    textAnchor="middle"
                    fontSize="9"
                    fill="var(--fg-subtle)"
                  >
                    {p.label}
                  </text>
                </g>
              );
            })}
          </svg>
        )}
      </div>
    </div>
  );
}
