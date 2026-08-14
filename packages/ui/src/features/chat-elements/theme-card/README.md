# Theme Card

Chat/assistant chrome — one manuscript theme (e.g. "the grove's rules,
memory, and agency") with a footer chip linking out to its notes.

## Placement

NO — chat/assistant-specific chrome. Stays in
`src/features/chat-elements/theme-card/`.

## Overlap

Searched primitives / atoms / molecules / organisms:

| Candidate | Verdict |
| --- | --- |
| **Card** primitive | Skip — Card is `rounded-xl` with header/content/footer slots and `--card-spacing`; this design is `rounded-lg`, single padded shell, and a bespoke footer chip. Composing it would fight more than it'd reuse. |
| Lucide `ArrowRightIcon` | Compose — footer chip's forward affordance (Figma "Icon / arrow-right": forward, next, direction, east). |

## Authoritative Figma

[Theme card](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=16338-2655)
set (`16338:2655`). Axis: Hover False / True.

Figma's Hover axis pairs the card and chip fills as a single flag, but that
collapses two different affordances into one on/off: the card background
tint (`--primary-hover`) is a passive "you're over this row" read, while the
chip fill (`--theme-alpha-black-switch-333` → `-5`) is the actual click
target's own feedback. In code these are independent — the chip owns its
own `:hover` / `:focus-visible`, scoped to its own box, not derived from
hovering the card body. `href` renders the chip itself as an `<a>` (not a
stretched link over the whole card); the card's hover tint still fires
whenever the pointer is anywhere over the card, including over the chip,
since the chip is nested inside it. The footer's Figma layer name ("Select
& Combobox") is borrowed visual styling, not a functional select/combobox.

## Colors (Foundations)

| Role | Figma | Token |
| --- | --- | --- |
| Title | alpha/black/switch/alpha-75 | `--theme-alpha-black-switch-75` |
| Description | shadcn text default color | `--text` |
| Card border | shadcn border | `--border` |
| Card hover fill | shadcn primary hover | `--primary-hover` |
| Chip border | alpha/black/switch/alpha-10 | `--theme-alpha-black-switch-10` |
| Chip fill (rest) | alpha/black/switch/alpha-333 | `--theme-alpha-black-switch-333` |
| Chip fill (hover) | alpha/black/switch/alpha-5 | `--theme-alpha-black-switch-5` |
| Chip label | shadcn text default color | `--text` |
| Note count + arrow | shadcn muted foreground | `--muted-foreground` |
| Chip focus ring | — (not in this Figma set) | `--effect-focus-ring-secondary` |

## Spacing (Foundations)

| Region | Token | px |
| --- | --- | --- |
| Card padding / content gap | `--spacing-md` | 16 |
| Title / description gap | `--spacing-xs` | 8 |
| Chip padding | `--spacing-sm` | 12 |
| Note count / arrow gap | `--spacing-xs` | 8 |
| Card radius / chip radius | `--rounded-lg` | 12 |

## Typography (Foundations)

| Role | Style |
| --- | --- |
| Title | Paragraph Large / Regular (18px) |
| Description | Paragraph Regular / Regular (16px) |
| Chip label | Paragraph Regular / Medium (16px) |
| Note count | Paragraph Small / Regular (14px) |

## API

| Prop | Notes |
| --- | --- |
| `index` | Numbered prefix ("1. …"). Omit to hide. |
| `title` / `description` | Required copy. |
| `chipLabel` | Footer chip label — required. |
| `noteCount` | Trailing count + arrow; omitted hides both. |
| `href` | Renders the footer chip as its own link (`<a>`), with its own hover / focus ring — not a stretched link over the whole card. |
| `forceHover` | Storybook / demo — locks the hover paint (card + chip) without a pointer. |
