# Attachment

The Fabely Attachment primitive — wraps the upstream shadcn Attachment (`src/components/ui/attachment.tsx`) with Foundations-sourced color, radius, focus-ring, spacing, and icon-size substitutions.

## Purpose

Import Attachment parts from this primitive rather than the vendor path. Future Fabely / Figma restyling lands here without call-site import changes.

## No Figma source — shadcn documentation used instead

**No Figma design exists yet for Attachment.** Per `docs/DESIGN.md` (“match Figma faithfully first…”), the API ground truth for composition and upload props is the shadcn Attachment docs. Fabely renames the trailing actions slot to **RightIcon** (below). No other Fabely-only props or variants.

## Wraps upstream

Vendor file is untouched. Parts override vendor classes via `className`. `AttachmentRightIcon` composes **our IconButton** (`ghost`). `AttachmentTrigger` and `AttachmentGroup` re-export the vendor parts.

### API

| Part | Notable props |
| --- | --- |
| `Attachment` | `state`: `idle` \| `uploading` \| `processing` \| `error` \| `done` (default `done`); `size`: `default` \| `sm` \| `xs`; `orientation`: `horizontal` \| `vertical` |
| `AttachmentMedia` | `variant`: `icon` \| `image` |
| `AttachmentRightIcon` | our **IconButton**; defaults `variant="ghost"`, `size="mini"`, `roundness="round"` (shadcn name: `AttachmentAction`, default size `icon-xs`) |
| `AttachmentRightIcons` | group for one or more right icons (shadcn name: `AttachmentActions`) |
| `AttachmentTrigger` | `render` for link/dialog composition |
| `AttachmentGroup` | scrollable snapping row |

## Composition

```text
Attachment
├── AttachmentMedia
├── AttachmentContent
│   ├── AttachmentTitle
│   └── AttachmentDescription
├── AttachmentRightIcons
│   └── AttachmentRightIcon
└── AttachmentTrigger

AttachmentGroup
├── Attachment
└── Attachment
```

## Token substitutions

| Concern | Foundations |
| --- | --- |
| Container radius default/sm | `--radius` (16px) |
| Container radius xs | `--rounded-md` (8px) |
| Border | `--border` + `--stroke-thin` |
| Surface | `--card` / `--card-foreground` |
| Focus | `--effect-focus-ring-secondary` |
| Icon media soft fill (non-error) | `--theme-alpha-black-switch-333` (light: black @ 3.33%; dark: white @ 3.33% — steps away from card; not `--muted`, which collides with `--card` at `#27272A` in dark) |
| Icon media soft fill (error) | `--destructive` @ 10% via `color-mix` |
| Icon media radius | Scales **independently** of the container (nested surface, not a proportional inset): default `--rounded-lg` (12px); sm `--rounded-md` (8px); xs `--rounded-sm` (5px — closest published step to 4px; Foundations has no 4px radius) |
| Icon glyph sizes | `--icon-sm` / `--icon-lg` |
| Description | `--muted-foreground` |
| Content trailing padding | default `--spacing-2-5` (10px); sm `--spacing-xs` (8px); xs `--spacing-1-5` (6px) |
| Right-icon group gap | `--spacing-3xs` (2px) |
| Right-icon button | our IconButton ghost; circular hover via `roundness="round"` → `--rounded-full` |

## Left on vendor defaults

| Value | Reason |
| --- | --- |
| Image-variant opacity ladder | Vendor upload/idle/done opacity behavior |
| Media icon `size-3.5` (14px) on xs | Between `--icon-xs` (12) and `--icon-sm` (16) |
| Root spacing / type utilities | Per `docs/DESIGN.md` — not globally aliased |
| Shimmer / `scroll-fade-x` | Vendor animation utilities |
| Error description `text-destructive/80` | Opacity step; color still `--destructive` |
