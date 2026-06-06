import type { AssetSlice } from "@/lib/utils/analytics";

interface AssetDonutProps {
  slices: AssetSlice[];
}

const CX = 80;
const CY = 80;
const R = 60;
const INNER_R = 36;

/** Converts polar coordinates to cartesian for SVG arc commands. */
function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

/** Builds an SVG arc path for a donut segment. */
function arcPath(
  cx: number,
  cy: number,
  outerR: number,
  innerR: number,
  startDeg: number,
  endDeg: number,
): string {
  // Clamp to avoid full-circle degenerate case
  const sweep = Math.min(endDeg - startDeg, 359.99);
  const end = startDeg + sweep;
  const o1 = polarToCartesian(cx, cy, outerR, startDeg);
  const o2 = polarToCartesian(cx, cy, outerR, end);
  const i1 = polarToCartesian(cx, cy, innerR, end);
  const i2 = polarToCartesian(cx, cy, innerR, startDeg);
  const large = sweep > 180 ? 1 : 0;

  return [
    `M ${o1.x} ${o1.y}`,
    `A ${outerR} ${outerR} 0 ${large} 1 ${o2.x} ${o2.y}`,
    `L ${i1.x} ${i1.y}`,
    `A ${innerR} ${innerR} 0 ${large} 0 ${i2.x} ${i2.y}`,
    "Z",
  ].join(" ");
}

/**
 * SVG donut chart for asset volume breakdown.
 * Segments sized by percentage; center shows total volume.
 * Legend rendered beside the donut.
 */
export default function AssetDonut({ slices }: AssetDonutProps) {
  const totalVolume = slices.reduce((s, sl) => s + sl.volume, 0);
  const isEmpty = totalVolume === 0 || slices[0]?.asset === "No data";

  // Build arc segments
  let cursor = 0;
  const segments = slices.map((sl) => {
    const startDeg = cursor;
    const spanDeg = (sl.percentage / 100) * 360;
    cursor += spanDeg;
    return { ...sl, startDeg, endDeg: cursor };
  });

  return (
    <div className="rounded-xl border border-border bg-white shadow-sm dark:bg-neutral-900 dark:border-white/5">
      {/* Header */}
      <div className="border-b border-border px-5 py-4 dark:border-white/5">
        <p className="text-sm font-semibold text-foreground">Asset breakdown</p>
      </div>

      <div className="flex items-center gap-6 px-5 py-4">
        {/* Donut */}
        <div className="shrink-0">
          <svg
            viewBox="0 0 160 160"
            width={160}
            height={160}
            aria-label="Asset breakdown donut chart"
          >
            {isEmpty ? (
              <circle
                cx={CX}
                cy={CY}
                r={R}
                fill="none"
                stroke="var(--border)"
                strokeWidth={R - INNER_R}
              />
            ) : (
              segments.map((seg, i) => (
                <path
                  key={seg.asset + i}
                  d={arcPath(CX, CY, R, INNER_R, seg.startDeg, seg.endDeg)}
                  fill={seg.color}
                  opacity="0.9"
                  className="transition-opacity hover:opacity-100"
                >
                  <title>
                    {seg.asset}: {seg.percentage.toFixed(1)}%
                  </title>
                </path>
              ))
            )}

            {/* Center total */}
            <text
              x={CX}
              y={CY - 6}
              textAnchor="middle"
              fontSize="11"
              fill="var(--fg-muted)"
            >
              Total
            </text>
            <text
              x={CX}
              y={CY + 10}
              textAnchor="middle"
              fontSize="13"
              fontWeight="600"
              fill="var(--fg)"
            >
              {isEmpty
                ? "—"
                : totalVolume >= 1000
                  ? `${(totalVolume / 1000).toFixed(1)}k`
                  : totalVolume.toFixed(0)}
            </text>
          </svg>
        </div>

        {/* Legend */}
        <ul className="flex flex-col gap-2.5">
          {isEmpty ? (
            <li className="text-sm text-muted">No data in range</li>
          ) : (
            slices.map((sl) => (
              <li key={sl.asset} className="flex items-center gap-2.5">
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-sm"
                  style={{ backgroundColor: sl.color }}
                />
                <span className="text-sm text-foreground font-medium">
                  {sl.asset}
                </span>
                <span className="ml-auto text-xs tabular-nums text-muted">
                  {sl.percentage.toFixed(1)}%
                </span>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
