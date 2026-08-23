# AI Mode Toggle

Switches the Promptbar between AI operating modes: Gather, Scene Desk, Fia.

## Placement

**YES** — Promptbar-specific product behavior (which AI mode is active,
paired with each mode's own icon/color/copy), even though it's built
entirely from a shared primitive. Not an Atom/Molecule: the mode set,
icon choices, and semantic colors are meaningless outside the Promptbar
context.

## Overlap

| Candidate | Verdict |
| --- | --- |
| [Tabs](../../../primitives/tabs/README.md) primitive | **Compose, don't fork.** `Tabs`/`TabsList variant="default"`/`TabsTrigger` already provide the segmented-pill chrome, keyboard nav, ARIA tab semantics, and inactive-at-50%-opacity — reused as-is. The primitive's own [Deferred](../../../primitives/tabs/README.md#deferred) section lists this exact odd size ("AI toggle / Size5") as unbuilt on the shared surface; by product decision this stays a Promptbar-local composition (className overrides for sizing/per-mode color) rather than adding a new `size`/variant to the shared primitive. `tabs.tsx` and the [post-primitives docket](../../../../.migration/post-primitives-docket.md) are both untouched. |
| Toggle Group | Considered — the Tabs README explicitly recommends it for "options toggle without panels." Not used here: no per-mode content panel either way, but Figma's own source component is named **Tabs (segmented)**, and Tabs already ships the exact segmented-pill visual this component needs; Toggle Group would mean re-deriving that chrome from a different primitive for no benefit. |
| `FiaSilcrow` icon | Reused directly — Figma's Fia glyph path is a pixel match. |
| `GatherSearchNotesIcon` | Reused, and **promoted** from `features/highlight/assets/` to `foundations/icons/` as part of this change (a second consumer now exists — same reasoning as `FiaSilcrow` already living in Foundations). No new SVG asset added. |
| Lucide `BookOpenText` | Reused for Scene Desk — Figma's own component is literally named "Icon / book-open-text," matching this Lucide icon 1:1. |

## Sources

| Source | Role |
| --- | --- |
| Figma [AI Mode Toggle Dark](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=16133-4559) (`16133:4559`) | Visual — Mode=Gather / Scene desk / Fia / Alt active state |
| [Tabs](../../../primitives/tabs/README.md) primitive | Segmented pill chrome, keyboard/ARIA tab semantics, inactive opacity |
| `@/foundations/icons` (`FiaSilcrow`, `GatherSearchNotesIcon`) | Fia and Gather glyphs |
| `lucide-react` (`BookOpenText`) | Scene Desk glyph |

## Composition

```text
AIModeToggle → Tabs (value/defaultValue/onValueChange forwarded directly)
  └── TabsList (variant="default", size="default"; padding overridden to
                Figma's 2px/3px track inset)
        └── MotionTabsTrigger × 3 (motion.create(TabsTrigger) + layout,
                                    one shared `transition` with everything below)
              ├── pill (motion.div, active trigger only — layoutId + layout;
              │         background/border/shadow; rides this trigger's own
              │         resize, morphs to the next trigger's pill on switch)
              ├── mode icon (GatherSearchNotesIcon | BookOpenText | FiaSilcrow)
              ├── mode text color (data-active:text-[...], per mode)
              └── AnimatePresence → mode label (active trigger only)
```

**"Alt active state" is a focus ring, not a fourth mode.** Figma's fourth
variant is the Fia-active tab with an extra `0 0 0 3px Neutrals(New)/200`
ring — decoded by diffing its JSX against the plain `Mode=Fia` variant,
which is identical except for that one added `box-shadow` layer. Mapped
here to `data-active:focus-visible:shadow-[...]` on every trigger (not
Fia-only — the ring is a focus treatment, not a Fia-specific one), so it
appears on whichever mode is both active and keyboard-focused. There is
no `'alt-active'` value in `AIMode`.

**Triggers genuinely resize with state — this matches how Tabs already
works everywhere else, and it's what lets the row read as "growing/
shrinking, siblings sliding," not a fixed rail.** The active trigger's
label is conditionally mounted (`AnimatePresence`), so an inactive
trigger really is narrower in true layout terms, not just visually — and
every trigger carries `motion.create(TabsTrigger)` + `layout` (the same
ref-passthrough pattern already proven by `GatherBookmarkButton`'s
motion-wrapped primitives), sharing one `transition` so a trigger
collapsing/expanding and its siblings repositioning around it all move on
the same timing, reading as one FLIP rather than independent resizes.

**The active pill lives *inside* the active trigger, not as an
independently-positioned list-level sibling — this is the load-bearing
decision.** As an `inset-0` child, the pill's own box is a pure CSS
consequence of its parent trigger's box, recomputed every frame the
parent's FLIP is mid-animation — it rides the trigger's own resize with
no separate measurement or animation of its own required for that part.
`layoutId` (`PILL_LAYOUT_ID`, shared across all three trigger's pills) is
what makes the *cross-trigger jump* read as one persistent object: this
instance unmounts in the old trigger and a same-`layoutId` instance
mounts in the new one in the same render, and Motion treats that pair as
a single element to morph between, using each one's own live (still
possibly mid-FLIP) measured box — this is Motion's own standard animated-
tab-indicator pattern, and the only one of three candidate techniques
that stays correct *while* the row keeps reflowing around it:
- A one-shot `animate({x, width})` computed from a snapshot measurement
  (tried in an earlier pass) has no way to track a destination that's
  still moving under its own separate FLIP animation — the two
  inevitably drift out of sync, reading as a teleport rather than one
  glide.
- Plain `layout` (FLIP) without `layoutId` only ever animates a single
  persistent element's own box; it has no mechanism for morphing between
  *two different elements* (one per trigger) at all.
- `layoutId` + `layout` together — what's used here — combines "morph
  between two elements across a mount/unmount" with "counter-scale this
  element so it isn't distorted by whatever transform its own parent's
  FLIP is applying." Both matter: without the `layout` half, this child
  would inherit the *scale*-based transform Motion uses to fake its
  resizing parent's FLIP, stretching/squishing the pill's own rounded
  corners — precisely the blob shape an earlier, differently-broken pass
  already produced once, for an unrelated reason (see below).

**This took several passes, each fixing a different, real problem, not
the same one repeatedly.** Pass 1 combined `x`/`width` in one tween fed a
spuriously narrow intermediate width from a state-timing bug — the
visible blob was mis-diagnosed as "never animate x and width together."
Pass 2 fixed that by avoiding simultaneous x/width change via a four-
phase collapse→travel→expand→reveal relay — no more shape distortion,
but three discrete, gated animations read as tabs taking turns, not one
object moving. Pass 3 froze every trigger to a fixed-width slot so the
pill could animate on its own fixed coordinate system — smooth, but the
brief was explicit that triggers must genuinely resize, which a frozen
track can't do. This pass keeps real trigger resizing (pass 3's
regression, fixed) *and* gets simultaneous x/width motion right (pass 1's
original goal) by no longer computing the pill's geometry independently
at all — `layoutId` + `layout` derive it from the live, reflowing DOM
every frame instead.

**Label crossfade, not a swap.** Each trigger's label sits inside its own
`AnimatePresence mode="popLayout"` — `popLayout` pulls an exiting label
out of flow immediately, so a trigger's own `layout` FLIP resizes against
just the remaining state, not two labels' widths at once (same reasoning
as `GatherBookmarkButton`'s label crossfade).

**Per-mode pill color is the semantic *ghost* token, not a filled one —
and the trigger's own fill has to be fully killed for that to actually
read as translucent.** `tabsTriggerVariants`' `default` variant paints
`data-active` with one fixed, *opaque* neutral gradient background,
shared by every other use of segmented Tabs. Ghost tokens are themselves
translucent (~12% alpha, e.g. `--tw-raw-secondary-ghost` resolves to
`#bdb7ea1f`) — layered on top of that still-opaque gradient, the result
blended into something that read as a solid filled color instead of a
clean ghost tint over the track. `TRIGGER_BASE_CLASSNAME` explicitly nulls
that gradient out (`data-active:[background:none]`, across all six
variant chains the primitive declares it on — `data-active`/`hover`/
`focus-visible` × light/dark, since `tailwind-merge` only dedupes classes
sharing the exact same arbitrary-property key *and* variant chain) so the
trigger itself is fully transparent and the pill's own inline
`style={{ backgroundColor: ghostToken }}` is the only color anyone sees.

**Only the label clips its overflow — not the trigger.** The label's own
`y`-offset enter/exit slide could flash briefly outside its box mid-
resize without some clipping. The first fix put `overflow-hidden` on the
whole trigger, which also silently killed the pill's slide: the pill's
`layoutId` travel has to visually paint *outside* its own trigger's
current box while mid-flight to read as crossing the row at all, and a
clipping trigger clips exactly that, leaving the pill only able to
fade/resize in place. The actual fix scopes `overflow-hidden` to a small
wrapper around just the label, leaving the trigger itself unclipped. The
extra focus ring is still built from `outline`, not `box-shadow` — no
longer strictly required once the trigger stopped clipping, but `outline`
paints outside a clipping box regardless by CSS design, so there's no
reason to revert it and reintroduce that fragility.

**A new Foundations token, consumed directly — `--effect-focus-ring-
neutral`.** None of the original six `--effect-focus-ring-*` tokens are
neutral-flavored — all resolve through `--ring` (Neutrals-300 light /
Neutrals-700 dark). Figma's "Alt active state" reference frame specifies
"Neutrals (New)/200" instead, confirmed via a *live* Figma variable query
(not a JSX codegen fallback, which read stale here once already:
`#e7e5e4`, the fixed light-mode value, when the live query — on the exact
node, in Figma's own dark canvas — returned `#38383b`). Added as
`--effect-focus-ring-neutral: 0px 0px 0px 3px var(--neutrals-new-200)` in
`focus-rings.css`, deliberately *not* by changing `--effect-focus-ring-
secondary` itself (already the default ring for ~45 other files app-wide;
redefining it would have changed focus-ring color on `Button`, `Input`,
`Select`, `Switch`, and everything else that consumes it, in both
themes). `--neutrals-new-200` (not `--theme-neutrals-200`, a fixed value
that never changes with theme) specifically because it's the one that
actually inverts per theme — light mode resolves it to raw-200
(`#e7e5e4`), dark mode to raw-800 (`#38383b`), matching Figma's live value
exactly.

**Consumed as a real `box-shadow`, not `outline` — this needed a genuine
geometry fix, not a value swap.** An earlier pass built the ring from
`outline` + a manual `-1px` `outline-offset`, since a non-inset
`box-shadow`'s spread has no separate offset control and starts at the
same outer point `outline` does by default — confirmed empirically that
using the Foundations token's literal box-shadow value produced a 1px
gap between the ring and the pill's actual edge, because the pill only
filled the trigger's *padding*-box while `box-shadow`/`outline` both
start from the trigger's *border*-box (its own 1px transparent border sat
in between). Fixed at the source instead: the pill now spans
`-inset-[length:var(--stroke-thin)]`, not `inset-0` — 1px larger in every
direction, flush with the trigger's true outer edge — so a plain
`shadow-[var(--effect-focus-ring-neutral)]` on the trigger starts exactly
where the pill's own edge already is. That's what let the outline-based
workaround go away entirely in favor of consuming the token as-is.

**Still two independent rulesets — real keyboard focus and Storybook's
static reference view need different trigger conditions, even sharing one
token.** `data-active:focus-visible:shadow-[var(--ai-mode-toggle-ring,
none)]` is the actual shipped behavior — defaults to `none` (no ring on
real focus, per product decision), left wired rather than deleted so a
real keyboard-triggered ring stays possible later without touching this
file again. A second, unconditional `data-active:shadow-[var(--ai-mode-
toggle-ring-force,none)]` (no `:focus-visible` in the selector at all)
is what Storybook's "With ring" alternative sets — to
`var(--effect-focus-ring-neutral)` — specifically because a static
comparison view can't rely on real `:focus-visible` (mouse clicks never
trigger it, and genuine keyboard focus is momentary, not something a
reference screenshot can hold). Both declarations also supersede Tabs'
own `data-active:shadow-[var(--effect-focus-ring-primary)]` (its half of
the gradient-border illusion, applied unconditionally on `data-active` —
see `tabs.tsx`) simply by being the last `shadow-[...]` declaration in
their respective variant chains; defaulting to `none` already nulls it
out, with no separate explicit override needed.

