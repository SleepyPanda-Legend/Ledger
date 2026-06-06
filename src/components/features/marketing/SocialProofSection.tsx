/**
 * Target customer types — rendered as a clean, scannable grid.
 * No fake logos. Real specificity about who this is built for is more
 * credible than placeholder brand marks.
 */

const customers = [
  "Digital Banks",
  "Neobanks",
  "Payment Providers",
  "Remittance Platforms",
  "Treasury Software",
  "Financial Super Apps",
  "Enterprise Fintechs",
  "Cross-border Payments",
] as const;

const metrics = [
  { value: "3 mo.", label: "Average time to production" },
  { value: "1 API", label: "Covers 4 stablecoins, 3 networks" },
  { value: "MiCA", label: "EU compliance ready out of the box" },
] as const;

export default function SocialProofSection() {
  return (
    <section className="border-y border-border bg-white px-6 py-32">
      <div className="mx-auto max-w-7xl">
        {/* Metrics strip */}
        <div className="mb-24 grid gap-12 border-b border-border pb-24 sm:grid-cols-3">
          {metrics.map(({ value, label }) => (
            <div key={value} className="flex flex-col gap-2">
              <span className="text-5xl font-semibold tracking-tight text-foreground">
                {value}
              </span>
              <span className="text-sm leading-relaxed text-muted">{label}</span>
            </div>
          ))}
        </div>

        {/* Customer types */}
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:gap-24">
          <div className="shrink-0 md:w-64">
            <p className="mb-3 text-sm font-medium tracking-widest text-muted uppercase">
              Built for
            </p>
            <h2 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
              Modern fintechs.
            </h2>
          </div>

          <div className="flex flex-wrap gap-3">
            {customers.map((name) => (
              <span
                key={name}
                className="rounded-full border border-border bg-[#f9f9f9] px-5 py-2.5 text-sm font-medium text-foreground"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
