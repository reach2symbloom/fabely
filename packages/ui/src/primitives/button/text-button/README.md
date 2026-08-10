# Text Button

Labeled control in the Button family — Figma-authored variant, size, and
roundness surface on Base UI's Button, sourced from Foundations.

Exported as **`Button`** (component name unchanged). Folder is `text-button/`
to sit beside `icon-button/`.

## Purpose

`Button` and `buttonVariants` are the public API for labeled actions. Import
from `@/primitives/button` (family barrel) or `@/primitives/button/text-button`.
Prefer these over `src/components/ui/button`.

For icon-only actions use [Icon Button](../icon-button/). Family overview:
[Button](../README.md).

## Figma source

Visual source of truth: Figma component set **Button** in
[Fabely Design System](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=842-44442)
(`fileKey` `gV94L0qCmvwQkddNbEktry`, page `Button`, set `9:1071`).

## Figma → API mapping

| Figma axis | Values | Primitive API |
| --- | --- | --- |
| Variant | Primary · Primary outline · Secondary · Tertiary · Ghost · Destructive · Fia filled · Fia Outline | `variant`: `primary` \| `primaryOutline` \| `secondary` \| `tertiary` \| `ghost` \| `destructive` \| `fiaFilled` \| `fiaOutline` |
| Size | Extra Small · Small · Default · Large · Extra Large | `size`: `mini` \| `small` \| `default` \| `large` \| `extraLarge` |
| Roundness | Default · Round | `roundness`: `default` \| `round` |
| State | Default · Hover & Active · Focus · Disabled | CSS `:hover` / `:active` / `:focus-visible` / `[disabled]` — not props |
| Icons | Show left / right (boolean + instance swap) | children + `data-icon="inline-start" \| "inline-end"` |

Shared eight-variant styles live in [`../shared.ts`](../shared.ts)
(`buttonVariantClasses`) — same source Icon Button spreads.

### Variant tokens (summary)

| `variant` | Fill | Border | Text | Focus ring |
| --- | --- | --- | --- | --- |
| `primary` | `--gradient-primary-top-bottom` | — | `--primary-foreground` | Always-on `--effect-focus-ring-primary-rest`; full `--effect-focus-ring-primary` on `:focus-visible` |
| `primaryOutline` | transparent (see deviations) | gradient poles (border-box via mask) | `--foreground` | `--effect-focus-ring-secondary` |
| `secondary` | transparent | `--tw-raw-secondary-200` | `--foreground` | secondary |
| `tertiary` | transparent | `--theme-alpha-black-switch-10` | `--muted-foreground` → `--secondary-foreground` on hover/pressed | secondary |
| `ghost` | `--theme-alpha-white-switch-001` | none | `--muted-foreground` → `--foreground` on hover/pressed | secondary |
| `destructive` | `--tw-raw-error-ghost` @ 12% (`color-mix`) | — | `--tw-raw-error-600` | `--effect-focus-ring-error` |
| `fiaFilled` | `--tw-raw-fia-200` | — | `--tw-raw-fia-950` | secondary |
| `fiaOutline` | transparent | `--tw-raw-fia-200` | `--foreground` | secondary |

### Interaction model (library-authored)

Figma had no pressed state and inconsistent outline hovers — this model is defined in code (library wins; see `docs/DESIGN.md`).

| Group | Hover | Pressed (`:active` / `data-pressed`) |
| --- | --- | --- |
| Filled — Primary | `--opacity-hover-soft` (0.9) | `--opacity-hover` (0.8) |
| Filled — Destructive, Fia filled | `--opacity-hover` (0.8) | `--opacity-pressed` (0.7) |
| Outline/quiet — Primary outline, Secondary, Tertiary, Ghost, Fia Outline | `--theme-alpha-black-switch-5` fill | `--theme-alpha-black-switch-10` fill |

Border width is constant in every state (no 2px→3px hover thickening). Disabled → layer opacity 0.5.

### Size tokens

