# Drop Target

The glowing insertion-line indicator a drag-reorderable list renders between
items to show where a drop would land. Presentation only — a caller (e.g.
[Paragraph List](../../features/manuscript/paragraph-list/README.md)) owns
computing *which* gap is currently active and re-renders this in that gap.

## Sources

| Source | Role |
| --- | --- |
| Figma [Paragraph drop line](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=16372-4438) (`16372:4438`), `Chevron=No, Orientation=H` variant | Visual |

The `Chevron=Yes` and `Orientation=V` variants in that Figma component
aren't implemented — neither current caller (Paragraph List, Chapter Menu's
outline drag) uses them. Add them if/when a caller actually needs one.

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
