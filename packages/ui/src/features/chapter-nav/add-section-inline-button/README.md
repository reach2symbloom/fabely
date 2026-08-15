# Add Section Inline Button

Insert row between manuscript sections. Chapter / Scene: plus (Icon Button)
to the left of a hover-only 1px divider (`--stroke-thin`). Chapter plus or
divider opens Chapter / Act. Act rows keep diamond rails + roman / title.

## Placement

NO — manuscript outline chrome tied to Chapter Nav. Stays in
`src/features/chapter-nav/add-section-inline-button/`.

## Overlap

| Piece | Approach |
| --- | --- |
| Plus | **Icon Button** `ghost` `mini` `round` — compose as the insert trigger. Pulled into the chapter chevron column (`-lg + 2xs`, minus half the mini vs `--icon-xs` delta). |
| Divider | **Separator** `thin` (`--stroke-thin` / 1px), to the right of the plus. Click opens the same action as plus. Hovering the line lightens it (`--theme-alpha-black-switch-5` → `-25`). |
| Chapter / Act | **Dropdown Menu** — Chapter (`PlusIcon`) and Act (`SeparatorHorizontalIcon`). |
| Act rails | Diamond terminals + hairline in `--theme-alpha-black-switch-5`. |
| Act title | **Input** `variant="quiet"` `size="mini"` — untitled / titled only. |
| Act numeral | From `actIndex` (1-based sequence) → roman. Act no. only is a span, not an input. |

## Hover reveal

Chapter-to-chapter gap is **`--spacing-sm` (12px)** at rest **and** on hover.
The hit-zone does not grow. Plus + divider stay mounted; rest is `opacity-0`.
Hover / focus-within / `forceHover` / open menu: opacity only.

Use `forceHover` in Storybook to lock chrome visible, `forceOpen` to lock the
Chapter / Act menu. Act rows stay always visible. Pass
`revealOnHover={false}` to keep Chapter / Scene chrome always on.

Scene plus or divider inserts immediately (no menu).

## Actions

Wire Chapter / Act / Scene with `addChapter` / `addAct` / `addScene`:

| Field | Use |
| --- | --- |
| `onClick` | App handler |
| `href` | Optional; navigation should run from `onClick` (menu items are not `<a>`) |
| `formAction` / `formMethod` / `form` | Scene plus as `<button type="submit">` |

Shorthands `onAddChapter` / `onAddAct` / `onAddScene` still work.

## Authoritative Figma

[Add section inline button](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=16373-4624)
— Chapter / Scene / Act variants. Type=Default (pill) lives on the atom and
is not used on this insert row.

| Type | Role |
| --- | --- |
| Chapter | Hover plus + 1px divider; plus or line opens Chapter / Act menu |
| Scene | Hover plus + 1px divider; plus or line inserts a scene |
| Act untitled / titled | Diamond rails + sequence roman + title input |
| Act no. only | Diamond rails + sequence roman only (display) |
