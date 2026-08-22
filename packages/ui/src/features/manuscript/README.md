# Manuscript

Manuscript-editor content chrome — product-specific; stays in
`src/features/manuscript/`.

Each piece is its own folder. Compose across them; do not duplicate
primitives into this tree.

`Paragraph Block` (the individual row) lives under
[`src/molecules/paragraph-block/`](../../molecules/paragraph-block/README.md)
instead of here — it combines manuscript text, the drag handle, and
selection/drag interaction, but doesn't touch ordering, so it's a molecule
composed by this feature rather than a feature of its own. This folder is
for pieces that *compose* those molecules into product-specific behavior.

## Pieces

| Piece | Folder | Status |
| --- | --- | --- |
| [Paragraph List](./paragraph-list/README.md) | `paragraph-list/` | Landed |

## Figma

[Paragraph block](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=16129-377)
/ [Paragraph drop line](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=16372-4438).
