import { auth } from "@/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import Sidebar from "@/components/features/dashboard/Sidebar";
import DashboardHeader from "@/components/features/dashboard/DashboardHeader";

/**
 * Dashboard shell — server component that gates all /dashboard/* routes.
 * Fetches session + org data once here so child pages don't repeat the lookup.
 * Auth is double-checked here as a second line of defence after middleware.
 */
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const membership = await db.organizationMember.findFirst({
    where: { userId: session.user.id },
    include: { organization: true },
  });

  // New users without an org get sent to onboarding
  if (!membership && !children) redirect("/dashboard/onboarding");

  const orgName = membership?.organization.name ?? "Ledger";
  const userName = session.user.name ?? session.user.email ?? "User";

  return (
    <div className="flex h-screen overflow-hidden bg-[#f9f9f9]">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <DashboardHeader userName={userName} orgName={orgName} />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
