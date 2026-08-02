---
title: Fabely Design System
version: 1.0
status: Living Document
---

# DESIGN.md

DESIGN.md evolves alongside the design system. It records architectural decisions, guiding principles, and conventions as they emerge through design and implementation. It is expected to change over time as the system matures.


## Purpose

DESIGN.md is the architectural reference for the Fabely Design System.

It explains *why* the design system is structured the way it is. Figma defines the visual source of truth, Storybook documents the implementation, and production code brings the system to life.

### Responsibilities

- **Figma** → Visual design and design tokens
- **DESIGN.md** → Architecture, philosophy, naming, and conventions
- **Storybook** → Implementation and documentation
- **Code** → Production implementation

---

# Philosophy

## Design Tenets

### Preserve the Writing Space

The manuscript is the heart of Fabely.

Writing should feel as close as possible to the timeless experience of pen and paper. While Fabely contains sophisticated AI, semantic search, spatial organization, and research tools, those systems should remain in the background until the author intentionally invokes them.

The interface should remove friction, not add spectacle. Controls should appear when needed and disappear when they are not, allowing the writing surface to remain calm, focused, and uninterrupted.

Complexity belongs behind the manuscript—not on top of it.

---

### Human First

Fabely exists to help authors create work they could not easily create alone—not to replace them.

AI should amplify human creativity through organization, memory, retrieval, critique, and workflow assistance. While authors may choose to co-write with AI, the product should never assume generation is the primary goal.

The author remains the creator.

---

## Engineering Principles

### Semantic Design

Semantic layers describe **intent**, not implementation.

Prefer semantic names:

- Manuscript
- Heading
- Surface
- Primary

Avoid exposing implementation details as public APIs:

- Gray 500
- Shadow Large
- Sharp Serif
- Semibold

Implementation details may evolve. Semantic APIs should remain stable.

---

### Progressive Semantic Abstraction

Begin with faithful implementation.

Semantic tokens should emerge from repeated design patterns rather than being invented prematurely.

Foundations may be consumed directly during exploration. As recurring interface patterns become evident, they should be elevated into semantic tokens that express purpose rather than implementation.

Example:

```
alpha-10
alpha-25
alpha-40
```

may eventually become:

```
border-subtle
border-default
border-strong
```

Semantic abstraction is an evolution of the design system—not a prerequisite for building it.

---

# System Architecture

```text
Figma
    ↓
Foundations
    ↓
Semantic Tokens
    ↓
Components
    ↓
Product
```

---

# Foundations

Foundations are reusable visual primitives.

Current foundations include:

- Colors
- Alpha
- Typography
- Shadows
- Effects
- Radius
- Spacing
- Motion
- Iconography

Foundations should remain implementation-agnostic.

### Iconography

**Size tokens** (`packages/ui/src/foundations/iconography.css`) are the canonical icon sizing scale: `--icon-2xs` … `--icon-3xl` (8–48px). Atoms, molecules, organisms, and vendored shadcn wrappers must consume these via `var(--icon-*)` — never hardcoded px or Tailwind `size-*` utilities for icons.

**Icon glyphs** are not CSS tokens. They come from approved libraries:

- Lucide — primary system UI
- Solar Bold Duotone — illustration accents only
- Fabely Icons — brand-specific custom glyphs (catalog empty until designed)

Do not mix sets in the same interface. Full catalogs live in Storybook under Foundations → Iconography → Icon Library.

---

# Semantic Layer

Semantic tokens express design intent.

Components should consume semantic tokens whenever a reusable semantic role exists. During exploration, consuming foundation tokens directly is acceptable until stable patterns emerge.

---

# Component Layer

## Component Semantics

Workflow:

1. Match Figma faithfully.
2. Identify recurring patterns.
3. Create semantic component tokens where appropriate.
4. Refactor components to consume those semantic tokens.

Example:

```text
Button
    ↓
button.shadow.default
    ↓
shadow-md-black
```

The semantic token becomes the public API.

---

# Colors

_To be completed from Figma variables._

---

# Alpha

Alpha tokens are shared foundation primitives.

Theme behavior should occur above the alpha layer.

Direct alpha usage is acceptable during exploration. As consistent roles emerge, they should be promoted into semantic tokens.

---

# Typography

## Layer 1 — Font Definitions

Contains:

- Font families
- Semantic font weights

Does not contain:

- Sizes
- Line heights
- Text styles

---

## Layer 2 — Typography Styles

Typography styles combine:

- Family
- Weight
- Size
- Line height
- Letter spacing
- Paragraph spacing

---

## Semantic Weights

Typography exposes semantic weights.

Current mapping:

```text
Regular → Regular
Medium  → Medium
Bold    → Semibold (Gellix)
```

"Bold" is the semantic API.

"Semibold" is an implementation detail.

---

## Manuscript

Manuscript is the semantic typography role for long-form reading.

Current implementation:

```text
Manuscript
└── Sharp Serif
```

Future manuscript fonts should be introduced beneath this semantic layer without changing the API consumed by components.

Each semantic typography group should document its own implementation and rationale independently.

---

# Shadows

Shadows separate geometry from polarity.

Example:

```text
shadow-md-black

geometry → shadow-md
polarity → black
```

Components intentionally choose polarity.

Geometry should never encode theme behavior.

---

# Component Shadows

When reusable roles emerge, components should consume semantic shadow tokens instead of foundation shadows.

Example:

```text
Dialog
    ↓
dialog.shadow.surface
    ↓
shadow-lg-black
```

---

# Storybook

Storybook documents implementation.

It complements DESIGN.md rather than replacing it.

Documentation should explain what exists, demonstrate usage, and remain concise.

---

# Naming

Prefer semantic names.

Good:

- Manuscript
- Primary
- Surface
- Selected

Avoid implementation names unless documenting implementation details:

- Sharp Serif
- Semibold
- Gray 500

---

# Rules

## Always

- Preserve semantic APIs.
- Separate intent from implementation.
- Prefer composition.
- Match Figma before introducing abstractions.
- Promote recurring patterns into semantic tokens.

## Never

- Expose implementation details as public APIs.
- Hardcode reusable values.
- Couple semantic names to specific implementations.