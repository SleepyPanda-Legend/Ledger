/**
 * Analytics Hub — data processing utilities.
 * All computation happens client-side on the transaction array passed from the server.
 * No additional DB queries needed for MVP analytics.
 */

export type DateRange = "7d" | "30d" | "90d";
export type Granularity = "daily" | "weekly" | "monthly";

export interface AnalyticsTx {
  id: string;
  asset: string;
  amount: number;
  fee: number | null;
  network: string;
  status: string;
  toAddress: string;
  fromAddress: string;
  createdAt: Date;
}

export interface ChartPoint {
  label: string;
  volume: number;
  count: number;
}

export interface AssetSlice {
  asset: string;
  volume: number;
  percentage: number;
  color: string;
}

export interface Corridor {
  from: string;
  to: string;
  volume: number;
  count: number;
  network: string;
}

export interface SummaryMetrics {
  totalVolume: number;
  txCount: number;
  activeWallets: number;
  avgFee: number;
}

const ASSET_COLORS: Record<string, string> = {
  USDC: "#0066FF",
  USDT: "#26A17B",
  EURC: "#7C3AED",
  PYUSD: "#0070BA",
  Other: "#9CA3AF",
};

/** Corridor labels derived from the network — realistic for a stablecoin MVP demo. */
const NETWORK_CORRIDORS: Record<string, { from: string; to: string }> = {
  ethereum: { from: "United States", to: "European Union" },
  polygon: { from: "European Union", to: "Asia-Pacific" },
  solana: { from: "Asia-Pacific", to: "Latin America" },
};

/** Returns the cutoff Date for a given range relative to now. */
export function getRangeCutoff(range: DateRange): Date {
  const days = range === "7d" ? 7 : range === "30d" ? 30 : 90;
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000);
}

/** Filters to settled + confirmed transactions within the selected date range. */
export function filterTxs(txs: AnalyticsTx[], range: DateRange): AnalyticsTx[] {
  const cutoff = getRangeCutoff(range);
  return txs.filter(
    (t) =>
      new Date(t.createdAt) >= cutoff &&
      (t.status === "settled" || t.status === "confirmed"),
  );
}

/** Groups filtered transactions into chart points by the selected granularity. */
export function groupByGranularity(
  txs: AnalyticsTx[],
  granularity: Granularity,
  range: DateRange,
): ChartPoint[] {
  if (txs.length === 0) return getEmptyPoints(granularity, range);

  const buckets = new Map<string, ChartPoint>();

  for (const tx of txs) {
    const d = new Date(tx.createdAt);
    let key: string;

    if (granularity === "daily") {
      key = d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
    } else if (granularity === "weekly") {
      // ISO week: floor to Monday
      const day = d.getDay();
      const monday = new Date(d);
      monday.setDate(d.getDate() - ((day + 6) % 7));
      key = monday.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
    } else {
      key = d.toLocaleDateString("en-GB", { month: "short", year: "2-digit" });
    }

    const existing = buckets.get(key) ?? { label: key, volume: 0, count: 0 };
    existing.volume += tx.amount;
    existing.count += 1;
    buckets.set(key, existing);
  }

  return Array.from(buckets.values());
}

/** Returns empty placeholder points when there are no transactions to chart. */
function getEmptyPoints(granularity: Granularity, range: DateRange): ChartPoint[] {
  const count = granularity === "daily" ? (range === "7d" ? 7 : range === "30d" ? 6 : 6) : 4;
  return Array.from({ length: count }, (_, i) => ({
    label: `—`,
    volume: 0,
    count: 0,
  }));
}

/** Returns volume split by asset with percentage and chart color. */
export function getAssetBreakdown(txs: AnalyticsTx[]): AssetSlice[] {
  const totals = new Map<string, number>();

  for (const tx of txs) {
    totals.set(tx.asset, (totals.get(tx.asset) ?? 0) + tx.amount);
  }

  const grandTotal = Array.from(totals.values()).reduce((s, v) => s + v, 0);
  if (grandTotal === 0) {
    return [{ asset: "No data", volume: 0, percentage: 100, color: "#E5E7EB" }];
  }

  return Array.from(totals.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([asset, volume]) => ({
      asset,
      volume,
      percentage: (volume / grandTotal) * 100,
      color: ASSET_COLORS[asset] ?? ASSET_COLORS.Other,
    }));
}

/** Derives top corridor pairs from network field + aggregates volume. */
export function getTopCorridors(txs: AnalyticsTx[]): Corridor[] {
  const map = new Map<string, Corridor>();

  for (const tx of txs) {
    const meta = NETWORK_CORRIDORS[tx.network] ?? {
      from: "Unknown",
      to: "Unknown",
    };
    const key = `${meta.from}→${meta.to}`;
    const existing = map.get(key) ?? {
      from: meta.from,
      to: meta.to,
      volume: 0,
      count: 0,
      network: tx.network,
    };
    existing.volume += tx.amount;
    existing.count += 1;
    map.set(key, existing);
  }

  return Array.from(map.values())
    .sort((a, b) => b.volume - a.volume)
    .slice(0, 5);
}

/** Computes summary metrics for the metrics strip. */
export function getSummaryMetrics(txs: AnalyticsTx[]): SummaryMetrics {
  const totalVolume = txs.reduce((s, t) => s + t.amount, 0);
  const txCount = txs.length;
  const wallets = new Set(txs.map((t) => t.toAddress));
  const activeWallets = wallets.size;
  const avgFee =
    txCount > 0
      ? txs.reduce((s, t) => s + (t.fee ?? 0), 0) / txCount
      : 0;

  return { totalVolume, txCount, activeWallets, avgFee };
}
