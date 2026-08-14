# Chapter Nav Button

Manuscript location chrome — book title + current chapter. Chevron (and the
shell around the field) opens Chapter Menu (stubbed). The chapter line is an
Input instance with Prepend on, so the name is renamed inline.

## Placement

NO — this would not be reused with unrelated content outside chapter / book
admin. It stays in `src/features/chapter-nav/chapter-nav-button/`.

## Overlap

Searched primitives / atoms / molecules / organisms. Compose, do not copy:

| Piece | Approach |
| --- | --- |
| Chapter menu | **Dropdown Menu** — wrap. Trigger is the Fade chevron, not the whole shell (an Input cannot live inside a `<button>`). Content stubbed until Chapter Menu lands. |
| Chevron | **Icon Button `fadeGold`** — compose as `DropdownMenuTrigger` (`render={<IconButton />}`). Call-site hug: `--icon-sm`. Sits on the chapter row, `--spacing-3xs` after the hugging field. Group hover / open uses the same `--primary` as the primitive hover. |
| Inline rename | **Input Group** `variant="quiet"` `size="mini"` — Figma Prepend is text (`Ch. N:`), which lives on Input Group (`InputGroupText`), not Input `decorationLeft` (icons). Quiet is the Input primitive variant with independent hover (`--theme-alpha-black-switch-333`) and a semantic `--border` on focus (no ring, no value-slot fill). |

## Authoritative Figma

[Chapter nav button](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=16038-15527)
— **first variant** (`State=Empty, Hover=False`, `16038:15485`):

- Book title (Paragraph Regular, muted) over an **Input** instance
  (Mini, Prepend on: `Ch. 1:` + placeholder `Untitled`, Heading 4).
  Empty copy: `Untitled book` / `Untitled`. Filled copy: `The Lumithra
  Prophecy` / `The Eldergrove`. Code uses Input `quiet` (hover fill +
  `--border` focus) rather than Figma Ghost, which has no rest hover and a
  focus ring.
- Sibling **Fade button** (chevron-down), centered on the stack.
- Hover / open fills the outer `--rounded-lg` with
  `--theme-alpha-black-switch-333`. Empty vs Filled is contrast on the
  chapter line (`--theme-alpha-black-switch-25` vs `-50`). Book title is
  `--theme-neutrals-400`.
- Chevron sits `--spacing-3xs` (2px) after the input box. The chapter
  field hugs the placeholder / value (`field-sizing-content`) and keeps
  Input mini pad (`--spacing-1-5`) on both sides. Min width is the empty
  (placeholder) size so short names do not shrink the box; the chevron
  only moves out as the name grows past that floor.

## Structure

- Clicking the chapter name (or prepend) focuses the field — inline rename.
  `Untitled` is placeholder text, not a value. An empty blur restores it.
  Cmd / Ctrl+A selects the field (the menu is not an ancestor, so it cannot
  steal the shortcut). The field hugs the typed name but never shrinks
  below the empty placeholder width; mini end-pad stays. The chevron sits
  `--spacing-3xs` after the box and tracks growth past that floor.
- Clicking the chevron, book title, or shell padding opens the Chapter Menu
  stub. Rename does **not** live in that panel.
- Two interactive controls, not one nested trigger.

## Gaps (call-site)

- **Type:** Figma Ghost Mini uses Heading 4 Light for prepend + value. Input /
  Input Group keep Paragraph Mini. Override via `className` (Foundations
  Heading 4 tokens). Same gap already noted on Input’s README.
- **Height:** Figma Mini instance is 32px; Input mini slot is 24px
  (`--spacing-xl`). Override to `--spacing-2xl` (Input’s 32px slot) so Heading 4
  is not clipped. Mini pad + `--rounded-md` stay.

## Deferred

- Chapter Menu organism (outline, cover, author, library link, new chapter)
- Figma Fade `Show superscript`
