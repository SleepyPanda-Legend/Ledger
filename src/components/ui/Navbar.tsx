"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

/**
 * Top navigation bar for all marketing pages.
 *
 * Becomes opaque on scroll — matches Apple's translucent-then-solid pattern.
 * Kept deliberately minimal: logo, 3 nav links, one primary CTA.
 */
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-black/90 backdrop-blur-xl border-b border-white/8"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-lg font-semibold tracking-tight text-white">
            Ledger
          </span>
        </Link>

        {/* Nav links — hidden on mobile */}
        <ul className="hidden items-center gap-8 md:flex">
          {[
            { label: "Product", href: "#features" },
            { label: "How it works", href: "#how-it-works" },
            { label: "Pricing", href: "#pricing" },
          ].map(({ label, href }) => (
            <li key={label}>
              <Link
                href={href}
                className="text-sm font-medium text-white/70 transition-colors duration-150 hover:text-white"
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <Link
          href="/login"
          className="rounded-full bg-white px-5 py-2 text-sm font-medium text-black transition-opacity duration-150 hover:opacity-80"
        >
          Get API Access
        </Link>
      </nav>
    </header>
  );
}
