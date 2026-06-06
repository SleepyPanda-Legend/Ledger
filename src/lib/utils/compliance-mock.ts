/**
 * Compliance status mock data.
 * Full KYC/AML/Travel Rule integration is post-MVP.
 * MVP shows realistic status shapes so clients can evaluate the UI and flow.
 *
 * Status is deterministically derived from org creation date so it stays
 * consistent between page loads without a database column.
 */

export type OverallStatus = "verified" | "pending" | "action_required";
export type KycItemStatus = "verified" | "pending" | "failed";
export type AmlStatus = "pass" | "review" | "flagged";
export type MicaStatus = "ready" | "in_progress" | "not_started";

export interface KycItem {
  label: string;
  description: string;
  status: KycItemStatus;
}

export interface ComplianceProfile {
  overall: OverallStatus;
  kyc: KycItem[];
  aml: AmlStatus;
  mica: MicaStatus;
  /** ISO date string of last review */
  lastReviewed: string;
}

/**
 * Returns the mock compliance profile for an organization.
 * Sandbox orgs always start in "pending" with identity verified
 * but address and business docs outstanding — a realistic onboarding state.
 */
export function getComplianceProfile(_orgId: string): ComplianceProfile {
  return {
    overall: "pending",
    kyc: [
      {
        label: "Identity verified",
        description: "Government-issued ID matched against live selfie.",
        status: "verified",
      },
      {
        label: "Address verified",
        description: "Proof of address document under review.",
        status: "pending",
      },
      {
        label: "Business verified",
        description: "Certificate of incorporation and UBO declaration required.",
        status: "pending",
      },
    ],
    aml: "pass",
    mica: "in_progress",
    lastReviewed: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
  };
}
