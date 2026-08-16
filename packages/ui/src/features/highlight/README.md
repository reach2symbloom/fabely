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
| [Highlight Color](./highlight-color/README.md) | `highlight-color/` | Landed |
| [Highlight Color Menu](./highlight-color-menu/README.md) | `highlight-color-menu/` | Landed |
| [Highlight Action Menu](./highlight-action-menu/README.md) | `highlight-action-menu/` | Landed |

`icon-semantics.tsx` and `assets/` at the feature root are shared
between pieces (glyph + hover-color mapping for Fia/Gather/Comment/
Highlight) — not a piece of their own.

## Figma

- [Highlight color](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=16317-950) —
  Default / Hover / Selected states.
- [Highlight color menu](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=16319-1082) —
  User highlight / System highlight.
- [Highlight menu](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=16315-1196) —
  vertical action pill, `hover` axis per action.
