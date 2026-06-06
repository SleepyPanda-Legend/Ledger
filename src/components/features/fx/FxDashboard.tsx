"use client";

import { useEffect, useState, useCallback } from "react";
import { RefreshCw } from "lucide-react";
import {
  getInitialRates,
  applyRefreshTick,
  type FxRate,
} from "@/lib/utils/fx-mock";
import RateCard from "./RateCard";
import AiRecommendationCard from "./AiRecommendationCard";

const REFRESH_INTERVAL_MS = 30_000;

/**
 * FX Intelligence Engine dashboard.
 * Manages auto-refresh every 30 seconds and exposes a manual refresh trigger.
 * Data is mocked at MVP — real price feed is post-MVP.
 */
export default function FxDashboard() {
  const [rates, setRates] = useState<FxRate[]>(() => getInitialRates());
  const [lastRefreshed, setLastRefreshed] = useState<Date>(() => new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [countdown, setCountdown] = useState(REFRESH_INTERVAL_MS / 1000);

  const refresh = useCallback(() => {
    setIsRefreshing(true);
    // Simulate a brief network round-trip feel (150ms)
    setTimeout(() => {
      setRates((prev) => applyRefreshTick(prev));
      setLastRefreshed(new Date());
      setCountdown(REFRESH_INTERVAL_MS / 1000);
      setIsRefreshing(false);
    }, 150);
  }, []);

  // Auto-refresh every 30 s
  useEffect(() => {
    const interval = setInterval(refresh, REFRESH_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [refresh]);

  // Live countdown to next refresh
  useEffect(() => {
    const tick = setInterval(() => {
      setCountdown((c) => (c <= 1 ? REFRESH_INTERVAL_MS / 1000 : c - 1));
    }, 1000);
    return () => clearInterval(tick);
  }, [lastRefreshed]);

  const formattedTime = lastRefreshed.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted">
          Last updated {formattedTime} · auto-refresh in{" "}
          <span className="tabular-nums">{countdown}s</span>
        </p>

        <button
          onClick={refresh}
          disabled={isRefreshing}
          className="flex items-center gap-1.5 rounded-lg border border-border bg-white px-3 py-1.5 text-xs font-medium text-foreground shadow-sm transition-colors hover:bg-foreground/[0.03] disabled:opacity-50 dark:bg-neutral-900 dark:border-white/5"
        >
          <RefreshCw
            size={12}
            className={isRefreshing ? "animate-spin" : ""}
          />
          Refresh
        </button>
      </div>

      {/* Live rate cards — 3 columns on large screens */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {rates.map((r) => (
          <RateCard key={r.pair} rate={r} />
        ))}
      </div>

      {/* AI recommendation card — full width */}
      <AiRecommendationCard rates={rates} />
    </div>
  );
}
