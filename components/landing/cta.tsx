import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function CTA() {
  return (
    <section className="px-6 py-24 lg:py-32">
      <div className="relative mx-auto max-w-4xl overflow-hidden rounded-2xl border border-primary/20 bg-primary/5 px-8 py-16 text-center sm:px-16">
        {/* Glow */}
        <div
          className="pointer-events-none absolute top-0 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-30"
          style={{
            background:
              "radial-gradient(circle, oklch(0.78 0.12 65 / 0.5) 0%, transparent 70%)",
          }}
        />

        <h2 className="relative font-serif text-3xl leading-tight tracking-tight text-foreground sm:text-4xl lg:text-5xl">
          Your story is waiting
        </h2>
        <p className="relative mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
          Join writers who have discovered the power of meaning-driven writing.
          Start your 21-day free trial today.
        </p>
        <div className="relative mt-8">
          <Button
            size="lg"
            className="bg-primary px-8 text-primary-foreground hover:bg-primary/90"
          >
            Start Writing Free
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  )
}
