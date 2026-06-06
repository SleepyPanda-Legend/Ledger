import type { Metadata } from "next";
import FxDashboard from "@/components/features/fx/FxDashboard";

export const metadata: Metadata = { title: "FX Intelligence" };

/**
 * FX Intelligence Engine page.
 * Server component — no data to pre-fetch since rates are mocked client-side.
 * FxDashboard handles all refresh and animation logic client-side.
 */
export default function FxPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          FX Intelligence
        </h1>
        <p className="mt-1 text-sm text-muted">
          Live stablecoin exchange rates with AI-powered volatility signals.
        </p>
      </div>

      <FxDashboard />
    </div>
  );
}
