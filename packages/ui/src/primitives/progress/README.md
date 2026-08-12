# Progress

Displays an indicator showing the completion progress of a task, typically as
a progress bar.

## Purpose

Import from this primitive rather than `src/components/ui/progress`. Public
API matches [shadcn Progress](https://ui.shadcn.com/docs/components/base/progress)
(Base UI [Progress](https://base-ui.com/react/components/progress)).

## No Figma source — Foundations restyle

**No dedicated Figma Progress set.** Per `docs/DESIGN.md` and the Accordion /
Pagination precedent, this milestone restyles the shadcn API with Foundations
colors, radius, spacing, type, and motion.

## Composition

```text
Progress
├── ProgressLabel          (optional)
├── ProgressValue          (optional)
└── ProgressTrack          (auto-composed by Progress)
    └── ProgressIndicator
```

## Token substitutions

| Vendor | Foundations | Notes |
| --- | --- | --- |
| Root `gap-3` | `--spacing-sm` (12) | Exact |
| Track `h-3` | `--spacing-sm` (12) | Nearest published size token |
| Track `rounded-full` | `--rounded-full` | Exact |
| Track `bg-muted` | `--muted` | Exact |
| Indicator `bg-primary` | `--primary` | Exact |
| Indicator `transition-all` | + `--duration-fast` | Motion token |
| Label `text-sm font-medium` | Paragraph Small Medium | Exact role |
| Value `text-sm` muted + `ml-auto` | Paragraph Small Regular + `ms-auto` | Logical margin for RTL |

## Left on vendor / layout defaults

| Value | Why |
| --- | --- |
| `flex flex-wrap` on root | Layout so label/value sit above full-width track |
| `tabular-nums` on value | Numeric alignment |
| Auto-compose Track inside Root | Matches shadcn API |

## API

| Export | Notes |
| --- | --- |
| `Progress` | Root; `value`; auto Track + Indicator |
| `ProgressLabel` / `ProgressValue` | Optional header row |
| `ProgressTrack` / `ProgressIndicator` | Exported for custom composition |

## Deferred

- Controlled story uses thin-pass [Slider](../slider/README.md) — re-skin once
  Slider is Foundations-matched.
- Optional Figma Progress set → pixel pass if Library authors one.

## Related

- [Slider](../slider/README.md) · [Spinner](../spinner/README.md)
- Docs: [shadcn Progress](https://ui.shadcn.com/docs/components/base/progress)
