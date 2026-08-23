# Fabely Icons

Brand-specific glyphs that Lucide and Solar do not cover. Size with Foundation
`--icon-*` tokens. Ink via `currentColor`.

| Icon | Component | Use |
| --- | --- | --- |
| Fia Silcrow | `FiaSilcrow` | Upgrade / Fia lockup (Figma “Fia Silcrow”) |
| Gather & Search Notes | `GatherSearchNotesIcon` | Stacked pages + sparkle + magnifying glass, no Lucide equivalent — promoted from `features/highlight` once AI Mode Toggle became a second consumer |

```tsx
import { FiaSilcrow, GatherSearchNotesIcon } from '@/foundations/icons';

<span className="text-[color:var(--tw-raw-fia-200)]">
  <FiaSilcrow />
</span>
```

Source SVGs: `fia-silcrow.svg`, exported Figma asset for Gather & Search
Notes. Catalog: Storybook → Foundations → Iconography → Icon Library →
Fabely Icons.
