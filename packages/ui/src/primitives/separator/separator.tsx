/**
 * Fabely Separator — Base UI separator from Figma Separator (Divider).
 *
 * Figma: Separator (Divider) — Spacing × Orientation × Size. Line fill
 * `--theme-alpha-black-switch-5`; Thin `--stroke-thin` / Thick `--stroke-thick`.
 * Public API matches [shadcn Separator](https://ui.shadcn.com/docs/components/base/separator)
 * plus Figma `size` and `spacing`. Import from this primitive, not
 * `src/components/ui/separator`.
 */

'use client';

import { Separator as SeparatorPrimitive } from '@base-ui/react/separator';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const separatorRootVariants = cva(
  [
    'flex shrink-0 items-center justify-center',
    /* Base UI sets data-orientation — not data-horizontal / data-vertical. */
  ],
  {
    variants: {
      orientation: {
        horizontal: 'w-full flex-col',
        vertical: 'self-stretch flex-row',
      },
      spacing: {
        none: '',
        /* Regular: ~4px (H) / ~2px (V) gutters around the line. */
        regular: [
          'data-[orientation=horizontal]:py-[length:var(--spacing-2xs)]',
          'data-[orientation=vertical]:px-[length:var(--spacing-3xs)]',
        ].join(' '),
        /* Spacious: fixed 16px track, line centered. */
        spacious: [
          'data-[orientation=horizontal]:h-[length:var(--spacing-md)]',
          'data-[orientation=vertical]:w-[length:var(--spacing-md)]',
        ].join(' '),
      },
    },
    defaultVariants: {
      orientation: 'horizontal',
      spacing: 'none',
    },
  },
);

const separatorLineVariants = cva(
  'bg-[color:var(--theme-alpha-black-switch-5)]',
  {
    variants: {
      orientation: {
        horizontal: 'w-full',
        vertical: 'h-full self-stretch',
      },
      size: {
        thin: '',
        thick: '',
      },
      spacing: {
        none: '',
        regular: '',
        spacious: '',
      },
    },
    compoundVariants: [
      {
        orientation: 'horizontal',
        size: 'thin',
        class: 'h-[length:var(--stroke-thin)]',
      },
      {
        orientation: 'horizontal',
        size: 'thick',
        class: 'h-[length:var(--stroke-thick)]',
      },
      {
        orientation: 'vertical',
        size: 'thin',
        class: 'w-[length:var(--stroke-thin)]',
      },
      {
        orientation: 'vertical',
        size: 'thick',
        class: 'w-[length:var(--stroke-thick)]',
      },
      /* Spacing=none: root is the line — paint on root, no inner span needed.
       * Handled in the component by collapsing to a single painted node. */
    ],
    defaultVariants: {
      orientation: 'horizontal',
      size: 'thin',
      spacing: 'none',
    },
  },
);

type SeparatorProps = SeparatorPrimitive.Props &
  VariantProps<typeof separatorRootVariants> &
  VariantProps<typeof separatorLineVariants> & {
    size?: 'thin' | 'thick';
    spacing?: 'none' | 'regular' | 'spacious';
  };

function Separator({
  className,
  orientation = 'horizontal',
  size = 'thin',
  spacing = 'none',
  ...props
}: SeparatorProps) {
  const isNone = spacing === 'none';

  return (
    <SeparatorPrimitive
      data-slot="separator"
      data-orientation={orientation}
      data-size={size}
      data-spacing={spacing}
      orientation={orientation}
      className={cn(
        isNone
          ? cn(
              'shrink-0',
              'bg-[color:var(--theme-alpha-black-switch-5)]',
              orientation === 'horizontal' && 'w-full',
              orientation === 'vertical' && 'self-stretch',
              orientation === 'horizontal' &&
                size === 'thin' &&
                'h-[length:var(--stroke-thin)]',
              orientation === 'horizontal' &&
                size === 'thick' &&
                'h-[length:var(--stroke-thick)]',
              orientation === 'vertical' &&
                size === 'thin' &&
                'w-[length:var(--stroke-thin)]',
              orientation === 'vertical' &&
                size === 'thick' &&
                'w-[length:var(--stroke-thick)]',
            )
          : separatorRootVariants({ orientation, spacing }),
        className,
      )}
      {...props}
    >
      {isNone ? null : (
        <span
          aria-hidden
          data-slot="separator-line"
          className={separatorLineVariants({ orientation, size, spacing })}
        />
      )}
    </SeparatorPrimitive>
  );
}

export { Separator, type SeparatorProps };
