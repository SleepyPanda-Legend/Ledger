import { CheckCircle, Clock, XCircle, ShieldCheck } from "lucide-react";
import type { KycItem, KycItemStatus } from "@/lib/utils/compliance-mock";

interface KycCardProps {
  items: KycItem[];
}

const ITEM_CONFIG: Record<
  KycItemStatus,
  { icon: typeof CheckCircle; iconClass: string; labelClass: string }
> = {
  verified: {
    icon: CheckCircle,
    iconClass: "text-success",
    labelClass: "text-foreground",
  },
  pending: {
    icon: Clock,
    iconClass: "text-warning",
    labelClass: "text-foreground",
  },
  failed: {
    icon: XCircle,
    iconClass: "text-danger",
    labelClass: "text-foreground",
  },
};

const STATUS_BADGE: Record<KycItemStatus, { label: string; className: string }> =
  {
    verified: {
      label: "Verified",
      className:
        "bg-green-50 text-green-700 border-green-200 dark:bg-green-950/40 dark:text-green-400 dark:border-green-800/40",
    },
    pending: {
      label: "Pending",
      className:
        "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800/40",
    },
    failed: {
      label: "Failed",
      className:
        "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-800/40",
    },
  };

/**
 * KYC status card with per-check checklist.
 * Each item shows icon, label, description, and a status badge.
 */
export default function KycCard({ items }: KycCardProps) {
  const verifiedCount = items.filter((i) => i.status === "verified").length;

  return (
    <div className="rounded-xl border border-border bg-white shadow-sm dark:bg-neutral-900 dark:border-white/5">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-border px-5 py-4 dark:border-white/5">
        <ShieldCheck size={15} className="text-accent" />
        <div>
          <p className="text-sm font-semibold text-foreground">
            Know Your Customer (KYC)
          </p>
          <p className="text-xs text-muted">
            {verifiedCount} of {items.length} checks passed
          </p>
        </div>

        {/* Progress bar */}
        <div className="ml-auto h-1.5 w-24 overflow-hidden rounded-full bg-gray-100 dark:bg-neutral-700">
          <div
            className="h-full rounded-full bg-accent transition-all duration-500"
            style={{ width: `${(verifiedCount / items.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Checklist */}
      <ul className="divide-y divide-border dark:divide-white/5">
        {items.map((item) => {
          const { icon: Icon, iconClass, labelClass } = ITEM_CONFIG[item.status];
          const badge = STATUS_BADGE[item.status];

          return (
            <li key={item.label} className="flex items-start gap-4 px-5 py-4">
              <Icon size={16} className={`mt-0.5 shrink-0 ${iconClass}`} />
              <div className="min-w-0 flex-1">
                <p className={`text-sm font-medium ${labelClass}`}>
                  {item.label}
                </p>
                <p className="mt-0.5 text-xs text-muted">{item.description}</p>
              </div>
              <span
                className={`shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-medium ${badge.className}`}
              >
                {badge.label}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
