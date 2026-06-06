import Link from "next/link";

/**
 * Auth layout — minimal, centered, distraction-free.
 * Logo anchors the user in the product; no nav links compete for attention.
 * Think Apple ID sign-in: nothing exists except the task at hand.
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-[#f9f9f9]">
      {/* Minimal header — logo only */}
      <header className="flex h-16 items-center px-8">
        <Link
          href="/"
          className="text-sm font-semibold tracking-tight text-foreground"
        >
          Ledger
        </Link>
      </header>

      {/* Centered form area */}
      <main className="flex flex-1 items-center justify-center px-6 py-12">
        {children}
      </main>
    </div>
  );
}
