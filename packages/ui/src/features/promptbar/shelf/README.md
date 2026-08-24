# Promptbar Shelf

The small elevated card docked to the top of the Promptbar — a status
summary plus an optional click-to-expand menu.

## Placement

**YES** — Promptbar-specific product chrome, even though it's built
entirely from shared Atoms/Primitives. Like AI Mode Toggle, the shell
itself is generic (a status row + optional expand-to-menu), but its
existence and the 3 configurations it's used in are meaningless outside
the Promptbar.

The Promptbar organism itself does not exist yet. This piece only
prepares the shelf so it's ready to dock into that organism later — no
Promptbar state/context is read or assumed here.

## Overlap

| Candidate | Verdict |
| --- | --- |
| [StatusBadge](../../../atoms/status-badge/README.md) atom | Reused directly for every `statusContent`/`trigger` example (connection-state badge, context badges, workflow-count badge) — not reimplemented inline. This piece adds zero new badge variants; every Figma example here was already a documented `StatusBadge` configuration. |
| [Status](../../../atoms/status/README.md) atom | Not used by the shell itself, but its `variant="glyph"` is what the Default type's *connected* `statusContent` example uses as a trailing "connected" dot (see StatusBadge's own trailing-slot examples) — this shell has no opinion about it either way. |
| [ListItem](../../../primitives/list-item/README.md) primitive | **Compose, don't fork.** Figma's own "Menu Item" instances here (`min-h-32px`, `gap-8px`, `px-8px`, `py-5.5px`, 20px media, 2px→4px title/description gap) are a pixel-exact match to `ListItem`'s own existing `size="default"` — no new size/variant needed on the primitive. The one adjustment is call-site-only: the trailing checkmark uses a 16px icon inset in 2px of padding (`--icon-sm` inside `--spacing-3xs`), passed via `<ListItemTrailing className="p-[length:var(--spacing-3xs)]"><Check className="size-[length:var(--icon-sm)]" /></ListItemTrailing>` — `ListItemTrailing`'s own default (a flush 20px `--icon-md` glyph) is unchanged. |
| [Collapsible](../../../primitives/collapsible/README.md) primitive | Reused for expand/collapse mechanics (open/defaultOpen/onOpenChange, height-animated panel) — this piece is Collapsible's first real consumer in the codebase. |
| [Separator](../../../primitives/separator/README.md) primitive | Reused for the Default type's footer divider. |

## Sources

| Source | Role |
| --- | --- |
| Figma [Promptbar shelf](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=16199-2558) (`16199:2558`) | Visual — 6 symbols across 3 "Type" (Default / Fia / Fia workflows) × collapsed/expanded/hover |
| [StatusBadge](../../../atoms/status-badge/README.md) atom | Every status-content/trigger example |
| [ListItem](../../../primitives/list-item/README.md) primitive | Expanded-menu rows |
| [Collapsible](../../../primitives/collapsible/README.md) primitive | Expand/collapse shell mechanics — this piece is its first consumer needing `keepMounted` |
| [Separator](../../../primitives/separator/README.md) primitive | Default type's footer divider |
| `motion/react` + `@/lib/motion` (`EASE_OUT`, `EASE_EMPHASIZED_IN`) | The expanded menu's staggered cascade — see Composition |
| [Fabely Icons](../../../foundations/icons/README.md) (`LineDotRightHorizontal`) | Connected-scene divider / menu item icon — no Lucide equivalent |
| `lucide-react` | `SearchCheck`, `GitPullRequestCreate`, `GitCompare`, `Check`, `ChevronUp`, `Globe`, `Link2Off`, `BookOpen`, `Feather`, `Workflow`, `Waypoints`, `Share2` |

## Composition

