# Breadcrumb

The Fabely Breadcrumb primitive — wraps the upstream shadcn Breadcrumb
(`src/components/ui/breadcrumb.tsx`) with Foundations-sourced styling.

## Purpose

`Breadcrumb` and its composition parts are the public API future Fabely
components should depend on. Import from this primitive rather than
`src/components/ui/breadcrumb`.

## No Figma source — shadcn documentation used instead

**No Figma design exists for Breadcrumb.** Per `docs/DESIGN.md` and the
Accordion precedent, this milestone is a thin faithful *restyle* only:
vendor Tailwind defaults are swapped for Foundations tokens where one
already exists. One library-over-vendor exception: `BreadcrumbEllipsis`
(see Composition).

shadcn’s Breadcrumb docs (composition, prop names, canonical examples) are
the API/behavior source of truth until a Figma set is authored.

## Composition

```text
Breadcrumb
└── BreadcrumbList
    ├── BreadcrumbItem
    │   └── BreadcrumbLink | BreadcrumbPage | BreadcrumbEllipsis
    ├── BreadcrumbSeparator
    └── …
```

`BreadcrumbEllipsis` is **our Icon Button** (`ghost` / `mini`), not the
vendor’s presentational `<span>`. Vendor ships a non-interactive span;
in practice the ellipsis opens a dropdown, so a button is the correct
element. Library over vendor — same rationale as Button’s pressed state.
Composable as `DropdownMenuTrigger` via
`render={<BreadcrumbEllipsis aria-label="…" />}`. `aria-label` is required.
Collapsed overflow uses the **Dropdown Menu primitive**
(`../dropdown-menu`) — Foundations card surface and ListItem rows — not
`src/components/ui/dropdown-menu`.

## Token substitutions

| Vendor | Foundations | Notes |
| --- | --- | --- |
| `gap-1.5` (List, Item) | `--spacing-1-5` (6px) | Exact |
| `sm:gap-2.5` (List) | `--spacing-2-5` (10px) | Exact; `sm:` breakpoint kept |
| `text-sm` (List) | Paragraph Small Regular | Exact 14/20 |
| `text-muted-foreground` (List) | `--muted-foreground` | Restated |
| `hover:text-foreground` (Link) | `--foreground` | Restated |
| `font-normal` (Page) | `--font-weight-paragraph-regular` | Exact 400 |
| `text-foreground` (Page) | `--foreground` | Restated |
| `[&>svg]:size-3.5` (Separator) | `--icon-xs` (12px) | See below |
| Ellipsis box `size-5` (20px) | Icon Button `mini` (24×24) | No exact slot; nearest published hit target |
| Ellipsis icon `size-4` (16px) | `--icon-xs` via `mini` | Icon Button size ladder |

### Separator icon — 12px (`--icon-xs`)

Vendor default is `size-3.5` (14px). There is no `--icon-*` at 14px
(`--icon-xs` = 12, `--icon-sm` = 16). We use **`--icon-xs` (12px)**: a
separator is subordinate to the labels it divides, so 12px recedes;
16px would match a larger control glyph and compete with the 14px label
text. **2px smaller than the Figma-less vendor default** — intentional.

### Ellipsis — Icon Button `mini`

Vendor ellipsis is a 20×20 presentational span. There is no Icon Button
size slot at 20px; **`mini` (24×24)** is the nearest published hit target.
`ghost` keeps it quiet in the trail; glyph follows the mini ladder
(`--icon-xs`).

## Left on vendor defaults

| Value | Why |
| --- | --- |
| `transition-colors` on Link | No motion/duration tokens yet |
| `flex` / `flex-wrap` / `items-center` / `wrap-break-word` / `inline-flex` | Layout primitives, not Foundations scales |
| `sm:` breakpoint on List gap | Responsive layout, not a token |
| Chevron glyph (Lucide) on Separator | Vendor default; custom separator via `children` |
| Root `<nav>` (no classes) | Nothing to restyle |

## API

Matches the vendor / shadcn docs for List / Item / Link / Page / Separator.
`BreadcrumbEllipsis` additionally requires `aria-label` (Icon Button) and
forwards Icon Button props (including `render` for `DropdownMenuTrigger`).
No other Fabely-specific props.
