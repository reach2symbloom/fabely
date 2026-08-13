# Tooltip

Brief label that appears on hover / focus.

## Purpose

Import from this primitive rather than `src/components/ui/tooltip`. Public API
matches [shadcn Tooltip](https://ui.shadcn.com/docs/components/base/tooltip)
(`TooltipProvider`, `Tooltip`, `TooltipTrigger`, `TooltipContent`), plus a
`variant` on content.

Open delay defaults to **0** on Provider and Trigger (and every `Tooltip`
wraps a Provider), so labels show immediately — including Sidebar icon-rail
tooltips.

## Figma source

[Tooltip](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=133-14788)
(`133:14788`) — page
[Tooltip](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=842-44449)
(`842:44449`). Figma axis is Side only (Top / Bottom / Left / Right) →
`side` on `TooltipContent`.

| Figma / intent | Code |
| --- | --- |
| Side | `side` (`top` \| `bottom` \| `left` \| `right`) |
| Neutrals (New)/150 surface | `variant="default"` |
| High-contrast inverted chip (sidebar) | `variant="inverse"` |

## Composition

```text
TooltipProvider   (optional — Tooltip already includes one with delay 0)
└── Tooltip
    ├── TooltipTrigger
    └── TooltipContent  (variant · side · align)
```

## Token substitutions (Figma variable → Foundations)

| Figma binding | Foundations |
| --- | --- |
| `Neutrals (New)/150` | `--neutrals-new-150` |
| `shadcn colors/general/border` | `--border` |
| `shadcn colors/general/foreground (black)` | `--foreground` |
| `xs` pad x / gap | `--spacing-xs` |
| `odd/1.5` pad y | `--spacing-1-5` |
| `rounded-md` | `--rounded-md` |
| paragraph mini/* | `--text-paragraph-mini-regular-*` |
| Inverse fill / type | `--foreground` / `--background` |

## API

| Export | Notes |
| --- | --- |
| `TooltipProvider` | `delay` / `closeDelay` default `0` |
| `Tooltip` | Wraps an inner Provider (`delay` 0) |
| `TooltipTrigger` | `delay` / `closeDelay` default `0` |
| `TooltipContent` | `variant`: `default` \| `inverse` |

## Deferred

- [ ] Re-verify Kbd Glow pairing on `default` (light) vs `inverse` / dark.
      See [Kbd README](../kbd/README.md) · post-primitives docket.
