"use client";

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import WalletCard from "./WalletCard";
import SendFlow from "./SendFlow";
import TransactionTable from "./TransactionTable";
import Button from "@/components/ui/Button";

interface Transaction {
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

interface SdkDashboardProps {
  walletAddress: string | null;
  balance: number;
  transactions: Transaction[];
}

/**
 * Client wrapper for the SDK page.
 * Manages the show/hide state of the SendFlow panel.
 * Data is fetched server-side and passed in as props.
 */
export default function SdkDashboard({
  walletAddress,
  balance,
  transactions,
}: SdkDashboardProps) {
  const [sending, setSending] = useState(false);

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Wallet card */}
        <WalletCard walletAddress={walletAddress} balance={balance} />

        {/* Quick stats */}
        <div className="grid grid-cols-2 gap-4">
          {[
            {
              label: "Total sent",
              value: transactions
                .filter((t) => t.status === "settled")
                .reduce((s, t) => s + t.amount, 0)
                .toLocaleString("en-US", { minimumFractionDigits: 2 }),
              sub: "USDC settled",
            },
            {
              label: "Transactions",
              value: transactions.length.toString(),
              sub: "All time",
            },
            {
              label: "Avg fee",
              value:
                transactions.length > 0
                  ? `$${(transactions.reduce((s, t) => s + (t.fee ?? 0), 0) / transactions.length).toFixed(4)}`
                  : "$0.00",
              sub: "Per transaction",
            },
            {
              label: "Pending",
              value: transactions.filter((t) => t.status === "pending").length.toString(),
              sub: "Awaiting confirmation",
            },
          ].map(({ label, value, sub }) => (
            <div key={label} className="rounded-xl border border-border bg-white p-4 shadow-sm">
              <p className="text-xs font-medium text-muted uppercase tracking-widest">{label}</p>
              <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground">{value}</p>
              <p className="mt-0.5 text-xs text-subtle">{sub}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Send button — only when wallet connected and not already sending */}
      {walletAddress && !sending && (
        <div className="flex items-center gap-3">
          <Button onClick={() => setSending(true)} size="md">
            <ArrowUpRight size={15} />
            Send stablecoin
          </Button>
        </div>
      )}

      {/* Send flow panel */}
      {sending && walletAddress && (
        <SendFlow
          fromAddress={walletAddress}
          balance={balance}
          onClose={() => setSending(false)}
        />
      )}

      {/* Transaction history */}
      <TransactionTable transactions={transactions} />
    </div>
  );
}
