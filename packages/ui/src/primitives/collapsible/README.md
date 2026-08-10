# Collapsible

An interactive component which expands/collapses a panel.

## Purpose

Import from this primitive rather than `src/components/ui/collapsible`. Public
API matches [shadcn Collapsible](https://ui.shadcn.com/docs/components/base/collapsible)
(Base UI `Collapsible.Root` / `Trigger` / `Panel`):

```text
Collapsible
├── CollapsibleTrigger
└── CollapsibleContent
```

## No Figma source — shadcn documentation used instead

There is no Collapsible page in the Fabely DS file. Per `docs/DESIGN.md`,
composition and examples follow shadcn / Base UI for this milestone (same
approach as [Accordion](../accordion/README.md)).

## Token substitutions

| Role | Foundations | Notes |
| --- | --- | --- |
| Trigger focus (bare) | `--effect-focus-ring-secondary` | Prefer Button / IconButton via `render` |
| Content type | Paragraph Small Regular | |
| Panel height | `--collapsible-panel-height` | Base UI CSS var + `data-starting/ending-style` |
| Open/close motion | `duration-200` height transition | Same category as Accordion panel motion |

## API

| Export | Notes |
| --- | --- |
| `Collapsible` | `open` / `defaultOpen` / `onOpenChange`, `disabled` |
| `CollapsibleTrigger` | Bare button or `render={<Button />}` / IconButton |
| `CollapsibleContent` | Base UI Panel; open state on trigger is `data-panel-open` |

## Deferred

- **Settings Panel** — Field / Input still thin-pass; re-verify once matched.
- **File Tree** — Tabs header chrome deferred (thin-pass Tabs); story uses a
  plain Explorer title on Card.
- **Figma Collapsible** — if a DS page is authored later, revisit variants.

## Related

- [Accordion](../accordion/README.md) — multi-item disclosure with chevron chrome
- [Card](../card/README.md) — common shell for Basic / Settings / File Tree demos
- shadcn: https://ui.shadcn.com/docs/components/base/collapsible
- Base UI: https://base-ui.com/react/components/collapsible
