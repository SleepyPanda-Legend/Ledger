import {
  Code2,
  TrendingUp,
  Route,
  Bell,
  ShieldCheck,
  BarChart3,
} from "lucide-react";

/**
 * The 6 core platform pillars displayed as a clean card grid.
 * Each card is self-contained — icon, name, and a single precise sentence.
 * No filler copy. Every word earns its place.
 */

const features = [
  {
    icon: Code2,
    title: "Stablecoin SDK",
    description:
      "Single API for USDC, USDT, EURC, and PYUSD. Web, iOS, and Android. Ship wallet, payment, and settlement features without touching blockchain infrastructure.",
  },
  {
    icon: TrendingUp,
    title: "FX Intelligence Engine",
    description:
      "AI-powered volatility prediction. Real-time market signals tell you exactly when to convert, hold, or hedge — before the market moves against you.",
  },
  {
    icon: Route,
    title: "Smart Routing",
    description:
      "Automatic path selection across chains and liquidity sources. Optimise for best rate, lowest fee, or fastest settlement — simultaneously.",
  },
  {
    icon: Bell,
    title: "Alert Engine",
    description:
      "Rate threshold alerts, volatility spikes, and settlement confirmations delivered via push, SMS, or voice. Customers act before windows close.",
  },
  {
    icon: ShieldCheck,
    title: "Compliance API",
    description:
      "Built-in KYC, AML screening, Travel Rule, and MiCA readiness. Drop into your existing compliance stack — no rearchitecting required.",
  },
  {
    icon: BarChart3,
    title: "Analytics Hub",
    description:
      "Real-time visibility into volume, conversion rates, corridor performance, and revenue. Actionable data without building a data team.",
  },
] as const;

export default function FeaturesSection() {
  return (
    <section id="features" className="bg-[#f9f9f9] px-6 py-32">
      <div className="mx-auto max-w-7xl">
        {/* Section header */}
        <div className="mb-20 max-w-2xl">
          <p className="mb-4 text-sm font-medium tracking-widest text-accent uppercase">
            Platform
          </p>
          <h2 className="text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
            Everything to go live.
            <br />
            <span className="text-muted">Nothing you don&apos;t need.</span>
          </h2>
        </div>

        {/* Feature grid */}
        <div className="grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, description }) => (
            <article
              key={title}
              className="group flex flex-col gap-5 bg-[#f9f9f9] p-10 transition-colors duration-200 hover:bg-white"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-foreground/5">
                <Icon
                  size={20}
                  strokeWidth={1.5}
                  className="text-foreground/70"
                />
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-base font-semibold text-foreground">
                  {title}
                </h3>
                <p className="text-sm leading-relaxed text-muted">
                  {description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
