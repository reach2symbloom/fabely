# Kbd

Keyboard key labels for shortcuts and affordances.

## Purpose

Import from this primitive rather than `src/components/ui/kbd`. Public API
matches [shadcn Kbd](https://ui.shadcn.com/docs/components/base/kbd) (`Kbd`,
`KbdGroup`), plus Figma’s Mode axis as `variant`.

## Figma source

[kbd](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=12116-7780)
(`12116:7780`) — page [Kbd](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=842-49171).
Mode specimen (Default over Glow):
[kbd group](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=780-42498)
(`780:42498`). Companion
[kbd combo](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=780-43835)
(`780:43835`) → `KbdGroup` + optional `+` text in composition.

| Figma | Code |
| --- | --- |
| Mode Default (`780:42511`) | `variant="default"` |
| Mode Glow (`12116:7781`) | `variant="glow"` (also auto inside inverse / dark Tooltip) |
| key | children |

## Composition

```text
Kbd
KbdGroup
├── Kbd
└── Kbd
```

## Token substitutions (Figma variable → Foundations)

| Figma binding | Foundations |
| --- | --- |
| `2xs` (pad x) | `--spacing-2xs` |
| `3xs` (pad y) | `--spacing-3xs` |
| `rounded-sm` | `--rounded-sm` |
| `alpha/black/switch/alpha-5` | `--theme-alpha-black-switch-5` |
| `alpha/black/switch/alpha-50` | `--theme-alpha-black-switch-50` |
| `alpha/white/no-switch/alpha-25` | `--theme-alpha-white-no-switch-25` |
| `alpha/white/no-switch/alpha-60` | `--theme-alpha-white-no-switch-60` |
| `font definitions/font-family-body` | `--font-family-body` |
| `paragraph/paragraph-weight` | `--font-weight-paragraph-regular` |
| `paragraph/mini/font-size` | `--text-paragraph-mini-regular-font-size` |
| `paragraph/mini/line height` | `--text-paragraph-mini-regular-line-height` |
| `paragraph/mini/letter-spacing` | `--text-paragraph-mini-regular-letter-spacing` |
| combo `itemSpacing` `2xs` | `--spacing-2xs` on `KbdGroup` |

Glow is **white @ 25%** for dark surfaces. Story demos put Glow on
`--theme-neutrals-900` charcoal; Default sits on the page (no charcoal panel
in light mode).

## API

| Export | Notes |
| --- | --- |
| `Kbd` | `variant`: `default` \| `glow` |
| `KbdGroup` | Inline flex row; `div` (not nested `<kbd>`) |
| `KBD_GLOW_SURFACE` | Story/demo charcoal panel class |

## Deferred

- [ ] **Light-mode final check** — walk Default / Glow / Tooltip / Input Group /
      Button demos in light theme; confirm Glow specimen charcoal only appears
      when needed, Default never sits on a dark panel, and contrast holds.
- [ ] **Tooltip pairing** — `default` Tooltip uses Neutrals/150 (Default switch
      alphas); `inverse` / dark hosts auto-Glow. Confirm both in light + dark.
      See post-primitives docket.
