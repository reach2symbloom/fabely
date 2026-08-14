# Chapter Nav

Manuscript location chrome — book, chapter, and the menu that switches
between them. Product-specific; stays in `src/features/chapter-nav/`.

Each piece is its own folder. Compose across them; do not duplicate
primitives into this tree.

## Pieces

| Piece | Folder | Status |
| --- | --- | --- |
| [Chapter Nav Button](./ChapterNavButton.tsx) | (this folder) | Landed |
| [Chapter menu list item](./chapter-menu-list-item/README.md) | `chapter-menu-list-item/` | This branch |
| Chapter menu header | `chapter-menu-header/` | Not started |
| Chapter menu | `chapter-menu/` | Not started (needs header + list item) |

## Figma

[Chapter nav](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=16038-174)
page. Authoritative variant for each set is the first / designated one —
other variants on a set may be superseded structural explorations
(see overlap-check).