| `size` | Height | Padding (y / x) | Gap | Type | Icon |
| --- | --- | --- | --- | --- | --- |
| `mini` | `--spacing-xl` (24) | `--spacing-2xs` / `--spacing-xs` | `--spacing-1-5` | paragraph mini/medium | `--icon-xs` |
| `small` | `--spacing-2xl` (32) | `--spacing-1-5` / `--spacing-2-5` | `--spacing-1-5` | paragraph small/medium | `--icon-sm` |
| `default` | `--spacing-3xl` (40) | `--spacing-xs` / `--spacing-2-5` | `--spacing-xs` | paragraph small/medium | `--icon-sm` |
| `large` | `--spacing-11` (44) | `--spacing-2-5` | `--spacing-xs` | paragraph/medium | `--icon-sm` |
| `extraLarge` | `--spacing-13` (52) | `--spacing-sm` / `--spacing-xl` | `--spacing-xs` | paragraph/medium | `--icon-sm` |

Size slot names are shared vocabulary with Icon Button (`mini` / `default`); **values differ** — see `docs/DESIGN.md` “Size slots”.

**Radius:** Roundrect is `--rounded-lg` (12px) for every size — flat, not size-proportional. Round is `--rounded-full`.

### Foundations promotions

| Token | Value | Why |
| --- | --- | --- |
| `--spacing-9` | `var(--tw-raw-spacing-9)` → 36px | Icon Button default box (also available here) |
| `--spacing-11` | `var(--tw-raw-spacing-11)` → 44px | Button Large height (Figma spacing `11`) |
| `--spacing-13` | `var(--tw-raw-spacing-13)` → 52px | Button Extra Large height (Figma spacing `13`) |
| `--opacity-hover-soft` | `0.9` | Primary hover |
| `--opacity-hover` | `0.8` | Primary pressed; Destructive + Fia filled hover |
| `--opacity-pressed` | `0.7` | Destructive + Fia filled pressed |
| `--opacity-focus-ring-rest` | `40%` | Primary always-on ring strength at rest |
| `--effect-focus-ring-primary-rest` | 3px ring via `color-mix` + rest opacity | Always-on Primary treatment |

## Decisions / deviations

1. Tertiary/Ghost default muted text → `--muted-foreground` (not a 0.75 alpha literal on a separate “text default” token).
2. Outline/quiet hover/pressed fills use `--theme-alpha-black-switch-5` / `-10` across all five quiet variants (extends the old Tertiary/Ghost hover pattern).
3. Large/XL heights use published `--spacing-11` / `--spacing-13` (not raw).
4. Primary focus ring is always-on at rest opacity; `:focus-visible` uses full primary ring.
5. Border width stays constant — no hover/focus stroke thickening (border-box was eating padding).
6. Dropped shadcn `link` variant and all `icon*` sizes — Icon Button / Button Link are separate primitives. Figma “Extra Small” maps to API `mini`.
7. Heights consume spacing tokens because Figma binds button height to the spacing scale (same precedent as Avatar).
8. **Primary outline gradient border:** Figma fill is `--theme-alpha-white-switch-0` (transparent). An opaque padding-box background layer would pin the center to `--background` and fail on non-default surfaces. Instead we use mask-composite on `::before`: `background: var(--gradient-primary-top-bottom) border-box` + `mask: linear-gradient(#000 0 0) padding-box exclude, linear-gradient(#000 0 0)` (`-webkit-mask-composite: xor` on WebKit). That punches out the padding-box so only the border ring remains, with a genuinely transparent face. The ring is on `::before` (negative-inset to the border-box) so the mask does not hide label text. Focus fills `--background` on the button; the ring remains.
9. **Interaction model** (hover/pressed) is library-authored — Figma lacked pressed and had inconsistent outline hovers.

## As link

**Do not use `<Button render={<a />} />` for links.** Base UI's Button always applies `role="button"`. Use `buttonVariants` with a plain `<a>`:

```tsx
<a className={buttonVariants({ variant: 'primaryOutline' })} href="…">
  Link
</a>
```

Button Link (Figma) will be a dedicated primitive later for link-specific typography/spacing.
