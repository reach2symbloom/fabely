# Images

Multi-color rasters — file-type marks, photos, illustrations. Not iconography.

Iconography (`foundations/icons`, Lucide, Solar) is `currentColor` glyphs sized
with `--icon-*`. These assets keep their own colors and lighting; they cannot
tinted and do not belong in the Icon Library.

When a raster sits at icon scale, still size the **frame** with `--icon-*`.

## Doc types

Figma set [Doc types](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=16509-30930)
(`16509:30930`) — Type=PDF / Doc / Docx.

```tsx
import { DOC_TYPE_IMAGES } from '@/foundations/images';

<img
  src={DOC_TYPE_IMAGES.pdf}
  alt=""
  aria-hidden
  className="size-[length:var(--icon-lg)] object-contain"
/>
```

Catalog: Storybook → Foundations → Images.
