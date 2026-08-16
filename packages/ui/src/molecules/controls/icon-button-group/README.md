# Control Icon Button Group

Labeled row of single-select Icon Buttons.

Figma: [Controls](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=16301-20374)
`type=Chip icon` — "LABEL" field. Figma renders the row with its own
placeholder glyph (`Icon / square-dashed`); `icon` is caller-supplied.

Composes `@/primitives/button/icon-button`; selection is applied via
`data-selected` at the molecule level, not a primitive change.
