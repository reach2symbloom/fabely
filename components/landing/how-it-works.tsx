import Image from "next/image"

const steps = [
  {
    number: "01",
    title: "Write in a Pure Space",
    description:
      "Begin with a distraction-free manuscript canvas. Beautiful serif typography, warm tones, and nothing between you and the page. The tool disappears so your prose can breathe.",
  },
  {
    number: "02",
    title: "Let the Graph Build Itself",
    description:
      "As you write, the semantic pattern engine silently harvests characters, places, themes, and connections into a living knowledge graph. No manual entry. No lore homework.",
  },
  {
    number: "03",
    title: "Touch and Meaning Emerges",
    description:
      "Select a phrase, hover over a name, or pause at a structural boundary. Intelligence surfaces exactly at the inflection point — related notes, contradictions, or style suggestions.",
  },
  {
    number: "04",
    title: "Weave Notes into Narrative",
    description:
      "Transfer context-blocks between research, notes, and manuscript with fluid ease. The semantic graph keeps everything linked, so nothing is ever truly separate.",
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="px-6 py-24 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="grid items-start gap-16 lg:grid-cols-2 lg:gap-20">
          {/* Left: Image */}
          <div className="relative lg:sticky lg:top-32">
            <div className="overflow-hidden rounded-2xl border border-border bg-card">
              <Image
                src="/images/semantic-web.jpg"
                alt="Visualization of a semantic knowledge graph with glowing amber nodes connected by luminous threads"
                width={640}
                height={480}
                className="h-auto w-full object-cover"
              />
            </div>
            <div
              className="pointer-events-none absolute -bottom-8 -left-8 h-40 w-40 rounded-full opacity-25"
              style={{
                background:
                  "radial-gradient(circle, oklch(0.78 0.12 65 / 0.5) 0%, transparent 70%)",
              }}
            />
          </div>

          {/* Right: Steps */}
          <div>
            <p className="mb-4 text-sm font-medium tracking-widest text-primary uppercase">
              How It Works
            </p>
            <h2 className="text-balance font-serif text-3xl leading-tight tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              Weaving thought into flow
            </h2>
            <p className="mt-4 mb-12 text-pretty text-lg leading-relaxed text-muted-foreground">
              Four seamless phases of writing — research, notes, organization,
              and manuscript — unified by a semantic engine that understands your
              intent.
            </p>

            <div className="flex flex-col gap-10">
              {steps.map((step, i) => (
                <div key={step.number} className="group flex gap-6">
                  <div className="flex flex-col items-center">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-primary/30 text-sm font-semibold text-primary">
                      {step.number}
                    </span>
                    {i < steps.length - 1 && (
                      <div className="mt-3 h-full w-px bg-border" />
                    )}
                  </div>
                  <div className="pb-2">
                    <h3 className="text-lg font-semibold text-foreground">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
