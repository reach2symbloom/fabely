# Calendar

Date and date-range selection built on [React DayPicker](https://react-day-picker.js.org).

## Purpose

Import from this primitive rather than `src/components/ui/calendar`. Public
surface matches [shadcn Calendar](https://ui.shadcn.com/docs/components/base/calendar)
(`mode`, `selected`, `onSelect`, `captionLayout`, `locale`, `dir`, …).

## No Figma source — shadcn documentation used instead

**No Figma design exists for Calendar.** Per `docs/DESIGN.md` and the
Breadcrumb / Accordion precedent, this milestone is a Foundations restyle of
the shadcn Base Calendar — not a new variant set.

## Composition

```text
Calendar                 DayPicker props + buttonVariant
└── (DayPicker internals)
    ├── nav (prev / next)     ← Fabely buttonVariants
    ├── caption / dropdowns
    ├── weekday row
    └── day grid
        └── CalendarDayButton ← Fabely Button (ghost)
```

`CalendarDayButton` is exported for advanced `components` overrides.

## Token substitutions

| Vendor | Foundations | Notes |
| --- | --- | --- |
| `p-3` | `--spacing-sm` (12) | Root pad |
| `[--cell-size:--spacing(8)]` | `--spacing-2xl` (32) | Day / nav hit target |
| `[--cell-radius:var(--radius-4xl)]` | `--rounded-lg` (12) | No `--radius-4xl` in Foundations |
| `gap-4` | `--spacing-md` | Months / month stack |
| `gap-1` / `gap-1.5` | `--spacing-2xs` / `--spacing-1-5` | Nav / dropdowns |
| `text-sm` / `text-[0.8rem]` | Paragraph Small / Mini | Caption / weekday |
| Chevron `size-4` | `--icon-sm` | Lucide system UI |
| Caption chevron `size-3.5` | `--icon-xs` | Dropdown affordance |
| Focus `ring-[3px]` | `--effect-focus-ring-secondary` | Day focus |
| Range filler `after:w-4` | `--spacing-md` | Range bridge |
| L/R radii | `rounded-s` / `rounded-e` | RTL-safe (shadcn changelog) |
| Vendor `Button` / `buttonVariants` | Fabely `Button` / `buttonVariants` | Day + nav |
| Range middle `bg-muted` | Primary @ 14% mix | Continuous tinted band |
| Selected hover `text-foreground` | Opacity soft on primary | Avoids wash-to-white |
| Today `bg-muted` fill | Transparent + `--stroke-thin` / `--border` roundrect | Outline when unselected; suppressed in range/selection so the band stays continuous |

### Left on vendor / DayPicker

- Layout mechanics (`absolute` nav, `aspect-square` days, DayPicker class hooks)
- Semantic fills (`--primary`, `--muted`, `--background`, `--popover`) already Foundations-backed
- `--cell-size` / `--cell-radius` CSS variables remain public for custom cell sizing (see stories)

## API

| Export | Notes |
| --- | --- |
| `Calendar` | DayPicker props + `buttonVariant` (`ghost` \| `outline` \| `tertiary` \| `secondary`) |
| `CalendarDayButton` | Day cell button; accepts `locale` for `toLocaleDateString` |
| `CalendarProps` | Public props type |

Always prefer controlled `selected` / `onSelect` (or range equivalents). Pass
`timeZone` when SSR/client timezone skew is a risk — see shadcn docs.

## Deferred

- **Date Picker Popover chrome** — [Date Picker](../date-picker/README.md) landed;
  re-verify once Popover is Foundations-matched
- **Persian / Hijri** (`react-day-picker/persian`) — opt-in swap, not default
- Presets / date-time demos that need Card + Input polish

Tracked in [post-primitives docket](../../../.migration/post-primitives-docket.md).

## Related

- [Button](../button/README.md) — day cells + nav chrome
- [React DayPicker](https://react-day-picker.js.org)
- shadcn docs: https://ui.shadcn.com/docs/components/base/calendar
