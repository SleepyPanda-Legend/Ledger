import Link from "next/link";

/**
 * Bottom-of-page CTA — the last thing a visitor sees before they leave or convert.
 * Single question, single action. No alternatives, no distractions.
 */
export default function CtaSection() {
  return (
    <section className="bg-black px-6 py-40 text-center text-white">
      <div className="mx-auto max-w-3xl">
        <h2 className="mb-6 text-5xl font-semibold tracking-tight md:text-6xl">
          Ready to launch?
        </h2>
        <p className="mb-12 text-lg leading-relaxed text-white/40">
          Join the fintechs shipping stablecoin products in months — not years.
          Your API key is one click away.
        </p>
        <Link
          href="/login"
          className="inline-flex rounded-full bg-white px-10 py-4 text-base font-medium text-black transition-opacity duration-150 hover:opacity-85"
        >
          Get API Access
        </Link>
      </div>
    </section>
  );
}
