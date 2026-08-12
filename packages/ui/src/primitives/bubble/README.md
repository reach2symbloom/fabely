# Bubble

The Fabely Bubble primitive — conversational message surface for chat.

## Purpose

Import from this primitive rather than `src/components/ui/bubble`. Speakers
Speakers are modeled as `from="user" | "other"` (alignment, sharp
near-speaker corner, and default fill: **other → black-switch 10%**, **user →
secondary**). Keep `variant="destructive"` for error / failed-action
surfaces — no other shadcn color variants.

## Figma source

Visual source of truth: **Chat bubbles** in
[Fabely Design System](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=16340-807)
(`fileKey` `gV94L0qCmvwQkddNbEktry`, node `16340:807`, page Chat elements).

One authored example is the **user** bubble (`--secondary`). The other
speaker mirrors radius / spacing with a faded **`--theme-alpha-black-switch-10`**
fill (not `--primary` / warm taupe, and not `--muted`, which equals
`--secondary` in dark).

## Composition

```text
Bubble                    from="user" | "other"
                          variant="default" | "destructive"
├── BubbleContent         message text (optional `render` for button/link)
├── BubbleFooter          optional bottom slot (badge / chip)
└── BubbleReactions       optional edge-anchored reactions

BubbleGroup
├── Bubble …
└── Bubble …
```

## Token map

| Role | Foundations |
| --- | --- |
| Fill / text (other) | `--theme-alpha-black-switch-10` / `--foreground` |
| Fill / text (user) | `--secondary` / `--text` |
| Fill / text (destructive) | `--destructive` @ 10% (20% dark) / `--destructive` |
| Padding | `--spacing-md` (12) |
| Content ↔ footer gap | `--spacing-xs` (8) |
| Radius | `--rounded-xl` (20) on three corners; near-speaker corner `0` |
| User (end) | sharp **bottom-right** |
| Other (start) | sharp **bottom-left** |
| Reactions fill | `--muted` |
| Reactions ring | width `--stroke-medium`; color `--card` (light) / `--border` (dark) |

Long copy can compose our Collapsible primitive for show more / show less
(shadcn Bubble docs pattern). Trigger with
[`ButtonLink`](../button/link-button/README.md)
(`variant="primary"`, `size="default"` — Figma Link Button Small → `default`).

## Footer slot

Figma places a custom workflow chip under the message text. That chip is
not a Badge yet — pass any node through `BubbleFooter` until the atom
exists. Presence-based: omit the slot when unused.

## Reactions (dark mode)

Vendor used `ring-card`. In dark theme `--card`, `--muted`, and
`--background` collapse to the same near-black, so the ring vanished.
We keep a `--stroke-medium` ring: `--card` in light, `--border` in dark.

## API

| Prop / part | Notes |
| --- | --- |
| `Bubble` `from` | `"user"` (end, secondary) \| `"other"` (start, black-switch 10%); default `"other"` |
| `Bubble` `variant` | `"default"` \| `"destructive"`; default `"default"` |
| `BubbleContent` `render` | Polymorphic content (`<button />`, `<a />`, …) |
| `BubbleReactions` `side` / `align` | `"top" \| "bottom"` / `"start" \| "end"` |
| `BubbleGroup` | Consecutive same-speaker stack; set `from` on each Bubble |

No `align` prop — use `from`.
