# API Connection

Connected-service row — brand logo, name, connected status, unlink
action, note count, and a "Select files" action.

## Placement

NO — Library product chrome. Stays in
`src/features/library/api-connections/`.

## Overlap

Searched primitives / atoms / molecules / organisms / features:

| Candidate | Verdict |
| --- | --- |
| **Icon Button `fade`** | Compose — the unlink control. Figma's 16×16 "Fade button" is smaller than Icon Button's smallest `mini` slot (28px), so the call site overrides `size-*`/padding directly (same approach as Resume Writing Button's go-control override), forcing the same `--icon-xs` glyph the `mini` slot already targets. |
| **Button `ghost`** | Compose — "Select files". Figma's own node is literally the shared `Button` component (`9:1071`), `mini` size already matches its 24px height / mini-paragraph text / `--icon-xs` glyph almost exactly. |
| **Book Cover** | Skip — different job (portrait manuscript cover with an edit scrim, not a small square brand logo). |
| **Foundations Brand Logos** | Compose — `BRAND_LOGOS` from `@/foundations/images/brand-logos`, not a locally-bundled PNG (see [foundations/images/brand-logos/README.md](../../../foundations/images/brand-logos/README.md)). |
| **Status atom** | Compose — `@/atoms/status`, extracted from this component's own inline dot+label once Figma's "Status" sub-component made the reuse boundary explicit. |
| **Brand Link atom** | Compose — `@/atoms/brand-link`, same story as Status; this component resolves the brand → logo/label mapping and passes it in. |

## Authoritative Figma

[API Connections](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=16456-17857)
set (`16456:17857`). Axis: Hover — False / True.

The set's own `Brand logos` sub-component models the full catalog now
in `@/foundations/images/brand-logos` (13 marks) — every one is a
`brand` option here except `openai-light`/`openai-dark`, which collapse
into one `openai` value (always the white `openai-dark` mark, since
Library rows sit on a dark surface). Add a new
`DEFAULTS_BY_BRAND` entry (plus its Foundations logo) when a new brand
lands in the catalog.

## Colors (Foundations)

| Role | Figma | Token |
| --- | --- | --- |
| Row rest border | alpha/black/switch/alpha-10 | `--theme-alpha-black-switch-10` |
| Row hover fill | alpha/black/switch/alpha-333 | `--theme-alpha-black-switch-333` |
| Brand label | text-default-color 75% | `--foreground` (via `@/atoms/brand-link`) |
| Status dot / label | (Figma raw green) / muted-foreground | `--tw-raw-success-500` / `--theme-alpha-black-switch-60` (via `@/atoms/status`) |
| Unlink icon | Icon Button `fade` | inherits `fade`'s ink/opacity treatment |
| Note count | muted-foreground | `--theme-alpha-black-switch-60` |
| Select files | Button `ghost` | inherits `ghost`'s rest/hover ink |

No Figma color changes between Rest and Hover beyond the row fill —
row hover doesn't restyle any child text/icon.

Note count references the switch token directly rather than
`--muted-foreground` (same reasoning documented on the Status atom) —
the latter is declared once at `:root` as
`var(--theme-alpha-black-switch-60)` with no redeclaration inside
`.dark`, so it doesn't re-resolve on a locally-`.dark`-wrapped canvas
(Storybook's `LibraryCanvas`) and renders near-invisible on black.
`Button`'s shared `ghost` variant has this same latent issue for
"Select files" — left alone here since fixing it means touching the
shared primitive, which affects every `ghost` consumer app-wide, not
just this row.

## Structure

- **Brand link** — `@/atoms/brand-link`, given a resolved `logoSrc`
  (Foundations' `BRAND_LOGOS`, tight-cropped/unpadded — the atom
  supplies its own 40×40/8px box) and `label`. Apple gets
  `logoClassName="invert"` — Figma ships it as a single black mark with
  no light/dark ink pair like OpenAI, and it needs to read on Library's
  permanently dark rows.
- **Status** — `@/atoms/status`. No Figma-defined alternate status
  (disconnected/syncing/error) exists yet, so this only renders the one
  `'success'` tone; extend the atom when a second status is designed.
- **Unlink** — Icon Button `fade`, `mini`, size-overridden to 16px.
  `onUnlink` callback — no confirmation dialog built in.
- **Note count** — optional "N notes added" line; omit `noteCount` to
  hide it entirely (Figma's own `showNoteCount` boolean, generalized to
  a real count since the call site needs the number anyway).
- **Select files** — Button `ghost` `mini` + trailing `ChevronRight`.
- **Hit target** — the whole row is clickable (`cursor-pointer`,
  `onClick` fires `onSelectFiles`) — a deliberate departure from Figma,
  which only nests a real Fade button and a real Button with no row-level
  click. The visible "Select files" Button stays real/focusable
  (keyboard access), its own click `stopPropagation`s so it doesn't
  double-fire through the row's handler. Unlink is the opposite-intent
  action nested in the same row, so it also `stopPropagation`s — clicking
  it never triggers `onSelectFiles`.

## API

| Prop | Notes |
| --- | --- |
| `brand` | `'google-drive'` (default) — any Foundations brand-logo key except `openai-light`/`openai-dark`, plus `'openai'` |
| `label` / `logoSrc` | Override the brand's default name/logo |
| `statusLabel` | Default `"Connected"` |
| `noteCount` | Omit to hide the "N notes added" line |
| `onUnlink` / `unlinkLabel` | Unlink button callback / `aria-label` (defaults to `"Disconnect {label}"`) |
| `onSelectFiles` / `selectFilesLabel` | Select-files button callback / label |
| `forceHover` | Storybook — lock hover paint |
