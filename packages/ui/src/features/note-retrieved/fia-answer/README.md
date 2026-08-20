# Fia Answer

A single retrieved answer row in Fia's search results — the quoted
paragraph plus its source badge and result count.

## Placement

Fia search/retrieval-specific chrome. Stays in
`src/features/note-retrieved/fia-answer/`.

## Authoritative Figma

[Fia answer](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=16064-4860)
(`16064:4860`).

## Tokens

| Role | Token |
| --- | --- |
| Answer text | Paragraph Regular / Regular; `--theme-alpha-black-switch-70` |
| Silcrow mark | `FiaSilcrow` (`@/foundations/icons`); `--tw-raw-fia-200` |
| Source badge | `Badge` primitive, `default` variant/size |
| Result count | Paragraph Mini / Regular; `--theme-alpha-black-switch-50` |
| Row divider | `--theme-alpha-black-switch-5`, `--stroke-thin` |
| Padding | `--spacing-md` (16px) sides/bottom |
| Row gap | `--spacing-sm` (12px) |

## API

| Prop | Notes |
| --- | --- |
| `answer` | Required quoted paragraph body. |
| `source` | Required source label rendered as "Source: {source}". |
| `resultCount` | Required supporting-result count. |
