import { AlertTriangle, CheckCircle, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";
import type { OverallStatus } from "@/lib/utils/compliance-mock";

interface ComplianceBannerProps {
  status: OverallStatus;
  orgName: string;
}

const CONFIG: Record<
  OverallStatus,
  {
    label: string;
    description: string;
    icon: typeof CheckCircle;
    className: string;
    iconClass: string;
    showCta: boolean;
  }
> = {
  verified: {
    label: "Verified",
    description: "Your organization has passed all KYC, AML, and compliance checks.",
    icon: CheckCircle,
    className:
      "border-green-200 bg-green-50 dark:border-green-800/40 dark:bg-green-950/20",
    iconClass: "text-success",
    showCta: false,
  },
  pending: {
    label: "Verification Pending",
    description:
      "Your compliance review is in progress. Some checks are outstanding — complete them to unlock full access.",
    icon: Clock,
    className:
      "border-amber-200 bg-amber-50 dark:border-amber-800/40 dark:bg-amber-950/20",
    iconClass: "text-warning",
    showCta: true,
  },
  action_required: {
    label: "Action Required",
    description:
      "One or more compliance checks have failed. Immediate action is required to keep your account active.",
    icon: AlertTriangle,
    className:
      "border-red-200 bg-red-50 dark:border-red-800/40 dark:bg-red-950/20",
    iconClass: "text-danger",
    showCta: true,
  },
};

/**
 * Full-width compliance status banner.
 * Renders at the top of the compliance page to give instant status visibility.
 */
export default function ComplianceBanner({
  status,
  orgName,
}: ComplianceBannerProps) {
  const { label, description, icon: Icon, className, iconClass, showCta } =
    CONFIG[status];

  return (
    <div
      className={`flex items-start gap-4 rounded-xl border p-5 ${className}`}
    >
      <Icon size={20} className={`mt-0.5 shrink-0 ${iconClass}`} />

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-semibold text-foreground">{orgName}</p>
          <span
            className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${className} ${iconClass}`}
          >
            {label}
          </span>
        </div>
        <p className="mt-1 text-sm text-muted">{description}</p>
      </div>

      {showCta && (
        <Link
          href="/dashboard/compliance/verify"
          className="flex shrink-0 items-center gap-1.5 rounded-lg bg-foreground px-4 py-2 text-xs font-medium text-background transition-opacity hover:opacity-80"
        >
          Complete verification
          <ArrowRight size={12} />
        </Link>
      )}
    </div>
  );
}
