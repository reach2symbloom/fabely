# Cycle Switch

Figma **Cycle switch** (`16399:23372`) — pill that advances through a finite
option list in one direction (wraps). Rest fill
`--theme-alpha-white-no-switch-5` / border `--theme-alpha-black-switch-333`;
hover `--theme-alpha-white-no-switch-10` / `--theme-alpha-black-switch-5`.
Tooltip (default: “Cycle between outline views”) on hover.

## Placement

YES — same chrome with different option lists (outline filters, density,
etc.). Lives in `src/atoms/cycle-switch/`.

## Overlap

| Piece | Approach |
| --- | --- |
| Switch / Switch Light | Binary on/off — different job. Do not extend. |
| Toggle Group | Shows all options at once — different job. |
| Icon | Solar Bold Duotone Eye in one SVG, filled with Figma `gradients/primary` (`--tw-raw-primary-gradient-1/2` via `url(#id)`). Same-SVG paint server — a CSS mask with black fills luminance-masks to transparent in WebKit and the glyph then picked up muted label color. Lid uses `--icon-solar-secondary-opacity`. |
| Tooltip | Compose primitive for hover tip. |

## API

| Prop | Role |
| --- | --- |
| `options` | `{ value, label }[]` — click advances to next |
| `value` / `defaultValue` / `onValueChange` | Controlled or uncontrolled |
| `tooltip` | Tip copy; `false` hides |

## Authoritative Figma

[Cycle switch](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=16399-23372)
— Filter mode × Hover. Used by Chapter Menu Header variants (deferred
alternatives until one is designated).
