export function Testimonial() {
  return (
    <section className="px-6 py-24 lg:py-32">
      <div className="mx-auto max-w-4xl text-center">
        <div
          className="pointer-events-none absolute left-1/2 h-px w-48 -translate-x-1/2"
          style={{
            background:
              "linear-gradient(90deg, transparent, oklch(0.78 0.12 65 / 0.4), transparent)",
          }}
        />
        <blockquote className="relative">
          <p className="font-serif text-2xl leading-relaxed text-foreground italic sm:text-3xl lg:text-4xl">
            {'"'}I am weaving existing thought into flow. The manuscript is not
            built — it is attracted. Every note, every fragment of research,
            finds its place in the narrative like iron filings drawn to a
            magnet.{'"'}
          </p>
          <footer className="mt-8">
            <p className="text-sm font-semibold text-primary">
              The Fabely Design Manifesto
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              On the philosophy of emergent writing tools
            </p>
          </footer>
        </blockquote>
      </div>
    </section>
  )
}
