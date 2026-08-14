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

The whole card is one hoverable surface (root background shifts on hover,
not just the footer chip) — `href` renders a stretched link over the card
rather than making only the chip interactive. The footer's Figma layer name
("Select & Combobox") is borrowed visual styling, not a functional
select/combobox; it renders as static content.

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
| `href` | Stretched link over the whole card. |
| `forceHover` | Storybook / demo — locks the hover paint without a pointer. |
