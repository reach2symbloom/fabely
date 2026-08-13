# Popover

Displays rich content in a portal, triggered by a button.

## Purpose

Import from this primitive rather than `src/components/ui/popover`. Public
API matches [shadcn Popover](https://ui.shadcn.com/docs/components/base/popover)
(Base UI [Popover](https://base-ui.com/react/components/popover)).

## No Figma source — Foundations floating panel

**No dedicated Figma Popover set.** Content chrome uses the same Foundations
floating-panel tokens as Dialog / Dropdown / Hover Card (`--radius`, border,
lg shadow), with fill `--popover` / `--popover-foreground`. Hover Card uses
the same fill; its lighter weight is padding (`--spacing-xs` vs `--spacing-md`).

## Composition

```text
Popover
├── PopoverTrigger
└── PopoverContent
    ├── PopoverHeader
    │   ├── PopoverTitle
    │   └── PopoverDescription
    └── …slot content (forms, etc.)
```

## Token substitutions

| Vendor | Foundations | Notes |
| --- | --- | --- |
| `rounded-3xl` | `--radius` | Dialog / Hover Card panel |
| `bg-popover` / `text-popover-foreground` | `--popover` / `--popover-foreground` | Exact semantic |
| `p-4` / `gap-4` | `--spacing-md` (16) | Exact |
| `shadow-lg` + ring | `--shadow-lg-black` / `--shadow-lg-white` + `--border` | Ring → border (Dialog) |
| Title `text-base font-medium` | Paragraph Small Medium | Compact panel title |
| Description muted | Paragraph Small Regular + `--muted-foreground` | Exact role |
| Header `gap-1` | `--spacing-2xs` (4) | Exact |

## Left on vendor / layout defaults

| Value | Why |
| --- | --- |
| `w-72` default width | Override via `className` (Date Picker: `w-auto p-0`) |
| `side` / `align` / offsets | Base UI Positioner API |
| Open / close motion (`duration-100`, zoom/fade) | Shared with Hover Card / Dialog |

## API

| Export | Notes |
| --- | --- |
| `Popover` | Root |
| `PopoverTrigger` | `render` for custom triggers |
| `PopoverContent` | Portal + Positioner + Popup; `shadow` defaults `true` |
| `PopoverHeader` / `Title` / `Description` | Optional chrome |

## Deferred

- Padding vs [Hover Card](../hover-card/README.md) is intentional
  (`--spacing-md` vs `--spacing-xs`); fill is shared (`--popover`).
  [Tooltip](../tooltip/README.md) stays a separate recipe.
- [Date Picker](../date-picker/README.md) hosts this surface — re-check
  calendar chrome after this landing.

## Related

- [Dialog](../dialog/README.md) · [Hover Card](../hover-card/README.md) ·
  [Date Picker](../date-picker/README.md)
- Docs: [shadcn Popover](https://ui.shadcn.com/docs/components/base/popover)
