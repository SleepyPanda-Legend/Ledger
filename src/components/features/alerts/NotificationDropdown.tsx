"use client";

import { useRef, useState, useEffect, useTransition } from "react";
import { Bell, X, CheckCheck, TrendingDown, Zap, CheckCircle } from "lucide-react";
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

interface NotificationDropdownProps {
  alerts: Alert[];
  unreadCount: number;
}

const TYPE_ICON: Record<string, React.ReactNode> = {
  rate_threshold: <TrendingDown size={13} />,
  volatility_spike: <Zap size={13} />,
  tx_confirmed: <CheckCircle size={13} />,
};

const TYPE_COLOR: Record<string, string> = {
  rate_threshold: "text-warning bg-amber-50 dark:bg-amber-950/40",
  volatility_spike: "text-danger bg-red-50 dark:bg-red-950/40",
  tx_confirmed: "text-success bg-green-50 dark:bg-green-950/40",
};

function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

/**
 * Bell icon + notification dropdown in the dashboard header.
 * Renders up to 10 most recent alerts. Mark-read / dismiss / clear all
 * are optimistic — they fire server actions and React re-renders via revalidatePath.
 */
export default function NotificationDropdown({
  alerts,
  unreadCount,
}: NotificationDropdownProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  function handleMarkRead(id: string) {
    startTransition(() => markAlertReadAction(id));
  }

  function handleDismiss(id: string) {
    startTransition(() => dismissAlertAction(id));
  }

  function handleMarkAllRead() {
    startTransition(() => markAllReadAction());
  }

  function handleClearAll() {
    startTransition(() => clearAllAlertsAction());
  }

  const recent = alerts.slice(0, 10);

  return (
    <div className="relative" ref={ref}>
      {/* Bell button */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={`Notifications — ${unreadCount} unread`}
        className="relative flex h-8 w-8 items-center justify-center rounded-full bg-foreground/5 text-muted transition-colors hover:bg-foreground/10 hover:text-foreground"
      >
        <Bell size={14} />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-danger text-[10px] font-semibold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown panel */}
      {open && (
        <div className="absolute right-0 top-10 z-50 w-80 overflow-hidden rounded-xl border border-border bg-white shadow-md dark:bg-neutral-900 dark:border-white/5">
          {/* Panel header */}
          <div className="flex items-center justify-between border-b border-border px-4 py-3 dark:border-white/5">
            <span className="text-sm font-semibold text-foreground">
              Notifications
            </span>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  disabled={isPending}
                  className="flex items-center gap-1 text-xs text-muted transition-colors hover:text-foreground disabled:opacity-50"
                >
                  <CheckCheck size={12} />
                  Mark all read
                </button>
              )}
              {alerts.length > 0 && (
                <button
                  onClick={handleClearAll}
                  disabled={isPending}
                  className="text-xs text-muted transition-colors hover:text-danger disabled:opacity-50"
                >
                  Clear all
                </button>
              )}
            </div>
          </div>

          {/* Alert list */}
          {recent.length === 0 ? (
            <div className="px-4 py-8 text-center">
              <Bell size={20} className="mx-auto mb-2 text-subtle" />
              <p className="text-sm font-medium text-foreground">All clear</p>
              <p className="mt-0.5 text-xs text-muted">No notifications right now.</p>
            </div>
          ) : (
            <ul className="max-h-80 divide-y divide-border overflow-y-auto dark:divide-white/5">
              {recent.map((alert) => {
                const iconColor =
                  TYPE_COLOR[alert.type] ?? "text-muted bg-gray-50";
                const icon = TYPE_ICON[alert.type] ?? <Bell size={13} />;

                return (
                  <li
                    key={alert.id}
                    className={`flex items-start gap-3 px-4 py-3 transition-colors ${
                      alert.read ? "opacity-60" : "bg-accent/[0.03]"
                    }`}
                  >
                    {/* Type icon */}
                    <span
                      className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${iconColor}`}
                    >
                      {icon}
                    </span>

                    {/* Content */}
                    <div className="min-w-0 flex-1">
                      <p className="text-xs leading-snug text-foreground line-clamp-2">
                        {alert.message}
                      </p>
                      <p className="mt-0.5 text-[10px] text-subtle">
                        {timeAgo(alert.createdAt)}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex shrink-0 items-center gap-1 pt-0.5">
                      {!alert.read && (
                        <button
                          onClick={() => handleMarkRead(alert.id)}
                          disabled={isPending}
                          aria-label="Mark as read"
                          className="text-muted transition-colors hover:text-foreground disabled:opacity-50"
                        >
                          <CheckCheck size={12} />
                        </button>
                      )}
                      <button
                        onClick={() => handleDismiss(alert.id)}
                        disabled={isPending}
                        aria-label="Dismiss"
                        className="text-muted transition-colors hover:text-danger disabled:opacity-50"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}

          {/* Footer link to full alerts page */}
          <div className="border-t border-border dark:border-white/5">
            <a
              href="/dashboard/alerts"
              onClick={() => setOpen(false)}
              className="block px-4 py-3 text-center text-xs font-medium text-accent transition-colors hover:bg-accent/5"
            >
              View all alerts & configure thresholds →
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
