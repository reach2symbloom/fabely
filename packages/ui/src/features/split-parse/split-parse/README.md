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

- **"Parse here"** uses `--muted-foreground` (quieter than Figma's flat
  black/white — a background affordance, not a primary action), already
  flips light/dark on its own (see colors.css), so it needs no override.
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

## Hover on the dashed rule (not in Figma)

Figma exports a single `Default & hover` variant for the clickable row —
no distinct hover swatch. A hover state was added anyway: the row's own
`group` class deepens both dashed rules from `--theme-alpha-black-switch-10`
to full alpha (`-100`) on hover, via a second `group-hover:` gradient (swapped instead of
animated — animating a `background-image` gradient's color stops doesn't
tween in CSS, so `transition-[background-image]` is present but has
nothing to interpolate; the visible change is an instant swap). Only the
`default`-state row gets `group`/hover — `split-created`'s rules are a
static status display.

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
   than two rules changing independently.
6. **420–580ms** — the undo icon fades/slides in, only once the rule has
   fully resolved to solid (not fading in against a still-wiping line).

Reverse (undo) is deliberately simpler and quicker — ~300ms, a "cancel,"
not a re-parse: no snip, both rules retreat together rather than
travelling in sequence, and the undo icon fades out immediately rather
than lingering.

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
| Text color ("Parse here") | `--muted-foreground` |
| Text color ("Note parsed") | `--tw-raw-pantones-ginseng` / `dark:` `--tw-raw-pantones-ginseng-light` |
| Dashed line, `default` (rest / hover) | `--theme-alpha-black-switch-10` / `-100` |
| Solid line, `split-created` | `--tw-raw-fia-200` |
