/**
 * Marketing layout — wraps all public-facing pages (landing, pricing, docs).
 * Intentionally lightweight: no auth checks, no heavy providers.
 * Navbar and footer are composed here so every marketing page inherits them.
 */
export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Navbar will live here — Epic 2 */}
      <main className="flex-1">{children}</main>
      {/* Footer will live here — Epic 2 */}
    </div>
  );
}
