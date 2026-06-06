import { auth } from "@/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { getComplianceProfile } from "@/lib/utils/compliance-mock";
import ComplianceBanner from "@/components/features/compliance/ComplianceBanner";
import KycCard from "@/components/features/compliance/KycCard";
import AmlIndicator from "@/components/features/compliance/AmlIndicator";
import MicaBadge from "@/components/features/compliance/MicaBadge";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Compliance" };

/**
 * Compliance status page — server component.
 * All data is mocked at MVP with realistic shapes.
 * Full KYC/AML/Travel Rule integration (Persona, Onfido, Chainalysis) is post-MVP.
 */
export default async function CompliancePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const membership = await db.organizationMember.findFirst({
    where: { userId: session.user.id },
    include: { organization: true },
  });
  if (!membership) redirect("/dashboard/onboarding");

  const { organization } = membership;
  const profile = getComplianceProfile(organization.id);

  return (
    <div className="flex flex-col gap-8">
      {/* Page title */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Compliance
        </h1>
        <p className="mt-1 text-sm text-muted">
          KYC, AML, and regulatory status for your organisation.
        </p>
      </div>

      {/* Overall status banner */}
      <ComplianceBanner status={profile.overall} orgName={organization.name} />

      {/* KYC + AML side by side on large screens */}
      <div className="grid gap-6 lg:grid-cols-2">
        <KycCard items={profile.kyc} />
        <AmlIndicator status={profile.aml} lastReviewed={profile.lastReviewed} />
      </div>

      {/* MiCA full width */}
      <MicaBadge status={profile.mica} />
    </div>
  );
}
