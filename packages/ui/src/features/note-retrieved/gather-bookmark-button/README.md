# Gather Bookmark Button

Split control for pinning a note/answer into a scene from the Gather panel:
a bookmark toggle, an optional hover-reveal label, and a menu chevron.

## Purpose

Distinct from the [Bookmark Button](../../../atoms/bookmark-button/README.md)
atom — that one is a bare icon toggle usable anywhere; this composite wraps
it with Gather-specific chrome (chip housing, "Add to scene" / "Remove from
scene" copy, a menu trigger) and belongs only in the Gather panel context.
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
| [Bookmark Button](../../../atoms/bookmark-button/README.md) atom | The toggle itself — including its own click target for the revealed label, via `trailingContent` |

## Composition

```text
GatherBookmarkButton → ButtonGroup (carries the default/rest fill)
  ├── BookmarkButton atom (padding + own hover-deepen; label passed as `trailingContent`, inside the same button)
  ├── ButtonGroupSeparator (only once housed)
  └── IconButton (chevron, "ghost", own hover-deepen)
```

**The label is inside the button, not next to it.** The first pass rendered
the revealed "Add to scene" text as a sibling `<span>` beside the
`BookmarkButton` atom — visually attached, but not part of its click target,
so hovering/clicking the text itself didn't show the pointer cursor or
toggle anything. Fixed by adding an optional `trailingContent` slot to the
`BookmarkButton` atom itself (rendered inside the same `<button>`, after the
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

1. **Hug-to-content width** — `ButtonGroupSeparator` is only rendered
   (mounted, not just hidden) once the control is housed (`active` or
   `roam`); each segment sizes to its own content, so there's no shared
   container reserving space for the other. Roam mode / no revealed label
   naturally hugs down to icon + chevron.
2. **Independent hover** — the bookmark segment and the chevron
   (`IconButton`) each carry their own `hover:bg-*` / `hover:text-*`, not a
   shared wash from a common ancestor. Hovering one never lights up the
   other, matching Figma's `Hover=Bookmark` (only the label pill darkens)
   and `Hover=Chevron` (only the chevron box darkens) being genuinely
   distinct variants.

**Default fill lives on the group; segments only ever deepen.** An earlier
pass painted the full fill (`alpha-333` etc.) independently on *each*
segment, including at rest. Two segments each separately colored the same
value happen to look identical when touching — but the moment either one's
hover state differed even slightly, or you inspected the DOM, the divider
between them read as sitting between two separate painted boxes rather than
embedded in one continuous pill. Fixed by moving the rest/default fill onto
the `ButtonGroup` itself (`groupBg`, painted once), and reducing each
segment to a `hoverDeepenClasses` rule that only ever *adds* a hover-time
color on top of that shared base — never repaints it independently:

- **Group fill** — `active` (any mode) or `roam` mode keeps the group housed
  (`--theme-alpha-black-switch-333`) permanently; `gather`-inactive is
  transparent.
- **Segment hover-deepen** — `gather`-inactive: a segment's own hover paints
  the group's `alpha-333` itself (group is transparent, so this is the first
  fill either segment shows). Housed + `active`: no further hover change
  (static). Housed-but-inactive (`roam`): each segment independently deepens
  the group's `alpha-333` base to `alpha-5` on its own hover — the chevron
  is not exempt, it deepens exactly like the bookmark segment.
- **Label reveal** — only in `gather` mode: the segment's `gap` and the
  label's `max-width` both animate from `0`, scoped to that segment's own
  `hover:` so hovering the chevron never triggers it.
- **Chevron color** — permanent `alpha-50` once housed, `alpha-20`
  otherwise — verified against the raw Figma export's `imgVector2` /
  `imgVector3` chevron assets, which are the same path at `alpha-50` and
  `alpha-20` respectively.

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

**Vertical centering.** An earlier pass nudged the internal `BookmarkButton`
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
`data-vertical:` rule).

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

## API

| Prop | Default | Notes |
| --- | --- | --- |
| `active` / `defaultActive` / `onActiveChange` | — | Controlled/uncontrolled bookmarked state |
| `mode` | `'gather'` | `'gather'` reveals the hover label; `'roam'` never does and stays housed at rest |
| `showSuperscript` | `false` | Forwarded to the internal `BookmarkButton` |
| `superscriptValue` | `2` | Forwarded to the internal `BookmarkButton` |
| `activeLabel` | `'Remove from scene'` | Gather-mode hover label when active |
| `inactiveLabel` | `'Add to scene'` | Gather-mode hover label when inactive |
| `onMenuClick` | — | Chevron button's click handler (scene picker, etc.) |
| `groupLabel` | `'Bookmark'` | Accessible name for the `ButtonGroup` itself (the two segments have their own names) |
| `size` | `'default'` | Forwarded to the internal `BookmarkButton`'s glyph size (`sm` / `default` / `lg`) — e.g. [Note Card](../note-card/README.md) uses `sm` to match `PinButton`'s fixed `--icon-sm` glyph |
| `forceHover` | `false` | Storybook-only — locks both segments' hover paint via `data-force-hover` without a real pointer |

## Tokens

| Concern | Foundations |
| --- | --- |
| Group height | `--spacing-2xl` (32px) |
| Segment housed background | `--theme-alpha-black-switch-333` |
| Roam hover background | `--theme-alpha-black-switch-5` |
| Chevron (housed) | `--theme-alpha-black-switch-50` |
| Chevron (rest) | `--theme-alpha-black-switch-20` |
| Label typography | `--text-paragraph-mini-regular-*`, `--muted-foreground` |
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
