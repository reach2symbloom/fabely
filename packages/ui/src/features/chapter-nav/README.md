# Chapter Nav Button

Manuscript location chrome — book title + current chapter. Chevron (and the
shell around the field) opens Chapter Menu (stubbed). The chapter line is an
Input instance with Prepend on, so the name is renamed inline.

## Placement

NO — this would not be reused with unrelated content outside chapter / book
admin. It stays in `src/features/chapter-nav/`.

## Overlap

Searched primitives / atoms / molecules / organisms. Compose, do not copy:

| Piece | Approach |
| --- | --- |
| Chapter menu | **Dropdown Menu** — wrap. Trigger is the Fade chevron, not the whole shell (an Input cannot live inside a `<button>`). Content stubbed until Chapter Menu lands. |
| Chevron | **Icon Button `fade`** — compose as `DropdownMenuTrigger` (`render={<IconButton />}`). Call-site hug: `--icon-sm`. Vertically centered on the two-line stack. |
| Inline rename | **Input Group** `variant="ghost"` `size="mini"` — Figma Prepend is text (`Ch. N:`), which lives on Input Group (`InputGroupText`), not Input `decorationLeft` (icons). |

## Authoritative Figma

[Chapter nav button](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=16038-15527)
— **first variant** (`State=Empty, Hover=False`, `16038:15485`):

- Book title (Paragraph Regular, muted) over an **Input** instance
  (Ghost, Mini, Prepend on: `Ch. 1:` + placeholder `Untitled`, Heading 4).
- Sibling **Fade button** (chevron-down), centered on the stack.
- Hover / open fills the outer `--rounded-lg` with
  `--theme-alpha-black-switch-333`. Empty vs Filled is contrast on the
  chapter line (switch-25 vs switch-100).
- Chevron sits `--spacing-3xs` (2px) after the chapter text (Frame 145
  itemSpacing). Input mini end-pad is cleared so that gap is the space
  between the words and the glyph, not 6px + 2px.

## Structure

- Clicking the chapter name (or prepend) focuses the field — inline rename.
  `Untitled` is placeholder text, not a value. An empty blur restores it.
  Cmd / Ctrl+A selects the field (the menu is not an ancestor, so it cannot
  steal the shortcut). The field fills the chrome beside the chevron and does
  not hug the value, so a one-letter name keeps the same click target.
- Clicking the chevron, book title, or shell padding opens the Chapter Menu
  stub. Rename does **not** live in that panel.
- Two interactive controls, not one nested trigger.

## Gaps (call-site, not new Input variants)

- **Type:** Figma Ghost Mini uses Heading 4 Light for prepend + value. Input /
  Input Group keep Paragraph Mini. Override via `className` (Foundations
  Heading 4 tokens). Same gap already noted on Input’s README.
- **Height:** Figma Mini instance is 32px; Input mini slot is 24px
  (`--spacing-xl`). Override to `--spacing-2xl` (Input’s 32px slot) so Heading 4
  is not clipped. Mini pad + `--rounded-md` stay.

## Deferred

- Chapter Menu organism (outline, cover, author, library link, new chapter)
- Figma Fade `Show superscript`
