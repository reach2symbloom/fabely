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
| **Input / Input Group** | Compose — Quiet Mini name field (hover fill + focus border). Chapter uses Input Group Prepend (`Ch. N`); scene / sub-scene are bare Input. |
| **Separator** | Compose — vertical rail under expanded chapters (`--theme-alpha-black-switch-5`, width `--spacing-3xs`). |
| Lucide chevron / `Circle` / `Dot` | Expand + scene / sub-scene markers. |
| **Icon Button `ghost` mini** | Trailing ellipsis (Show dot menu). |

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

- **Chapter** — Input Group Quiet Mini with Prepend `Ch. N` + name Input
  (no colon); chevron in `--spacing-lg` lead; ellipsis on hover. Empty value
  uses `Untitled` placeholder. Quiet chrome shows on field hover / focus and
  on row hover — padding comes from Input Group mini (`--spacing-1-5`).
- **Scene** — circle + scene number (`--theme-alpha-black-switch-30`) + Input
  Quiet Mini for the name; `pl-md`.
- **Sub-scene** — dot + Input Quiet Mini (quieter `--theme-alpha-black-switch-40`);
  deeper indent.
- **`href`** — manuscript section URL. Prefer a real route; Storybook uses
  `#`. Stretched link behind the row; name / chevron / actions stay on top.
- **Hover / drag** — secondary-200 ink on markers, prepend, and value.
- **Expanded chapter** — chevron-up; children under a vertical Separator rail.
