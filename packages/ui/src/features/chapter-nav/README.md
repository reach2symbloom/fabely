# Chapter Nav Button

Manuscript location trigger — book title + current chapter, opening a stub
panel until Chapter Menu lands.

## Placement

NO — this would not be reused with unrelated content outside chapter / book
admin. It stays in `src/features/chapter-nav/`.

## Overlap

Searched primitives / atoms / molecules / organisms. Compose, do not copy:

| Piece | Approach |
| --- | --- |
| Open behavior | **Dropdown Menu** — wrap. Content is stubbed (rename Input only). |
| Chevron | **Icon Button `fade`** chrome via `iconButtonVariants` on a span — the whole control is one trigger, so a nested `IconButton` (second `<button>`) is not used. Call-site size hug: `--icon-sm`. |
| Rename | **Input** `variant="ghost"` `size="mini"` inside the open panel. |

## Authoritative Figma

[Chapter nav button](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=16038-15527)
— **first variant only** (`State=Empty, Hover=False`, `16038:15485`): single
trigger, two-line presentational text, chevron centered on the stack. Other
variants on that set are superseded structural explorations (inline rename in
the collapsed trigger). Do not build those.

## Structure

- Collapsed trigger is **not** an Input. Book title (Paragraph Regular,
  `text-muted-foreground`) over serif Heading 4 `Ch. X: Chapter Name`.
- Hover / open fills the outer `--rounded-lg` (12) with
  `--theme-alpha-black-switch-333`. Empty vs Filled is contrast on the chapter
  line (switch-25 vs switch-100), not a different rest fill.
- Panel: Input ghost mini for chapter rename. Chapter Menu (cover, author,
  library, new chapter) is later.

## Gap — Input in the panel

Figma’s collapsed chapter line was an Input Ghost Mini *instance* used as
chrome, with Heading 4 serif 20/24. The decided structure moves rename into
the panel. Input **does** expose `ghost` + `mini`; that is what we use.

Mini type is Paragraph Mini, not Heading 4. We did not add a serif / Heading 4
Input variant (feature-specific). Closest existing treatment: `ghost` + `mini`.
Promote a type axis on Input if a second feature needs the same.

## Deferred

- Chapter Menu organism (outline, cover, author, library link, new chapter)
- Figma Fade `Show superscript`
