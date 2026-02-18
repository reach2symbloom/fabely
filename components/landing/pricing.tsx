import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"

const plans = [
  {
    name: "Writer",
    price: "Free",
    period: "for 21 days",
    description: "Everything you need to start writing with AI-powered tools.",
    features: [
      "Unlimited manuscripts",
      "Semantic pattern engine",
      "Chapter-note synchronicity",
      "Semantic Graveyard",
      "Automated Codex harvesting",
      "Community support",
    ],
    cta: "Start Free Trial",
    highlighted: false,
  },
  {
    name: "Author",
    price: "$19",
    period: "/month",
    description:
      "For serious writers who want the full power of Fabely's intelligence.",
    features: [
      "Everything in Writer",
      "Bring your own AI keys",
      "Contextual inference engine",
      "AI-powered search & recall",
      "Split-screen versioning",
      "Dynamic pacing pulse",
      "Contradiction guard",
      "Highlight model training",
      "Priority support",
    ],
    cta: "Start Writing",
    highlighted: true,
  },
  {
    name: "Studio",
    price: "$49",
    period: "/month",
    description:
      "For professional authors and small publishers managing multiple projects.",
    features: [
      "Everything in Author",
      "Unlimited projects",
      "Project export & import",
      "Revision history",
      "Advanced AI instructions",
      "Mobile idea capture",
      "Dedicated support",
    ],
    cta: "Contact Us",
    highlighted: false,
  },
]

export function Pricing() {
  return (
    <section id="pricing" className="px-6 py-24 lg:py-32">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-4 text-sm font-medium tracking-widest text-primary uppercase">
            Pricing
          </p>
          <h2 className="text-balance font-serif text-3xl leading-tight tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Start for free, scale with your craft
          </h2>
          <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
            21 days free, no credit card required. Upgrade when you are ready for
            the full suite of intelligent writing tools.
          </p>
        </div>

        {/* Cards */}
        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col rounded-xl border p-8 transition-all duration-300 ${
                plan.highlighted
                  ? "border-primary/50 bg-primary/5"
                  : "border-border bg-card hover:border-primary/20"
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                    Most Popular
                  </span>
                </div>
              )}

              <div>
                <h3 className="text-sm font-semibold text-foreground">
                  {plan.name}
                </h3>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="font-serif text-4xl font-bold text-foreground">
                    {plan.price}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {plan.period}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {plan.description}
                </p>
              </div>

              <ul className="my-8 flex flex-col gap-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span className="text-sm text-muted-foreground">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-auto">
                <Button
                  className={`w-full ${
                    plan.highlighted
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  }`}
                >
                  {plan.cta}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
