# Chapter Menu Header

Book chrome at the top of Chapter Menu — logo, author, title, plan /
upgrade, outline Cycle Switch, and cover.

## Placement

NO — manuscript menu chrome tied to Chapter Nav. Stays in
`src/features/chapter-nav/chapter-menu-header/`.

## Overlap

| Piece | Approach |
| --- | --- |
| Cycle Switch | **CycleSwitch** atom — compose |
| Author | **AvatarWithLabel** — Main: `sm` + `avatarSize="small"` + flush role; Alt: `sm`. Default **static** (`authorHref={false}`) — no link / hover |
| Divider | **Separator** vertical thin — Main only (logo ↔ author); Alt has no divider |
| Upgrade | **Link Button** (`buttonLinkVariants` `fia` `lg` on `<a>`) + Foundations **FiaSilcrow** → default `upgradeHref="/pricing"` |
| Logo | Open slot; wrapped in home link — default `homeHref="/"` (`false` to skip) |
| Title | **Textarea** `quiet` + `heading` + `resizable={false}` — full-width wrap, Heading 2 |
| Cover | **BookCover** atom `size="sm"` — edit opens OS image picker (`onCoverImageSelect`); `coverEditHref` to navigate instead; `cover` slot overrides |

## Variants (alternatives)

Both Figma explorations are landed as `variant="main" | "alt"` for
comparison. Designate the product winner later; do not average them.

| Variant | Figma | Layout |
| --- | --- | --- |
| Main | [16373:11236](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=16373-11236) | Wordmark + author top; plan + Cycle Switch bottom |
| Alt | [16373:11235](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=16373-11235) | Mark + plan top; author + Cycle Switch bottom |

## Notes

- Cover shadow uses Foundations `--shadow-md-black` (Figma’s 0 4 12 / 40%
  black is not a Foundations token).
- Upgrade uses Foundations `FiaSilcrow` (`currentColor`, `--icon-sm`).
- Link placeholders: logo → `/` (home), Upgrade → `/pricing`. Override via
  `homeHref` / `upgradeHref`.
- **Author / Avatar with Label (open):** This header uses a **static** author
  row (no `href`, so no hover fill). Product may later want a profile link,
  a link without hover, or stay static — decide before shipping. Pass
  `authorHref="/author"` (or similar) to opt into the molecule’s interactive
  mode; if we need “link but no hover,” that belongs as an Avatar with Label
  prop, not a feature fork.

## Spacing parity

| Region | Token | px |
| --- | --- | --- |
| Cover inset (left of cover) | `--spacing-xl` | 24 |
| Root min width | `494px` (Figma frame) | 494 |
| Left column stack | `--spacing-sm` | 12 |
| Title optical nudge | `--tw-raw-spacing-0-5` (`-mt`) | 2 — font-metrics exception, not a gap token; Heading 2 Sharp Serif 32px ascent / 10px descent vs 34px line-height measured ~21px above vs ~19px below |
| Main top / bottom rows | `--spacing-md` | 16 |
| Alt top (logo → plan) | `--spacing-md` | 16 |
| Cover | Book Cover atom `sm` (`--tw-raw-spacing-40` / 160 tall, aspect `1023/1537`) | ~107×160 |
| Title | Quiet Heading Textarea, wraps; min 1× Heading 2, grows with lines | — |

Root gap matches Figma `--xl` (24) between the left chrome and the cover.
