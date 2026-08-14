# Add Section Button

Figma **Add section inline button / Type=Default** (`16373:4622`) — icon +
label pill. Rest uses `--text`; hover fills `--theme-alpha-black-switch-333`
and paints `--tw-raw-secondary-200`.

## Placement

YES — same chrome with different icons/labels for Add chapter, Chapter,
Act, and Scene. Lives in `src/atoms/add-section-button/`.

Never a product surface on its own: Chapter Nav’s insert rows
(`AddSectionInlineButton`) always pair it with glow / diamond dividers.

Pass `href` to render as `<a>` (navigation / empty link / webhook URL);
omit `href` for `<button>` (`onClick`, `formAction`, …).

## Overlap

| Piece | Approach |
| --- | --- |
| Chrome | Custom atom — Button `ghost` / `mini` use muted → foreground and quiet `@5`/`@10`, not Figma’s `--text` / secondary-200 / `333`. |
| Icon | Open slot; size locked to `--icon-xs` (Figma 12). Lucide at call sites. |
| Type | Paragraph Mini Medium Foundations tokens. |

## Authoritative Figma

[Add section inline button](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=16373-4624)
— **Type=Default** only (`Hover=False` / `Hover=True`). Chapter / Scene /
Act split-parse variants are the feature composition that nests this atom.
