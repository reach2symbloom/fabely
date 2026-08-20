# Gather Bookmark Button

Split control for pinning a note/answer into a scene from the Gather panel:
a bookmark toggle, an always-visible label (Gather mode), and a menu chevron.

## Purpose

Distinct from the [Bookmark Button](../../../atoms/bookmark-icon-button/README.md)
atom — that one is a bare icon toggle usable anywhere; this composite wraps
it with Gather-specific chrome (chip housing, "Add to scene" / "Remove from
scene" copy, a menu trigger) and belongs only in the Gather panel context.
`Gather` and `Roam` modes share one fill/divider/color model — the *only*
difference between them is whether the label renders. An earlier pass gave
Gather a transparent, hover-reveal-everything treatment distinct from Roam's
always-housed one; they're unified now, by product decision, not because
Figma's own mockup shows them that way (it still differs there too).
Storybook groups it under **Features/Gather** even though its folder is
`features/note-retrieved/`, matching the existing convention set by
[Fia Answer](../fia-answer/README.md) — the sidenav was renamed to "Gather"
without renaming the underlying folder.

## Sources

| Source | Role |
| --- | --- |
| Figma [Bookmark Button](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=16228-3535) (`16228:3535`) | Visual — Mode × Active × Hover, chip + label + chevron |
| [Button Group](../../../primitives/button-group/README.md) | Joins the two segments — geometry, hug-width, focus z-index |
| [Icon Button](../../../primitives/button/icon-button/README.md) | The chevron trigger |
| [Bookmark Button](../../../atoms/bookmark-icon-button/README.md) atom | The toggle itself — including its own click target for the revealed label, via `trailingContent` |

## Composition

```text
GatherBookmarkButton → ButtonGroup (always housed, alpha-333)
  ├── BookmarkIconButton atom (padding + own hover-deepen; label passed as `trailingContent`, inside the same button)
  ├── ButtonGroupSeparator (always rendered)
  └── IconButton (chevron, "ghost", own hover-deepen; identical color/fill to the bookmark segment)
```

**The label is inside the button, not next to it.** The first pass rendered
the revealed "Add to scene" text as a sibling `<span>` beside the
`BookmarkIconButton` atom — visually attached, but not part of its click target,
so hovering/clicking the text itself didn't show the pointer cursor or
toggle anything. Fixed by adding an optional `trailingContent` slot to the
`BookmarkIconButton` atom itself (rendered inside the same `<button>`, after the
glyph) — this composite passes the label through it instead of placing it
outside. The atom's own standalone usage is unaffected; the prop defaults to
nothing.

**First pass hand-rolled one outer `<div>` with a single shared hover wash
and a hand-built divider.** That's wrong for two reasons the raw Figma data
confirms: `get_metadata` shows the rest instance is 44px wide with *no
divider element in the tree at all* (hover/active instances that include one
measure 53px) — a shared div reserving dead space for a hidden divider
doesn't hug correctly. And the `Hover=Bookmark` variant keeps the chevron's
own container fully transparent while only the label pill darkens — a single
shared `:hover` wash can't express that; two independently-hovering elements
can. [Button Group](../../../primitives/button-group/README.md) is exactly
the primitive built for "two-plus real, independent controls joined into one
strip," so this rebuild composes on it instead of re-deriving that behavior
by hand:

1. **Hug-to-content width** — each segment sizes to its own content, so
   there's no shared container reserving dead space for the other. Roam mode
   (no label) naturally hugs down to icon + chevron; Gather's label pushes
   the bookmark segment wider.
2. **Independent hover** — the bookmark segment and the chevron
   (`IconButton`) each carry their own `hover:bg-*`, not a shared wash from a
   common ancestor. Hovering one never lights up the other, matching Figma's
   `Hover=Bookmark` (only the label pill darkens) and `Hover=Chevron` (only
   the chevron box darkens) being genuinely distinct variants.

**Default fill lives on the group; segments only ever deepen — and this is
now true unconditionally, in both modes.** An earlier pass gave the group's
own fill and the divider's presence a whole conditional matrix keyed off
`active`/`mode` (transparent-until-active in Gather, always-housed in Roam,
label only appearing on hover). That's gone: the group is *always* housed at
`--theme-alpha-black-switch-333` — `GROUP_BG`, applied unconditionally, no
`active`/`mode` branching — and each segment (`BookmarkIconButton`'s root,
`IconButton`) shares one `HOVER_DEEPEN` class string that just adds
`hover:bg-[...-5]` / `data-[force-hover=true]:bg-[...-5]` on top of that
base. The chevron's color is likewise a flat, unconditional `alpha-50`
(`CHEVRON_COLOR`) — no more "housed vs. rest" distinction, since the group
is always housed now. `HOVER_DEEPEN` also carries its own
`transition-colors duration-[--duration-fast] ease-[--ease-emphasized]`
rather than relying on the outer group's transition — a CSS transition only
animates the element it's declared on, so without this each segment's
background snapped instantly regardless of the group's own transition.

**The label is always visible in Gather mode — not hover-revealed.** The
only remaining difference between the two modes: `mode="gather"` always
renders the "Add to scene" / "Added to scene" label via `trailingContent`
(rest, hover, and active alike); `mode="roam"` never renders it. There's no
`max-width`/`opacity` reveal animation left to describe — the label is just
there, styled with `pl-[--spacing-2xs] pr-[--spacing-1-5]` (4px / 6px) so it
doesn't crowd the glyph or the segment's own trailing edge.

**Visible label and accessible name intentionally diverge once active.**
`activeLabel` defaults to "Added to scene" — a status, confirming the
celebration that just played (see [Bookmark Icon Button](../../../atoms/bookmark-icon-button/README.md)),
not an instruction. But a screen reader user still needs to know that
*activating* the control removes the note — "Added to scene, button" gives
no such hint. So the toggle's `aria-label` is computed independently
(`accessibleLabel`, always "Add to scene" / "Remove from scene") rather
than mirroring whatever `label` currently reads. `inactiveLabel`'s default
happens to match its own accessible name, since there's no status/action
mismatch to resolve on that side.

**Chevron footprint.** Figma's chevron column is a `24×32` frame (`4px`
horizontal padding, `8px` vertical) around a `16px` "Fade button" —
`get_metadata` on `16231:7077` confirms it: `Frame 1149` is `24×32`, its
`Fade button` child sits at `x=4, y=8, 16×16`. `IconButton`'s own `sm` size
is a fixed `32×32` square; using it as-is made the chevron column 8px wider
than Figma and threw off the left/right balance (visibly "more padding on
the right"). Overridden via `className` — `h-full w-[24px]` plus explicit
`px-2xs`/`py-xs` — instead of a built-in size variant, since none of
`IconButton`'s sizes are non-square.

**Chevron glyph.** Was Lucide's `ChevronDownIcon` (stroke-based, different
geometry). Swapped for the exact path from Figma's `Icon / chevron-down`
(`1463:191`) — same asset already used for `imgVector1` in the raw Bookmark
Button export — rendered as a small inline `ChevronDownGlyph`, matching the
`~7×4` rendered size Figma's own 33%/20% insets produce inside its `12px`
icon box.

