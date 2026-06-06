"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowRight, Info } from "lucide-react";
import RouteCard from "./RouteCard";
import { getRouteOptions } from "@/services/stablecoin";
import type { RouteOption } from "@/services/stablecoin";

const ASSETS = ["USDC", "USDT", "EURC"] as const;
type Asset = (typeof ASSETS)[number];

const NETWORKS = ["ethereum", "polygon", "solana"] as const;
type Network = (typeof NETWORKS)[number];

const NETWORK_LABELS: Record<Network, string> = {
  ethereum: "Ethereum",
  polygon: "Polygon",
  solana: "Solana",
};

/**
 * Interactive route comparison panel.
 * User enters amount + asset to see all routing paths ranked.
 * Network filter narrows the visible options (stubbed at MVP — all enabled by default).
 * Best route is auto-selected; the user can see the reasoning but cannot override it
 * (smart routing is the product's core value proposition).
 */
export default function RouteComparisonPanel() {
  const [amount, setAmount] = useState("1000");
  const [asset, setAsset] = useState<Asset>("USDC");
  const [enabledNetworks, setEnabledNetworks] = useState<Set<Network>>(
    new Set(NETWORKS),
  );

  function toggleNetwork(net: Network) {
    setEnabledNetworks((prev) => {
      const next = new Set(prev);
      // Prevent deselecting all networks
      if (next.has(net) && next.size === 1) return prev;
      next.has(net) ? next.delete(net) : next.add(net);
      return next;
    });
  }

  const routes: RouteOption[] = useMemo(() => {
    const n = parseFloat(amount);
    const base = isNaN(n) || n <= 0 ? 1000 : n;
    return getRouteOptions(asset, base).filter((r) =>
      enabledNetworks.has(r.network as Network),
    );
  }, [amount, asset, enabledNetworks]);

  const bestRoute = routes.find((r) => r.tag === "cheapest") ?? routes[0];

  const isValidAmount = !isNaN(parseFloat(amount)) && parseFloat(amount) > 0;

  return (
    <div className="flex flex-col gap-6 rounded-xl border border-border bg-white p-6 shadow-sm dark:bg-neutral-900 dark:border-white/5">
      {/* Controls row */}
      <div className="flex flex-wrap items-end gap-4">
        {/* Amount input */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-muted">Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min={0}
            step="100"
            className="h-9 w-36 rounded-lg border border-border bg-background px-3 text-sm tabular-nums text-foreground placeholder:text-subtle focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
          />
        </div>

        {/* Asset selector */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-muted">Asset</label>
          <select
            value={asset}
            onChange={(e) => setAsset(e.target.value as Asset)}
            className="h-9 rounded-lg border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
          >
            {ASSETS.map((a) => (
              <option key={a}>{a}</option>
            ))}
          </select>
        </div>

        {/* Network filter toggles */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-muted">Networks</label>
          <div className="flex gap-2">
            {NETWORKS.map((net) => {
              const active = enabledNetworks.has(net);
              return (
                <button
                  key={net}
                  onClick={() => toggleNetwork(net)}
                  className={[
                    "rounded-lg border px-3 py-1.5 text-xs font-medium capitalize transition-colors duration-150",
                    active
                      ? "border-accent bg-accent/10 text-accent"
                      : "border-border text-muted hover:text-foreground",
                  ].join(" ")}
                >
                  {NETWORK_LABELS[net]}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Invalid amount notice */}
      {!isValidAmount && (
        <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 dark:border-amber-800/40 dark:bg-amber-950/30">
          <Info size={13} className="shrink-0 text-warning" />
          <p className="text-xs text-warning">
            Enter a valid amount to see routing options.
          </p>
        </div>
      )}

      {/* Route cards */}
      {isValidAmount && routes.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {routes.map((route, i) => (
            <RouteCard
              key={route.id}
              route={route}
              selected={route.id === bestRoute?.id}
              rank={i + 1}
            />
          ))}
        </div>
      )}

      {/* No routes state — all networks deselected (guarded above, but just in case) */}
      {isValidAmount && routes.length === 0 && (
        <p className="py-6 text-center text-sm text-muted">
          Enable at least one network to see routing options.
        </p>
      )}

      {/* CTA — links to SDK send flow */}
      {isValidAmount && bestRoute && (
        <div className="flex items-center justify-between rounded-xl border border-border bg-[#f9f9f9] px-5 py-4 dark:bg-neutral-800/50 dark:border-white/5">
          <div>
            <p className="text-sm font-medium text-foreground">
              Ready to send?
            </p>
            <p className="mt-0.5 text-xs text-muted">
              Smart routing will automatically select the optimal path.
            </p>
          </div>
          <Link
            href="/dashboard/sdk"
            className="flex items-center gap-1.5 rounded-lg bg-foreground px-4 py-2 text-xs font-medium text-background transition-opacity hover:opacity-80"
          >
            Go to SDK
            <ArrowRight size={12} />
          </Link>
        </div>
      )}
    </div>
  );
}
