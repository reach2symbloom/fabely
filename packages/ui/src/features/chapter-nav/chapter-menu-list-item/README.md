# Chapter Menu List Item

Outline row for chapters, scenes, and sub-scenes inside Chapter Menu.

## Placement

NO — manuscript outline chrome tied to Chapter Menu. Stays in
`src/features/chapter-nav/chapter-menu-list-item/`.

## Overlap

Searched primitives / atoms / molecules / organisms:

| Candidate | Verdict |
| --- | --- |
| **ListItem** | Skip as shell — generic menu leaf with fill hover / focus ring. This row is tree chrome (indent, markers, secondary hover ink, expand rail). |
| **Textarea / Input Group** | Compose — Quiet Mini name field, a field-sizing `Textarea` (not `Input` — wraps to a 2nd line instead of overflowing) inside Input Group. Chapter uses Input Group Prepend (`Ch. N`); scene / sub-scene wrap the Textarea alone. |
| **Separator** | Compose — vertical rail under expanded chapters (`--theme-alpha-black-switch-5`, width `--spacing-3xs`). |
| Lucide chevron / `Circle` / `Dot` | Expand + scene / sub-scene markers. |
| **Icon Button `ghost` mini + Dropdown Menu** | Trailing ellipsis (Show dot menu) opens Delete / Archive / Rename — chapter rows only. |

## Authoritative Figma

[Chapter menu list item](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=16371-635)
set (`16371:635`). Axes:

| Axis | Values |
| --- | --- |
| Type | Chapter · Chapter untitled · Scene · Sub-scene · Chapter + scenes · Chapter +sub-scene |
| Hover | False / True |
| Drag | False / True |
| Expanded | False / True |

Leaf API maps Type to `chapter` | `scene` | `subscene` (`untitled` for Chapter untitled). Expanded composites are a chapter leaf with `expanded` + nested scene / sub-scene children.

## Colors (Foundations)

| Role | Figma | Token |
| --- | --- | --- |
| Chapter / scene title | text default color (75%) | `--text` |
| `Ch. N` · untitled · chevron | muted foreground | `--muted-foreground` |
| Scene circle + number | alpha/black/switch/30 | `--theme-alpha-black-switch-30` |
| Sub-scene label + dot | alpha/black/switch/40 | `--theme-alpha-black-switch-40` |
| Hover / drag (name + markers) | secondary/200 (Main) | `--tw-raw-secondary-200` |
| Ellipsis (ghost Icon Button) | Icon Button ghost ink | not secondary — actions stay neutral |
| Expand rail | alpha/black/switch/5 | Separator (`--theme-alpha-black-switch-5`) |

## Structure

- **Chapter** — Input Group Quiet Mini with Prepend `Ch. N` + name Textarea
  (no colon); ellipsis on hover. Empty value uses `Untitled` placeholder.
  Field chrome (border) shows on focus only — padding comes from Input
  Group mini (`--spacing-1-5`), addon-to-title gap `--spacing-xs` (8px). No
  chapter `pl` — chevron is absolute at `-spacing-lg + 2xs` (4px closer than
  Figma `left: -20`); Chapter Menu outline list supplies `pl-xs` so “Ch.”
  sits body `xl` + list `xs` from the panel edge.
  - **Number alignment** — `N` sits in a fixed `--spacing-lg` (20px),
    left-aligned, `tabular-nums` slot (own `<span>`, separate from the
    "Ch." label, tight `--spacing-2xs` gap between them). Without this,
    the addon hugged `Ch. N` as one string, so its width — and therefore
    where the title started — shifted with digit count (`Ch. 1` vs
    `Ch. 11`). Left-aligned keeps the number reading naturally right next
    to "Ch." (like normal type); the fixed slot width is still what pins
    the title's start x — the variable gap now falls between the number
    and the title instead of between "Ch." and the number. 20px
    comfortably fits two digits at the 16px `text-paragraph-regular-regular`
    size with a little room to spare; it does not fit three (100+
    chapters) — treated as an acceptable edge case for now (title would
    butt up against / crowd the number), not sized for, since three-digit
    chapter counts aren't expected.
  - Nested scene numbers (the plain "1", "2", "3" under an expanded
    chapter) already had a fixed-width, centered slot
    (`--spacing-md + --spacing-3xs`, 18px) — checked, no hug-width issue
    there, left as-is.
- **Chapter scenes dropdown** — chevron only when the chapter has scene
  `children`. Click toggles open/closed (Figma Chapter + scenes). Chapters
  with no individual scenes omit the chevron.
- **Scene** — circle + scene number (`--theme-alpha-black-switch-30`) + name
  Textarea; `pl-md`.
- **Sub-scene** — dot + name Textarea (quieter `--theme-alpha-black-switch-40`);
  deeper indent.
- **`href`** — manuscript section URL. Prefer a real route; Storybook uses
  `#`. Stretched link behind the row; name / chevron / actions stay on top.
- **Hover / drag** — secondary-200 ink on markers, prepend, and value —
  color only, no field chrome (see Interaction below).
- **Expanded chapter** — chevron-up; children under a vertical Separator rail.

## Interaction — double-click to rename, not single-click

Rename is gated behind **double-click**, not single-click, and hover is
ink-color-only (no bounding box / field background). This is a deliberate
deviation from [Chapter Nav Button](../chapter-nav-button), which renames
on single click:

- Chapter Nav Button has nothing else competing for a single click on its
  name field.
- Chapter Menu List Item does: the whole row is a drag-and-drop source (see
  `chapter-menu/outline-dnd.ts`), so a plain pointerdown has to be free for
  drag. Single-click-to-rename and click-to-drag can't share one gesture on
  the same element.

Mechanics: the name Textarea's `onMouseDown` calls `preventDefault()` when
`event.detail < 2` (blocking the browser's default focus-on-mousedown for
the first click of any sequence), so a bare single click never focuses the
field and is left free for the drag sensor. The 2nd mousedown of a
double-click has `detail === 2` and is let through, so `onDoubleClick`
lands with the field already focused; it then calls `.select()`. The
actions menu's **Rename** item calls the identical focus+select — same
outcome, different trigger.

If Chapter Menu ever needs drag-and-drop too, re-evaluate whether it should
adopt double-click for the same reason, or keep single-click if nothing
there ends up competing for the gesture.