```text
PromptbarShelf
  ├── statusContent (slot — StatusBadge(s), always visible)
  └── children set?
        NO  → static row, no Collapsible, no chevron (Figma's plain Fia type)
        YES → Collapsible (root — collapsed-card hover/click target)
                ├── header (full-bleed width — expanded-header hover target)
                │     └── inner row (padded — actual layout)
                │           ├── statusContent
                │           └── CollapsibleTrigger (real <button>, scoped
                │                 to just this zone — see below)
                │                 ├── trigger (optional slot — text or a
                │                 │     StatusBadge; doesn't decide
                │                 │     expandability, `children` does)
                │                 └── chevron (one glyph, rotated — see
                │                       below)
                └── CollapsibleContent (slot — group-label caption +
                      ListItems, optional Separator + footer ListItems)
```

**Not Figma's own Type axis.** Default / Fia / Fia workflows are
anatomically the same shell (status content + optional trigger + optional
revealed content) composed with different children — exactly the same
reasoning `StatusBadge` uses for Figma's Mode × Type × Subtype axis. See
`PromptbarShelf.stories.tsx`'s Overview for all 3 as configurations of
this one component, not three variants.

**Two independent hover/click zones, by design.** Collapsed, the whole
card is the target (hover lights it, click anywhere expands it). Expanded,
only the header (the top row containing `statusContent` + trigger +
chevron) is the target — the menu body below keeps each `ListItem`'s own
independent hover, and never triggers collapse. Both zones use a plain
click handler (not a giant `<button>`) guarded to bail out on any click
whose target is inside a real `<button>`
(`event.target.closest('button')`) — necessary because *either*
`statusContent` **or** `trigger` can contain a real interactive control (a
dismissible `StatusBadge`'s own remove button — Figma's "Fia workflows"
collapsed row has one in `statusContent`; a picked workflow's resulting
chip has one in `trigger`), and nesting either inside a `<button>`
wrapping the whole row is invalid HTML and breaks the inner control's own
click handling. Two real bugs of this exact shape were caught building
this — `CollapsibleTrigger` ended up scoped to *just the chevron itself*,
not `statusContent` and not `trigger`, both of which sit as plain
siblings. `CollapsibleTrigger` remains the sole *keyboard*-operable path
(Tab + Enter/Space, via Base UI); the bigger click/hover zones are a
pointer-only convenience layered on top, not a replacement for it.

**Illumination, not recoloring — but two different veils, deliberately.**
Hover never swaps to a lighter neutral step — it layers a faint alpha
veil (`background-image: linear-gradient(TOKEN, TOKEN)`) on top of the
constant base fill (`background-color` stays `--neutrals-new-200`
throughout), so hovering reads as the same surface catching light, not a
material/state change. The two hover zones use *different* tokens on
purpose:

- Collapsed card: `--theme-alpha-white-no-switch-333` (~3.33%). `-no-switch`
  specifically, not `-switch`: switch tokens flip base color between
  light/dark themes, which would turn this "white" veil into a *black*
  one under `.dark` (which this dark-only shelf always is) — the
  opposite of the intended effect.
- Expanded header: `--theme-alpha-black-switch-5` (~5%, i.e. a touch
  stronger) — the *same* token `ListItem`'s own row hover already uses
  elsewhere in this file. `-switch` here specifically, not `-no-switch`:
  in this always-`.dark` shelf, `-switch` tokens resolve to a white
  overlay too, so the practical effect is the same "light" direction —
  but reusing `ListItem`'s own exact hover token makes the header read as
  the same surface *family* as the menu body beneath it, rather than a
  visually distinct "bar hover" species borrowed from the collapsed
  card. This was a deliberate refinement after the header's hover
  initially read as a separate illuminated bar rather than part of the
  disclosed panel — same veil *technique*, different token *family*.

**Every `transition-[...]` declaration that covers a padding change must
itself be unconditional — this bug happened twice, on two different
elements.** First on the root: collapsed↔expanded changes its own
`padding-top` (8px ↔ 0, since the header now owns that padding — see
below), and `transition-[...]` was originally declared only inside the
collapsed branch, so toggling *to* expanded had no active transition to
interpolate against and snapped instantly. Then again on the header
wrapper once its own `py-md` moved there (see below): the
`transition-[background-image]` class sat inside the *same* `open &&
[...]` block as `py-md` itself, so collapsing removed both the padding
**and** the only declaration that could have animated it in the same
instant — the header's 16px padding vanished immediately while the
root's 8px eased in on its own 200ms schedule, which visibly read as the
chip snapping to the very top of the card before easing back down to its
resting position. Both fixes are the same shape: the `transition-[...]`
class lives outside the `open` ternary/`&&` so it's present on *both*
sides of the toggle; only the veil-triggering `hover:` class itself stays
state-scoped.

