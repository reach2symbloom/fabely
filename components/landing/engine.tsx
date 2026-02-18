import Image from "next/image"

export function Engine() {
  return (
    <section id="engine" className="px-6 py-24 lg:py-32">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-4 text-sm font-medium tracking-widest text-primary uppercase">
            The Pattern Engine
          </p>
          <h2 className="text-balance font-serif text-3xl leading-tight tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            A semantic graph that understands your story
          </h2>
          <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
            Under the hood, Fabely is a general pattern engine that interprets
            meaning and relational affinity between contexts of any size —
            statements, paragraphs, sections, or entire motifs.
          </p>
        </div>

        {/* Visual */}
        <div className="relative mt-16 overflow-hidden rounded-2xl border border-border bg-card">
          <Image
            src="/images/writing-interface.jpg"
            alt="Sleek dark UI of the Fabely writing application showing a clean editor with connected notes panel"
            width={1200}
            height={600}
            className="h-auto w-full object-cover"
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-12">
            <div className="grid gap-6 sm:grid-cols-3">
              {[
                {
                  label: "Semantic Anchors",
                  value: "Persistent identity for every statement, resilient to edits within a tolerable semantic radius.",
                },
                {
                  label: "Intent Classification",
                  value: "Tracks how far edits drift from prior meaning using embeddings and intent analysis.",
                },
                {
                  label: "Atomic Context",
                  value: "Builds understanding atomically — from a single phrase to an entire chapter's arc.",
                },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-sm font-semibold text-primary">{stat.label}</p>
                  <p className="mt-1 text-sm leading-relaxed text-foreground/80">
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
