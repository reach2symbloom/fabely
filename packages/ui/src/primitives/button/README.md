# Button

The Fabely Button primitive — Figma-authored variant, size, and roundness surface on Base UI's Button, sourced from Foundations.

## Purpose

`Button` and `buttonVariants` are the public API future Fabely components should depend on. Import from this primitive rather than `src/components/ui/button`.

## Figma source

Visual source of truth: Figma component set **Button** in [Fabely Design System](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=842-44442) (`fileKey` `gV94L0qCmvwQkddNbEktry`, page `Button`, set `9:1071`).

**Not this component:** Icon Button and Button Link / Link Button are separate Figma sets and will be their own primitives.

## Figma → API mapping

| Figma axis | Values | Primitive API |
| --- | --- | --- |
| Variant | Primary · Primary outline · Secondary · Tertiary · Ghost · Destructive · Fia filled · Fia Outline | `variant`: `primary` \| `primaryOutline` \| `secondary` \| `tertiary` \| `ghost` \| `destructive` \| `fiaFilled` \| `fiaOutline` |
| Size | Extra Small · Small · Default · Large · Extra Large | `size`: `extraSmall` \| `small` \| `default` \| `large` \| `extraLarge` |
| Roundness | Default · Round | `roundness`: `default` \| `round` |
| State | Default · Hover & Active · Focus · Disabled | CSS `:hover` / `:active` / `:focus-visible` / `[disabled]` — not props |
| Icons | Show left / right (boolean + instance swap) | children + `data-icon="inline-start" \| "inline-end"` |

### Variant tokens (summary)

| `variant` | Fill | Border | Text | Focus ring |
| --- | --- | --- | --- | --- |
| `primary` | `--gradient-primary-top-bottom` | — | `--primary-foreground` | Always-on `--effect-focus-ring-primary-rest`; full `--effect-focus-ring-primary` on `:focus-visible` |
| `primaryOutline` | transparent (see deviations) | gradient poles (border-box via mask) | `--foreground` | `--effect-focus-ring-secondary` |
| `secondary` | transparent | `--tw-raw-secondary-200` | `--foreground` | secondary |
| `tertiary` | transparent / hover `--theme-alpha-black-switch-5` | `--theme-alpha-black-switch-10` | `--muted-foreground` → `--secondary-foreground` on hover | secondary |
| `ghost` | `--theme-alpha-white-switch-001` / hover `--theme-alpha-black-switch-5` | none | `--muted-foreground` → `--foreground` on hover | secondary |
| `destructive` | `--tw-raw-error-ghost` @ 12% (`color-mix`) | — | `--tw-raw-error-600` | `--effect-focus-ring-error` |
| `fiaFilled` | `--tw-raw-fia-200` | — | `--tw-raw-fia-950` | secondary |
| `fiaOutline` | transparent | `--tw-raw-fia-200` | `--foreground` | secondary |

Hover opacity: Primary → `--opacity-hover-soft` (0.9); Destructive + Fia → `--opacity-hover` (0.8). Disabled → layer opacity 0.5.

### Size tokens

| `size` | Height | Padding (y / x) | Gap | Type | Icon |
| --- | --- | --- | --- | --- | --- |
| `extraSmall` | `--spacing-xl` (24) | `--spacing-2xs` / `--spacing-xs` | `--spacing-1-5` | paragraph mini/medium | `--icon-xs` |
| `small` | `--spacing-2xl` (32) | `--spacing-1-5` / `--spacing-2-5` | `--spacing-1-5` | paragraph small/medium | `--icon-sm` |
| `default` | `--spacing-3xl` (40) | `--spacing-xs` / `--spacing-2-5` | `--spacing-xs` | paragraph small/medium | `--icon-sm` |
| `large` | `--spacing-11` (44) | `--spacing-2-5` | `--spacing-xs` | paragraph/medium | `--icon-sm` |
| `extraLarge` | `--spacing-13` (52) | `--spacing-sm` / `--spacing-xl` | `--spacing-xs` | paragraph/medium | `--icon-sm` |

**Radius:** Roundrect is `--rounded-lg` (12px) for every size — flat, not size-proportional. Round is `--rounded-full`.

### Foundations promotions (this milestone)

| Token | Value | Why |
| --- | --- | --- |
| `--spacing-11` | `var(--tw-raw-spacing-11)` → 44px | Button Large height (Figma spacing `11`) |
| `--spacing-13` | `var(--tw-raw-spacing-13)` → 52px | Button Extra Large height (Figma spacing `13`) |
| `--opacity-hover-soft` | `0.9` | Primary hover / active |
| `--opacity-hover` | `0.8` | Destructive + Fia hover (second use) |
| `--opacity-focus-ring-rest` | `40%` | Primary always-on ring strength at rest |
| `--effect-focus-ring-primary-rest` | 3px ring via `color-mix` + rest opacity | Always-on Primary treatment |

## Decisions / deviations

1. Tertiary/Ghost default muted text → `--muted-foreground` (not a 0.75 alpha literal on a separate “text default” token).
2. Ghost hover fill → `--theme-alpha-black-switch-5` (aligned with Tertiary).
3. Large/XL heights use published `--spacing-11` / `--spacing-13` (not raw).
4. Primary focus ring is always-on at rest opacity; `:focus-visible` uses full primary ring.
5. Fia hover → `--opacity-hover` (0.8), matching updated Figma.
6. Dropped shadcn `link` variant and all `icon*` sizes — separate Figma components.
7. Heights consume spacing tokens because Figma binds button height to the spacing scale (same precedent as Avatar).
8. **Primary outline gradient border:** Figma fill is `--theme-alpha-white-switch-0` (transparent). An opaque padding-box background layer would pin the center to `--background` and fail on non-default surfaces. Instead we use mask-composite on `::before`: `background: var(--gradient-primary-top-bottom) border-box` + `mask: linear-gradient(#000 0 0) padding-box exclude, linear-gradient(#000 0 0)` (`-webkit-mask-composite: xor` on WebKit). That punches out the padding-box so only the border ring remains, with a genuinely transparent face. The ring is on `::before` (negative-inset to the border-box) so the mask does not hide label text. Focus fills `--background` on the button; the ring remains.

## As link

**Do not use `<Button render={<a />} />` for links.** Base UI's Button always applies `role="button"`. Use `buttonVariants` with a plain `<a>`:

```tsx
<a className={buttonVariants({ variant: 'primaryOutline' })} href="…">
  Link
</a>
```

Button Link (Figma) will be a dedicated primitive later for link-specific typography/spacing.
