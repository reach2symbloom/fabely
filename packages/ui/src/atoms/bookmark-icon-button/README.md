# Bookmark Icon Button

Bare icon toggle — no button chrome at all. Three states: unselected
(stroked outline, `alpha-20` rest → `alpha-50` hover), selected (solid
filled glyph, `primary`). Entering selected plays a one-shot "captured"
celebration — see Motion below.

## Purpose

Fabely bookmark / save affordance. Composes Base UI's headless
[`Toggle`](https://base-ui.com/react/components/toggle) primitive directly —
not the styled [Toggle](../../primitives/toggle/README.md) atom, which
carries pill/ghost/outline chrome this control deliberately has none of.

## Sources

| Source | Role |
| --- | --- |
| Figma [Bookmark Icon Button](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=16066-5970) (`16066:5970`) | Visual — Hover × Active |
| [Base UI Toggle](https://base-ui.com/react/components/toggle) | Headless pressed API — `aria-pressed` / `data-pressed` |

## Composition

```text
BookmarkIconButton → Base UI Toggle (headless, unstyled) + Lucide Bookmark + Superscript badge + useSelectionCelebration (pop + star burst)
```

Fetching the raw Figma SVG assets (not just the screenshot) showed unselected
and selected are genuinely different shapes, not the same path recolored:
unselected/hover share one path drawn as a stroked outline; selected is a
separate, solid-filled path. `BookmarkIconButton` reproduces that with the same
Lucide glyph rendered two ways — stroke-only when unselected, filled when
selected — rather than a single shape with a fill-opacity trick.

| State | Color | Rendering |
| --- | --- | --- |
| Unselected, rest | `--theme-alpha-black-switch-20` | stroke, `fill="none"` |
| Unselected, hover | `--theme-alpha-black-switch-50` | stroke, `fill="none"` |
| Selected (pressed), rest or hover | `--primary` | filled, `stroke-width={0}` |

Color transition uses Foundations `--duration-fast` / `--ease-emphasized`.
Hover-only color step is scoped with `not-data-pressed:not-aria-pressed:hover:`
so it never fights the selected-state color rule.

**Entering selected plays a one-shot "captured" celebration — never the
reverse.** Lives entirely in the shared
[`useSelectionCelebration`](../../hooks/use-selection-celebration.tsx) hook,
not duplicated here — [Pin Icon Button](../../pin-icon-button/README.md)
uses the exact same hook, so both controls run on identical timing by
construction, not by convention (a design goal stated explicitly, after an
earlier pass had two independently-tuned copies). The hook compares
`pressed` against a ref of its previous value each render; only the
unselected→selected edge (`justSelected`) triggers anything. Deselecting is
a plain CSS unfill (the color transition above), nothing more — celebrating
a *removal* would read backwards. Two coordinated pieces, both keyed off
that same edge and both starting together (not sequenced):

1. **Icon pop** — an imperative `useAnimate()` call (not the declarative
   `animate` prop: this needs to *replay* an identical keyframe sequence
   every time the edge fires, not settle at a differing target value) on a
   `motion.span` wrapping just the glyph (`ref={iconScope}` from the hook):
   `scale: [1, 1.2, 0.96, 1]` over `0.4`s, `times: [0, 0.3, 0.65, 1]` —
   overshoot past 1, undershoot slightly, settle. Reads as a crisp "landed"
   confirmation, not a bounce. Color/fill is untouched, still the plain CSS
   `transition-colors` above; Motion only ever owns this scale.
2. **Star/glint burst** — 5 small Lucide `Sparkle` glyphs (an odd count so
   the spread doesn't read as a mechanical square/hexagon), each a
   static-`rotate`d wrapper (sets direction) around a `motion.span` that
   animates its own local `y` + `opacity` + `scale` — rotating the parent
   first means "move up" in the child's local space already points
   radially outward, so no per-star trig is needed. Size (5–8px), starting
   offset, travel distance (8–12px), and duration (0.3–0.4s) all vary
   slightly per star so the burst doesn't read as one uniform ring. Fires
   almost immediately (`0.03`s base delay) plus a very slight per-star
   stagger (`0.015`s) — essentially simultaneous with the icon pop, not
   sequenced after it. **Stacks behind the glyph** (`z-0` on the burst vs.
   `z-10` on the icon wrapper) so the icon stays visually on top
   throughout — the stars read as emerging from behind it, not overlapping
   in front. Pure Motion + a Lucide icon (already a dependency elsewhere in
   this codebase) — no particle/confetti library. Absolutely positioned
   (`pointer-events-none`) inside the same `relative` icon span the
   superscript badge already uses, so it can never affect layout or hit
   targets; the whole burst unmounts once the last star's own animation
   completes, leaving nothing behind.

Both respect `prefers-reduced-motion` — `useReducedMotion()` short-circuits
the whole `justSelected` branch, so reduced-motion users just see the
state change (color) with no pop, no stars. This benefits every consumer
of this atom automatically, including
[Gather Bookmark Button](../../features/note-retrieved/gather-bookmark-button/README.md),
which layers its own label-crossfade and layout/FLIP animation on top —
the two don't conflict: this atom's `scale` transform doesn't affect the
box Motion's `layout` measures for FLIP purposes.

The optional count badge (Figma `Show superscript`, `16231:7082`/`7091`) sits
absolute at `-top-2 left-4` of the Icon box, `paragraph-mini-medium`
typography at a `10px` override, `--muted-foreground` text, `--spacing-2xs` /
`--spacing-3xs` padding. Visibility is `showSuperscript && pressed`, decided
by the shared [`useSuperscript`](../../hooks/use-superscript.ts) hook — the
same rule Icon Button and Chapter Nav Button will reuse for their own
deferred superscript axis.

## API

| Prop | Default | Notes |
| --- | --- | --- |
| `pressed` / `defaultPressed` / `onPressedChange` | — | From Base UI Toggle |
| `size` | `default` | `sm` / `default` / `lg` — glyph size only, no hit-target chrome |
| `showSuperscript` | `false` | Figma `Show superscript`; badge only renders while `pressed` |
| `superscriptValue` | `2` | Badge content; Figma default is the literal "2" |
| `forceHover` | `false` | Storybook-only — locks the hover paint via `data-force-hover` without a real pointer |
| `trailingContent` | — | Extra content inside this same button, after the glyph — e.g. [Gather Bookmark Button](../../features/note-retrieved/gather-bookmark-button/README.md)'s revealed label, sharing this button's click target/cursor instead of sitting as an inert sibling |
| `aria-label` | auto | `"Bookmark"` off · `"Remove bookmark"` on |

There is no `variant` or `roundness` prop — this control has no container
chrome for either to style.

## Tokens

| Concern | Foundations |
| --- | --- |
| Glyph (default size) | Lucide · `--icon-md` (Figma 20) |
| Glyph (`sm` / `lg`) | `--icon-sm` / `--icon-lg` |
| Color | `currentColor` ← `--theme-alpha-black-switch-20` / `-50` / `--primary` |
| Color motion | `--duration-fast` / `--ease-emphasized` |
| Celebration star color | `--primary` |
| Celebration pop | `0.4`s, `ease-emphasized`, keyframes `[1, 1.2, 0.96, 1]` at `[0, 0.3, 0.65, 1]` |
| Celebration stars | 5 (Lucide `Sparkle`), 5–8px, travel 8–12px, `0.3–0.4`s each, `ease-out`, `0.03`s base delay + `0.015`s/star stagger — shared with Pin Icon Button via `useSelectionCelebration` |
| Focus | `--effect-focus-ring-secondary` |

## Deferred

- **Press ripple / global push effect** — deferred with Toggle; shared
  Foundations recipe later. See
  [post-primitives docket](../../../.migration/post-primitives-docket.md).
