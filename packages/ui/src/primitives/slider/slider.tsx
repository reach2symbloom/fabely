/**
 * Fabely Slider primitive — range input from Figma Slider Horizontal
 * (`65:4902`) / Slider Vertical (`162:17939`) with the shadcn Slider API.
 *
 * Vendor file (`src/components/ui/slider.tsx`) stays untouched.
 *
 * Figma axes → props:
 * - Type Default | Range narrow | Range wide → `defaultValue` / `value` length
 *   (one thumb vs two+)
 * - Horizontal | Vertical → `orientation` (`"horizontal"` | `"vertical"`)
 *
 * Track uses `--theme-alpha-black-switch-333` for both orientations (Horizontal
 * Figma binding; Vertical’s muted solid reconciled for H/V parity). Value fill
 * is Primary gradient. Thumb is an oblong pill on `--theme-neutrals-700` with
 * `--shadow-md-black` (`--spacing-md` × `--spacing-xl`, swapped when vertical).
 * No thumb border.
 *
 * Discrete steps (`step` such that stop count is ≤ 21) render little dots on
 * the track at each stop. Pointer scrubbing stays continuous; values snap to
 * those stops on commit. Arrow keys move stop-to-stop.
 *
 * Orientation styles use `data-[orientation=…]` — Base UI sets
 * `data-orientation`, not bare `data-horizontal` / `data-vertical` (vendor
 * shadcn classes still use the latter and miss the track cross-axis size).
 */

'use client';

import * as React from 'react';
import { Slider as SliderPrimitive } from '@base-ui/react/slider';

import { cn } from '@/lib/utils';

/** Max inclusive stop count before dots become noise (e.g. step=1 on 0–100). */
const DISCRETE_DOT_MAX = 21;

/** Pointer granularity while discrete dots are shown (smooth scrub). */
const SMOOTH_DIVISIONS = 1000;

/** Thumb count from value / defaultValue — Base UI accepts `number | number[]`. */
function thumbValues(
  value: SliderPrimitive.Root.Props['value'],
  defaultValue: SliderPrimitive.Root.Props['defaultValue'],
  min: number,
  max: number,
): number[] {
  if (Array.isArray(value)) return [...value];
  if (typeof value === 'number') return [value];
  if (Array.isArray(defaultValue)) return [...defaultValue];
  if (typeof defaultValue === 'number') return [defaultValue];
  return [min, max];
}

function asNumberArray(
  value: number | readonly number[] | undefined,
  fallback: number[],
): number[] {
  if (Array.isArray(value)) return [...value];
  if (typeof value === 'number') return [value];
  return [...fallback];
}

/** Stops for track dots when the range is clearly discrete. */
function discreteStops(min: number, max: number, step: number): number[] | null {
  if (!(step > 0) || !(max > min)) return null;
  const intervals = Math.round((max - min) / step);
  if (intervals < 1 || intervals + 1 > DISCRETE_DOT_MAX) return null;

  const stops: number[] = [];
  for (let i = 0; i <= intervals; i += 1) {
    const raw = min + i * step;
    /* Keep float steps (e.g. 0.1) stable. */
    stops.push(Number(raw.toFixed(10)));
  }
  stops[stops.length - 1] = max;
  return stops;
}

function nearestStop(value: number, stops: number[]): number {
  let best = stops[0]!;
  let bestDist = Math.abs(value - best);
  for (let i = 1; i < stops.length; i += 1) {
    const stop = stops[i]!;
    const dist = Math.abs(value - stop);
    if (dist < bestDist) {
      best = stop;
      bestDist = dist;
    }
  }
  return best;
}

function nextStopInDirection(
  from: number,
  direction: 1 | -1,
  stops: number[],
): number {
  if (direction > 0) {
    for (const stop of stops) {
      if (stop > from + Number.EPSILON) return stop;
    }
    return stops[stops.length - 1]!;
  }
  for (let i = stops.length - 1; i >= 0; i -= 1) {
    const stop = stops[i]!;
    if (stop < from - Number.EPSILON) return stop;
  }
  return stops[0]!;
}

function snapToStops(
  value: number | readonly number[],
  stops: number[],
): number | number[] {
  if (typeof value === 'number') return nearestStop(value, stops);
  return value.map((v) => nearestStop(v, stops));
}

