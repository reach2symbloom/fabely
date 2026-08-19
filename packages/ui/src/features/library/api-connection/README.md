# API Connection

Third-party integration row — brand mark, name, connection status, an
unlink control, and a "Select files" action. Nested inside Sources &
notes card's "Linked" state.

## Placement

NO — Library product chrome. Stays in
`src/features/library/api-connection/`.

Would not make sense reused outside Library with unrelated content
(brand marks, "Select files" copy are Library-specific).

## Overlap

Searched primitives / atoms / molecules / organisms / features:

| Candidate | Verdict |
| --- | --- |
| **Icon Button** | Nest — unlink control (`fade` variant, sized down to Figma's 16px "Fade button" via `className`) and (indirectly) the ghost text Button below. |
| **Button `ghost` `mini`** | Nest — Figma's "Select files" control is a ghost text Button with a trailing chevron, height matches `mini` (24px) exactly. |
| **Tooltip** | Nest — unlink has no Figma tooltip, added anyway: a 16px icon-only control with no visible label leaves no way to tell what it does before clicking. |
| **Add Document List Item** | Skip — different row job (doc row, not integration row); no shared structure beyond "row with a trailing control". |

## Authoritative Figma

[API Connections](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=16456-17880)
— two instances nested in Sources & notes card's Linked state
(`16456:17608`): Google Drive (`16456:17880`), OpenAI (`16456:17949`).
Both only ever show the connected state in Figma.

The row's own master component (`16456:17857`, under the Library
components page) has a separate Hover axis (`16456:17841` False /
`16456:17858` True) — the whole row gains a subtle background fill on
hover, not just its nested controls. Easy to miss reading only the
instance nodes above, since an instance's `get_design_context` output
doesn't surface the master's other variants.

## Colors (Foundations)

| Role | Figma | Token |
| --- | --- | --- |
| Row border | alpha-black 10% | `--theme-alpha-black-switch-10` |
| Row hover fill | alpha-black 3% (Figma's alpha-333 slot) | `--theme-alpha-black-switch-333` |
| Name | white 75% | `--text` |
| Status dot | `#76E0B2` | `--tw-raw-success-500` |
| Status label | white 50% | `--muted-foreground` |
| Unlink icon | white 40% (Icon Button `fade`) | primitive as-is |
| Select files | white 75% label | `ghost` Button as-is |

## Structure

- **Brand mark** — 40×40 box, `object-contain` raster (Google Drive,
  exported Figma asset) or an inline `currentColor` SVG (OpenAI mark,
  `assets/openai-mark.tsx`, same convention as Library Cover's divider
  ornament).
- **Status** — 8px filled dot + label. `connected` (default `true`)
  swaps dot color and default status copy; Figma never shows the
  disconnected state, kept for a real integration to use.
- **Unlink** — nested `<IconButton variant="fade">`, sized down from
  its `default` 36px slot to Figma's 16px via `className` (`size-*` /
  `p-0` / icon-size utilities all win over the variant's own through
  `tailwind-merge`). Wrapped in `<Tooltip>` — `unlinkLabel` doubles as
  both the tooltip copy and the button's `aria-label`, same pattern as
  Highlight Action Menu's icon-only controls.
- **Select files** — nested `<Button variant="ghost" size="mini">` with
  a trailing Lucide `ChevronRight`, or a plain anchor with the same
  visual treatment when `selectFilesHref` is set (no Button primitive
  polymorphism for anchors).

## API

| Prop | Notes |
| --- | --- |
| `brand` | `'google-drive'` (default) \| `'openai'` |
| `name` | Defaults to the brand's display name |
| `connected` | Default `true` — Figma's only published state |
| `statusLabel` | Overrides the `connected`-derived copy |
| `onUnlink` / `unlinkLabel` | Unlink Icon Button click / `aria-label` |
| `selectFilesLabel` | Default `'Select files'` |
| `selectFilesHref` / `onSelectFiles` | Renders an anchor when `selectFilesHref` is set, otherwise a button |
| `forceHover` | Storybook / playground — locks the row's hover fill without a pointer |
