/**
 * Fabely Aspect Ratio primitive — media frame from Figma Aspect Ratio
 * (`842:52053`) with the shadcn Aspect Ratio API (`ratio` number).
 *
 * Vendor file (`src/components/ui/aspect-ratio.tsx`) stays untouched.
 *
 * Figma Aspect axis → `ratio`:
 * - 16:9 → `16 / 9`
 * - 4:3  → `4 / 3`
 * - 1:1  → `1`
 * - 3:4  → `3 / 4`
 * - 9:16 → `9 / 16`
 *
 * Empty fill is `--theme-neutrals-300` (Figma Shade). Radius `--radius`.
 * Clip overflow so media covers the frame. A locked ratio is optional —
 * use it when the composition needs a stable hole; skip it when intrinsic
 * media already looks right.
 */

import type { ComponentProps, CSSProperties } from 'react';

import { cn } from '@/lib/utils';

type AspectRatioProps = ComponentProps<'div'> & {
  /** Width / height. Required — same as shadcn. */
  ratio: number;
};

function AspectRatio({ ratio, className, style, ...props }: AspectRatioProps) {
  return (
    <div
      data-slot="aspect-ratio"
      style={
        {
          '--ratio': ratio,
          ...style,
        } as CSSProperties
      }
      className={cn(
        'relative overflow-hidden',
        'aspect-(--ratio)',
        'rounded-[length:var(--radius)]',
        'bg-[color:var(--theme-neutrals-300)]',
        '[&>*]:absolute [&>*]:inset-0 [&>*]:size-full',
        '[&_img]:size-full [&_img]:object-cover',
        '[&_video]:size-full [&_video]:object-cover',
        className,
      )}
      {...props}
    />
  );
}

export { AspectRatio };
export type { AspectRatioProps };
