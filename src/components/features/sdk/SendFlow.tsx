"use client";

import { useState, useTransition } from "react";
import { ArrowRight, CheckCircle, Loader2, Zap, DollarSign, Clock } from "lucide-react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import StatusBadge from "./StatusBadge";
import { createTransactionAction, advanceTransactionStatusAction } from "@/lib/actions/transactions";
import { getRouteOptions, isValidAddress } from "@/services/stablecoin";
import type { RouteOption } from "@/services/stablecoin";

/** Stablecoin assets only — no blockchain networks exposed to the user */
const STABLECOIN_ASSETS = ["USDC", "USDT", "EURC"] as const;
type StablecoinAsset = (typeof STABLECOIN_ASSETS)[number];

type Step = "form" | "confirm" | "processing" | "success";

interface SendFlowProps {
  fromAddress: string;
  balance: number;
  onClose: () => void;
}

const TAG_ICONS: Record<string, React.ReactNode> = {
  cheapest:  <DollarSign size={11} />,
  fastest:   <Zap size={11} />,
  best_rate: <Clock size={11} />,
};

const TAG_LABELS: Record<string, string> = {
  cheapest:  "Cheapest",
  fastest:   "Fastest",
  best_rate: "Best rate",
};

/**
 * 4-step stablecoin send flow.
 * Networks (Ethereum, Polygon, Solana) are internal routing details —
 * never surfaced as user choices. Users only select stablecoin assets.
 *
 * Steps: form → confirm summary → processing → success.
 */
export default function SendFlow({ fromAddress, balance, onClose }: SendFlowProps) {
  const [step, setStep] = useState<Step>("form");
  const [isPending, startTransition] = useTransition();

  const [toAddress, setToAddress]     = useState("");
  const [amount, setAmount]           = useState("");
  const [asset, setAsset]             = useState<StablecoinAsset>("USDC");
  const [addrError, setAddrError]     = useState("");
  const [amountError, setAmountError] = useState("");

  // Auto-selected best route — not exposed to user
  const [bestRoute, setBestRoute] = useState<RouteOption | null>(null);

  const [status, setStatus] = useState<string>("pending");

  function validateAndContinue() {
    let ok = true;
    if (!isValidAddress(toAddress)) {
      setAddrError("Enter a valid 0x address");
      ok = false;
    } else {
      setAddrError("");
    }

    const n = parseFloat(amount);
    if (!amount || isNaN(n) || n <= 0) {
      setAmountError("Enter a valid amount");
      ok = false;
    } else if (n > balance) {
      setAmountError("Insufficient balance");
      ok = false;
    } else {
      setAmountError("");
    }

    if (!ok) return;

    // Auto-pick cheapest route — routing is Ledger's job, not the user's
    const routes = getRouteOptions(asset, parseFloat(amount));
    const best = routes.find((r) => r.tag === "cheapest") ?? routes[0] ?? null;
    setBestRoute(best);
    setStep("confirm");
  }

  function submit() {
    if (!bestRoute) return;
    setStep("processing");

    const fd = new FormData();
    fd.append("toAddress", toAddress);
    fd.append("amount", amount);
    fd.append("asset", asset);
    fd.append("network", bestRoute.network);
    fd.append("fee", String(bestRoute.fee));
    fd.append("routeId", bestRoute.id);

    startTransition(async () => {
      const result = await createTransactionAction(undefined, fd);
      if ("error" in result) { setStep("form"); return; }

      setStatus("pending");

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
      <div className="flex items-center justify-between border-b border-border px-6 py-4">
        <h2 className="text-sm font-semibold text-foreground">Send stablecoin</h2>
        <button onClick={onClose} className="text-xs text-muted transition-colors hover:text-foreground">
          Cancel
        </button>
      </div>

      <div className="p-6">

        {/* STEP 1 — Form: asset + amount + recipient */}
        {step === "form" && (
          <div className="flex flex-col gap-5">
            <Input
              label="Recipient address"
              value={toAddress}
              onChange={(e) => setToAddress(e.target.value)}
              placeholder="0x…"
              error={addrError}
            />

            <div className="flex gap-4">
              <div className="flex-1">
                <label className="mb-1.5 block text-sm font-medium text-foreground">Amount</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  min={0}
                  step="0.01"
                  className="h-10 w-full rounded-lg border border-border bg-background px-3.5 text-sm text-foreground placeholder:text-subtle focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                />
                {amountError && <p className="mt-1 text-xs text-danger">{amountError}</p>}
              </div>

              {/* Stablecoins only — USDC, USDT, EURC */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Asset</label>
                <select
                  value={asset}
                  onChange={(e) => setAsset(e.target.value as StablecoinAsset)}
                  className="h-10 rounded-lg border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  {STABLECOIN_ASSETS.map((a) => <option key={a}>{a}</option>)}
                </select>
              </div>
            </div>

            <p className="text-xs text-muted">
              Available: {balance.toLocaleString("en-US", { minimumFractionDigits: 2 })} {asset}
            </p>

            <Button onClick={validateAndContinue} className="w-full rounded-xl">
              Review transfer <ArrowRight size={14} />
            </Button>
          </div>
        )}

        {/* STEP 2 — Confirm: summary + auto-selected route info */}
        {step === "confirm" && bestRoute && (
          <div className="flex flex-col gap-5">
            {/* Transfer summary */}
            <div className="rounded-xl border border-border bg-[#f9f9f9] p-5">
              <div className="flex flex-col gap-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted">Sending</span>
                  <span className="font-semibold text-foreground">{amount} {asset}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted">To</span>
                  <span className="font-mono text-foreground">{toAddress.slice(0, 8)}…{toAddress.slice(-4)}</span>
                </div>
                <div className="h-px bg-border" />
                <div className="flex justify-between text-sm">
                  <span className="text-muted">Network fee</span>
                  <span className="text-foreground">${bestRoute.fee.toFixed(4)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted">Est. settlement</span>
                  <span className="text-foreground">~{bestRoute.estimatedSeconds}s</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted">You receive</span>
                  <span className="font-semibold text-foreground">
                    {(parseFloat(amount) - bestRoute.fee).toLocaleString("en-US", { minimumFractionDigits: 2 })} {asset}
                  </span>
                </div>
              </div>
            </div>

            {/* Smart routing badge — internal detail only */}
            <div className="flex items-center gap-2 rounded-lg border border-border bg-white px-4 py-3">
              <Zap size={13} className="text-accent" />
              <p className="text-xs text-muted">
                <span className="font-medium text-foreground">Smart Routing</span> selected the optimal path automatically.
              </p>
            </div>

            <div className="flex gap-3">
              <Button variant="secondary" onClick={() => setStep("form")} className="w-full rounded-xl">
                Back
              </Button>
              <Button onClick={submit} loading={isPending} className="w-full rounded-xl">
                Confirm & send
              </Button>
            </div>
          </div>
        )}

        {/* STEP 3 — Processing */}
        {step === "processing" && (
          <div className="flex flex-col items-center gap-5 py-6 text-center">
            <Loader2 size={32} className="animate-spin text-accent" />
            <div>
              <p className="text-sm font-semibold text-foreground">Broadcasting transaction…</p>
              <p className="mt-1 text-xs text-muted">Waiting for settlement confirmation.</p>
            </div>
            <StatusBadge status={status} />
          </div>
        )}

        {/* STEP 4 — Success */}
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
            <Button onClick={onClose} variant="secondary" className="w-full rounded-xl mt-2">
              Done
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
