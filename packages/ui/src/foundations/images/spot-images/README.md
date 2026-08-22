# Spot Images

Decorative illustrations for Library entry-point cards. Lives in
`src/foundations/images/spot-images/`, imported via
`@/foundations/images/spot-images`.

Not [Brand Logos](../brand-logos/README.md) — those are third-party
service marks; these are Fabely's own illustration art (e.g. the
glowing book/tree art behind [Image Button](../../../features/library/image-button/README.md)'s
"Bring in your notes" card).

## Source

Each image is the 72×72 thumbnail from one of Image Button's Figma
instances:

| Key | Figma instance |
| --- | --- |
| `import-notes` | Import notes (`16455:16977`) |
| `import-manuscript` | Import your manuscript (`16455:17561`) |

## Usage

```tsx
import { SPOT_IMAGES } from '@/foundations/images/spot-images';

<img src={SPOT_IMAGES['import-notes']} alt="" />
```

Promoted out of `image-button/assets/` so the art is reusable if a
future card needs the same illustration (and to keep the naming
convention consistent with Brand Logos — one Foundations home for
every raster image asset).
