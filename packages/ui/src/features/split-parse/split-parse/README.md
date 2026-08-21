# Split & Parse

Inline manuscript-editor row: click to mark a split point ("Parse here"),
which flips to a confirmation row ("Note parsed") with an undo trigger.
Icon fused to a rule on the left; a second rule fills the right, so the
label reads centered in whatever width the row hugs. The flip between the
two states is Motion-animated — see below.

Root is a `<div>` in both states, not a `<button>` — `split-created` nests
a real `<button>` (the undo trigger), and a `<button>` can never validly
contain another one. `default`'s clickability is `role="button"` +
Enter/Space handling on that same div. A stable root element/type across
both states is also what makes the transition animatable at all: swapping
element types would force React to unmount and recreate the whole subtree
on every state change instead of animating between two renders of it.

## Sources

| Source | Role |
| --- | --- |
| Figma [Split & parse](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=16095-208) (`16095:208`) | Visual — State × Mode |
| [Icon Button](../../../primitives/button/icon-button/README.md) `fade` variant | The undo trigger — Figma's own "Fade button" (`12042:25189`), reused as-is |

## No `mode`/`surface` prop — Figma's Mode is just app theme

An earlier pass read Figma's `Mode=Light`/`Dark` as "which surface this row
sits on" and added a `surface: 'default' | 'primary'` prop, pairing
`foreground`/`primary-foreground`. Wrong: it decoupled the "Note parsed"
Ginseng color (a manual choice tied to the prop) from `foreground` (which
already auto-switches with the app's real light/dark theme) — the two
could desync whenever the prop and the actual app theme disagreed. Figma's
`Mode` really is just the app's own theme here, not a separate context.

Removed. Now:

- **"Parse here"** rests at 0.6 alpha over `--foreground` (quieter than
  Figma's flat black/white — a background affordance, not a primary
  action; visually identical to `--muted-foreground`, see the hover
  section below for why it's expressed as opacity instead), already flips
  light/dark on its own (see colors.css), so it needs no override.
- **"Note parsed"** uses `--tw-raw-pantones-ginseng` with a `dark:` override
  to `--tw-raw-pantones-ginseng-light` (Figma's exact two swatches —
  `16095:250` Light, `16095:262` Dark) — Ginseng has no switch-token
  equivalent, so `dark:` is the direct way to pair it with the same theme
  `--foreground`/`--muted-foreground` already follow.

Storybook's own theme toolbar toggle (not a story prop) is what shows the
dark-mode look — see Overview.

## `default`-state rule is a dashed gradient, not `border-dashed`

Figma's stroke settings: Dashed, Dash `6`, Gap `6`, butt cap. CSS's native
`border-style: dashed` can't hit a specific dash/gap length — the browser
picks its own ratio. Reproduced instead as a
`repeating-linear-gradient(to right, color 0, color 6px, transparent 6px, transparent 12px)`
background on a thin (`--stroke-thin`) strip: exact 6px/6px, and a
gradient's segments are naturally flat-ended, matching Figma's butt cap
with no extra config.

## Hover: a directional activation sweep (not in Figma)

Figma exports a single `Default & hover` variant for the clickable row —
no distinct hover swatch. `useSplitParseHover` (component file, above
`useSplitParseTransition`) drives a left-to-right "activation sweep"
instead of a static brighten, entirely separate from the click transition
below — different Motion values, never reading or writing them, and
firing only for the `default`-state row (`split-created`'s rules are a
static status display, no hover wiring at all).

Hover-in (~360ms, inside the requested 300-450ms):

1. **0–100ms** — the scissors icon brightens first (opacity 0.6 → 1).
2. **60–210ms** — the left rule lights left-to-right.
3. **170–280ms** — "Parse here" brightens, as the left sweep nears its end
   ("reaching the center").
4. **200–360ms** — the right rule lights left-to-right in turn, completing
   the path all the way to the row's right edge — the right side always
   finishes fully lit, never left dim.

Hover-out (~200ms, inside the requested 180-260ms) retreats faster and in
the opposite order (right rule, then label, then left rule, then icon) —
since each sweep's own `clip-path` formula un-reveals from the same edge
it grew from, animating the same values back to 0 reads as the activation
reversing, not a different animation.

**Implementation** — each rule (`TransformingLine`) gets a third,
nested layer: a full-alpha copy of the same dash pattern, revealed by its
own `clip-path` driven by a hover-specific progress value (`leftSweep`/
`rightSweep`). Nested *inside* the existing dashed layer, so it's
automatically cropped by that layer's own clip too — it can never show
through once the click transition has moved a row past its dashed state.
The icon and label use the same "opaque color + animated opacity"
technique the click-transition's icon fix already established (see
`useSplitParseHover`'s own comment for why opacity, not a `color` tween,
is what's animated throughout — Motion can't interpolate between two
different CSS custom properties, and doesn't need to here since
`--muted-foreground` **is** `--foreground` at 60% alpha).

**`prefers-reduced-motion`** — every hover value jumps straight to its
target, no sweep, no stagger; verified live (Playwright, `reducedMotion:
'reduce'`) to reach full alpha within one render frame of hovering.

## `split-created`-state rule is solid Fia brand color, not dashed (not in Figma)

Figma keeps the same dashed rule for both states. Changed here: once a
split is confirmed, the rule reads as a solid line in `--tw-raw-fia-200`
(the same token Badge's `fia` variant uses — see `primitives/badge`) —
a settled/confirmed state visually contrasted against the still-pending
dashed rule on the `default` row.

## Undo trigger reuses Icon Button's `fade` variant verbatim

Figma's own "Fade button" (`12042:25189`) — near-invisible face
(`--theme-alpha-white-switch-001`), dimmed glyph at rest, full opacity on
hover — is already wrapped as `IconButton`'s `fade` variant (see
[Icon Button](../../../primitives/button/icon-button/README.md)). Reused
directly here, with `size`/`rounded`/padding overridden via `className` to
match this row's `16px` footprint (Icon Button's smallest built-in slot,
`mini`, is `28px`) — the same override pattern
[Gather Bookmark Button](../../../features/note-retrieved/gather-bookmark-button/README.md)
used for its non-square chevron column.

