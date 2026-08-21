# Drop Target

The glowing insertion-line indicator a drag-reorderable list renders between
items to show where a drop would land. Presentation only — a caller (e.g.
[Paragraph List](../../features/manuscript/paragraph-list/README.md)) owns
computing *which* gap is currently active and re-renders this in that gap.

## Sources

| Source | Role |
| --- | --- |
| Figma [Paragraph drop line](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=16372-4438) (`16372:4438`), `Orientation=H` | Rail, both `Chevron` values |
| Figma [Chevron=Yes, Orientation=H](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=16372-4419) (`16372:4419`) | The down-glyph's exact vector + glow |

The `Orientation=V` variant in that Figma component isn't implemented —
neither current caller (Paragraph List, Chapter Menu's outline drag) uses
it. Add it if/when a caller actually needs one.

## Chevron glyph is hand-built SVG, not a Lucide icon

`chevron` renders Figma's own vector verbatim (filled shape, not a Lucide
stroke icon — no `ChevronDown` in that set is pixel-equivalent), same
"copy the exact export" precedent Split & Parse's hand-built check-circle
sets. Its drop-shadow glow can't reuse the rail's `linear-gradient`
technique — it's an SVG `<filter>` (`feGaussianBlur` + `feColorMatrix`),
and `feColorMatrix` can't consume a CSS custom property the way `fill`
can — so the matrix's color values are `--tw-raw-secondary-200` hand-
converted to the 0–1 decimals it requires, literal, same as how the
Foundations glows are documented as bypassing tokens for invariant visual
treatments. Each `<filter id>` gets a `useId()` suffix — a bare, literal
id copied onto two `DropTarget`s on the same page would collide.

Sits with its own `16x16` frame flush against the rail — 0px of *added*
margin between them. The glyph is drawn with headroom inside that frame
(ink starts around a third of the way down, not at the very top edge), so
the visible space between the line and the ink is the icon as designed,
not something to trim.

## Promoted from Chapter Menu, not duplicated

Chapter Menu's own outline drag-and-drop already rendered this exact
indicator, as `DropIndicatorDivider`/`DropIndicatorSlot` local to
`ChapterMenu.stories.tsx`, and `SecondaryGlowRail` (the rail itself) local
to `AddSectionInlineButton.tsx`. Both moved here — Chapter Menu's story now
imports `DropTarget` from this atom instead of keeping its own copy, and
`AddSectionInlineButton` imports `SecondaryGlowRail` back from here — rather
than Paragraph List growing a second implementation of the same Figma
component.

## Always-mounted, zero-size when inactive

`active` toggles a `grid-template-rows` `0fr` → `1fr` tween, not `height`/
`max-height`. This lets every gap in a list render one of these
permanently — only the currently-active gap visibly opens — with no jump
between "not rendered" and "rendered at 0 height," and no `max-height`
guess to size the collapsed state against.

## No gap-compensation margin baked in

Chapter Menu's own row gap needs
`[margin-block:calc(var(--outline-row-gap,0px)*-0.5)]` on the slot so it
sits flush between rows without adding extra vertical space beyond that
list's own gap rhythm — that's specific to how *that* list spaces its rows,
not a Drop Target concern. Pass the equivalent via `className` if a
caller's own row gap needs the same treatment; Paragraph List's own row gap
happens not to need it (see its README).

## API

| Prop | Default | Notes |
| --- | --- | --- |
| `active` | `false` | Whether this is the live prospective insertion point right now |
| `chevron` | `false` | Figma's `Chevron=Yes` variant — adds the down-glyph centered under the rail |
| `className` | — | Merged onto the root — e.g. a caller's own gap-compensation margin |

`SecondaryGlowRail` (the rail with no open/close animation) is also
exported, for callers that already own their own show/hide — currently
Add Section Inline Button's proximity-revealed divider.

## Tokens

| Concern | Foundations |
| --- | --- |
| Rail color | `--tw-raw-secondary-200` |
| Rail thickness | `--stroke-thin` (solid) / `--stroke-regular` (glow) |
| Slot min-height | `--spacing-xl` |
| Open/close motion | `--duration-normal`, `ease-emphasized` |
| Chevron size | `--icon-sm` (16px, matches its own 16×16 viewBox) |
