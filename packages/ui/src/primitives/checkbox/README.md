# Checkbox

A control that toggles between checked and not checked (including indeterminate).

## Purpose

Import from this primitive rather than `src/components/ui/checkbox`. Public API
matches [shadcn Checkbox](https://ui.shadcn.com/docs/components/base/checkbox)
(Base UI `Checkbox.Root`): controlled / uncontrolled checked state,
`indeterminate`, `disabled`, `aria-invalid`.

## Figma source

[Fabely Design System → Checkbox](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry?node-id=842-49183)
— component set **Checkbox** (`Checked?` × `State`). Post-it: keep checks /
radios / switches swappable in larger hosts once those atoms match.

## Token substitutions

| Source | Foundations | Notes |
| --- | --- | --- |
| Box 16×16 · radius 5 | `--spacing-md` · `--rounded-sm` | Unchecked Figma bg is 14×14 optical; control is 16 |
| Unchecked fill / stroke | `--background` / `--input` | |
| Checked / indeterminate fill | `--primary` | Glyph `--primary-foreground` via `text-current` |
| Error stroke / fill | `--destructive` | Keeps `primary-foreground` glyph |
| Focus ring (spread 3) | `--effect-focus-ring-primary` | Error → `--effect-focus-ring-error` |
| Indicator enter/exit | `scale-50` · `duration-150` | Base UI `data-starting/ending-style` |
| Check / minus glyph | `--icon-xs` (12) | Figma icons are ~14; nearest Foundations step |
| Disabled checked glyph | `opacity-60` on svg | Figma alpha-60 mute |

## API

| Export | Notes |
| --- | --- |
| `Checkbox` | Base UI root props; Lucide `Check` / `Minus` indicators |

Pair with Field + FieldLabel for labeled layouts (see shadcn docs). Set
`aria-invalid` on the checkbox and `data-invalid` on the Field wrapper for
invalid styles.

## Deferred

- **Field / Label** — Basic, Description, Disabled, Group, Invalid, and RTL
  demos use thin-pass Field/Label; re-verify spacing and disabled/invalid host
  styles once those are Foundations-matched.
- **Table** — re-skin Data Table selection rows once Table is matched
  (demo lives under [Data Table](../data-table/README.md)).
- **Figma Checkbox Group** — separate Figma set (Inline / Block); compose via
  Field once Label/Field land rather than a second primitive.

## Related

- shadcn: https://ui.shadcn.com/docs/components/base/checkbox
- Base UI: https://base-ui.com/react/components/checkbox