**The Storybook story forces dark mode — `globals: { theme: 'dark' }`,
same pattern as `BookshelfTemplate.stories.tsx`.** Figma's source frame is
"AI Mode Toggle **Dark**" — dark-only chrome — and `--neutrals-new-200`'s
`.dark` override (the one carrying the correct `#38383b`) only takes
effect when `.dark` sits on `document.documentElement`, not on some local
wrapper div. Confirmed empirically: without this, nothing in the story
had ever actually toggled dark mode — the component only *looked* dark
because its track background (`--theme-alpha-black-switch-333`) doesn't
switch with theme either way — so the ring silently rendered in its
light-mode color instead.

**Inactive icon opacity is untouched, on purpose.** Tabs' `default`
variant already applies `opacity-50` / `hover:opacity-100` /
`data-active:opacity-100` to the whole trigger (which visually applies to
its icon and label children too) — this component adds no opacity classes
of its own. Matches Figma's flat 50% inactive treatment exactly, and
avoids repurposing the unrelated `--theme-alpha-black-switch-*` "switch"
family (a different, hover-responsive muted-icon convention used by
Bookmark/Pin, not what Figma specifies here).

## API

| Prop | Default | Notes |
| --- | --- | --- |
| `value` / `defaultValue` / `onValueChange` | `defaultValue: 'gather'` | Controlled/uncontrolled active mode, forwarded to the underlying `Tabs` |
| `className` | — | Applied to the outer `Tabs` root |