## The `default` ↔ `split-created` transition (Motion, not in Figma)

Figma only specifies the two resting states; the flip between them is
built to read as "the note is actively being parsed," not a crossfade.
`useSplitParseTransition` (top of the component file) owns the whole
sequence, keyed off genuine *changes* to the `state` prop — mounting
directly into either state renders it at rest, nothing animates in.

Forward (click "Parse here"), ~580ms total, inside the requested
450–600ms window:

0. **0ms** — the undo icon's `16px` + gap footprint is reserved in the
   right rule's flex row immediately (`reserveUndoSlot`) — not the icon
   itself, just its layout space. See "No overshoot on the right rule"
   below for why.
1. **0–180ms** — the scissors icon "snips": a quick rotate/scale/fade
   baked into its own `AnimatePresence` `exit` keyframes (not a separate
   imperative animation) as it starts leaving.
2. **0–220ms** — the left rule (icon-adjacent) wipes/cuts left-to-right.
3. **160ms** — icon crossfades scissors → a hand-built check-circle (see
   below), its checkmark drawing in via `pathLength`.
4. **200ms** — label crossfades "Parse here" → "Note parsed" (small `y`
   offset, same technique as
   [Gather Bookmark Button](../../../features/note-retrieved/gather-bookmark-button/README.md)'s
   label swap).
5. **200–420ms** — the right rule wipes in turn, continuing the same
   travelling cut through to the row's right edge — not simultaneous with
   the left rule, so the cut reads as passing *through* the label rather
   than two rules changing independently. Grows directly to its resting
   length (the space from step 0 is already final-width) — no
   overshoot-and-retract when the icon appears next.
6. **420–580ms** — the undo icon fades/slides in (its space already
   exists), only once the rule has fully resolved to solid (not fading in
   against a still-wiping line), and doesn't move the rule when it does.

Reverse (undo) is deliberately simpler and quicker — ~280ms, a "cancel,"
not a re-parse: no snip, but still one continuous cascade, not two rules
retreating in parallel — the solid rule un-resolves as a single sequence,
right side first (where the forward cut finished), then left (picking up
before right is fully done, so the two read as one continuous unwind back
to the scissors, not two separate moves) — and the undo icon fades out
immediately rather than lingering.

