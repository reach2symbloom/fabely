"use client"

import {
  Brain,
  Search,
  BookOpen,
  SplitSquareVertical,
  Trash2,
  Activity,
  BookMarked,
  Shield,
} from "lucide-react"

const features = [
  {
    icon: Brain,
    title: "Contextual Inference",
    description:
      "Fabely understands what you mean based on where you are in your manuscript, what you are writing, and your recent work path. It infers your objective in real time.",
  },
  {
    icon: Search,
    title: "Search with AI",
    description:
      "A relational recall agent that pulls in context-blocks related to your prompt, tagged by location across chapters and notes. Your personal librarian, not an autopilot.",
  },
  {
    icon: BookOpen,
    title: "Chapter-Note Synchronicity",
    description:
      "The interface knows which notes correspond to which chapters. Assign connections manually or let the AI infer them contextually as you write.",
  },
  {
    icon: SplitSquareVertical,
    title: "Split-Screen Versioning",
    description:
      "Compare and reconcile two versions of any text side by side. Conserve key sentences from each version. Save gems for later.",
  },
  {
    icon: Trash2,
    title: "Semantic Graveyard",
    description:
      "Deleted text is archived, not lost. It remains anchored to its original context through semantic links. Kill your darlings without fear.",
  },
  {
    icon: Activity,
    title: "Dynamic Pacing Pulse",
    description:
      "A subtle vertical pulse line that shifts color based on semantic density, sentence pacing, and emotional valence. See the rhythm of your prose.",
  },
  {
    icon: BookMarked,
    title: "Automated Codex",
    description:
      "As you write, the pattern engine continuously extracts and updates character profiles, locations, and lore into a living world bible. No homework required.",
  },
  {
    icon: Shield,
    title: "Contradiction Guard",
    description:
      "The AI monitors for identity drift across your manuscript. If a detail contradicts an earlier fact, a quiet inflection icon appears. It waits for you.",
  },
]

export function Features() {
  return (
    <section id="features" className="px-6 py-24 lg:py-32">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-4 text-sm font-medium tracking-widest text-primary uppercase">
            Features
          </p>
          <h2 className="text-balance font-serif text-3xl leading-tight tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Every tool a writer needs, none they don't
          </h2>
          <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
            Eight integrated capabilities woven into a single surface. No tabs
            to manage. No context to lose. Just deeper writing.
          </p>
        </div>

        {/* Grid */}
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group relative rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:border-primary/30 hover:bg-secondary/50"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <feature.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-sm font-semibold text-foreground">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
