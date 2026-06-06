interface RateSparklineProps {
  /** 7 daily closing rates, oldest → newest */
  data: number[];
  /** Width of the SVG viewport in pixels */
  width?: number;
  /** Height of the SVG viewport in pixels */
  height?: number;
}

/**
 * Minimal SVG sparkline for 7-day rate history.
 * No chart library — keeps the bundle light and renders fast.
 * Line color follows the last-to-first delta (green up, red down, gray flat).
 */
export default function RateSparkline({
  data,
  width = 120,
  height = 36,
}: RateSparklineProps) {
  if (data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 0.0001; // Guard against flat lines

  const pad = 2;
  const usableW = width - pad * 2;
  const usableH = height - pad * 2;

  const points = data.map((v, i) => {
    const x = pad + (i / (data.length - 1)) * usableW;
    const y = pad + (1 - (v - min) / range) * usableH;
    return `${x},${y}`;
  });

  const polyline = points.join(" ");

  const isUp = data[data.length - 1] >= data[0];
  const isFlat = Math.abs(data[data.length - 1] - data[0]) < 0.0001;

  const stroke = isFlat
    ? "var(--fg-subtle)"
    : isUp
      ? "var(--success)"
      : "var(--danger)";

  const gradientId = `sparkline-grad-${Math.random().toString(36).slice(2)}`;
  const fillColor = isFlat ? "#9ca3af" : isUp ? "#16a34a" : "#dc2626";

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      aria-hidden="true"
      className="overflow-visible"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={fillColor} stopOpacity="0.15" />
          <stop offset="100%" stopColor={fillColor} stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Fill area under the line */}
      <polygon
        points={`${pad},${height - pad} ${polyline} ${pad + usableW},${height - pad}`}
        fill={`url(#${gradientId})`}
      />

      {/* Main sparkline */}
      <polyline
        points={polyline}
        fill="none"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Terminal dot at current price */}
      {points[points.length - 1] && (
        <circle
          cx={points[points.length - 1].split(",")[0]}
          cy={points[points.length - 1].split(",")[1]}
          r="2"
          fill={stroke}
        />
      )}
    </svg>
  );
}
