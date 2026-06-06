"use client";

import { useState, useMemo } from "react";
import MetricsStrip from "./MetricsStrip";
import VolumeChart from "./VolumeChart";
import AssetDonut from "./AssetDonut";
import CorridorsTable from "./CorridorsTable";
import {
  filterTxs,
  groupByGranularity,
  getAssetBreakdown,
  getTopCorridors,
  getSummaryMetrics,
  type AnalyticsTx,
  type DateRange,
  type Granularity,
} from "@/lib/utils/analytics";

interface AnalyticsDashboardProps {
  transactions: AnalyticsTx[];
}

const DATE_RANGES: { label: string; value: DateRange }[] = [
  { label: "7d", value: "7d" },
  { label: "30d", value: "30d" },
  { label: "90d", value: "90d" },
];

/**
 * Analytics Hub client wrapper.
 * Holds date range + granularity state; all aggregation is pure computation
 * on the server-fetched transaction array — no additional network requests.
 */
export default function AnalyticsDashboard({ transactions }: AnalyticsDashboardProps) {
  const [range, setRange] = useState<DateRange>("30d");
  const [granularity, setGranularity] = useState<Granularity>("daily");

  const filtered = useMemo(() => filterTxs(transactions, range), [transactions, range]);

  const metrics = useMemo(() => getSummaryMetrics(filtered), [filtered]);
  const chartPoints = useMemo(
    () => groupByGranularity(filtered, granularity, range),
    [filtered, granularity, range],
  );
  const assetSlices = useMemo(() => getAssetBreakdown(filtered), [filtered]);
  const corridors = useMemo(() => getTopCorridors(filtered), [filtered]);

  return (
    <div className="flex flex-col gap-6">
      {/* Date range filter */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted">
          Showing{" "}
          <span className="font-medium text-foreground">
            {filtered.length} settled transactions
          </span>{" "}
          in the last {range}
        </p>
        <div className="flex gap-1 rounded-lg border border-border bg-white p-1 shadow-sm dark:bg-neutral-900 dark:border-white/5">
          {DATE_RANGES.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => setRange(value)}
              className={[
                "rounded-md px-3 py-1.5 text-xs font-medium transition-colors duration-150",
                range === value
                  ? "bg-foreground text-background"
                  : "text-muted hover:text-foreground",
              ].join(" ")}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Metrics strip */}
      <MetricsStrip metrics={metrics} />

      {/* Volume chart — full width */}
      <VolumeChart
        points={chartPoints}
        granularity={granularity}
        onGranularityChange={setGranularity}
      />

      {/* Asset donut + corridors side by side on large screens */}
      <div className="grid gap-6 lg:grid-cols-2">
        <AssetDonut slices={assetSlices} />
        <CorridorsTable corridors={corridors} />
      </div>
    </div>
  );
}
