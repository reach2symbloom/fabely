/**
 * Fabely Progress — Figma Progress (Size Thin | Thick) + shadcn composition API.
 *
 * Vendor file (`src/components/ui/progress.tsx`) stays untouched.
 * Source: Fabely Design System Progress set
 * https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=5010-29
 *
 * Public API matches https://ui.shadcn.com/docs/components/base/progress
 * plus Figma `size` (`thin` | `thick`).
 */

'use client';

import * as React from 'react';
import { Progress as ProgressPrimitive } from '@base-ui/react/progress';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

type ProgressSize = NonNullable<VariantProps<typeof progressTrackVariants>['size']>;

type ProgressContextValue = {
  size: ProgressSize;
  value: number | null | undefined;
};

const ProgressContext = React.createContext<ProgressContextValue>({
  size: 'thin',
  value: undefined,
});

const progressTrackVariants = cva(
  [
    /* order-1 so ProgressValue (order-2) sits after the bar — Figma Show layout. */
    'relative order-1 flex min-w-0 flex-1 items-center overflow-x-hidden',
    'rounded-[length:var(--rounded-lg)]',
    'bg-[color:var(--theme-alpha-black-switch-333)]',
    /* With ProgressLabel, track drops to a full-width row under the header. */
    '[[data-slot=progress]:has([data-slot=progress-label])_&]:basis-full',
    '[[data-slot=progress]:has([data-slot=progress-label])_&]:w-full',
  ],
  {
    variants: {
      size: {
        /* Figma Thin = 4px */
        thin: 'h-[length:var(--spacing-2xs)]',
        /* Figma Thick = 8px */
        thick: 'h-[length:var(--spacing-xs)]',
      },
    },
    defaultVariants: { size: 'thin' },
  },
);

const progressIndicatorVariants = cva(
  [
    /* Absolute so Base UI width/% + inset-inline-start share the track box. */
    'absolute inset-y-0 origin-inline-start',
    '[background-image:var(--gradient-primary-left-right)]',
    'transition-[width,clip-path] duration-[var(--duration-fast)]',
  ],
  {
    variants: {
      size: {
        thin: 'rounded-[length:var(--rounded-lg)]',
        /* Start cap only — end is slanted (or fully round when complete). */
        thick: 'rounded-s-[length:var(--rounded-lg)]',
      },
      slant: {
        false: '',
        /*
         * Figma Thick: top of the leading edge extends past the bottom (`\`).
         * Leading edge is inline-end — mirror under `dir=rtl`.
         */
        true: [
          'rounded-e-none',
          '[clip-path:polygon(0_0,100%_0,calc(100%-var(--spacing-xs))_100%,0_100%)]',
          'rtl:[clip-path:polygon(0_0,100%_0,100%_100%,var(--spacing-xs)_100%)]',
        ].join(' '),
      },
      complete: {
        false: '',
        true: 'rounded-e-[length:var(--rounded-lg)]',
      },
    },
    defaultVariants: { size: 'thin', slant: false, complete: false },
  },
);

function Progress({
  className,
  children,
  value,
  size = 'thin',
  ...props
}: ProgressPrimitive.Root.Props & { size?: ProgressSize }) {
  return (
    <ProgressContext.Provider value={{ size, value }}>
      <ProgressPrimitive.Root
        value={value}
        data-slot="progress"
        data-size={size}
        className={cn(
          'flex w-full items-center gap-[var(--spacing-md)]',
          'has-[[data-slot=progress-label]]:flex-wrap',
          className,
        )}
        {...props}
      >
        {children}
        <ProgressTrack>
          <ProgressIndicator />
        </ProgressTrack>
      </ProgressPrimitive.Root>
    </ProgressContext.Provider>
  );
}

function ProgressTrack({ className, ...props }: ProgressPrimitive.Track.Props) {
  const { size } = React.useContext(ProgressContext);
  return (
    <ProgressPrimitive.Track
      className={cn(progressTrackVariants({ size }), className)}
      data-slot="progress-track"
      data-size={size}
      {...props}
    />
  );
}

function ProgressIndicator({
  className,
  ...props
}: ProgressPrimitive.Indicator.Props) {
  const { size, value } = React.useContext(ProgressContext);
  const complete = typeof value === 'number' && value >= 100;
  const slant = size === 'thick' && !complete && typeof value === 'number' && value > 0;

  return (
    <ProgressPrimitive.Indicator
      data-slot="progress-indicator"
      data-size={size}
      data-complete={complete || undefined}
      className={cn(
        progressIndicatorVariants({
          size,
          slant,
          complete: complete && size === 'thick',
        }),
        className,
      )}
      {...props}
    />
  );
}

function ProgressLabel({ className, ...props }: ProgressPrimitive.Label.Props) {
  return (
    <ProgressPrimitive.Label
      className={cn(
        'order-0 min-w-0 flex-1',
        'font-[family-name:var(--text-paragraph-small-medium-font-family)]',
        '[font-weight:var(--text-paragraph-small-medium-font-weight)]',
        'text-[length:var(--text-paragraph-small-medium-font-size)]',
        'leading-[var(--text-paragraph-small-medium-line-height)]',
        'tracking-[var(--text-paragraph-small-medium-letter-spacing)]',
        'text-[color:var(--foreground)]',
        className,
      )}
      data-slot="progress-label"
      {...props}
    />
  );
}

function ProgressValue({ className, ...props }: ProgressPrimitive.Value.Props) {
  return (
    <ProgressPrimitive.Value
      className={cn(
        /* Trailing % beside the bar (Figma Show); with Label, sits end of header row. */
        'order-2 shrink-0 tabular-nums whitespace-nowrap',
        'font-[family-name:var(--text-paragraph-mini-medium-font-family)]',
        '[font-weight:var(--text-paragraph-mini-medium-font-weight)]',
        'text-[length:var(--text-paragraph-mini-medium-font-size)]',
        'leading-[var(--text-paragraph-mini-medium-line-height)]',
        'tracking-[var(--text-paragraph-mini-medium-letter-spacing)]',
        'text-[color:var(--muted-foreground)]',
        '[[data-slot=progress]:has([data-slot=progress-label])_&]:order-0',
        '[[data-slot=progress]:has([data-slot=progress-label])_&]:ms-auto',
        '[[data-slot=progress]:has([data-slot=progress-label])_&]:basis-auto',
        className,
      )}
      data-slot="progress-value"
      {...props}
    />
  );
}

export {
  Progress,
  ProgressTrack,
  ProgressIndicator,
  ProgressLabel,
  ProgressValue,
  progressTrackVariants,
  progressIndicatorVariants,
};
export type { ProgressSize };
