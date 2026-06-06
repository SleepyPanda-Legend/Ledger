"use client";

import { useTransition, useState } from "react";
import { Save } from "lucide-react";
import { saveAlertConfigAction } from "@/lib/actions/alerts";

interface AlertConfig {
  id: string;
  type: string;
  asset: string;
  threshold: number | null;
  enabled: boolean;
}

interface AlertConfigCardProps {
  config: AlertConfig;
}

const TYPE_LABELS: Record<string, string> = {
  rate_threshold: "Rate threshold",
  volatility_spike: "Volatility spike",
};

const TYPE_DESCRIPTIONS: Record<string, string> = {
  rate_threshold:
    "Fire when the exchange rate drops below your set threshold.",
  volatility_spike:
    "Fire when volatility is classified as High for this pair.",
};

/**
 * Alert configuration card for a single (type, asset) combination.
 * Handles enabled toggle and threshold input with optimistic save feedback.
 */
export default function AlertConfigCard({ config }: AlertConfigCardProps) {
  const [isPending, startTransition] = useTransition();
  const [enabled, setEnabled] = useState(config.enabled);
  const [threshold, setThreshold] = useState(
    config.threshold?.toString() ?? "",
  );
  const [saved, setSaved] = useState(false);

  function handleSave() {
    const fd = new FormData();
    fd.set("type", config.type);
    fd.set("asset", config.asset);
    fd.set("enabled", String(enabled));
    if (threshold) fd.set("threshold", threshold);

    startTransition(async () => {
      await saveAlertConfigAction(undefined, fd);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    });
  }

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border bg-white p-5 shadow-sm dark:bg-neutral-900 dark:border-white/5">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted">
            {config.asset}
          </p>
          <p className="mt-0.5 text-sm font-medium text-foreground">
            {TYPE_LABELS[config.type] ?? config.type}
          </p>
          <p className="mt-1 text-xs leading-relaxed text-muted">
            {TYPE_DESCRIPTIONS[config.type]}
          </p>
        </div>

        {/* Enabled toggle */}
        <button
          onClick={() => setEnabled((v) => !v)}
          aria-pressed={enabled}
          className={[
            "relative mt-0.5 h-5 w-9 shrink-0 rounded-full transition-colors duration-200",
            enabled ? "bg-accent" : "bg-gray-200 dark:bg-neutral-700",
          ].join(" ")}
        >
          <span
            className={[
              "absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200",
              enabled ? "translate-x-4" : "translate-x-0.5",
            ].join(" ")}
          />
        </button>
      </div>

      {/* Threshold input — only for rate_threshold type */}
      {config.type === "rate_threshold" && (
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-muted">
            Alert when rate drops below
          </label>
          <input
            type="number"
            value={threshold}
            onChange={(e) => setThreshold(e.target.value)}
            step="0.001"
            min="0"
            placeholder="e.g. 0.910"
            disabled={!enabled}
            className="h-9 w-full rounded-lg border border-border bg-background px-3 text-sm tabular-nums text-foreground placeholder:text-subtle focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent disabled:opacity-40"
          />
        </div>
      )}

      {/* Save button */}
      <button
        onClick={handleSave}
        disabled={isPending}
        className={[
          "flex items-center justify-center gap-1.5 rounded-lg px-4 py-2 text-xs font-medium transition-colors disabled:opacity-50",
          saved
            ? "bg-green-50 text-success border border-green-200 dark:bg-green-950/40 dark:border-green-800/40"
            : "bg-foreground/5 text-foreground hover:bg-foreground/10",
        ].join(" ")}
      >
        <Save size={12} />
        {saved ? "Saved" : isPending ? "Saving…" : "Save"}
      </button>
    </div>
  );
}
