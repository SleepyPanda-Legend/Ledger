import Link from "next/link";

/**
 * Site footer — minimal by design.
 * Legal, navigation, and brand identity. Nothing decorative.
 */
export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/8 bg-black px-6 py-12 text-white">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 md:flex-row md:items-center">
        {/* Brand */}
        <Link
          href="/"
          className="text-sm font-semibold tracking-tight text-white/80 hover:text-white transition-colors duration-150"
        >
          Ledger
        </Link>

        {/* Links */}
        <nav className="flex flex-wrap gap-6">
          {[
            { label: "Product", href: "#features" },
            { label: "How it works", href: "#how-it-works" },
            { label: "Privacy", href: "/privacy" },
            { label: "Terms", href: "/terms" },
          ].map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className="text-sm text-white/30 transition-colors duration-150 hover:text-white/70"
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Copyright */}
        <p className="text-sm text-white/20">
          &copy; {year} Ledger. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