function sameShape(
  value: number | readonly number[],
  next: number | number[],
): number | number[] {
  return typeof value === 'number' && typeof next === 'number'
    ? next
    : Array.isArray(next)
      ? next
      : [next];
}

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  step = 1,
  orientation = 'horizontal',
  onValueChange,
  onValueCommitted,
  largeStep,
  ...props
}: SliderPrimitive.Root.Props) {
  const initialThumbs = thumbValues(value, defaultValue, min, max);
  const dots = discreteStops(min, max, step);
  const smooth = dots != null;
  const vertical = orientation === 'vertical';
  const span = max - min;
  const interactionStep = smooth ? span / SMOOTH_DIVISIONS : step;

  const controlled = value !== undefined;
  const [uncontrolled, setUncontrolled] = React.useState(() =>
    asNumberArray(defaultValue, initialThumbs),
  );
  const currentValues = controlled
    ? asNumberArray(value, initialThumbs)
    : uncontrolled;

  const emitChange = React.useCallback(
    (
      next: number | number[],
      eventDetails: SliderPrimitive.Root.ChangeEventDetails,
    ) => {
      if (!controlled && smooth) {
        setUncontrolled(asNumberArray(next, initialThumbs));
      }
      onValueChange?.(next as never, eventDetails);
    },
    [controlled, smooth, onValueChange, initialThumbs],
  );

  const handleValueChange = React.useCallback(
    (
      next: number | readonly number[],
      eventDetails: SliderPrimitive.Root.ChangeEventDetails,
    ) => {
      if (!smooth || !dots) {
        if (!controlled) {
          setUncontrolled(asNumberArray(next, initialThumbs));
        }
        onValueChange?.(next as never, eventDetails);
        return;
      }

      if (eventDetails.reason === 'keyboard') {
        const index = eventDetails.activeThumbIndex;
        const incoming = asNumberArray(next, currentValues);
        const prev = currentValues[index] ?? incoming[index]!;
        const proposed = incoming[index]!;
        const direction: 1 | -1 = proposed >= prev ? 1 : -1;
        const stepped = [...currentValues];
        stepped[index] = nextStopInDirection(prev, direction, dots);
        emitChange(sameShape(next, stepped), eventDetails);
        return;
      }

      emitChange(sameShape(next, asNumberArray(next, currentValues)), eventDetails);
    },
    [
      smooth,
      dots,
      controlled,
      onValueChange,
      initialThumbs,
      currentValues,
      emitChange,
    ],
  );

  const handleValueCommitted = React.useCallback(
    (
      next: number | readonly number[],
      eventDetails: SliderPrimitive.Root.CommitEventDetails,
    ) => {
      if (!smooth || !dots) {
        onValueCommitted?.(next as never, eventDetails);
        return;
      }

      const snapped = snapToStops(next, dots);
      if (!controlled) {
        setUncontrolled(asNumberArray(snapped, initialThumbs));
      }
      onValueChange?.(snapped as never, {
        ...eventDetails,
        reason: 'none',
        activeThumbIndex: 0,
      } as SliderPrimitive.Root.ChangeEventDetails);
      onValueCommitted?.(snapped as never, eventDetails);
    },
    [smooth, dots, controlled, onValueChange, onValueCommitted, initialThumbs],
  );

  return (
    <SliderPrimitive.Root
      className={cn(
        'w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-auto',
        className,
      )}
      data-slot="slider"
      defaultValue={smooth || controlled ? undefined : defaultValue}
      value={controlled ? value : smooth ? uncontrolled : undefined}
      min={min}
      max={max}
      step={interactionStep}
      largeStep={smooth ? step : largeStep}
      orientation={orientation}
      thumbAlignment="edge"
      onValueChange={handleValueChange}
      onValueCommitted={handleValueCommitted}
      {...props}
    >
      <SliderPrimitive.Control
        className={cn(
          'relative flex w-full touch-none items-center select-none',
          'data-disabled:opacity-50',
          'data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-40',
          'data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col',
        )}
      >
        <SliderPrimitive.Track
          data-slot="slider-track"
          className={cn(
            'relative grow overflow-hidden select-none',
            'rounded-[length:var(--rounded-full)]',
            'bg-[color:var(--theme-alpha-black-switch-333)]',
            /* Figma track cross-axis = 6 → `--stroke-bold`. Default = horizontal. */
            'h-[length:var(--stroke-bold)] w-full',
            'data-[orientation=vertical]:h-full data-[orientation=vertical]:w-[length:var(--stroke-bold)]',
          )}
        >
          <SliderPrimitive.Indicator
            data-slot="slider-range"
            className={cn(
              'select-none',
              /* Horizontal fill (default); Indicator also sets cross-axis inherit. */
              'h-full bg-[image:var(--gradient-primary-left-right)]',
              'data-[orientation=vertical]:w-full',
              'data-[orientation=vertical]:bg-[image:var(--gradient-primary-top-bottom)]',
            )}
          />
        </SliderPrimitive.Track>
        {dots?.map((stop) => {
          const percent = span === 0 ? 0 : ((stop - min) / span) * 100;
          return (
            <span
              key={stop}
              aria-hidden
              data-slot="slider-dot"
              className={cn(
                'pointer-events-none absolute z-[1]',
                /* 4px marks on the 6px track — solid so they read on fill + empty. */
                'h-[length:var(--spacing-2xs)] w-[length:var(--spacing-2xs)]',
                'rounded-[length:var(--rounded-full)]',
                'bg-[color:var(--theme-neutrals-500)]',
                vertical
                  ? 'left-1/2 -translate-x-1/2 translate-y-1/2'
                  : 'top-1/2 -translate-x-1/2 -translate-y-1/2',
              )}
              style={
                vertical
                  ? { bottom: `${percent}%` }
                  : { insetInlineStart: `${percent}%` }
              }
            />
          );
        })}
        {Array.from({ length: currentValues.length }, (_, index) => (
          <SliderPrimitive.Thumb
            data-slot="slider-thumb"
            key={index}
            className={cn(
              'relative z-[2] block shrink-0 select-none',
              /* Oblong pill — h16×w24 horizontal; swapped for vertical. */
              'h-[length:var(--spacing-md)] w-[length:var(--spacing-xl)]',
              'data-[orientation=vertical]:h-[length:var(--spacing-xl)]',
              'data-[orientation=vertical]:w-[length:var(--spacing-md)]',
              'rounded-[length:var(--rounded-full)]',
              'bg-[color:var(--theme-neutrals-700)]',
              'shadow-[var(--shadow-md-black)]',
              'outline-none transition-[box-shadow,opacity]',
              'focus-visible:[box-shadow:var(--effect-focus-ring-secondary),var(--shadow-md-black)]',
              'disabled:pointer-events-none disabled:opacity-50',
            )}
          />
        ))}
      </SliderPrimitive.Control>
    </SliderPrimitive.Root>
  );
}

export { Slider };