**The expanded header spans the card's full width and reaches its true
top edge — not an inset chip, and not a thin strip hugging the badge
row.** Horizontal padding (`--spacing-sm`) deliberately lives on an
*inner* content row, not on the header element that carries the hover
veil or on the `Collapsible` root itself — putting the veil on a padded
element made the highlight read as a separate boxed button floating
inside the shelf. Vertically, the expanded root's own top padding
(`--spacing-md`) was moved onto the header wrapper's own `pt-` instead of
staying on the root: the header row's *content* is only ~24px tall, so
leaving the 16px of padding above it on the root meant hovering that gap
did nothing and the veil only ever painted a thin band matching the
content height. With the header wrapper owning that padding itself, its
box — and its hover veil — extends flush from the shelf's own rounded top
corner down through the row, reading as "the top part of the surface,"
not a slim strip. The `Collapsible` root also has `overflow-hidden` (on
`SHELF_BASE`, applying to every shelf configuration) specifically so this
full-bleed, corner-to-corner veil gets clipped to the shelf's own
`rounded-t-xl` shape rather than showing square corners poking past it.

**The header's `py-md` is symmetric (16px top and bottom, for an even
hover veil), and `CollapsibleContent` starts in ordinary flow right after
it — no negative margin.** This went through three wrong turns before
landing here. First, symmetric `py-md` alone pushed "Change scene link"
noticeably far from the chip row, so the bottom half was dropped entirely
(asymmetric/top-heavy veil again). Then, chasing *both* an even veil and
a tight caption at once, `CollapsibleContent` was given
`-mt-[var(--spacing-md)]` to cancel the header's bottom padding and pull
the menu content back up to where it'd sit with no bottom padding at all
— this hit the exact pixel target, but was wrong in a different way: it
made "Change scene link" visually overlap into the header's own
hover-reactive box, reading as if the caption belonged to the top
chip/chevron zone instead of the menu body beneath it. The negative
margin was removed; `CollapsibleContent` now starts flush against the
header's *true* bottom edge with no overlap, and the header's own
`--spacing-md` bottom padding is the entire visible gap — tight because
nothing else stacks on top of it (no root-level gap, no `GroupLabel` top
padding), and correctly bounded because the caption never enters the
header's own box, hovered or not.

`GroupLabel`'s own `min-h-8` was a second, easy-to-miss contributor to the
original "space above the caption" complaint: centering text inside a fixed 32px
box reads as leftover top padding even with zero actual padding/margin
above it, since the box's own height alone pushes the text down from its
top edge. Sized to content instead (no `min-h-8`) once the real
padding/margin sources were already accounted for.

**One rotating glyph, not a two-icon swap.** The chevron is a single
`ChevronUp`, rotated 180° via `open` state (a `ChevronUp` at 180° is
pixel-identical to a `ChevronDown`) rather than two icons toggled by
visibility. The rotation, the hover-brighten (`opacity-70` → `100`), and
the hover nudge (`±1px`, up when collapsed via `group-hover/shelf`, down
when expanded via `group-hover/header` — opposite directions, matching
which way the chevron currently points) all land on the same element and
transition together via one `transition-[opacity,color,rotate,translate]`,
so there's never a snap or reset between states. Expanded-header hover
additionally brightens the chevron's *color* (`--muted-foreground` →
`--foreground`, not just opacity) — this chevron doubles as the collapse
affordance for an already-open panel, so it earns slightly more presence
than the collapsed-state chevron hover (left untouched, opacity-only).
**Tailwind v4 writes
`rotate`/`translate` utilities to their own standalone CSS properties,
not the legacy `transform` property** — transitioning `transform` here
would silently no-op (this one cost real debugging time: `getComputedStyle(el).transform`
stays `"none"` even while the element visibly rotates/translates, because
the actual animated values live on `getComputedStyle(el).rotate` /
`.translate` instead).

