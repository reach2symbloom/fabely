# Chapter Menu

Manuscript outline panel opened from Chapter Nav Button — header, scrollable
outline body, and footer actions.

## Placement

NO — chapter-nav panel chrome. Stays in `src/features/chapter-nav/chapter-menu/`.

## Overlap

| Piece | Approach |
| --- | --- |
| Panel chrome | **Card** `shadow` + `bordered` — compose |
| Header | **ChapterMenuHeader** — `header` slot |
| Outline rows | **ChapterMenuListItem** — body `children` |
| Insert rows | **AddSectionInlineButton** — fixed gap hit strip; chrome opacity /
  scaleX only (no layout thrash) |
| Footer actions | **Button** primaryOutline + ghost — default footer |
| Close | **IconButton** outline round — `panel-left-close` |

## Authoritative Figma

[Chapter menu](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=16373-12458)
set (`16373:12458`). First variant **Acts=False** (`16373:10965`) is
authoritative for the shell. Acts (False · Subscenes · Style 1–3 · Empty)
change body composition, not the panel chrome.

## Structure

- **Header** — `header` slot (pad `--spacing-xl`, bottom rule via Card bordered)
- **Body** — scrollable `children` (pad `--spacing-xl`)
- **Footer** — default Add chapter (`primaryOutline`) / Add act (ghost), or
  custom / `null` to omit (pad `--spacing-md`, top rule)
- **Close** — Icon Button on the header / body divider, half outside the
  card edge (`overflow-visible` on the Card shell). When the panel is the
  Chapter Nav Button dropdown, this pin overlays the chevron and closes
  the menu.

## Notes

- Panel max width matches Figma 542px (`max-w-[542px]`).
- Body outline list: `pl-xs` (8) inside Card `--card-spacing` xl (24) so
  chapter “Ch.” matches [Acts=False](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=16373-10965)
  (`16373:10965`).
- Wire into Chapter Nav Button as the dropdown overlay; close is the pin
  on the trigger. **Not** Sheet or Drawer — neither primitive is used
  anywhere in `chapter-nav`; Chapter Nav Button opens this panel through a
  Base UI `DropdownMenu` (`DropdownMenuContent` with collision avoidance
  and its own overflow disabled, so nothing there caps height either).

## Height cap — Card, not Sheet/Drawer

The panel caps its own height and scrolls the outline internally,
independent of whatever wraps it (the Chapter Nav Button dropdown, or
standalone in a story):

- **Card root** (`data-slot="chapter-menu"`) —
  `max-h-[calc(100dvh-var(--spacing-7xl))]`. `--spacing-7xl` is 96px,
  matching [Drawer](../../../primitives/drawer)'s own
  `calc(100dvh-6rem)` viewport inset exactly (6rem = 96px) — reusing the
  established "breathing room from the screen edge" convention rather
  than inventing a new one.
- **Body** (`data-slot="chapter-menu-body"`, the `CardContent` wrapping
  `children`) already had `flex-1 min-h-0 overflow-y-auto` — that's what
  actually scrolls once the Card root is height-bound. Added
  `scroll-fade-y` (existing Foundations scroll utility, `src/styles/
  scroll-fade.css` — same one `MessageScroller` uses) for the fade at the
  scroll edges.
- **Header and footer are unaffected** — they sit outside `CardContent`
  as Card's other flex children, so they stay pinned; only the body
  between them scrolls.
