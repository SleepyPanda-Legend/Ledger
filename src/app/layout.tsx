import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

/**
 * Inter loaded via next/font — zero layout shift, self-hosted automatically.
 * Mirrors SF Pro's neutrality; the closest open-source equivalent.
 */
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Ledger",
    template: "%s | Ledger",
  },
  description:
    "Stablecoin infrastructure platform. Launch compliant stablecoin products in months, not years.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"
  ),
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f9f9f9" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

/**
 * Root layout — wraps every page in the app.
 * Keep this shell thin: no providers here unless truly global.
 * Feature-specific providers (QueryClient, etc.) belong in nested layouts.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full`} suppressHydrationWarning>
      <body className="min-h-full bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}