**Every configuration's bottom padding is `--spacing-4xl` (48px), not the
smaller `--spacing-md` (16px) used for the top.** The Promptbar organism
this shelf docks into doesn't exist yet, but when it does, the shelf is
meant to sit partway *under* it — the Promptbar's own opaque surface
overlapping the shelf's bottom ~48px — rather than stacking cleanly above
it with a visible seam. That extra bottom space is this shelf's own
background reaching down into the future overlap zone, so real content
(`statusContent`, menu rows) stays clear of it and never gets clipped by
whatever eventually sits on top. In isolation today (no Promptbar exists
to cover it) this reads as a noticeably tall empty strip at the very
bottom of the card — expected, not a bug, and not something to "fix" by
shrinking it back down.

**The Overview story's playground has a "Type" control** (a plain
Storybook `useState`, not a real `PromptbarShelf` prop — there isn't one)
that swaps its live preview between the 3 `*TypeExample` components,
matching `StatusBadge`'s own `PlaygroundPanel` + `InlineSegmentedControl`
pattern — lets you try each configuration without scrolling to the
variants gallery.

**Shadow needs `spread`, so it's `box-shadow` on a separate outer wrapper,
not `filter: drop-shadow()` on the card itself.** Figma's actual effect
(confirmed directly from its own panel): `X 0, Y -16, Blur 24, Spread -4,
color black at 12%`. An earlier reading of this had Blur wrong (12, not
24) and dropped Spread entirely, landing on `drop-shadow()` — CSS's only
filter-based shadow, which structurally has no spread parameter at all.
`box-shadow` is the sole CSS primitive that can express Spread, but it
can't live on the same element as `SHELF_BASE`'s own `overflow-hidden`
(needed to clip the header's hover veil to the card's rounded corners): a
*box*-shadow, unlike a *drop*-shadow filter, gets clipped by its own
element's overflow, since it's part of that element's own box decoration
rather than a post-render filter effect. `SHELF_SHADOW` is a second class
list applied to a plain wrapping `<div>` around the whole card (both the
static and expandable returns), carrying just the matching
`rounded-t-xl` + shadow — `PromptbarShelfProps.className` now targets
this outer wrapper too, matching what its own doc comment already said
("applied to the outer shelf container"). Geometry (`-16px 24px -4px`)
stays literal since no published Shadow-scale step matches it; closest
existing alpha token used for the 12% (`-10`, no exact 12% step exists in
that scale either). Do not introduce a new Foundations shadow token for
this without checking with the design team first.

**The expanded menu cascades in/out in a staggered top-to-bottom (enter) /
bottom-to-top (exit) sequence — `cascadeItemVariants`.** Each top-level
child of `children` (via `React.Children.toArray`, so the footer divider
participates in the same sequence with no special-casing) is wrapped in a
`motion.div` animating `opacity` + a small `y` offset (`CASCADE_Y_PX`,
8px) between a `hidden` and `visible` variant, `animate={open ? 'visible'
: 'hidden'}` — driven by variant target, not by mounting/unmounting the
items. Two real bugs surfaced building this, both worth knowing before
touching this code again:

- **Items must stay mounted the whole time — `<CollapsibleContent
  keepMounted>`.** Base UI's `Collapsible.Panel` defaults to
  `keepMounted={false}`: it doesn't render its children *at all* until
  the panel has opened once. Combined with `initial={false}` on each
  `motion.div` (needed so a later close→open doesn't replay a jarring
  "snap to hidden, then animate" on every remount), the *very first*
  expand of a session mounted every item already in its final "visible"
  state with no transition — the cascade only worked from the second
  open onward. `keepMounted` makes Base UI render (and keep) the panel's
  children the whole time, exactly like the always-mounted model this
  animation assumes.
- **Opacity/`y` only, never anything that affects layout.** Base UI
  measures the panel's own `scrollHeight` to animate its height — a
  cascade item that changed width/height/margin would feed back into
  that measurement and cause visible jumps. `transform`-based `y` and
  `opacity` never affect layout, so nothing reflows underneath this.

