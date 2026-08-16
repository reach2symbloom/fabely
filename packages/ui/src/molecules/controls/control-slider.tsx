/**
 * Control Slider — labeled Slider field.
 *
 * Figma: Controls (`16301:20374`) `type=Slider` — "LINE WIDTH" label over
 * `SliderHorizontal`. Composes `@/primitives/slider` as-is; no local
 * restyling of the thumb/track here.
 */

import * as React from 'react';

import { cn } from '@/lib/utils';
import { Slider, type SliderProps } from '@/primitives/slider';
import { ControlLabel } from './control-label';

export type ControlSliderProps = SliderProps & {
  className?: string;
  label?: React.ReactNode;
};

function ControlSlider({ className, label, ...sliderProps }: ControlSliderProps) {
  return (
    <div
      data-slot="control-slider"
      className={cn('flex w-full flex-col gap-[var(--spacing-sm)]', className)}
    >
      {label != null ? <ControlLabel>{label}</ControlLabel> : null}
      <Slider {...sliderProps} />
    </div>
  );
}

export { ControlSlider };
