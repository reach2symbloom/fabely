# Book Cover

Portrait cover art with an optional hover / focus **edit** affordance.

## Placement

YES — reusable manuscript chrome (chapter menus, library cards, shelves).
Lives in `src/atoms/book-cover/`.

## Overlap

| Piece | Approach |
| --- | --- |
| Aspect Ratio | Ratio lock only — no edit interaction. Compose sizing here. |
| Empty Media | Slot frame for empty states — different job. |
| Icon Button | **Compose** — edit control is Icon Button `ghost` (or `iconButtonVariants` on `<a>` when navigating) |

## Hover / focus (edit)

When `editable` (default `true`):

1. Soft black scrim (`--theme-alpha-black-no-switch-50`) fades in
2. Cover image eases to a slight scale (`1.03`; reduced-motion safe)
3. Centered **Icon Button** (`ghost` · Lucide `SquarePen`) — size tracks
   cover `sm`→`sm`, `md`→`default`, `lg`→`lg`. Ghost has no rest ring
   (`secondary` + `round` would draw a circle around the pencil).

**Default action:** opens the OS file picker (`accept` images) via a hidden
`<input type="file">`. Handle the result with `onImageSelect`.

**Opt out of upload:** pass `editHref` to navigate instead (real `<a>` +
`iconButtonVariants` — not `IconButton render={<a />}`).

Resting state keeps the cover readable; edit chrome only appears on
intent (hover / keyboard focus-within).

## API

| Prop | Role |
| --- | --- |
| `src` / `alt` | Cover image; omit `src` for placeholder fill |
| `size` | `sm` · `md` · `lg` — height-driven; width from aspect `1023/1537` |
| `editable` | Default `true`; `false` for display-only |
| `onImageSelect` | `(file: File) => void` — OS picker result (default path) |
| `accept` | File input filter; default `BOOK_COVER_ACCEPT` |
| `editHref` | Navigate instead of opening the file picker |
| `editLabel` | Icon Button `aria-label`; default “Change cover” |

`sm` height is `--tw-raw-spacing-40` (160) — Chapter Menu Header cover,
one step under `md` (`--tw-raw-spacing-48` / 192).

## Tokens

| Role | Token |
| --- | --- |
| Radius | `--rounded-sm` |
| Border | `--stroke-regular` / `--theme-alpha-black-switch-10` |
| Shadow | `--shadow-md-black` |
| Scrim | `--theme-alpha-black-no-switch-50` |
| Edit control | Icon Button `ghost` |
| Motion | `--duration-fast` / `--ease-emphasized` |
| Icon | Lucide `SquarePen` via Icon Button size slots |