Collapse and expand are deliberately asymmetric, matching how a physical
unfolding/folding motion actually reads:

- **Timing**: enter `CASCADE_ENTER_DURATION_S` (170ms) with `EASE_OUT`;
  exit `CASCADE_EXIT_DURATION_S` (130ms, quicker — collapsing should feel
  responsive, not sluggish) with `EASE_EMPHASIZED_IN` (Foundations'
  `--ease-emphasized-in`, documented there as "nested content opacity" —
  exactly this shape of a list dissolving as its own container closes).
  Both exported from `@/lib/motion.ts`, not invented for this component.
- **Stagger**: `CASCADE_STAGGER_S` (35ms) per item, forward on enter
  (`index * STAGGER`) and reversed on exit (`(total - 1 - index) *
  STAGGER`) — the same delay formula mirrored, not two different
  mechanisms.
- **The header's own padding-collapse runs in series with the cascade on
  close, but in parallel with it on open.** On expand, the header's
  `py-xs`→(whatever it settles to) padding change and the first cascade
  item are meant to start at the same instant, so the whole interaction
  reads as one continuous unfolding rather than "the container opens,
  then the contents animate." On collapse, the reverse: the header
  shouldn't visually shrink *underneath* rows that are still fading out
  above it, so its own padding transition gets a computed
  `transitionDelay` (`headerPaddingDelayMs`, via inline `style` since the
  exact delay depends on how many rows there are — `0` on expand, the
  full `cascadeExitTotalMs(...)` on collapse) so it only starts once
  every row has finished leaving.
- **`CollapsibleContent`'s own panel-height duration is overridden to
  `duration-[340ms]`** (the Collapsible primitive's shared default is
  200ms) specifically so the panel doesn't reach height 0 — clipping
  everything via its own `overflow-hidden` — before a longer cascade
  (more rows = more total stagger time) has actually finished animating.
  340ms comfortably covers realistic menu sizes here without needing an
  exact per-instance calculation.
- **`prefers-reduced-motion`**: `cascadeItemVariants` returns an
  opacity-only, `duration: 0` variant set when reduced motion is active
  (no `y`, no delay) — items still change visibility, just without motion
  or stagger, matching this codebase's established
  `useReducedMotion()`-gating convention elsewhere (`Status`'s glyph
  pulse, etc.).

**"Icon / line-dot-right-horizontal" has no Lucide equivalent — added as
a real Fabely Icon, not substituted.** Figma's own custom glyph (a
horizontal line ending in a circle at its right end; Lucide's closest
shape, `GitCommitHorizontal`, centers the circle instead) appears twice —
the Default type's connected-scene badge divider, and the "Connected to
current scene" menu item's leading icon. Traced from the asset's own
exported SVG and added as `LineDotRightHorizontal` in
`foundations/icons/` (same filled-glyph pattern as `FiaSilcrow`) rather
than substituted, since both usages specifically depict "the current
scene" and a wrong shape there is more noticeable than an icon
substitution elsewhere. That menu item's icon is also the one exception
to `ListItem`'s default icon color — `text-[color:var(--tw-raw-success-500)]!`
(the `!` needed to outweigh the `default` variant's own
`[&_[data-slot=list-item-media]_svg]:text-primary` descendant rule),
signaling "this is the currently connected scene," not a plain leading
glyph like the rows below it. "Threads" (the topic-map icon) still reuses
the `Share2` substitution `StatusBadge`'s own Workflow: Topic map example
already established — no Fabely Icon added for that one.

## API

