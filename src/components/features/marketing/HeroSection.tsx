import Link from "next/link";

/**
 * Landing page hero — the single most important screen.
 *
 * Design intent: pure restraint. Dark field, one headline, one sub-line,
 * two actions. Nothing competes for attention. Think Apple.com circa 2013.
 */
export default function HeroSection() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-black px-6 text-center">
      {/* Subtle radial glow — depth without decoration */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(0,102,255,0.12) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 flex flex-col items-center gap-8">
        {/* Badge */}
        <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium tracking-wide text-white/60 backdrop-blur-sm">
          B2B Stablecoin Infrastructure
        </span>

        {/* Headline */}
        <h1 className="max-w-4xl text-5xl font-semibold leading-tight tracking-tight text-white md:text-6xl lg:text-7xl">
          Launch Stablecoin Products in Months,{" "}
          <span className="text-white/40">Not Years.</span>
        </h1>

        {/* Sub-headline */}
        <p className="max-w-2xl text-lg font-normal leading-relaxed text-white/50 md:text-xl">
          Full-stack stablecoin infrastructure for banks, fintechs, and payment
          providers. SDK, FX intelligence, smart routing, compliance — one
          integration.
        </p>

        {/* Actions */}
        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <Link
            href="/login"
            className="rounded-full bg-white px-8 py-3.5 text-sm font-medium text-black transition-opacity duration-150 hover:opacity-85"
          >
            Get API Access
          </Link>
          <Link
            href="#how-it-works"
            className="rounded-full border border-white/15 px-8 py-3.5 text-sm font-medium text-white/70 transition-colors duration-150 hover:border-white/30 hover:text-white"
          >
            See how it works
          </Link>
        </div>

        {/* Social proof stat */}
        <div className="mt-4 flex items-center gap-6 text-sm text-white/30">
          <span>
            <strong className="text-white/70">18 months</strong> → 3 months
          </span>
          <span className="h-3.5 w-px bg-white/10" />
          <span>
            <strong className="text-white/70">1 API</strong> · 4 stablecoins ·
            3 networks
          </span>
          <span className="h-3.5 w-px bg-white/10" />
          <span>
            <strong className="text-white/70">MiCA</strong> ready
          </span>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="h-8 w-px bg-gradient-to-b from-transparent to-white/20" />
      </div>
    </section>
  );
}
