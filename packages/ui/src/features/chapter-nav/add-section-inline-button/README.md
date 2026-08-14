# Add Section Inline Button

Insert row between manuscript sections — secondary glow rails (Chapter /
Scene) or diamond rails (Act split-parse). Always includes dividers.

## Placement

NO — manuscript outline chrome tied to Chapter Nav. Stays in
`src/features/chapter-nav/add-section-inline-button/`.

## Overlap

| Piece | Approach |
| --- | --- |
| Pill | **Add Section Button** atom — compose. Figma Default is that atom; never ship it alone here. |
| Insert rails | CSS linear gradient on `--tw-raw-secondary-200` + soft blur. |
| Act rails | Diamond terminals + hairline in `--theme-alpha-black-switch-5`. |
| Act title | **Input** `variant="quiet"` `size="mini"` — untitled / titled only. |
| Act numeral | From `actIndex` (1-based sequence) → roman. Act no. only is a span, not an input. |

## Actions

Wire Chapter / Act / Scene pills with `addChapter` / `addAct` / `addScene`:

| Field | Use |
| --- | --- |
| `href` | Real route, placeholder `#add-chapter`, or webhook URL — pill renders as `<a>` |
| `onClick` | App handler (also runs after `href` click unless `preventDefault`) |
| `formAction` / `formMethod` / `form` | Native form POST (webhook / server action) — pill stays `<button type="submit">` |

Shorthands `onAddChapter` / `onAddAct` / `onAddScene` still work.

## Authoritative Figma

[Add section inline button](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=16373-4624)
— Chapter / Scene / Act variants only. Type=Default lives on the atom.

| Type | Role |
| --- | --- |
| Chapter | Glow rails + Chapter / Act pills |
| Scene | Glow rails + Scene pill (Hover=False; row is already the hover surface) |
| Act untitled / titled | Diamond rails + sequence roman + title input |
| Act no. only | Diamond rails + sequence roman only (display) |
