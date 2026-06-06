import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/features/marketing/Footer";

/**
 * Marketing layout — wraps all public-facing pages.
 * Navbar is fixed/floating; Footer anchors the page.
 * No auth checks — this is the public surface of the product.
 */
export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}
