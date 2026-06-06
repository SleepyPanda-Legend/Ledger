"use client";

import { useState, useTransition } from "react";
import { Wallet, Copy, Check } from "lucide-react";
import { connectWalletAction } from "@/lib/actions/transactions";
import { truncateAddress, ASSET_USD_PRICE } from "@/services/stablecoin";
import Button from "@/components/ui/Button";

interface WalletCardProps {
  walletAddress: string | null;
  balance: number;
}

/**
 * Displays the connected wallet address and USDC balance.
 * "Connect" button triggers a server action that generates a sandbox address.
 */
export default function WalletCard({ walletAddress: initialAddress, balance }: WalletCardProps) {
  const [address, setAddress] = useState(initialAddress);
  const [isPending, startTransition] = useTransition();
  const [copied, setCopied] = useState(false);

  async function copyAddress() {
    if (!address) return;
    await navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function connect() {
    startTransition(async () => {
      const result = await connectWalletAction();
      if ("address" in result) setAddress(result.address);
    });
  }

  const usdValue = (balance * ASSET_USD_PRICE["USDC"]).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });

  return (
    <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground/5">
            <Wallet size={15} strokeWidth={1.5} className="text-muted" />
          </div>
          <span className="text-sm font-semibold text-foreground">Custodial Wallet</span>
        </div>

        {address && (
          <span className="flex items-center gap-1.5 rounded-full border border-green-200 bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
            Connected
          </span>
        )}
      </div>

      {address ? (
        <div className="flex flex-col gap-4">
          {/* Address — full address copyable, truncated for display */}
          <div>
            <p className="mb-1 text-xs font-medium text-muted uppercase tracking-widest">Address</p>
            <div className="flex items-center gap-2">
              <p className="font-mono text-sm text-foreground">{truncateAddress(address)}</p>
              <button
                onClick={copyAddress}
                title="Copy full address"
                className="flex items-center gap-1 rounded-md px-2 py-0.5 text-xs text-muted transition-colors hover:bg-foreground/5 hover:text-foreground"
              >
                {copied ? <Check size={12} className="text-success" /> : <Copy size={12} />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
          </div>

          {/* Balance */}
          <div className="flex items-end gap-4">
            <div>
              <p className="mb-1 text-xs font-medium text-muted uppercase tracking-widest">USDC Balance</p>
              <p className="text-3xl font-semibold tracking-tight text-foreground">
                {balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </p>
              <p className="mt-0.5 text-xs text-muted">{usdValue} USD</p>
            </div>
            <div className="rounded-full border border-border bg-[#f9f9f9] px-3 py-1 text-xs font-medium text-muted">
              Sandbox
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-start gap-4">
          <p className="text-sm text-muted">
            Connect a custodial wallet to start sending and receiving stablecoins.
          </p>
          <Button onClick={connect} loading={isPending} size="sm">
            {isPending ? "Connecting…" : "Connect wallet"}
          </Button>
        </div>
      )}
    </div>
  );
}
