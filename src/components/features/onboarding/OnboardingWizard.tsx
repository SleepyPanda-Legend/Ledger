"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, Copy, Check } from "lucide-react";
import Button from "@/components/ui/Button";

const ASSETS = ["USDC", "USDT", "EURC", "PYUSD"] as const;
type Asset = (typeof ASSETS)[number];
type Env = "sandbox" | "live";

interface OnboardingWizardProps {
  /** Pre-generated API key for this organization */
  apiKey: string;
  orgName: string;
}

/**
 * 3-step onboarding wizard.
 * Step 1 — Select stablecoin assets.
 * Step 2 — Choose environment (sandbox / live).
 * Step 3 — Review configuration + copy API key.
 *
 * State is local — no DB writes until the user explicitly saves preferences
 * (that's a post-MVP concern; the API key is all they need to get started).
 */
export default function OnboardingWizard({ apiKey, orgName }: OnboardingWizardProps) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [assets, setAssets] = useState<Asset[]>(["USDC"]);
  const [env, setEnv] = useState<Env>("sandbox");
  const [copied, setCopied] = useState(false);

  function toggleAsset(asset: Asset) {
    setAssets((prev) =>
      prev.includes(asset) ? prev.filter((a) => a !== asset) : [...prev, asset]
    );
  }

  async function copyKey() {
    await navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const steps = ["Assets", "Environment", "API Key"];

  return (
    <div className="mx-auto w-full max-w-lg">
      {/* Step indicators */}
      <div className="mb-10 flex items-center gap-3">
        {steps.map((label, i) => {
          const n = i + 1;
          const active = n === step;
          const done = n < step;
          return (
            <div key={label} className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div
                  className={[
                    "flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold transition-colors",
                    done ? "bg-success text-white" : active ? "bg-foreground text-background" : "bg-border text-muted",
                  ].join(" ")}
                >
                  {done ? <Check size={12} /> : n}
                </div>
                <span className={`text-sm font-medium ${active ? "text-foreground" : "text-muted"}`}>
                  {label}
                </span>
              </div>
              {i < steps.length - 1 && <div className="h-px w-8 bg-border" />}
            </div>
          );
        })}
      </div>

      {/* Card */}
      <div className="rounded-2xl border border-border bg-white p-8 shadow-sm">

        {/* Step 1 — Asset selection */}
        {step === 1 && (
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-foreground">
                Which stablecoins will you support?
              </h2>
              <p className="mt-1.5 text-sm text-muted">
                You can change this at any time in settings.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {ASSETS.map((asset) => {
                const selected = assets.includes(asset);
                return (
                  <button
                    key={asset}
                    onClick={() => toggleAsset(asset)}
                    className={[
                      "flex items-center gap-3 rounded-xl border p-4 text-left transition-all duration-150",
                      selected
                        ? "border-accent bg-accent/5 text-foreground"
                        : "border-border text-muted hover:border-foreground/20 hover:text-foreground",
                    ].join(" ")}
                  >
                    <div className={`h-4 w-4 rounded-full border-2 flex items-center justify-center ${selected ? "border-accent" : "border-border"}`}>
                      {selected && <div className="h-2 w-2 rounded-full bg-accent" />}
                    </div>
                    <span className="text-sm font-medium">{asset}</span>
                  </button>
                );
              })}
            </div>
            <Button
              onClick={() => setStep(2)}
              disabled={assets.length === 0}
              className="w-full rounded-xl"
            >
              Continue
            </Button>
          </div>
        )}

        {/* Step 2 — Environment */}
        {step === 2 && (
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-foreground">
                Choose your starting environment
              </h2>
              <p className="mt-1.5 text-sm text-muted">
                Sandbox uses test assets with no real funds at risk.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              {([
                { value: "sandbox", label: "Sandbox", desc: "Test freely with simulated transactions." },
                { value: "live", label: "Live", desc: "Real assets, real transactions. KYC required." },
              ] as const).map(({ value, label, desc }) => (
                <button
                  key={value}
                  onClick={() => setEnv(value)}
                  className={[
                    "flex items-start gap-4 rounded-xl border p-5 text-left transition-all duration-150",
                    env === value ? "border-accent bg-accent/5" : "border-border hover:border-foreground/20",
                  ].join(" ")}
                >
                  <div className={`mt-0.5 h-4 w-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${env === value ? "border-accent" : "border-border"}`}>
                    {env === value && <div className="h-2 w-2 rounded-full bg-accent" />}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{label}</p>
                    <p className="mt-0.5 text-xs text-muted">{desc}</p>
                  </div>
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <Button variant="secondary" onClick={() => setStep(1)} className="w-full rounded-xl">
                Back
              </Button>
              <Button onClick={() => setStep(3)} className="w-full rounded-xl">
                Continue
              </Button>
            </div>
          </div>
        )}

        {/* Step 3 — API key */}
        {step === 3 && (
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <CheckCircle size={24} className="text-success" />
              <h2 className="text-xl font-semibold tracking-tight text-foreground">
                You&apos;re all set, {orgName}
              </h2>
            </div>
            <div className="rounded-xl border border-border bg-[#f9f9f9] p-5">
              <p className="mb-2 text-xs font-medium text-muted uppercase tracking-widest">
                Your API Key ({env})
              </p>
              <div className="flex items-center gap-3">
                <code className="flex-1 truncate font-mono text-sm text-foreground">
                  {apiKey}
                </code>
                <button
                  onClick={copyKey}
                  className="flex items-center gap-1.5 rounded-lg border border-border bg-white px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:text-foreground"
                >
                  {copied ? <Check size={12} className="text-success" /> : <Copy size={12} />}
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
            </div>
            <p className="text-xs text-muted">
              Keep this key secret. You can regenerate it at any time in Settings.
            </p>
            <div className="flex flex-col gap-2">
              <p className="text-sm font-medium text-foreground">Configuration summary</p>
              <div className="flex gap-2 flex-wrap">
                {assets.map((a) => (
                  <span key={a} className="rounded-full border border-border px-3 py-1 text-xs font-medium text-foreground">{a}</span>
                ))}
                <span className="rounded-full border border-accent/30 bg-accent/5 px-3 py-1 text-xs font-medium text-accent capitalize">{env}</span>
              </div>
            </div>
            <Button onClick={() => router.push("/dashboard")} className="w-full rounded-xl">
              Go to dashboard
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
