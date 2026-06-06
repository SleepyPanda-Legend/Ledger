import { ArrowRight } from "lucide-react";
import type { Corridor } from "@/lib/utils/analytics";

interface CorridorsTableProps {
  corridors: Corridor[];
}

const NETWORK_DOTS: Record<string, string> = {
  ethereum: "bg-indigo-500",
  polygon: "bg-purple-500",
  solana: "bg-green-500",
};

/**
 * Top payment corridors table — sender/receiver country pairs ranked by volume.
 * Network dot gives a visual cue for which chain carries each corridor.
 */
export default function CorridorsTable({ corridors }: CorridorsTableProps) {
  const maxVol = Math.max(...corridors.map((c) => c.volume), 1);

  return (
    <div className="rounded-xl border border-border bg-white shadow-sm dark:bg-neutral-900 dark:border-white/5">
      {/* Header */}
      <div className="border-b border-border px-6 py-4 dark:border-white/5">
        <p className="text-sm font-semibold text-foreground">Top corridors</p>
        <p className="mt-0.5 text-xs text-muted">
          Most-used sender / receiver pairs by settled volume.
        </p>
      </div>

      {corridors.length === 0 ? (
        <div className="px-6 py-10 text-center">
          <p className="text-sm font-medium text-foreground">No corridors yet</p>
          <p className="mt-1 text-xs text-muted">
            Corridors appear once transactions settle.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border dark:border-white/5">
                {["Corridor", "Network", "Transactions", "Volume", "Share"].map(
                  (h) => (
                    <th
                      key={h}
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted last:pr-6"
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-border dark:divide-white/5">
              {corridors.map((c, i) => {
                const share = (c.volume / maxVol) * 100;
                const dot = NETWORK_DOTS[c.network] ?? "bg-gray-400";

                return (
                  <tr
                    key={`${c.from}-${c.to}`}
                    className="transition-colors hover:bg-[#f9f9f9] dark:hover:bg-neutral-800/40"
                  >
                    {/* Corridor */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-foreground">
                        <span className="text-xs font-semibold text-muted">
                          #{i + 1}
                        </span>
                        {c.from}
                        <ArrowRight size={12} className="text-subtle" />
                        {c.to}
                      </div>
                    </td>

                    {/* Network */}
                    <td className="px-6 py-4">
                      <span className="flex items-center gap-1.5 text-xs capitalize text-muted">
                        <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
                        {c.network}
                      </span>
                    </td>

                    {/* Count */}
                    <td className="px-6 py-4 text-right text-xs tabular-nums text-foreground">
                      {c.count.toLocaleString()}
                    </td>

                    {/* Volume */}
                    <td className="px-6 py-4 text-right text-xs tabular-nums font-medium text-foreground">
                      $
                      {c.volume.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                      })}
                    </td>

                    {/* Share bar */}
                    <td className="px-6 py-4 pr-6">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-20 overflow-hidden rounded-full bg-gray-100 dark:bg-neutral-700">
                          <div
                            className="h-full rounded-full bg-accent transition-all"
                            style={{ width: `${share}%` }}
                          />
                        </div>
                        <span className="text-xs tabular-nums text-muted">
                          {share.toFixed(0)}%
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
