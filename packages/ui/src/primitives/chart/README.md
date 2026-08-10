# Chart

Recharts composition helpers — container, tooltip, and legend — with Foundations
chrome and Figma chart series colors.

## Purpose

Import from this primitive rather than `src/components/ui/chart`. Public API
matches [shadcn Chart](https://ui.shadcn.com/docs/components/base/chart):
`ChartConfig`, `ChartContainer`, `ChartTooltip` / `ChartTooltipContent`,
`ChartLegend` / `ChartLegendContent`, `ChartStyle`. Compose Recharts chart
types yourself — we do not wrap `BarChart` / `LineChart`.

## Figma source

[Fabely Design System → Charts](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry?node-id=842-52058)
— building blocks + **chart colors** collection (`chart 1`…`chart 5`).

## Composition

```text
ChartContainer          config · height / aspect
└── (Recharts chart)    BarChart | LineChart | …
    ├── CartesianGrid / XAxis / …
    ├── ChartTooltip → ChartTooltipContent
    └── ChartLegend → ChartLegendContent
```

## Token substitutions

| Source | Foundations | Notes |
| --- | --- | --- |
| Figma `chart 1`…`5` | `--chart-1`…`--chart-5` | Neutrals ladder (see `colors.css`) |
| Tooltip surface | `--card` / `--border` / `--shadow-lg-*` | Radius `--rounded-md` (8) |
| Tooltip / legend type | Paragraph Mini | Axis ticks too (via container) |
| Tooltip hover cursor | `--theme-alpha-black-switch-5` | Recharts active column band |
| Legend swatch | `--rounded-xs` (2) · `--spacing-xs` | Figma 8×8 |
| Grid / cursor strokes | `--border` | Recharts attribute selectors |

### Chart colors (Figma aliases)

| Token | Alias |
| --- | --- |
| `--chart-1` | `--theme-neutrals-300` |
| `--chart-2` | `--theme-neutrals-400` |
| `--chart-3` | `--tw-raw-neutral-500` |
| `--chart-4` | `--tw-raw-neutral-600` |
| `--chart-5` | `--tw-raw-neutral-700` |

## API

| Export | Notes |
| --- | --- |
| `ChartContainer` | Provides config context + CSS vars `--color-*` |
| `ChartConfig` | Labels, icons, `color` / `theme` |
| `ChartTooltip` / `ChartTooltipContent` | `indicator`: `dot` \| `line` \| `dashed` |
| `ChartLegend` / `ChartLegendContent` | |
| `ChartStyle` / `useChart` | Style injection + context |

## Deferred

- Line / area / pie demos from the Charts library once product needs them
- Dark-mode series tuning if Figma adds a dark mode to **chart colors**

## Related

- [Card](../card/README.md) — common chart shell in product
- Recharts: https://recharts.org/
- shadcn: https://ui.shadcn.com/docs/components/base/chart
