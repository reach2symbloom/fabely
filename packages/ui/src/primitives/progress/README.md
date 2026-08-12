# Progress

Displays an indicator showing the completion progress of a task.

## Purpose

Import from this primitive rather than `src/components/ui/progress`. Public
API matches [shadcn Progress](https://ui.shadcn.com/docs/components/base/progress)
(Base UI [Progress](https://base-ui.com/react/components/progress)), plus Figma
`size`.

## Figma source

[Fabely Design System → Progress](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=5010-29)

| Axis | Values |
| --- | --- |
| Size | `thin` (4px) · `thick` (8px, slanted leading edge) |
| Progress | 0–100 (`value`) |
| Show | optional trailing `%` via `ProgressValue` |

## Composition

```text
Progress                    size="thin" | "thick"
├── ProgressLabel           (optional — wraps above track)
├── ProgressValue           (optional — trailing % / header end)
└── ProgressTrack           (auto)
    └── ProgressIndicator
```

## Token substitutions

| Role | Foundations |
| --- | --- |
| Track fill | `--theme-alpha-black-switch-333` |
| Track / indicator radius | `--rounded-lg` (12) |
| Thin height | `--spacing-2xs` (4) |
| Thick height | `--spacing-xs` (8) |
| Indicator fill | `--gradient-primary-left-right` |
| Root gap (bar ↔ %) | `--spacing-md` (16) |
| Value type | Paragraph Mini Medium + `--muted-foreground` |
| Motion | `--duration-fast` |

## API

| Export | Notes |
| --- | --- |
| `Progress` | Root; `value`; `size` `thin` \| `thick` (default `thin`) |
| `ProgressLabel` / `ProgressValue` | Optional chrome |
| `ProgressTrack` / `ProgressIndicator` | Exported for custom composition |

## Deferred

- Controlled story uses thin-pass [Slider](../slider/README.md).
- Thick Figma set uses per-step glow SVG overlays — omitted here; revisit if
  pixel QA needs them. RTL mirrors the slant onto inline-end.

## Related

- [Slider](../slider/README.md) · [Spinner](../spinner/README.md)
- Docs: [shadcn Progress](https://ui.shadcn.com/docs/components/base/progress)
