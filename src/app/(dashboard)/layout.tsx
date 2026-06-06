import { auth } from "@/auth";
import { redirect } from "next/navigation";

/**
 * Dashboard layout — server component that gates all /dashboard/* routes.
 *
 * Auth is checked here as a second line of defence (middleware is the first).
 * Having both prevents edge cases where middleware is bypassed (e.g. direct
 * Server Action calls or mismatched matcher patterns).
 *
 * The full sidebar and header shell will be built in Epic 3 (Onboarding & Auth).
 */
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar — Epic 3 */}
      <aside className="hidden w-64 shrink-0 border-r border-border lg:flex lg:flex-col">
        <div className="flex h-16 items-center border-b border-border px-6">
          <span className="text-sm font-semibold tracking-tight text-foreground">
            Ledger
          </span>
        </div>
        {/* Nav items — Epic 3 */}
      </aside>

      {/* Main content area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header — Epic 3 */}
        <header className="flex h-16 shrink-0 items-center border-b border-border px-6">
          <div className="ml-auto flex items-center gap-4">
            {/* Alerts bell, user menu — Epic 3 & 7 */}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
