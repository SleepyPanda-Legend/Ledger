"use client";

import { useState } from "react";
import { Copy, Check, Eye, EyeOff } from "lucide-react";
import Button from "@/components/ui/Button";

interface ApiKeyPanelProps {
  apiKey: string;
}

/**
 * API key display with copy and reveal/hide toggle.
 * Key is masked by default — only shown on explicit user action.
 * Copy confirmation resets after 2 seconds.
 */
export default function ApiKeyPanel({ apiKey }: ApiKeyPanelProps) {
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);

  const maskedKey = apiKey.slice(0, 8) + "••••••••••••••••••••" + apiKey.slice(-4);

  async function copy() {
    await navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <section className="rounded-xl border border-border bg-white p-6 shadow-sm">
      <h2 className="mb-1 text-sm font-semibold text-foreground">API Key</h2>
      <p className="mb-4 text-xs text-muted">
        Use this key to authenticate SDK requests. Keep it secret.
      </p>

      <div className="flex items-center gap-3 rounded-lg border border-border bg-[#f9f9f9] px-4 py-3">
        <code className="flex-1 truncate font-mono text-sm text-foreground">
          {revealed ? apiKey : maskedKey}
        </code>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setRevealed((r) => !r)}
            className="text-muted transition-colors hover:text-foreground"
            aria-label={revealed ? "Hide API key" : "Reveal API key"}
          >
            {revealed ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
          <button
            onClick={copy}
            className="text-muted transition-colors hover:text-foreground"
            aria-label="Copy API key"
          >
            {copied ? <Check size={14} className="text-success" /> : <Copy size={14} />}
          </button>
        </div>
      </div>

      <p className="mt-3 text-xs text-subtle">
        To regenerate your API key, contact support. Regeneration invalidates all existing integrations.
      </p>
    </section>
  );
}