## Tokens

| Concern | Foundations |
| --- | --- |
| Track background/border | `--theme-alpha-black-switch-333` (Tabs primitive, unmodified) |
| Track padding | `--spacing-3xs` (2px) / `--spacing-0-75` (3px) — overridden from Tabs' own default `--spacing-1-375` to match Figma's tighter inset |
| Trigger radius | `--radius` (16px, Tabs primitive default) |
| Trigger gap (icon↔label) | `--spacing-1-5` (6px, Tabs primitive default) |
| Gather pill/text | `--tw-raw-secondary-ghost` bg (pill), `--tw-raw-secondary-200` text (trigger) |
| Scene Desk pill/text | `--tw-raw-scene-desk-ghost` bg (pill), `--tw-raw-scene-desk-500` text (trigger) |
| Fia pill/text | `--tw-raw-fia-ghost` bg (pill), `--tw-raw-fia-200` text (trigger) |
| Pill border | `--theme-alpha-black-switch-333` |
| Pill shadow | `--shadow-sm-black` |
| Active focus ring (Alt active state) | `--effect-focus-ring-neutral` (Foundations, `focus-rings.css`) — `0 0 0 3px var(--neutrals-new-200)`, consumed directly as `box-shadow` |
| Typography | `--text-paragraph-small-medium-*` (Tabs primitive default, inherited by the label) |
| Inactive icon opacity | `opacity-50` (Tabs primitive default, unmodified) |
| Motion | `TRANSITION_EMPHASIZED_FAST` (`@/lib/motion`) — `--duration-fast` / `--ease-emphasized`, shared by every trigger's `layout`, the pill's `layoutId`+`layout`, and the label crossfade, so they read as one coordinated motion |

## Deferred

- No sidecar/per-mode content panel exists yet — this only switches the
  toggle's own active state. `onValueChange(mode: AIMode)` is the
  integration point: it fires once per real mode change (verified live —
  clicking each tab correctly drives `data-active` through the same
  controlled `value`/`onValueChange` pattern the `Controlled` story uses),
  so wiring an actual sidecar/Promptbar-body swap is just a matter of a
  caller passing a handler that sets its own state from the `mode` it
  receives. No per-mode callback props or shared context were added for
  this — one generic callback already covers it without new API surface.
