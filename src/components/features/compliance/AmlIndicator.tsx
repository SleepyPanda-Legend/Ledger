import { CheckCircle, AlertTriangle, XOctagon, Activity } from "lucide-react";
import type { AmlStatus } from "@/lib/utils/compliance-mock";

interface AmlIndicatorProps {
  status: AmlStatus;
  lastReviewed: string;
}

const CONFIG: Record<
  AmlStatus,
  {
    label: string;
    description: string;
    icon: typeof CheckCircle;
    iconClass: string;
    badgeClass: string;
    barClass: string;
    barWidth: string;
  }
> = {
  pass: {
    label: "Pass",
    description:
      "No suspicious activity detected. Transaction patterns are within normal parameters.",
    icon: CheckCircle,
    iconClass: "text-success",
    badgeClass:
      "bg-green-50 text-green-700 border-green-200 dark:bg-green-950/40 dark:text-green-400 dark:border-green-800/40",
    barClass: "bg-success",
    barWidth: "w-[20%]",
  },
  review: {
    label: "Under Review",
    description:
      "Automated screening flagged a transaction pattern for manual review. No action required yet.",
    icon: AlertTriangle,
    iconClass: "text-warning",
    badgeClass:
      "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800/40",
    barClass: "bg-warning",
    barWidth: "w-[60%]",
  },
  flagged: {
    label: "Flagged",
    description:
      "High-risk indicators detected. Account activity may be restricted pending review.",
    icon: XOctagon,
    iconClass: "text-danger",
    badgeClass:
      "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-800/40",
    barClass: "bg-danger",
    barWidth: "w-full",
  },
};

/**
 * AML screening status card.
 * Risk score represented as a visual bar (low fill = low risk).
 */
export default function AmlIndicator({
  status,
  lastReviewed,
}: AmlIndicatorProps) {
  const {
    label,
    description,
    icon: Icon,
    iconClass,
    badgeClass,
    barClass,
    barWidth,
  } = CONFIG[status];

  return (
    <div className="rounded-xl border border-border bg-white shadow-sm dark:bg-neutral-900 dark:border-white/5">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-border px-5 py-4 dark:border-white/5">
        <Activity size={15} className="text-accent" />
        <div>
          <p className="text-sm font-semibold text-foreground">
            Anti-Money Laundering (AML)
          </p>
          <p className="text-xs text-muted">
            Last screened {lastReviewed}
          </p>
        </div>
        <span
          className={`ml-auto rounded-full border px-2.5 py-0.5 text-xs font-medium ${badgeClass}`}
        >
          {label}
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-col gap-4 px-5 py-4">
        <div className="flex items-start gap-3">
          <Icon size={16} className={`mt-0.5 shrink-0 ${iconClass}`} />
          <p className="text-sm text-muted">{description}</p>
        </div>

        {/* Risk level bar */}
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <p className="text-xs font-medium text-muted">Risk level</p>
            <p className={`text-xs font-semibold ${iconClass}`}>{label}</p>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-neutral-700">
            <div
              className={`h-full rounded-full transition-all duration-500 ${barClass} ${barWidth}`}
            />
          </div>
          <div className="mt-1 flex justify-between text-[10px] text-subtle">
            <span>Low</span>
            <span>Medium</span>
            <span>High</span>
          </div>
        </div>
      </div>
    </div>
  );
}