**Vertical centering.** An earlier pass nudged the internal `BookmarkIconButton`
down (`mt-[length:var(--spacing-3xs)]`) to keep its superscript badge from
visually poking above this segment's own top edge. That broke the segment's
natural, Figma-matched vertical centering (`get_metadata` on `16231:7077`
shows the icon at `y=6` inside a `32px`-tall frame — symmetric `6px` top and
bottom) whenever the badge wasn't even showing. Removed — centering wins;
the badge's slight overlap in housed+superscript states is accepted as-is
for now (Figma's own bare-icon component has the same tension, since it
deliberately drops `overflow-clip` specifically so the badge *can* extend
past the icon's box).

**Divider spacing.** `ButtonGroupSeparator`'s own default vertical margin is
`--stroke-thin` (about `1px`), not the `4px` Figma measures (`16231:7040`:
the line sits at `y=4` with `height=24` inside the `32px` row). Overridden
via `className="my-[length:var(--spacing-2xs)]! bg-[...]!"` (both need `!`
to beat the primitive's own `!important`-free but still-specific
`data-vertical:` rule). It's always mounted now (not conditional on
`active`/`mode`) — the group is always housed, so there's always a divider
to draw.

**Simplification:** Figma's `Hover=Chevron` variant washes the *entire* row
(both segments) alpha-333, not just the chevron's own box — an artifact of
its single-div structure that the two-segment rebuild doesn't reproduce.
Here, hovering the chevron only affects the chevron; hovering the label only
affects the label. Revisit only if the asymmetry reads as a bug in practice.

`ButtonGroup`'s own end-cap radius defaults to `--rounded-lg` (12px);
Figma's chip is `--rounded-md` (8px). Overridden on the group's `className`
with matching `[&>[data-slot]:first-child]` / `:not(:has(~[data-slot]))`
selectors (same shape as `ButtonGroup`'s own compound-variant classes, just
targeting `--rounded-md`) so the `!important` join classes get superseded
rather than fought.

**The Gather↔Roam label change is animated as one persistent button, not a
swap.** `ButtonGroup`, `BookmarkIconButton`, `ButtonGroupSeparator`, and the
chevron `IconButton` are each wrapped with `motion.create(...)` — an
untouched ref pass-through to each primitive's own root element (the same
pattern already proven by `MotionIconButton` in Highlight Action Menu), so
none of the four primitives themselves changed. Three coordinated pieces:

