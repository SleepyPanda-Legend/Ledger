"use client";

import { useState } from "react";
import StatusBadge from "./StatusBadge";
import { truncateAddress } from "@/services/stablecoin";

interface Tx {
  id: string;
  toAddress: string;
  fromAddress: string;
  asset: string;
  amount: number;
  fee: number | null;
  network: string;
  status: string;
  createdAt: Date;
}

type Filter = "all" | "pending" | "confirmed" | "settled" | "failed";

/**
 * Transaction history table with client-side status filtering.
 * Numeric columns are right-aligned for scanability (per design rules).
 */
export default function TransactionTable({ transactions }: { transactions: Tx[] }) {
  const [filter, setFilter] = useState<Filter>("all");

  const visible = filter === "all" ? transactions : transactions.filter((t) => t.status === filter);

  const filters: Filter[] = ["all", "pending", "confirmed", "settled", "failed"];

  return (
    <div className="rounded-2xl border border-border bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-border px-6 py-4">
        <h2 className="text-sm font-semibold text-foreground">Transaction history</h2>

        {/* Filter pills */}
        <div className="flex gap-1.5">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full px-3 py-1 text-xs font-medium capitalize transition-colors duration-150 ${
                filter === f
                  ? "bg-foreground text-background"
                  : "text-muted hover:text-foreground"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {visible.length === 0 ? (
        <div className="px-6 py-12 text-center">
          <p className="text-sm font-medium text-foreground">No transactions</p>
          <p className="mt-1 text-xs text-muted">
            {filter === "all" ? "Send your first stablecoin transfer above." : `No ${filter} transactions.`}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                {["Date", "To", "Asset", "Amount", "Fee", "Network", "Status"].map((h) => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider first:pl-6 last:pr-6">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {visible.map((tx) => (
                <tr key={tx.id} className="hover:bg-[#f9f9f9] transition-colors duration-100">
                  <td className="px-6 py-4 text-xs text-muted whitespace-nowrap">
                    {new Date(tx.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-foreground">
                    {truncateAddress(tx.toAddress)}
                  </td>
                  <td className="px-6 py-4 text-xs font-medium text-foreground">{tx.asset}</td>
                  <td className="px-6 py-4 text-right text-xs font-medium text-foreground tabular-nums">
                    {tx.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-4 text-right text-xs text-muted tabular-nums">
                    ${(tx.fee ?? 0).toFixed(4)}
                  </td>
                  <td className="px-6 py-4 text-xs capitalize text-muted">{tx.network}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={tx.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
