# Date Picker

Popover + Calendar composition — not a vendor re-export. shadcn documents Date
Picker as a [guide](https://ui.shadcn.com/docs/components/base/date-picker), not
a registry component (there is no `DatePicker` root to install).

## Purpose

Use [Calendar](../calendar/README.md) inside [Popover](../popover/README.md) for
date (and range / DOB / input) pickers. This package exports a reusable
single-date `DatePicker` shell; other guide variants are composed the same way
in Storybook and in product code.

## Composition

```text
Popover
├── PopoverTrigger  → Button (outline) | InputGroupButton
└── PopoverContent
    └── Calendar    mode single | range · captionLayout …
```

## API

| Export | Notes |
| --- | --- |
| `DatePicker` | Controlled / uncontrolled single date; outline trigger + chevron |

## Deferred

- Re-verify Popover chrome (radius, pad, shadow) once
  [Popover](../popover/README.md) is Foundations-matched
- Re-verify Field / Input / Input Group hosts once those land
- Natural-language demo depends on `chrono-node` (already a package dependency)

## Related

- [Calendar](../calendar/README.md) — DayPicker surface
- [Popover](../popover/README.md) — popup host (thin-pass)
- [Button](../button/README.md) — trigger
- React DayPicker: https://react-day-picker.js.org
- shadcn: https://ui.shadcn.com/docs/components/base/date-picker
