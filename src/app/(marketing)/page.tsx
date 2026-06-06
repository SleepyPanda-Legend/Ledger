import HeroSection from "@/components/features/marketing/HeroSection";
import FeaturesSection from "@/components/features/marketing/FeaturesSection";
import HowItWorksSection from "@/components/features/marketing/HowItWorksSection";
import SocialProofSection from "@/components/features/marketing/SocialProofSection";
import CtaSection from "@/components/features/marketing/CtaSection";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ledger — Stablecoin Infrastructure for Modern Fintechs",
  description:
    "Launch compliant stablecoin products in months, not years. SDK, FX intelligence, smart routing, compliance API — one integration.",
};

/**
 * Marketing landing page — the top of the funnel.
 * Sections are composed in order of narrative importance:
 * hook → proof → mechanism → audience → conversion.
 */
export default function MarketingPage() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <SocialProofSection />
      <CtaSection />
    </>
  );
}
