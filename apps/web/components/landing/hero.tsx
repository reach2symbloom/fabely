"use client"

import { useEffect, useRef } from "react"
import { ArrowRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Hero() {
  const cursorRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = cursorRef.current
    if (!el) return
    const interval = setInterval(() => {
      el.style.opacity = el.style.opacity === "0" ? "1" : "0"
    }, 530)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 pt-24 pb-16">
      {/* Ambient background glow */}
      <div
        className="pointer-events-none absolute top-1/4 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-20"
        style={{
          background: "radial-gradient(circle, oklch(0.78 0.12 65 / 0.4) 0%, transparent 70%)",
        }}
      />
      <div
        className="pointer-events-none absolute right-0 bottom-0 h-[400px] w-[400px] rounded-full opacity-10"
        style={{
          background: "radial-gradient(circle, oklch(0.78 0.12 65 / 0.3) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-5xl text-center">
        {/* Badge */}
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-4 py-1.5">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            AI-Powered Writing Environment
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-balance font-serif text-5xl leading-tight tracking-tight text-foreground sm:text-6xl lg:text-8xl">
          The manuscript
          <br />
          <span className="text-primary">attracts meaning</span>
          <span
            ref={cursorRef}
            className="ml-1 inline-block h-[0.85em] w-[3px] translate-y-[0.08em] bg-primary"
            style={{ transition: "opacity 0.15s" }}
          />
        </h1>

        {/* Subheadline */}
        <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground lg:text-xl">
          Fabely is a semantic writing engine that unifies research, notes, and
          manuscript into one immersive environment. Intelligence surfaces only
          when you need it. Your words stay pure.
        </p>

        {/* CTAs */}
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button
            size="lg"
            className="bg-primary px-8 text-primary-foreground hover:bg-primary/90"
          >
            Start Writing Free
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="border-border px-8 text-foreground hover:bg-secondary"
          >
            Watch Demo
          </Button>
        </div>

        {/* Trust line */}
        <p className="mt-12 text-sm text-muted-foreground">
          21 days free. No credit card required. For fiction & non-fiction writers.
        </p>
      </div>
    </section>
  )
}
