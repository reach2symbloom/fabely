import Image from "next/image"

export function Philosophy() {
  return (
    <section className="relative overflow-hidden px-6 py-24 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Text */}
          <div>
            <p className="mb-4 text-sm font-medium tracking-widest text-primary uppercase">
              Our Philosophy
            </p>
            <h2 className="text-balance font-serif text-3xl leading-tight tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              A surface that becomes intelligent only when touched
            </h2>
            <p className="mt-6 text-pretty text-lg leading-relaxed text-muted-foreground">
              Fabely respects the minimalist sanctity of the writing experience.
              Your manuscript remains pure. The intelligence remains latent.
              Meaning emerges exactly when you are ready to see it.
            </p>
            <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
              Tools surface only at semantic inflection points: a selection, a
              pause, a structural boundary, or a rhetorical transition. No
              clutter. No interruptions. Just flow.
            </p>

            {/* Design principles */}
            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              {[
                {
                  title: "Immersive Writing",
                  desc: "The writing experience is always beautiful. No distractions, only the craft.",
                },
                {
                  title: "Emergent Tooling",
                  desc: "Intelligence appears at semantic inflection points. Never before.",
                },
                {
                  title: "Lossless by Design",
                  desc: "Every deleted sentence is archived. Kill your darlings without fear.",
                },
                {
                  title: "Unified Workspace",
                  desc: "Research, notes, and manuscript flow together in one seamless environment.",
                },
              ].map((item) => (
                <div key={item.title} className="group">
                  <h3 className="text-sm font-semibold text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Image */}
          <div className="relative">
            <div className="overflow-hidden rounded-2xl border border-border bg-card">
              <Image
                src="/images/hero-manuscript.jpg"
                alt="A manuscript notebook illuminated by warm golden light on a dark desk, evoking the literary writing experience"
                width={640}
                height={480}
                className="h-auto w-full object-cover"
                priority
              />
            </div>
            {/* Decorative glow */}
            <div
              className="pointer-events-none absolute -right-12 -bottom-12 h-48 w-48 rounded-full opacity-30"
              style={{
                background:
                  "radial-gradient(circle, oklch(0.78 0.12 65 / 0.5) 0%, transparent 70%)",
              }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
