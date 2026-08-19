# Avatar with Label

Figma **Avatar with label** (`12044:25610`) — Avatar + name, optional
second-line action. Style is image vs initials via `src`; sizes XS / SM / MD;
2-line chrome adds padding.

## Placement

YES — identity chrome reused in nav, menus, and headers. Lives in
`src/molecules/avatar-with-label/`.

## Overlap

| Piece | Approach |
| --- | --- |
| Avatar | Compose — size map XS→`extraTiny`, SM→`tiny`, MD→`regular`. Gradient via Avatar `gradient`. |
| Item | Generic list row — different job. Do not wrap Item. |
| Link Button | Second line is an open slot (`action`), or use `actionLabel`/`actionHref` for the built-in `fia` chrome. When the root has `href`, any second-line content renders non-interactive (no nested links). |

## Interactive vs static

| Mode | How | Behavior |
| --- | --- | --- |
| Interactive | Pass `href` (author profile) | Root `<a>`, `cursor-pointer`, hover fill, focus ring |
| Static | Omit `href` | Root `<div>`, default cursor, no hover affordance |

**Host note:** Chapter Menu Header currently uses static (no hover / link).
If a host needs a profile link *without* the hover fill, add an explicit
prop here — do not strip hover with feature-local CSS.

## API

| Prop | Role |
| --- | --- |
| `href` | Author profile URL — enables interactive mode |
| `size` | `xs` \| `sm` \| `md` (default `xs`) |
| `name` | First line |
| `initials` | Fallback initials |
| `src` / `alt` | Image — omit for Initials style |
| `action` | Second line; enables 2-line text stack. Wins over `actionLabel`. |
| `actionLabel` / `actionHref` / `onActionClick` | Convenience for the common "Upgrade plan" pattern — builds the second line as Link Button `fia` chrome (Figma's Upgrade plan / Upgrade color; see Chapter Menu Header, Bookshelf Template) instead of hand-rolling it per host. Renders a real `<a>`/`<button>` when this root is static; downgrades to a non-interactive `<span>` with the same chrome when this root is itself interactive (`href` set) — same no-nested-links rule as `action`. |
| `padded` | Padded chrome at rest; defaults on for `md` + `action`. Interactive + flush still gets hover padding (negative margin keeps rest layout). |
| `active` | Force Hover=True fill |
| `gradient` | Avatar ring; defaults on for MD + image + `action` |
| `avatarSize` | Override Avatar primitive size (e.g. header Main `small`) |
| `fallbackClassName` | Extra classes on AvatarFallback |

## Authoritative Figma

[Avatar with label](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=12044-25610)
— Style × Size × 2 lines × Hover. Authored combos: XS/SM one-line; MD
two-line (Hover only on Initials MD).
