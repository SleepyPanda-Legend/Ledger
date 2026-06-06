"use client";

import { useState, useTransition } from "react";
import { ArrowRight, CheckCircle, Loader2 } from "lucide-react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import StatusBadge from "./StatusBadge";
import { createTransactionAction, advanceTransactionStatusAction } from "@/lib/actions/transactions";
import { getRouteOptions, ASSET_USD_PRICE, isValidAddress } from "@/services/stablecoin";
import type { RouteOption } from "@/services/stablecoin";

type Step = "form" | "confirm" | "processing" | "success";

interface SendFlowProps {
  fromAddress: string;
  balance: number;
  onClose: () => void;
}

const TAG_LABELS: Record<string, string> = {
  cheapest: "Cheapest",
  fastest: "Fastest",
  best_rate: "Best rate",
};

/**
 * 4-step send flow:
 * form → confirm route → processing (pending) → success (settled).
 * Status advances via server actions on a simulated timeline.
 */
export default function SendFlow({ fromAddress, balance, onClose }: SendFlowProps) {
  const [step, setStep] = useState<Step>("form");
  const [isPending, startTransition] = useTransition();

  // Form state
  const [toAddress, setToAddress]   = useState("");
  const [amount, setAmount]         = useState("");
  const [asset, setAsset]           = useState<"USDC" | "USDT" | "EURC" | "PYUSD">("USDC");
  const [network, setNetwork]       = useState<"ethereum" | "polygon" | "solana">("polygon");
  const [addrError, setAddrError]   = useState("");
  const [amountError, setAmountError] = useState("");

  // Confirm state
  const [routes, setRoutes]           = useState<RouteOption[]>([]);
  const [selectedRoute, setSelected]  = useState<RouteOption | null>(null);

  // Success state
  const [txId, setTxId] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("pending");

  function validateAndContinue() {
    let ok = true;
    if (!isValidAddress(toAddress)) { setAddrError("Enter a valid 0x address"); ok = false; }
    else setAddrError("");
    const n = parseFloat(amount);
    if (!amount || isNaN(n) || n <= 0) { setAmountError("Enter a valid amount"); ok = false; }
    else if (n > balance) { setAmountError("Insufficient balance"); ok = false; }
    else setAmountError("");
    if (!ok) return;

    const opts = getRouteOptions(asset, parseFloat(amount));
    setRoutes(opts);
    setSelected(opts.find((r) => r.tag === "cheapest") ?? opts[0] ?? null);
    setStep("confirm");
  }

  function submit() {
    if (!selectedRoute) return;
    setStep("processing");

    const fd = new FormData();
    fd.append("toAddress", toAddress);
    fd.append("amount", amount);
    fd.append("asset", asset);
    fd.append("network", selectedRoute.network);
    fd.append("fee", String(selectedRoute.fee));
    fd.append("routeId", selectedRoute.id);

    startTransition(async () => {
      const result = await createTransactionAction(undefined, fd);
      if ("error" in result) { setStep("form"); return; }

      setTxId(result.txId);
      setStatus("pending");

      // Simulate on-chain progression
      setTimeout(async () => {
        await advanceTransactionStatusAction(result.txId);
        setStatus("confirmed");
        setTimeout(async () => {
          await advanceTransactionStatusAction(result.txId);
          setStatus("settled");
          setStep("success");
        }, 3000);
      }, 2500);
    });
  }

  return (
    <div className="rounded-2xl border border-border bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-6 py-4">
        <h2 className="text-sm font-semibold text-foreground">Send stablecoin</h2>
        <button onClick={onClose} className="text-xs text-muted hover:text-foreground transition-colors">
          Cancel
        </button>
      </div>

      <div className="p-6">

        {/* STEP: Form */}
        {step === "form" && (
          <div className="flex flex-col gap-5">
            <Input label="Recipient address" value={toAddress} onChange={(e) => setToAddress(e.target.value)}
              placeholder="0x…" error={addrError} />

            <div className="flex gap-4">
              <div className="flex-1">
                <label className="mb-1.5 block text-sm font-medium text-foreground">Amount</label>
                <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00" min={0} step="0.01"
                  className="h-10 w-full rounded-lg border border-border bg-background px-3.5 text-sm text-foreground placeholder:text-subtle focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent" />
                {amountError && <p className="mt-1 text-xs text-danger">{amountError}</p>}
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Asset</label>
                <select value={asset} onChange={(e) => setAsset(e.target.value as typeof asset)}
                  className="h-10 rounded-lg border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent">
                  {["USDC", "USDT", "EURC", "PYUSD"].map((a) => <option key={a}>{a}</option>)}
                </select>
              </div>
            </div>

            <p className="text-xs text-muted">
              Available: {balance.toLocaleString("en-US", { minimumFractionDigits: 2 })} {asset}
            </p>

            <Button onClick={validateAndContinue} className="w-full rounded-xl">
              Review routes <ArrowRight size={14} />
            </Button>
          </div>
        )}

        {/* STEP: Confirm route */}
        {step === "confirm" && (
          <div className="flex flex-col gap-5">
            <p className="text-sm text-muted">
              Sending <strong className="text-foreground">{amount} {asset}</strong> to{" "}
              <strong className="font-mono text-foreground">{toAddress.slice(0, 8)}…{toAddress.slice(-4)}</strong>
            </p>

            <div className="flex flex-col gap-2">
              {routes.map((route) => (
                <button key={route.id} onClick={() => setSelected(route)}
                  className={`flex items-center justify-between rounded-xl border p-4 text-left transition-all duration-150 ${
                    selectedRoute?.id === route.id ? "border-accent bg-accent/5" : "border-border hover:border-foreground/20"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`h-4 w-4 rounded-full border-2 flex items-center justify-center ${selectedRoute?.id === route.id ? "border-accent" : "border-border"}`}>
                      {selectedRoute?.id === route.id && <div className="h-2 w-2 rounded-full bg-accent" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium capitalize text-foreground">{route.network}</p>
                      <p className="text-xs text-muted">~{route.estimatedSeconds}s · ${route.fee.toFixed(4)} fee</p>
                    </div>
                  </div>
                  {route.tag && (
                    <span className="rounded-full border border-accent/20 bg-accent/5 px-2.5 py-0.5 text-xs font-medium text-accent">
                      {TAG_LABELS[route.tag]}
                    </span>
                  )}
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <Button variant="secondary" onClick={() => setStep("form")} className="w-full rounded-xl">Back</Button>
              <Button onClick={submit} loading={isPending} className="w-full rounded-xl">Confirm & send</Button>
            </div>
          </div>
        )}

        {/* STEP: Processing */}
        {step === "processing" && (
          <div className="flex flex-col items-center gap-5 py-6 text-center">
            <Loader2 size={32} className="animate-spin text-accent" />
            <div>
              <p className="text-sm font-semibold text-foreground">Broadcasting transaction…</p>
              <p className="mt-1 text-xs text-muted">Waiting for on-chain confirmation.</p>
            </div>
            <StatusBadge status={status} />
          </div>
        )}

        {/* STEP: Success */}
        {step === "success" && (
          <div className="flex flex-col items-center gap-5 py-4 text-center">
            <CheckCircle size={36} className="text-success" />
            <div>
              <p className="text-sm font-semibold text-foreground">Transaction settled</p>
              <p className="mt-1 text-xs text-muted">
                {amount} {asset} sent to {toAddress.slice(0, 8)}…{toAddress.slice(-4)}
              </p>
            </div>
            <StatusBadge status="settled" />
            <Button onClick={onClose} variant="secondary" className="w-full rounded-xl mt-2">Done</Button>
          </div>
        )}
      </div>
    </div>
  );
}