1. **Layout/FLIP width** — all four motion-wrapped elements carry `layout`
   with the same `transition`, so when the label's width changes, the
   segment resizes smoothly (verified live: interpolates frame-by-frame,
   not an instant jump) and the divider + chevron glide to their new
   position alongside it rather than snapping — "visually stable" here
   means *no animation of their own* (no color/opacity/scale), not that
   they're pinned in place; they physically have to move as their neighbor
   resizes, and `layout` is what makes that move smooth instead of abrupt.
2. **Label crossfade** — the label span wraps an `AnimatePresence
   mode="popLayout"` around a `motion.span key={label}`: opacity fade +
   2–3px vertical shift, `initial={false}` so a fresh mount (a new
   component instance, e.g. Storybook's Playground remounting via `key`)
   never animates in on first render. `popLayout` pulls the *exiting*
   string out of flow immediately, so the parent's own `layout` FLIP
   resizes against just the *entering* string's width, not both at once —
   without it, the segment would briefly overshoot to fit both strings
   simultaneously.
3. **Icon scale** — lives in [Bookmark Button](../../../atoms/bookmark-icon-button/README.md)
   itself (a subtle `1` → `1.08` Motion scale on `pressed`), not
   reimplemented here — this composite only adds the label crossfade and
   the group-level layout tracking around that shared, unmodified atom.

All three use `TRANSITION_EMPHASIZED_FAST` from `@/lib/motion` — Foundations'
own `--duration-fast` (200ms) / `--ease-emphasized`
(`cubic-bezier(0.22, 1, 0.36, 1)`) resolved into a value Motion can consume
directly (it can't read a CSS `var()`), deliberately not a spring — a
short eased transition reads as controlled and precise for a label/width
change, where a spring's overshoot would read as bouncy/playful. Respects
`prefers-reduced-motion` throughout (`useReducedMotion()` collapses every
`transition` here to `duration: 0`, verified live: width jumps directly to
its final value with no intermediate frames).

## API

| Prop | Default | Notes |
| --- | --- | --- |
| `active` / `defaultActive` / `onActiveChange` | — | Controlled/uncontrolled bookmarked state |
| `mode` | `'gather'` | `'gather'` always shows the label; `'roam'` never does. Fill, divider, and icon color are identical between the two |
| `showSuperscript` | `false` | Forwarded to the internal `BookmarkIconButton` |
| `superscriptValue` | `2` | Forwarded to the internal `BookmarkIconButton` |
| `activeLabel` | `'Added to scene'` | Gather-mode *visible* label when active — a status, not a command. The accessible name stays `'Remove from scene'` regardless (see "Visible label and accessible name" above) |
| `inactiveLabel` | `'Add to scene'` | Gather-mode label when inactive — visible and accessible name match here, since there's no status/action mismatch to resolve |
| `onMenuClick` | — | Chevron button's click handler (scene picker, etc.) |
| `groupLabel` | `'Bookmark'` | Accessible name for the `ButtonGroup` itself (the two segments have their own names) |
| `size` | `'default'` | Forwarded to the internal `BookmarkIconButton`'s glyph size (`sm` / `default` / `lg`) — e.g. [Note Card](../note-card/README.md) uses `sm` to match `PinIconButton`'s fixed `--icon-sm` glyph |
| `forceHover` | `false` | Storybook-only — locks both segments' hover paint via `data-force-hover` without a real pointer |

## Tokens

| Concern | Foundations |
| --- | --- |
| Group height | `--spacing-2xl` (32px) |
| Group background (always housed) | `--theme-alpha-black-switch-333` |
| Segment hover-deepen (both segments, both modes) | `--theme-alpha-black-switch-5` |
| Chevron color (always) | `--theme-alpha-black-switch-50` |
| Label typography | `--text-paragraph-mini-regular-*`, `--muted-foreground` |
| Label padding | `--spacing-2xs` left (4px) / `--spacing-1-5` right (6px) |
| Chevron column | `24×32` (`w-[24px] h-full`, `px-2xs`/`py-xs`) |
| Chevron glyph | Custom `~7×4` path (Figma `1463:191`), not Lucide |
| Divider inset | `--spacing-2xs` (4px) top/bottom |
| Motion | `--duration-fast` / `--ease-emphasized` |

## Deferred

- **Menu content** — `onMenuClick` is a bare callback; the actual scene
  picker/menu this chevron opens isn't built yet. A real implementation
  should likely swap the plain `IconButton` for a
  `DropdownMenuTrigger`-wrapped one (see Button Group's own "Dropdown"
  example) once the menu exists.
