import { Navbar } from "@/components/landing/navbar"
import { Hero } from "@/components/landing/hero"
import { Philosophy } from "@/components/landing/philosophy"
import { Features } from "@/components/landing/features"
import { HowItWorks } from "@/components/landing/how-it-works"
import { Engine } from "@/components/landing/engine"
import { Testimonial } from "@/components/landing/testimonial"
import { Pricing } from "@/components/landing/pricing"
import { CTA } from "@/components/landing/cta"
import { Footer } from "@/components/landing/footer"

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <Navbar />
      <Hero />
      <Philosophy />
      <Features />
      <HowItWorks />
      <Engine />
      <Testimonial />
      <Pricing />
      <CTA />
      <Footer />
    </main>
  )
}
