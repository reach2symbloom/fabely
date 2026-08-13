/**
 * Fabely Direction primitive — re-export of Base UI `DirectionProvider` /
 * `useDirection` (same surface as `src/components/ui/direction.tsx`).
 *
 * No visual chrome and no Figma set — this is the app-level text-direction
 * context Base UI components read for RTL. Prefer importing from this
 * primitive rather than the vendor path.
 *
 * Docs: https://ui.shadcn.com/docs/components/base/direction
 * Base UI: https://base-ui.com/react/utils/direction-provider
 */

'use client';

export {
  DirectionProvider,
  useDirection,
} from '@/components/ui/direction';
