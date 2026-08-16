# Controls

Interactive control molecules — compose primitives into a functioning
unit, not one-off primitive variants. Stays in `src/molecules/controls/`.

Figma: [Controls](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=16301-20374)
frame. `Header variant` and `Chip icon + text` types use Rich Radio Chip,
which isn't in this codebase yet (lives on the unmerged `pr/radio-group`
branch) — out of scope until that lands.

Small and similar enough to live as flat files rather than one folder per
piece — compose across them; do not duplicate primitives into this tree.
One Storybook entry (`controls.stories.tsx`) covers all of them in a
single Overview playground.

## Pieces

| Piece | File | Composes |
| --- | --- | --- |
| Control Label | `control-label.tsx` | — (caption, no primitive) |
| Control Dropdown | `control-dropdown.tsx` | `@/primitives/select` |
| Control Slider | `control-slider.tsx` | `@/primitives/slider` |
| Control Icon Button Group | `control-icon-button-group.tsx` | `@/primitives/button/icon-button` |
| Control Rich Divider | `control-rich-divider.tsx` | `@/primitives/select`, `@/primitives/separator` |

`assets/section-divider-ornament.tsx` is the exported Figma ornament SVG,
recolored to `currentColor`.
