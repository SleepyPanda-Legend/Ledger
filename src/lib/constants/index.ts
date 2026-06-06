/**
 * Application-wide constants.
 * Import from here — never hardcode these values inline.
 */

export const APP_NAME = "Ledger" as const;

export const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

/** Supported stablecoin assets at MVP */
export const SUPPORTED_ASSETS = ["USDC", "USDT", "EURC", "PYUSD"] as const;
export type SupportedAsset = (typeof SUPPORTED_ASSETS)[number];

/** Supported networks at MVP (routing stubs) */
export const SUPPORTED_NETWORKS = ["ethereum", "polygon", "solana"] as const;
export type SupportedNetwork = (typeof SUPPORTED_NETWORKS)[number];

/** Transaction lifecycle states */
export const TX_STATUS = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  SETTLED: "settled",
  FAILED: "failed",
} as const;
export type TxStatus = (typeof TX_STATUS)[keyof typeof TX_STATUS];

/** Organization member roles */
export const ORG_ROLES = {
  OWNER: "owner",
  ADMIN: "admin",
  ANALYST: "analyst",
  MEMBER: "member",
} as const;
export type OrgRole = (typeof ORG_ROLES)[keyof typeof ORG_ROLES];

/** Decimal places per asset for display formatting */
export const ASSET_DECIMALS: Record<SupportedAsset, number> = {
  USDC: 2,
  USDT: 2,
  EURC: 2,
  PYUSD: 2,
};

/** API response shape — all routes must conform to this */
export type ApiResponse<T> = {
  data: T | null;
  error: string | null;
};
