import RouteComparisonPanel from "./RouteComparisonPanel";
import RoutingDecisionLog from "./RoutingDecisionLog";

interface RoutingTx {
  id: string;
  toAddress: string;
  asset: string;
  amount: number;
  network: string;
  fee: number | null;
  status: string;
  routeId: string | null;
  createdAt: Date;
}

interface RoutingDashboardProps {
  transactions: RoutingTx[];
}

/**
 * Smart Routing dashboard.
 * RouteComparisonPanel is fully client-interactive (no server data needed).
 * RoutingDecisionLog is server-populated and rendered as a static table.
 */
export default function RoutingDashboard({ transactions }: RoutingDashboardProps) {
  return (
    <div className="flex flex-col gap-8">
      {/* Section: Route comparison */}
      <section className="flex flex-col gap-3">
        <div>
          <h2 className="text-base font-semibold text-foreground">
            Route comparison
          </h2>
          <p className="mt-0.5 text-xs text-muted">
            Enter an amount to compare fees, speed, and rates across all
            available networks. Smart Routing selects the optimal path
            automatically.
          </p>
        </div>
        <RouteComparisonPanel />
      </section>

      {/* Section: Routing decision log */}
      <section className="flex flex-col gap-3">
        <div>
          <h2 className="text-base font-semibold text-foreground">
            Decision log
          </h2>
          <p className="mt-0.5 text-xs text-muted">
            Every transaction's routing decision — network, fee, and the reason
            it was selected.
          </p>
        </div>
        <RoutingDecisionLog transactions={transactions} />
      </section>
    </div>
  );
}
