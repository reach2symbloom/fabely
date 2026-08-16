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

/* Slider's `className` merges onto its Root, not the Thumb — target the
 * Thumb by its `data-slot` instead of forking the primitive. */
const THUMB_HOVER = [
  '[&_[data-slot=slider-thumb]]:transition-opacity',
  '[&_[data-slot=slider-thumb]]:hover:opacity-[var(--opacity-hover-soft)]',
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
