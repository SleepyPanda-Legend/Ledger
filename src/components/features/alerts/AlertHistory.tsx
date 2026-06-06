"use client";

import { useTransition } from "react";
import { X, CheckCheck, TrendingDown, Zap, CheckCircle, Bell } from "lucide-react";
import {
  markAlertReadAction,
  dismissAlertAction,
  markAllReadAction,
  clearAllAlertsAction,
} from "@/lib/actions/alerts";

interface Alert {
  id: string;
  type: string;
  asset: string | null;
  message: string;
  read: boolean;
  createdAt: Date;
}

interface AlertHistoryProps {
  alerts: Alert[];
}

const TYPE_META: Record<
  string,
  { label: string; icon: React.ReactNode; color: string }
> = {
  rate_threshold: {
    label: "Rate threshold",
    icon: <TrendingDown size={13} />,
    color:
      "text-warning bg-amber-50 border-amber-200 dark:bg-amber-950/40 dark:border-amber-800/40",
  },
  volatility_spike: {
    label: "Volatility spike",
    icon: <Zap size={13} />,
    color:
      "text-danger bg-red-50 border-red-200 dark:bg-red-950/40 dark:border-red-800/40",
  },
  tx_confirmed: {
    label: "Transaction",
    icon: <CheckCircle size={13} />,
    color:
      "text-success bg-green-50 border-green-200 dark:bg-green-950/40 dark:border-green-800/40",
  },
};

/**
 * Full alert history table on the /dashboard/alerts page.
 * Supports per-row mark-read / dismiss and bulk mark-all-read / clear-all.
 */
export default function AlertHistory({ alerts }: AlertHistoryProps) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="rounded-xl border border-border bg-white shadow-sm dark:bg-neutral-900 dark:border-white/5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-6 py-4 dark:border-white/5">
        <div>
          <h2 className="text-sm font-semibold text-foreground">
            Alert history
          </h2>
          <p className="mt-0.5 text-xs text-muted">
            {alerts.filter((a) => !a.read).length} unread ·{" "}
            {alerts.length} total
          </p>
        </div>
        <div className="flex items-center gap-3">
          {alerts.some((a) => !a.read) && (
            <button
              onClick={() =>
                startTransition(() => markAllReadAction())
              }
              disabled={isPending}
              className="flex items-center gap-1.5 text-xs text-muted transition-colors hover:text-foreground disabled:opacity-50"
            >
              <CheckCheck size={13} />
              Mark all read
            </button>
          )}
          {alerts.length > 0 && (
            <button
              onClick={() =>
                startTransition(() => clearAllAlertsAction())
              }
              disabled={isPending}
              className="text-xs text-muted transition-colors hover:text-danger disabled:opacity-50"
            >
              Clear all
            </button>
          )}
        </div>
      </div>

      {/* Empty state */}
      {alerts.length === 0 ? (
        <div className="px-6 py-12 text-center">
          <Bell size={24} className="mx-auto mb-3 text-subtle" />
          <p className="text-sm font-medium text-foreground">No alerts yet</p>
          <p className="mt-1 text-xs text-muted">
            Alerts will appear here when thresholds are crossed or transactions settle.
          </p>
        </div>
      ) : (
        <ul className="divide-y divide-border dark:divide-white/5">
          {alerts.map((alert) => {
            const meta =
              TYPE_META[alert.type] ?? {
                label: alert.type,
                icon: <Bell size={13} />,
                color: "text-muted bg-gray-50 border-gray-200",
              };

            return (
              <li
                key={alert.id}
                className={`flex items-start gap-4 px-6 py-4 transition-colors ${
                  alert.read
                    ? "opacity-60"
                    : "bg-accent/[0.02] dark:bg-accent/[0.04]"
                }`}
              >
                {/* Type icon */}
                <span
                  className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border ${meta.color}`}
                >
                  {meta.icon}
                </span>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-muted">
                      {meta.label}
                    </span>
                    {alert.asset && (
                      <span className="rounded-full bg-foreground/5 px-2 py-0.5 text-[10px] font-medium text-muted">
                        {alert.asset}
                      </span>
                    )}
                    {!alert.read && (
                      <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                    )}
                  </div>
                  <p className="mt-0.5 text-sm text-foreground">
                    {alert.message}
                  </p>
                  <p className="mt-0.5 text-xs text-subtle">
                    {new Date(alert.createdAt).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>

                {/* Row actions */}
                <div className="flex shrink-0 items-center gap-1.5 pt-0.5">
                  {!alert.read && (
                    <button
                      onClick={() =>
                        startTransition(() => markAlertReadAction(alert.id))
                      }
                      disabled={isPending}
                      aria-label="Mark as read"
                      className="rounded p-1 text-muted transition-colors hover:bg-foreground/5 hover:text-foreground disabled:opacity-50"
                    >
                      <CheckCheck size={13} />
                    </button>
                  )}
                  <button
                    onClick={() =>
                      startTransition(() => dismissAlertAction(alert.id))
                    }
                    disabled={isPending}
                    aria-label="Dismiss"
                    className="rounded p-1 text-muted transition-colors hover:bg-red-50 hover:text-danger disabled:opacity-50 dark:hover:bg-red-950/40"
                  >
                    <X size={13} />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
