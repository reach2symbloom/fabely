/**
 * Control Slider — labeled Slider field.
 *
 * Figma: Controls (`16301:20374`) `type=Slider` — "LINE WIDTH" label over
 * `SliderHorizontal`. Composes `@/primitives/slider` as-is — the only
 * addition is a thumb hover affordance, since the primitive has none.
 */

import * as React from 'react';

import { cn } from '@/lib/utils';
import { Slider, type SliderProps } from '@/primitives/slider';
import { ControlLabel } from './control-label';

export type ControlSliderProps = SliderProps & {
  className?: string;
  label?: React.ReactNode;
};

/*
 * Slider's `className` merges onto its Root, not the Thumb — target the
 * Thumb by its `data-slot` instead of forking the primitive. A full step to
 * `--theme-neutrals-600` read as an abrupt color swap; blend in the
 * smallest step of the alpha scale (5%, the `-switch-5` token's own value)
 * instead — same "one notch" lighten, much more subtle.
 */
const THUMB_HOVER = [
  '[&_[data-slot=slider-thumb]]:transition-colors',
  '[&_[data-slot=slider-thumb]]:hover:bg-[color:color-mix(in_srgb,var(--theme-neutrals-700)_95%,white_5%)]',
].join(' ');

function ControlSlider({ className, label, ...sliderProps }: ControlSliderProps) {
  return (
    <div
      data-slot="control-slider"
      className={cn('flex w-full flex-col gap-[var(--spacing-sm)]', className)}
    >
      {label != null ? <ControlLabel>{label}</ControlLabel> : null}
      <Slider className={THUMB_HOVER} {...sliderProps} />
    </div>
  );
}

export { ControlSlider };
