# Status

Colored-dot status readout, in two variants: `'label'` (dot + text) and
`'glyph'` (bare pulsing dot in a soft halo, for another component's
trailing slot). Originally two separate atoms (`Status` and
`StatusIndicator`) — folded into one here as a `variant`, since both
express the same semantic idea.

## Placement

YES — reusable status indicator, not tied to API Connection or the
Promptbar. Lives in `src/atoms/status/`.

## Overlap

| Candidate | Verdict |
| --- | --- |
| **Badge** | Skip — filled pill for categorical tags (Library List Item's genre/series lockup), a different job from a dot-based state readout. |

## Variants

### `'label'` (default)

Standalone connection/state row with a required text label.

**Authoritative Figma**: [Status](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=16456-17778)
(`16456:17778`), part of the [API Connections](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=16456-17857)
set. Only one tone is published ("Connected", green).

- Dot uses Figma's "Icon / dot large" (`16456:17766`) construction — a
  24×24 (`--icon-lg`) frame with a *solid filled* 8×8 (`--icon-2xs`)
  circle centered inside (`inset: 33.33%`), reproduced as a plain
  `bg-current` circle in a flex-centered box, not an icon glyph. Lucide's
  `Dot` was tried first and is visually wrong for this: it draws a thin
  `r=1` stroke-outlined mark meant to read as a small `·` character, not
  a solid dot — scaling its 24×24 viewBox down to 8×8 shrank the actual
  visible mark to a sub-pixel sliver.
- No gap between the dot and the `paragraph/mini/regular` label — the
  dot's own 24×24 box already reads as spacing, matching Figma exactly.

| Role | Figma | Token |
| --- | --- | --- |
| Dot (`success` tone) | raw green | `--tw-raw-success-500` |
| Label | muted-foreground | `--theme-alpha-black-switch-60` (direct — not `--muted-foreground`, which doesn't re-resolve on a locally-`.dark`-wrapped canvas; see API Connection's README for the full explanation) |

### `'glyph'`

Bare pulsing dot inside a soft semantic ghost halo, no label — meant to be
embedded in another component's trailing slot (`StatusBadge`), not to
stand alone.

**Authoritative Figma**: [Promptbar status badges](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=16199-2312)
(`16199:2312`) — the "Dot divider" asset on the Scene Desk / All Notes
examples. Traced by fetching that asset's own SVG directly rather than
guessing from its name: a plain filled 6×6 circle, `fill: #76E0B2` — an
exact match to `--tw-raw-success-500`.

```text
Status (variant="glyph") → motion.span (halo)
  └── span (solid dot)
```

The halo is `--tw-raw-success-ghost` wrapped in
`color-mix(in srgb, ... 12%, transparent)`, the same treatment the Badge
primitive's own `success` variant already uses — that token is an opaque
hex in this codebase today, not a translucent one, so this matches
Badge's existing shipped workaround rather than computing a second,
differently-derived "success ghost."

**Pulse uses `FLOAT_LOOP` (`@/lib/motion`)** — the one ambient-loop preset
in this codebase (`duration: 1.5, repeat: Infinity, ease: 'easeInOut'`),
documented on the token itself as reusable for any ambient loop, not just
Drop Target's own y-float. Applied to `scale`/`opacity` on the halo (not
the solid dot) instead of `y` — same timing, different property, rather
than inventing a new duration/easing pair. Respects
`prefers-reduced-motion` (`useReducedMotion()` disables the animation
entirely, matching Drop Target's own gating).

| Concern | Foundations |
| --- | --- |
| Halo background | `color-mix(in srgb, var(--tw-raw-success-ghost) 12%, transparent)` |
| Halo padding (creates the 12×12 total size) | `--spacing-0-75` (3px) |
| Dot size | `--spacing-1-5` (6px) |
| Dot color | `--tw-raw-success-500` |
| Radius (both halo and dot) | `--rounded-full` |
| Motion | `FLOAT_LOOP` (`@/lib/motion`) |

## API

| Prop | Default | Notes |
| --- | --- | --- |
| `variant` | `'label'` | `'label'` or `'glyph'` — see Variants above |
| `label` | — | Required for `'label'`; not accepted (`never`) on `'glyph'` |
| `tone` | `'success'` | Literal union, not a boolean — only "connected" is published in Figma for either variant, left open for a disconnected/error/syncing state later |
| `pulse` | `true` | `'glyph'` only — set `false` for a static reading (e.g. a snapshot in a list where motion would be distracting) |
| `className` | — | Applied to the outer element (the row for `'label'`, the halo for `'glyph'`) |

## Deferred

- Only `tone="success"` exists for either variant — no
  disconnected/error/syncing state is published in Figma yet.
