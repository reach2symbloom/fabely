# Fabely Icons

Brand-specific glyphs that Lucide and Solar do not cover. Size with Foundation
`--icon-*` tokens. Ink via `currentColor`.

| Icon | Component | Use |
| --- | --- | --- |
| Fia Silcrow | `FiaSilcrow` | Upgrade / Fia lockup (Figma “Fia Silcrow”) |
| Gather & Search Notes | `GatherSearchNotesIcon` | Stacked pages + sparkle + magnifying glass, no Lucide equivalent — promoted from `features/highlight` once AI Mode Toggle became a second consumer |
| Line Dot Right Horizontal | `LineDotRightHorizontal` | Horizontal line ending in a circle at its right end, no Lucide equivalent (`GitCommitHorizontal` centers the circle instead) — used by Promptbar Shelf's connected-scene divider and its "Connected to current scene" menu item icon |

```tsx
import { FiaSilcrow, GatherSearchNotesIcon, LineDotRightHorizontal } from '@/foundations/icons';

<span className="text-[color:var(--tw-raw-fia-200)]">
  <FiaSilcrow />
</span>
```

Source SVGs: `fia-silcrow.svg`, exported Figma asset for Gather & Search
Notes. Catalog: Storybook → Foundations → Iconography → Icon Library →
Fabely Icons.
