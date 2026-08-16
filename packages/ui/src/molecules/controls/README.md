# Controls

Interactive control molecules — compose primitives into a functioning
unit, not one-off primitive variants. Stays in
`src/molecules/controls/`.

Shell folder: this branch (`mc-controls`) holds the folder and this
README only. Each piece lands on its own `mc-controls-*` sub-branch as
a subfolder here, then merges back into `mc-controls`, mirroring how
`chapter-nav` grew.

Each piece is its own folder. Compose across them; do not duplicate
primitives into this tree.

## Pieces

| Piece | Folder | Status |
| --- | --- | --- |
| [Control Label](./control-label/README.md) | `control-label/` | Landed |
| [Control Dropdown](./dropdown/README.md) | `dropdown/` | Landed |
| [Control Slider](./slider/README.md) | `slider/` | Landed |
| [Control Icon Button Group](./icon-button-group/README.md) | `icon-button-group/` | Landed |
| Control Rich Divider (section divider) | `rich-divider/` | Blocked — needs the ornament SVG asset |

## Figma

[Controls](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=16301-20374)
frame. `Header variant` and `Chip icon + text` types use Rich Radio Chip,
which isn't in this codebase yet (lives on the unmerged `pr/radio-group`
branch) — out of scope until that lands.