| Prop | Default | Notes |
| --- | --- | --- |
| `statusContent` | — | Required — always-visible status summary (typically one or two `StatusBadge`s) |
| `trigger` | — | Optional content next to the chevron (Fia workflows' own count `StatusBadge`). Doesn't decide expandability — a shelf with `children` but no `trigger` still expands via a bare chevron (Default type; deliberately no "Change" text — see Composition) |
| `children` | — | Revealed when expanded. **Presence of `children` is what makes the shelf expandable at all** — omit entirely for a static shelf (Figma's plain Fia type has no chevron and never expands) |
| `open` | — | Controlled expand state |
| `defaultOpen` | `false` | Uncontrolled initial expand state |
| `onOpenChange` | — | Fires on every toggle, controlled or not |
| `className` | — | Applied to the outer shelf container |

## Tokens

| Concern | Foundations |
| --- | --- |
| Corner radius (top only) | `--rounded-xl` (20px) |
| Background (constant, never swapped) | `--neutrals-new-200` |
| Hover veil (collapsed card, or expanded header only) | `--theme-alpha-white-no-switch-333` (~3.33%) as a layered `background-image`, not a `background-color` swap |
| Connected-scene icon color (exception) | `--tw-raw-success-500` — **only on the "Connected to current scene" menu item's own leading icon.** The same `LineDotRightHorizontal` glyph used as the connected header badge's `middleIcon` stays the badge's own default/primary icon color — success-green there read as double-signaling (the badge already carries a separate `Status` glyph dot for "connected"), and conflated "this badge is connected" with "this glyph specifically means connected," which only the menu item's icon does. |
| Horizontal padding (inner content rows only — not the header/root) | `--spacing-sm` (12px) |
| Collapsed vertical padding | `--spacing-xs` top / `--spacing-4xl` (48px) bottom |
| Expanded vertical padding | header wrapper `--spacing-md` top **and** bottom (symmetric hover veil); root `--spacing-4xl` (48px) bottom; `CollapsibleContent` starts in normal flow right after the header — no negative margin, no overlap into the header's own box |
| Bottom padding (all configurations, incl. static Fia) | `--spacing-4xl` (48px) — future-Promptbar overlap zone, see Composition |
| Chevron size | `--icon-sm` (16px); hover nudge `1px` (Tailwind's `px` step) |
| Hover/padding/rotation transition | `duration-200 ease-out` — matches `Collapsible`'s own built-in panel-height duration so the whole expand/collapse gesture (panel height + header padding + chevron rotation) moves at one shared pace, not several independently-timed pieces |
| Drop-shadow | `--theme-alpha-black-no-switch-10` (see Composition note on the 10%-vs-12% snap) |

## Deferred

- No Promptbar organism integration yet — `statusContent`/`trigger`/
  `children` are all plain slots; wiring real scene/note/workflow data in
  is the future Promptbar feature's responsibility (see
  `status-badge-content.ts`'s own "Future Promptbar Integration" note for
  the same boundary). This includes both interactive demos, entirely
  local story state (`useState`) — `PromptbarShelf` itself has no
  connection or workflow-selection concept of its own (`statusContent` /
  `trigger` / `children` are plain slots); a real consumer would own this
  the same way:
  - `DefaultTypeExample`'s `connected` boolean drives *both* the header
    badge (Not connected vs. connected-with-a-pulsing `Status` glyph) and
    the first "Change scene link" option's title/icon/checkmark
    ("Connect" when unchecked, "Connected" once picked) — these two must
    never disagree, which an earlier version of this story got wrong
    (showing a "Not connected" badge next to an already-checked
    "Connected to current scene" option).
  - `FiaWorkflowsTypeExample`'s `workflow` state: picking a suggested
    workflow collapses the shelf (`open` is lifted into the story
    specifically so selection can call `setOpen(false)`) and swaps
    `trigger` from the "3 workflows" count badge to a dismissible chip
    for the workflow just picked; dismissing that chip reverts to the
    count badge.
- The expanded header's hover/illumination is a deliberate design
  refinement beyond Figma's own documented states (Figma only shows a
  hover treatment for the collapsed card) — not something to "correct"
  back to Figma parity.
- **Header padding is mid-experiment, not settled.** The header wrapper
  currently uses `py-[var(--spacing-xs)]` (8px, same as the collapsed
  card's own top padding — i.e. this padding never changes size at all
  between collapsed and expanded), trying whether that reads as *less*
  disruptive than the earlier symmetric `py-md` (16px) version. Check
  which one actually shipped before assuming either description above
  (built around the 16px version) still matches the code exactly.
