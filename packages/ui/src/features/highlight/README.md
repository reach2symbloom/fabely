# Highlight

Manuscript text-highlight chrome — product-specific; stays in
`src/features/highlight/`.

Shell folder: this branch (`ft-highlights`) holds the folder and this
README only. Each piece lands on its own `ft-highlights-*` sub-branch
as a subfolder here, then merges back into `ft-highlights`, mirroring
how `chapter-nav` grew.

Each piece is its own folder. Compose across them; do not duplicate
primitives into this tree.

## Pieces

| Piece | Folder | Status |
| --- | --- | --- |
| — | — | Not started |

[Highlight Color](../../atoms/highlight-color/README.md) (atom) and
[Highlight Color Menu](../../molecules/highlight-color-menu/README.md)
(molecule) landed here first, then were reclassified into the reusable
tiers — both are generic enough that other features could compose
them, so they don't live in this feature-specific tree.

## Figma

- [Highlight color](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=16317-950) —
  Default / Hover / Selected states.
- [Highlight color menu](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=16319-1082) —
  User highlight / System highlight.
