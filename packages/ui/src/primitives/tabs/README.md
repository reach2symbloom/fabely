# Tabs

Layered content panels switched by a tab list (segmented or underline).

## Purpose

Import from this primitive rather than `src/components/ui/tabs`. Prefer
**Tabs** for mutually exclusive panels; use
[Toggle Group](../toggle-group/README.md) when options toggle without panels.

## Sources

| Source | Role |
| --- | --- |
| [shadcn Tabs](https://ui.shadcn.com/docs/components/base/tabs) | API, composition |
| Figma [Tabs](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=842-50580) page (`842:50580`) | Page |
| Figma [Tab (segmented)](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=9-634) (`9:634`) | Item chrome · Size · Content · State |
| Figma [Tabs (segmented)](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=9-639) (`9:639`) | Pill track (Fill · Icons · Size) |
| Figma [Tab (line)](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=5508-2187) (`5508:2187`) | Underline item |
| Figma [Tabs (line)](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=5508-1899) (`5508:1899`) | Underline list |

## Composition

```text
Tabs              orientation · value / defaultValue
├── TabsList      variant · size
│   └── TabsTrigger
└── TabsContent
```

Base UI Tabs — controlled via `value` / `onValueChange`, or `defaultValue`
for uncontrolled.

## Figma → API

| Figma | Code |
| --- | --- |
| Tabs (segmented) | `TabsList variant="default"` |
| Tabs (line) | `TabsList variant="line"` |
| Size=Small | `size="sm"` |
| Size=Default | `size="default"` |
| Size=Large | `size="lg"` |
| Size=AI toggle / Size5 | Deferred |
| Content=Label / Icon / Icon+Label | children (+ Lucide) |
| State Inactive / Hover / Focus / Active / Disabled | Base UI + CSS |
| Icons=Solar | Deferred (Lucide for this pass) |
| Thread tabs / counter | Deferred |

## Tokens

| Concern | Foundations |
| --- | --- |
| Segmented track | `--theme-alpha-black-switch-333` |
| Inactive (segmented) | `opacity-50` |
| Hover (segmented) | `--theme-alpha-black-switch-333` fill · full opacity |
| Active pill fill | Neutrals/200 (dark /700) via padding-box layer |
| Active pill stroke | `--gradient-primary-top-bottom` on border-box (transparent border) |
| Active selection ring | `--effect-focus-ring-primary` |
| Focus (inactive) | `--effect-focus-ring-secondary` (+ `--muted` fill) |
| Line underline | Sliding `TabsIndicator` · `--stroke-thick` (4) · `--primary` · radius `--stroke-hairline` (0.5) |
| Line track | `::before` hugs tab cluster · `--theme-alpha-black-switch-5` · `--stroke-thick` · radius `--stroke-hairline` |
| Line indicator motion | `--duration-fast` / `--ease-emphasized` (`translate` + size) |
| Line focus | secondary ring on Content slot |
| Type | paragraph mini / small / regular medium |
| Icons | Lucide · `--icon-sm` |
| Motion | `--duration-fast` / `--ease-emphasized` |

## API

| Export | Notes |
| --- | --- |
| `Tabs` | Root; `orientation` default `horizontal` |
| `TabsList` | `variant` default `default`; `size` cascades to triggers; injects `TabsIndicator` when `line` |
| `TabsTrigger` | Inherits list variant / size via context |
| `TabsContent` | Panel |
| `TabsIndicator` | Line underline — usually injected; Base UI `--active-tab-*` |
| `tabsListVariants` / `tabsTriggerVariants` | CVA |

## Scope (this pass)

Segmented + line · sm / default / lg · horizontal + vertical · icons ·
disabled · RTL — matching Figma Tabs (segmented / line) on the shadcn size
ladder.

## Deferred

- **Fill=False Large (elevated inactive)** — Figma Large Inactive uses
  background + alpha-333 stroke + `--shadow-xs` when the track has no fill.
  In-track Large keeps the opacity inactive pattern. See docket.
- **AI toggle / Size5** — Figma Tabs (segmented) odd sizes; not on the shadcn
  ladder. See
  [post-primitives docket](../../../.migration/post-primitives-docket.md).
- **Solar icon set on tabs** — this pass uses Lucide only (do not mix sets).
- **Thread tabs / Tab molecule / counter** — beyond the shadcn Tabs surface:
  [Thread tabs](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=12055-29751)
  (`12055:29751`), [Tab molecule](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=12055-29782)
  (`12055:29782`), [.Tabs Counter](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=189-43120)
  (`189:43120`).
- **Collapsible File Tree header** — restore Explorer / Outline Tabs once
  Collapsible composition is revisited. See
  [Collapsible README → Deferred](../collapsible/README.md#deferred).
