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
 * `interaction="discrete"` (opt-in) renders little dots on the track at each
 * `step` stop (capped at 21). Positions follow `thumbAlignment="edge"` so
 * marks sit on the thumb center, not the raw track percent. Drag and keys
 * snap stop-to-stop. `interaction="smooth"` (default) has no notches.
 *
 * Orientation styles use `data-[orientation=…]` — Base UI sets
 * `data-orientation`, not bare `data-horizontal` / `data-vertical` (vendor
 * shadcn classes still use the latter and miss the track cross-axis size).
 */

'use client';

import { Slider as SliderPrimitive } from '@base-ui/react/slider';

import { cn } from '@/lib/utils';

/** Max inclusive stop count before dots become noise (e.g. step=1 on 0–100). */
const DISCRETE_DOT_MAX = 21;

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

type SliderInteraction = 'smooth' | 'discrete';

type SliderProps = SliderPrimitive.Root.Props & {
  /** Smooth (default) has no track notches. Discrete snaps to step stops. */
  interaction?: SliderInteraction;
};

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  step = 1,
  orientation = 'horizontal',
  interaction = 'smooth',
  ...props
}: SliderProps) {
  const thumbs = thumbValues(value, defaultValue, min, max);
  const discrete = interaction === 'discrete';
  const dots = discrete ? discreteStops(min, max, step) : null;
  const vertical = orientation === 'vertical';
  const span = max - min;

  return (
    <SliderPrimitive.Root
      className={cn(
        'w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-auto',
        className,
      )}
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      step={step}
      orientation={orientation}
      thumbAlignment="edge"
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
          const unit = span === 0 ? 0 : (stop - min) / span;
          /* Match Base UI edge inset: thumb center travels (100% − thumb). */
          const position = `calc(var(--spacing-xl) / 2 + ${unit} * (100% - var(--spacing-xl)))`;
          return (
            <span
              key={stop}
              aria-hidden
              data-slot="slider-dot"
              className={cn(
                'pointer-events-none absolute z-[1]',
                /* 2px marks on the 6px track — light alpha so they stay quiet. */
                'h-[length:var(--stroke-regular)] w-[length:var(--stroke-regular)]',
                'rounded-[length:var(--rounded-full)]',
                'bg-[color:var(--theme-alpha-white-no-switch-25)]',
                vertical
                  ? 'left-1/2 -translate-x-1/2 translate-y-1/2'
                  : 'top-1/2 -translate-x-1/2 -translate-y-1/2',
              )}
              style={
                vertical
                  ? { bottom: position }
                  : { insetInlineStart: position }
              }
            />
          );
        })}
        {Array.from({ length: thumbs.length }, (_, index) => (
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
export type { SliderProps, SliderInteraction };
