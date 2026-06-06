/**
 * FX Intelligence Engine — mock data utilities.
 * AI signals are intentionally mocked at MVP with realistic data shapes.
 * Real ML model and live price feeds are scheduled for post-MVP.
 *
 * Seeded pseudo-randomness keeps sparklines stable across SSR/CSR boundaries.
 * Each call to `getSnapshotDelta` generates a small realistic jitter so the
 * auto-refresh cycle looks live without external API calls.
 */

export type Volatility = "low" | "medium" | "high";
export type Recommendation = "convert" | "hold" | "monitor";

export interface FxRate {
  /** Trading pair identifier, e.g. "USDC/EUR" */
  pair: string;
  /** Current mid-market rate */
  rate: number;
  /** 24-hour percentage change (positive = appreciation of quote currency) */
  change24h: number;
  volatility: Volatility;
  /** 7 daily closing rates, oldest → newest */
  history: number[];
  recommendation: Recommendation;
  /** Human-readable reason powering the AI card */
  recommendationReason: string;
}

/** Base rates anchored to realistic June 2026 stablecoin FX values. */
const BASE_RATES: Record<string, number> = {
  "USDC/USD": 1.0,
  "USDC/EUR": 0.918,
  "USDC/GBP": 0.781,
};

/**
 * Generates a deterministic 7-point history around a base rate.
 * Uses a simple LCG so values are stable on first render (avoids hydration mismatch).
 */
function seedHistory(base: number, spread: number, seed: number): number[] {
  const history: number[] = [];
  let s = seed;
  for (let i = 0; i < 7; i++) {
    // Linear congruential generator
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    const normalized = (s >>> 0) / 0xffffffff; // 0..1
    history.push(Number((base + (normalized - 0.5) * 2 * spread).toFixed(4)));
  }
  // Last point is current base rate so sparkline ends at live value
  history[6] = base;
  return history;
}

/** Volatility metadata used to build the recommendation signal. */
const VOLATILITY_MAP: Record<
  string,
  {
    volatility: Volatility;
    recommendation: Recommendation;
    reason: string;
    spread: number;
    seed: number;
  }
> = {
  "USDC/USD": {
    volatility: "low",
    recommendation: "convert",
    reason:
      "USDC/USD is pegged 1:1 with minimal deviation. Optimal window for conversion — no timing risk.",
    spread: 0.0008,
    seed: 42,
  },
  "USDC/EUR": {
    volatility: "medium",
    recommendation: "monitor",
    reason:
      "EUR showing moderate intraday swings (+0.3% σ). ECB meeting in 2 days may introduce short-term pressure. Consider waiting 24–48 h.",
    spread: 0.006,
    seed: 137,
  },
  "USDC/GBP": {
    volatility: "high",
    recommendation: "hold",
    reason:
      "GBP volatility spiked after UK CPI miss. Projected 1.2% drawdown window. Recommend holding until volatility normalises (est. 48–72 h).",
    spread: 0.018,
    seed: 251,
  },
};

/**
 * Returns the initial FX rate snapshot used on first render.
 * Deterministic — safe to call on both server and client.
 */
export function getInitialRates(): FxRate[] {
  return Object.entries(BASE_RATES).map(([pair, base]) => {
    const meta = VOLATILITY_MAP[pair];
    const history = seedHistory(base, meta.spread, meta.seed);
    const change24h = Number(
      (((history[6] - history[5]) / history[5]) * 100).toFixed(3),
    );

    return {
      pair,
      rate: base,
      change24h,
      volatility: meta.volatility,
      history,
      recommendation: meta.recommendation,
      recommendationReason: meta.reason,
    };
  });
}

/**
 * Applies a small realistic jitter to simulate a live price feed tick.
 * Called by the auto-refresh hook every 30 seconds.
 *
 * @param rates - Current snapshot to update
 * @returns New snapshot with updated rate, change24h, and history
 */
export function applyRefreshTick(rates: FxRate[]): FxRate[] {
  return rates.map((r) => {
    const meta = VOLATILITY_MAP[r.pair];
    // Jitter: ±(spread / 3) so movement is small but visible
    const jitter = (Math.random() - 0.5) * 2 * (meta.spread / 3);
    const newRate = Number((r.rate + jitter).toFixed(4));
    const newHistory = [...r.history.slice(1), newRate];
    const change24h = Number(
      (((newHistory[6] - newHistory[5]) / newHistory[5]) * 100).toFixed(3),
    );

    return { ...r, rate: newRate, change24h, history: newHistory };
  });
}
