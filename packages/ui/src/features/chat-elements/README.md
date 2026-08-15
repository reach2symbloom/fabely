# Chat Elements

Chat/assistant chrome — product-specific; stays in
`src/features/chat-elements/`.

Shell folder: this branch (`ft-chat-elements`) holds the folder and
this README only. Each piece lands on its own `ft-chat-elements-*`
sub-branch as a subfolder here, then merges back into
`ft-chat-elements`, mirroring how `chapter-nav` grew.

Each piece is its own folder. Compose across them; do not duplicate
primitives into this tree.

## Pieces

| Piece | Folder | Status |
| --- | --- | --- |
| [Theme Card](./theme-card/README.md) | `theme-card/` | Landed |
| [Topic Map Card](./topic-map-card/README.md) | `topic-map-card/` | Landed |

## Figma

[Theme card](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=16338-2655)
[Topic map card](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=16338-2709)
page. Authoritative variant for each set is the first / designated one —
other variants on a set may be superseded structural explorations
(see overlap-check).
