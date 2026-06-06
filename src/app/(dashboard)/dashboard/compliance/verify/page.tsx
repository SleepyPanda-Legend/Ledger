import { ArrowLeft, Lock, FileText, Building2, User } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Complete Verification" };

const STEPS = [
  {
    icon: User,
    title: "Identity verification",
    description:
      "Upload a government-issued photo ID (passport or national ID card). A live selfie is required for liveness check.",
    status: "done" as const,
  },
  {
    icon: FileText,
    title: "Address verification",
    description:
      "Provide a proof of address document dated within the last 3 months (utility bill, bank statement, or official letter).",
    status: "pending" as const,
  },
  {
    icon: Building2,
    title: "Business verification",
    description:
      "Upload your Certificate of Incorporation, a list of Ultimate Beneficial Owners (UBOs), and a signed declaration.",
    status: "pending" as const,
  },
];

/**
 * Stub verification flow page.
 * Full KYC/AML integration (Persona, Onfido, etc.) is post-MVP.
 * This page shows the verification steps and a placeholder upload UI
 * so the end-to-end demo flow is complete.
 */
export default function VerifyPage() {
  return (
    <div className="flex flex-col gap-8">
      {/* Back nav */}
      <div>
        <Link
          href="/dashboard/compliance"
          className="flex items-center gap-1.5 text-xs text-muted transition-colors hover:text-foreground"
        >
          <ArrowLeft size={12} />
          Back to Compliance
        </Link>
      </div>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Complete verification
        </h1>
        <p className="mt-1 text-sm text-muted">
          Complete all three steps to unlock full platform access and go live.
        </p>
      </div>

      {/* Steps */}
      <div className="flex flex-col gap-5">
        {STEPS.map(({ icon: Icon, title, description, status }, i) => (
          <div
            key={title}
            className="flex gap-5 rounded-xl border border-border bg-white p-6 shadow-sm dark:bg-neutral-900 dark:border-white/5"
          >
            {/* Step number + connector */}
            <div className="flex flex-col items-center gap-2">
              <div
                className={[
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold",
                  status === "done"
                    ? "bg-success/10 text-success"
                    : "bg-foreground/5 text-muted",
                ].join(" ")}
              >
                {i + 1}
              </div>
              {i < STEPS.length - 1 && (
                <div className="w-px flex-1 bg-border dark:bg-white/10" />
              )}
            </div>

            {/* Content */}
            <div className="flex min-w-0 flex-1 flex-col gap-3 pb-2">
              <div className="flex items-center gap-2">
                <Icon size={15} className="text-accent" />
                <p className="text-sm font-semibold text-foreground">{title}</p>
                {status === "done" && (
                  <span className="rounded-full border border-green-200 bg-green-50 px-2 py-0.5 text-[10px] font-medium text-green-700 dark:bg-green-950/40 dark:text-green-400 dark:border-green-800/40">
                    Completed
                  </span>
                )}
              </div>
              <p className="text-sm text-muted">{description}</p>

              {status === "pending" && (
                <div className="mt-1 flex items-center gap-3 rounded-lg border border-dashed border-border p-4">
                  <Lock size={14} className="shrink-0 text-subtle" />
                  <p className="text-xs text-muted">
                    Document upload available in live environment.{" "}
                    <span className="font-medium text-accent">
                      Integration via Persona / Onfido — post-MVP.
                    </span>
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Sandbox notice */}
      <div className="rounded-xl border border-border bg-[#f9f9f9] px-6 py-4 dark:bg-neutral-800/50 dark:border-white/5">
        <p className="text-xs text-muted">
          <span className="font-medium text-foreground">Sandbox mode</span> —
          verification documents cannot be submitted in this environment. Connect
          your production credentials to enable the full KYC/AML flow.
        </p>
      </div>
    </div>
  );
}
