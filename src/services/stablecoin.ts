/**
 * Mock stablecoin service.
 *
 * Simulates the Ledger SDK layer at MVP — no live blockchain calls.
 * Realistic data shapes and fee structures so the demo is credible.
 * Replace internals with real provider calls (Circle, Fireblocks, etc.) post-MVP.
 */

import { SUPPORTED_ASSETS, SUPPORTED_NETWORKS } from "@/lib/constants";
import type { SupportedAsset, SupportedNetwork } from "@/lib/constants";

export interface FeeEstimate {
  network: SupportedNetwork;
  fee: number;       // USD
  feeCrypto: number; // In the asset being sent
  estimatedSeconds: number;
  label: string;
}

export interface RouteOption {
  id: string;
  network: SupportedNetwork;
  fee: number;
  rate: number;       // e.g. 1.0002 (slight premium on best route)
  estimatedSeconds: number;
  tag: "cheapest" | "fastest" | "best_rate" | null;
}

/** Static USDC peg — always $1.00 for pegged assets at MVP */
export const ASSET_USD_PRICE: Record<SupportedAsset, number> = {
  USDC: 1.0,
  USDT: 1.0,
  EURC: 1.08, // Approximate EUR/USD
  PYUSD: 1.0,
};

/** Network fee estimates (realistic sandbox values) */
const NETWORK_FEES: Record<SupportedNetwork, { usd: number; seconds: number }> = {
  ethereum: { usd: 2.5,    seconds: 15  },
  polygon:  { usd: 0.01,   seconds: 3   },
  solana:   { usd: 0.0005, seconds: 1   },
};

/**
 * Returns fee estimates across all supported networks for a given transfer amount.
 * Fee in crypto is proportional to USD fee divided by asset price.
 */
export function getFeeEstimates(
  asset: SupportedAsset,
  amount: number
): FeeEstimate[] {
  const price = ASSET_USD_PRICE[asset];

  return SUPPORTED_NETWORKS.map((network) => {
    const { usd, seconds } = NETWORK_FEES[network];
    return {
      network,
      fee: usd,
      feeCrypto: +(usd / price).toFixed(6),
      estimatedSeconds: seconds,
      label: `${seconds < 60 ? `${seconds}s` : `${Math.round(seconds / 60)}m`} · $${usd} fee`,
    };
  });
}

/**
 * Returns ranked routing options with tags for the best choice per criterion.
 */
export function getRouteOptions(asset: SupportedAsset, amount: number): RouteOption[] {
  const estimates = getFeeEstimates(asset, amount);

  const routes: RouteOption[] = estimates.map((e, i) => ({
    id: `route-${i}`,
    network: e.network,
    fee: e.fee,
    rate: 1 + Math.random() * 0.0004, // Tiny simulated slippage variance
    estimatedSeconds: e.estimatedSeconds,
    tag: null,
  }));

  // Tag the best option per criterion
  const cheapest = routes.reduce((a, b) => (a.fee < b.fee ? a : b));
  const fastest  = routes.reduce((a, b) => (a.estimatedSeconds < b.estimatedSeconds ? a : b));
  const bestRate = routes.reduce((a, b) => (a.rate > b.rate ? a : b));

  cheapest.tag = "cheapest";
  if (fastest.id !== cheapest.id) fastest.tag = "fastest";
  if (bestRate.id !== cheapest.id && bestRate.id !== fastest.id) bestRate.tag = "best_rate";

  return routes;
}

/**
 * Generates a deterministic-looking mock Ethereum address.
 * Format matches real addresses so the UI looks authentic.
 */
export function generateWalletAddress(): string {
  const hex = () => Math.floor(Math.random() * 16).toString(16);
  return "0x" + Array.from({ length: 40 }, hex).join("");
}

/** Truncates an address for display: 0x1234…abcd */
export function truncateAddress(address: string): string {
  if (address.length < 12) return address;
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}

/** Validates a basic Ethereum address format */
export function isValidAddress(address: string): boolean {
  return /^0x[0-9a-fA-F]{40}$/.test(address);
}

export { SUPPORTED_ASSETS, SUPPORTED_NETWORKS };