**Rule wipe** — `TransformingLine` stacks two layers (the dashed
`repeating-linear-gradient` and the solid Fia line) with complementary
`clip-path: inset(...)` values driven by one shared Motion value
(`useTransform`). At `progress=0` only the dashed layer shows, at `1` only
the solid — animating between them reads as the solid line growing into
place while the dashed one is cut away ahead of it, not a crossfade. The
same component renders both resting states too (`progress` just sits at 0
or 1, no transition in flight) — it isn't transition-only scaffolding.

**Check-circle draws in, not `<CircleCheckIcon />`** — Motion's
`pathLength` draw-in needs a `motion.path` of its own; Lucide's pre-built
icon components don't expose child paths individually. Hand-built from
Lucide's own `circle-check` node data (`circle cx=12 cy=12 r=10` + `path
d="m9 12 2 2 4-4"`, copied verbatim) plus Lucide's exact default SVG props,
so it's pixel-identical to the real icon — only the checkmark `path`
animates `pathLength`; the circle just fades/scales with the rest of the
icon.

**Muted/hover opacity lives on a nested `<g>`, not the animated `<svg>`** —
the scissors `motion.svg`'s own `opacity` is already Motion-controlled
(mount/exit, 0↔1); an inline style always beats a CSS `:hover` rule on the
*same* element, so the two can't share one node. CSS `opacity` on a nested
`<g>` composes multiplicatively with the outer motion-controlled opacity
instead, so `rest = 1 × 0.6`, `hover = 1 × 1`, `mid-exit = (fading) × 0.6`
— all correct without the two systems fighting over one property.

**`prefers-reduced-motion`** — every animated value jumps straight to its
target with no keyframes, no `pathLength` draw, no snip; verified live
(Playwright, `reducedMotion: 'reduce'`) to settle within one render frame.

**No overshoot on the right rule** — the right rule's `flex-1` share used
to have the whole row's remaining width to itself until `showUndo` flipped
true near the end, at which point the icon's `16px` + gap suddenly ate
into that space and the rule's own final edge snapped backward. Fixed by
splitting "is the icon's *space* reserved" (`reserveUndoSlot`, true for
the whole transition) from "is the icon itself *visible*" (`showUndo`,
still only true near the end) — a fixed-size wrapper span reserves the
footprint from step 0 regardless of whether the icon inside it is
currently rendered, so `rightProgress` always animates against the same
final width and grows directly to it.

**Undo returns to rest, not "still hovering"** — clicking Undo puts the
mouse cursor right where the button used to be; the DOM swap back to
`default` content at that same screen position fires a real `mouseenter`
on the row with no actual pointer motion behind it (Chromium was observed
firing this more than once across the reverse transition's ~280ms run,
not just once at the very start). Left unhandled, the row would replay
the hover-in sweep the instant it returns to rest. `useSplitParseHover`
suppresses activation for a window sized to outlast the whole reverse
transition — see its own comment, and the `SUPPRESS_PHANTOM_HOVER_MS`
comment specifically, for why this is a time window rather than an event
check (`event.movementX`/`movementY` looked like a cleaner fix but proved
unreliable — see that comment) and for why hover tracks two independent
booleans (pointer-over, focused) rather than a shared counter (a counter
desyncs the moment a source's activate/deactivate calls aren't 1:1, which
these synthesized re-hovers aren't).

## API

| Prop | Default | Notes |
| --- | --- | --- |
| `state` | `'default'` | `'default'` ("Parse here", clickable) or `'split-created'` ("Note parsed", with undo) |
| `onParse` | — | Fires when the `default`-state row is clicked |
| `onUndo` | — | Fires when the `split-created`-state undo trigger is clicked |

## Tokens

| Concern | Foundations |
| --- | --- |
| Icon size | `--icon-md` (20px) |
| Undo glyph / footprint | `--icon-sm` (16px) |
| Row padding | `--spacing-2xs` top (4px) / `--spacing-3xs` bottom (2px) |
| Row gap | `--spacing-xs` (8px) |
| Icon-to-line gap | `--spacing-3xs` (2px) |
| Label typography | `--text-paragraph-mini-medium-*` |
| Text color ("Parse here") | `--foreground` at 0.6→1 opacity (hover sweep) |
| Text color ("Note parsed") | `--tw-raw-pantones-ginseng` / `dark:` `--tw-raw-pantones-ginseng-light` |
| Dashed line, `default` (rest / hover-lit) | `--theme-alpha-black-switch-10` / `-100` |
| Solid line, `split-created` | `--tw-raw-fia-200` |
