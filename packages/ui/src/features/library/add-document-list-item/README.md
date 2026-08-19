# Add Document List Item

File row — Doc-types glyph, title, and an Add or Remove trailing control.

## Placement

NO — Library product chrome. Stays in
`src/features/library/add-document-list-item/`.

Would not make sense reused outside Library with unrelated content.

## Overlap

Searched primitives / atoms / molecules / organisms / features:

| Candidate | Verdict |
| --- | --- |
| **ListItem** (primitives) | Skip as shell — menu leaf (hover fill, title+description slots). This row has no hover fill, a file-type raster, and a trailing Add/Remove that swaps structure. |
| **Attachment** | Skip — upload chip with progress states and a bordered card. Different job. |
| **Library List Item** | Skip — book row (badge, stats, continue link). Different job. |
| **Button `tertiary` `small`** | Nest — Figma's Add control is Button Variant=Tertiary, Size=Small. |
| **Icon Button `ghost` `sm`** | Nest — Figma's Remove control is Icon Button Variant=Ghost, Size=Small, Lucide `X`. |
| **Doc types** (Figma set `16509:30930`) | Foundations Images — `DOC_TYPE_IMAGES` from `@/foundations/images`. Multi-color rasters, not Lucide / Fabely Icons glyphs. |

## Authoritative Figma

[Add document list item](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=16509-31009)
set (`16509:31009`). Axes:

| Axis | Figma | API |
| --- | --- | --- |
| Property 1 | Frame 162 / Frame 163 | `added`: `false` / `true` |

Frame 162 is Add (tertiary Button). Frame 163 is already-added (ghost Icon
Button with X). The Figma names are placeholder frames; the structure is
the added state, not hover.

Nested [Doc types](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=16509-30930)
(`16509:30930`) Type=PDF on both published variants. Type=Doc / Type=Docx
exist on that set and are exposed here as `fileType`.

## Colors (Foundations)

| Role | Figma | Token |
| --- | --- | --- |
| Title | unbound white 100% | `--foreground` |
| Add button | Button Tertiary Small | primitive as-is (`--text` / muted label, alpha-10 hairline) |
| Remove icon | Icon Button Ghost Small; glyph white 50% | primitive as-is (`--muted-foreground`) |

## Structure

- **File type** — 24px (`--icon-lg`) raster from Foundations Images
  (`DOC_TYPE_IMAGES`). Decorative.
- **Title** — Paragraph Regular, truncates. Default copy is Figma's
  "The Discovery of the Eldergrove".
- **Trailing** — `added={false}`: nested `<Button variant="tertiary" size="small">`.
  `added`: nested `<IconButton variant="ghost" size="sm">` with Lucide `X`.
- **Hit target** — only the trailing control. The row is not a button
  (would nest the Add/Remove primitives).

## API

| Prop | Notes |
| --- | --- |
| `added` | `false` (default) shows Add; `true` shows Remove |
| `fileType` | `'pdf'` (default) \| `'docx'` \| `'doc'` |
| `title` | Row label |
| `onAdd` / `onRemove` | Trailing control clicks |
| `addLabel` / `removeLabel` | Add visible label / Remove `aria-label` |
