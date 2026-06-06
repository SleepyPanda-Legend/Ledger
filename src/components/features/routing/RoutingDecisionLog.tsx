import { DollarSign, Zap, TrendingUp } from "lucide-react";
import { truncateAddress } from "@/services/stablecoin";

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

interface RoutingDecisionLogProps {
  transactions: RoutingTx[];
}

const NETWORK_META: Record<string, { dot: string; label: string }> = {
  ethereum: { dot: "bg-indigo-500", label: "Ethereum" },
  polygon: { dot: "bg-purple-500", label: "Polygon" },
  solana: { dot: "bg-green-500", label: "Solana" },
};

/**
 * Derives a human-readable routing decision from network + fee.
 * At MVP the routeId is stored but the "why" is reconstructed here
 * from the fee tier, matching the logic in getRouteOptions().
 */
function deriveDecisionLabel(
  network: string,
  fee: number | null,
): { label: string; icon: typeof DollarSign } {
  if (network === "solana") return { label: "Lowest fee", icon: DollarSign };
  if (network === "polygon") return { label: "Fastest viable", icon: Zap };
  return { label: "Best rate", icon: TrendingUp };
}

const STATUS_COLORS: Record<string, string> = {
  settled: "text-success",
  confirmed: "text-accent",
  pending: "text-warning",
  failed: "text-danger",
};

/**
 * Routing decision log — shows each transaction's network path and the
 * Smart Routing rationale so clients can audit decisions.
 */
export default function RoutingDecisionLog({
  transactions,
}: RoutingDecisionLogProps) {
  if (transactions.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-white shadow-sm dark:bg-neutral-900 dark:border-white/5">
        <div className="border-b border-border px-6 py-4 dark:border-white/5">
          <h2 className="text-sm font-semibold text-foreground">
            Routing decision log
          </h2>
        </div>
        <div className="px-6 py-12 text-center">
          <p className="text-sm font-medium text-foreground">No decisions yet</p>
          <p className="mt-1 text-xs text-muted">
            Routing decisions will appear here after your first transfer.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-white shadow-sm dark:bg-neutral-900 dark:border-white/5">
      <div className="border-b border-border px-6 py-4 dark:border-white/5">
        <h2 className="text-sm font-semibold text-foreground">
          Routing decision log
        </h2>
        <p className="mt-0.5 text-xs text-muted">
          Network path chosen by Smart Routing per transaction.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border dark:border-white/5">
              {["Date", "To", "Asset", "Amount", "Network", "Fee", "Decision", "Status"].map(
                (h) => (
                  <th
                    key={h}
                    className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted last:pr-6"
                  >
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-border dark:divide-white/5">
            {transactions.map((tx) => {
              const net =
                NETWORK_META[tx.network] ?? { dot: "bg-gray-400", label: tx.network };
              const { label: decisionLabel, icon: DecisionIcon } =
                deriveDecisionLabel(tx.network, tx.fee);
              const statusColor =
                STATUS_COLORS[tx.status] ?? "text-muted";

              return (
                <tr
                  key={tx.id}
                  className="transition-colors duration-100 hover:bg-[#f9f9f9] dark:hover:bg-neutral-800/40"
                >
                  <td className="whitespace-nowrap px-5 py-4 text-xs text-muted">
                    {new Date(tx.createdAt).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="px-5 py-4 font-mono text-xs text-foreground">
                    {truncateAddress(tx.toAddress)}
                  </td>
                  <td className="px-5 py-4 text-xs font-medium text-foreground">
                    {tx.asset}
                  </td>
                  <td className="px-5 py-4 text-right text-xs tabular-nums text-foreground">
                    {tx.amount.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                    })}
                  </td>
                  <td className="px-5 py-4">
                    <span className="flex items-center gap-1.5 text-xs capitalize text-foreground">
                      <span className={`h-1.5 w-1.5 rounded-full ${net.dot}`} />
                      {net.label}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right text-xs tabular-nums text-muted">
                    ${(tx.fee ?? 0) < 0.01
                      ? (tx.fee ?? 0).toFixed(4)
                      : (tx.fee ?? 0).toFixed(2)}
                  </td>
                  <td className="px-5 py-4">
                    <span className="flex items-center gap-1 text-xs text-muted">
                      <DecisionIcon size={11} />
                      {decisionLabel}
                    </span>
                  </td>
                  <td className="px-5 py-4 pr-6">
                    <span
                      className={`text-xs font-medium capitalize ${statusColor}`}
                    >
                      {tx.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
