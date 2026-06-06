/**
 * Three-step integration journey.
 *
 * Deliberately linear — no tabs, no toggles. The simplicity of the process
 * IS the message. Three steps to production is the headline claim.
 */

const steps = [
  {
    number: "01",
    title: "Integrate the SDK",
    description:
      "One npm install. One API key. Connect your app to USDC payments, wallet infrastructure, and settlement rails in an afternoon — not a quarter.",
    aside: "~4 hours to first transaction",
  },
  {
    number: "02",
    title: "Configure & Comply",
    description:
      "Select your stablecoin assets, target networks, and compliance profile. KYC, AML, and MiCA requirements are handled by the platform — not your engineering team.",
    aside: "MiCA, Travel Rule, AML included",
  },
  {
    number: "03",
    title: "Go Live",
    description:
      "Switch from sandbox to production with a single environment variable. FX intelligence and smart routing activate automatically. Monitor everything in the Analytics Hub.",
    aside: "~3 months to full production",
  },
] as const;

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="bg-black px-6 py-32 text-white">
      <div className="mx-auto max-w-7xl">
        {/* Section header */}
        <div className="mb-24 max-w-2xl">
          <p className="mb-4 text-sm font-medium tracking-widest text-white/40 uppercase">
            How it works
          </p>
          <h2 className="text-4xl font-semibold tracking-tight md:text-5xl">
            Three steps to production.
          </h2>
        </div>

        {/* Steps */}
        <div className="flex flex-col divide-y divide-white/8">
          {steps.map(({ number, title, description, aside }) => (
            <div
              key={number}
              className="group grid gap-8 py-14 md:grid-cols-12 md:gap-16"
            >
              {/* Step number */}
              <div className="md:col-span-1">
                <span className="font-mono text-xs tracking-widest text-white/25">
                  {number}
                </span>
              </div>

              {/* Content */}
              <div className="md:col-span-6">
                <h3 className="mb-4 text-2xl font-semibold tracking-tight">
                  {title}
                </h3>
                <p className="text-base leading-relaxed text-white/50">
                  {description}
                </p>
              </div>

              {/* Aside stat */}
              <div className="flex items-start md:col-span-5 md:justify-end">
                <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/40 backdrop-blur-sm">
                  {aside}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
