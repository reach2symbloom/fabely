# Badge

The Fabely Badge atom — wraps the upstream shadcn Badge primitive (`src/components/ui/badge.tsx`) with Fabely's Figma-authored size, roundness, and color variants, sourced from Foundations.

## Purpose

`Badge` (and the exported `badgeVariants` helper) establish the public API future Fabely components should depend on. Importing from this atom rather than the vendor path directly means any future Fabely-specific behavior can be layered in here without call sites needing to change their import.

## Figma source

Visual source of truth: Figma component set **Badge** in [Fabely Design System](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=19-6979) (`fileKey` `gV94L0qCmvwQkddNbEktry`, node `19:6979`).

Figma axes reverse-engineered into this atom:

| Figma axis | Values | Atom API |
| --- | --- | --- |
| Size | Default · Large | `size`: `"default"` \| `"large"` |
| Roundness | Default · Round | `roundness`: `"default"` \| `"round"` |
| Variant | Primary · Secondary · Outline · Tertiary · Destructive · Success · Alert | see mapping below |
| State | Default · Focus | `:focus-visible` + Foundation focus-ring effects (not a prop) |
| Icons | Left / Right (boolean in Figma) | children + `data-icon="inline-start" \| "inline-end"` |

All Figma badges use **soft tinted fills** (ghost / alpha backgrounds + colored text), not the vendor's solid `bg-primary` chip. Matching Figma faithfully meant restyling the vendor defaults rather than keeping them.

## Wraps upstream

This atom does not modify the upstream primitive's file — `src/components/ui/badge.tsx` stays vendor code. `Badge` overrides the vendor's default classes (radius, padding, typography, colors, focus ring, height) via `className`, and extends the variant surface for Figma-only statuses.

**Polymorphism:** vendor uses Radix `Slot` via `asChild` — **not** a `render` prop. The shadcn docs page for newer Base UI variants mentions `render`; this package's CLI output is the Radix/`asChild` path, so that is the API ground truth.

**Vendor variants preserved / mapped:**

| Atom `variant` | Figma | Notes |
| --- | --- | --- |
| `default` | Primary | Soft `--theme-alpha-black-switch-333` fill + `--neutrals-new-500` text |
| `secondary` | Secondary | `--tw-raw-secondary-ghost` + `--tw-raw-secondary-200` |
| `outline` | Outline | Transparent fill, `--theme-alpha-black-switch-5` border, `--foreground` text |
| `ghost` | Tertiary | Same soft fill as Primary, `--foreground` text |
| `destructive` | Destructive | `--tw-raw-error-ghost` at 12% (`color-mix`) fill + `--tw-raw-error-300` text/icon — vendor solid `bg-destructive` stubbed away |
| `success` | Success | Figma-only — no vendor equivalent |
| `alert` | Alert | Figma-only — no vendor equivalent |
| `link` | *(none)* | Kept for shadcn Link docs composition (`asChild` + `<a>`) |

Soft-fill variants that would otherwise inherit a solid vendor chip (`destructive`, plus Fabely-only `success` / `alert`) call the vendor primitive with a stub vendor variant (`default`) so the upstream component remains mounted without its `bg-destructive` / `dark:bg-destructive/60` classes; the visible styles and `data-variant` come entirely from this atom.

## Implemented (this milestone)

- **Size** — `default` (Paragraph Mini Medium, 12/16) · `large` (Paragraph Small Medium, 14/20). Typography from `foundations/typography.css`.
- **Roundness** — `default` (`--rounded-sm`) · `round` (`--rounded-full`). From `foundations/radius.css`.
- **Heights** (Figma size × roundness compounds) — Default/Default `18px`, Default/Round `24px` (`--spacing-xl`), Large/Default `22px`, Large/Round `28px` (`--tw-raw-spacing-7`). `18px` / `22px` have no Foundation spacing token — kept as literals with `// TODO:` in `badge.tsx`.
- **Spacing** — horizontal padding `--spacing-1-5` (6px), vertical `--spacing-3xs` (2px), gap `--spacing-2xs` (4px).
- **Focus rings** — variant-specific Foundation effects: Primary → `--effect-focus-ring-primary`; Secondary/Outline/Ghost → `--effect-focus-ring-secondary`; Destructive → `--effect-focus-ring-error`; Success → `--effect-focus-ring-success`; Alert → `--effect-focus-ring-alert`.
- **Icons** — SVG children sized to `--tw-raw-spacing-3` (12px) at Default size; Large uses `14px` (see TODO in `badge.tsx` — Figma Large+icon frames weren't explicitly sized in the design-context payload). `data-icon` flips flex direction for start/end placement.
- **`asChild`** — passed through to the vendor Slot for link/button composition.
- **`badgeVariants`** — exported CVA helper for call sites that need the same class map (e.g. custom compositions).

Colors audited against `foundations/colors.css` before use. Soft fills for secondary / destructive / success / alert consume the raw `*-ghost` swatches via `color-mix(... 12%/8%, transparent)` — those tokens are solid hex in Foundations with a comment that Figma applies them at reduced opacity; using them as opaque fills would make Secondary/Success text invisible (text swatch equals the ghost hex). Same "Foundations may be consumed directly during exploration" posture Avatar documented for status colors — there is no promoted semantic `--success` / `--warning` fill token yet.

## Future enhancements

Not yet implemented — deliberately deferred until a recurring pattern justifies them (per `docs/DESIGN.md`'s "begin with faithful implementation" principle):

- A dedicated Spinner atom (With Spinner Storybook example uses Lucide `Loader2Icon` + `animate-spin` for now)
- Promoting `--success` / `--warning` (or badge-specific semantic fills) once a second real usage justifies them
- Confirmed Large-size icon dimensions from a Figma export that includes icon frames
- Published spacing tokens for the 18px / 22px badge heights
- Dismissible / removable badge (close affordance) — not in the Figma set
