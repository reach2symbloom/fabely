/**
 * Fabely Radio Group — Base UI radio restyled with Foundations tokens.
 *
 * Figma: Radio (`16:1796`) Checked? × State; Rich Radio Chip choice cards
 * (`19:5987`). Public API matches
 * [shadcn Radio Group](https://ui.shadcn.com/docs/components/base/radio-group).
 * Import from this primitive, not `src/components/ui/radio-group`.
 */

'use client';

import { Radio as RadioPrimitive } from '@base-ui/react/radio';
import { RadioGroup as RadioGroupPrimitive } from '@base-ui/react/radio-group';

import { cn } from '@/lib/utils';

function RadioGroup({ className, ...props }: RadioGroupPrimitive.Props) {
  return (
    <RadioGroupPrimitive
      data-slot="radio-group"
      className={cn('grid w-full gap-[var(--spacing-sm)]', className)}
      {...props}
    />
  );
}

function RadioGroupItem({ className, ...props }: RadioPrimitive.Root.Props) {
  return (
    <RadioPrimitive.Root
      data-slot="radio-group-item"
      className={cn(
        'group/radio-group-item peer relative flex aspect-square shrink-0 items-center justify-center',
        'size-[length:var(--spacing-md)]',
        'rounded-full',
        'border-[length:var(--stroke-thin)] border-[color:var(--input)]',
        'bg-[color:var(--background)]',
        'shadow-[var(--shadow-xs-black)]',
        'outline-none transition-[color,background-color,border-color,box-shadow,background-image]',
        'duration-[var(--duration-fast)]',
        /* Expanded hit target — same geometry as Checkbox / shadcn. */
        'after:absolute after:-inset-x-3 after:-inset-y-2',
        /* Figma Checked=True, State=Default — primary L→R gradient + neutrals-900 dot. */
        'data-checked:border-transparent',
        'data-checked:bg-[image:var(--gradient-primary-left-right)]',
        'data-checked:shadow-none',
        /* Focus — secondary ring unchecked; primary ring when checked. */
        'focus-visible:shadow-[var(--effect-focus-ring-secondary)]',
        'data-checked:focus-visible:shadow-[var(--effect-focus-ring-primary)]',
        /* Error — destructive fill + white dot when checked. */
        'aria-invalid:border-[color:var(--destructive)]',
        'aria-invalid:shadow-none',
        'aria-invalid:data-checked:border-[color:var(--destructive)]',
        'aria-invalid:data-checked:bg-none',
        'aria-invalid:data-checked:bg-[color:var(--destructive)]',
        'aria-invalid:focus-visible:shadow-[var(--effect-focus-ring-error)]',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'disabled:data-checked:opacity-30',
        'group-has-disabled/field:opacity-50',
        className,
      )}
      {...props}
    >
      <RadioPrimitive.Indicator
        data-slot="radio-group-indicator"
        className={cn(
          'flex size-full items-center justify-center',
          'transition-[transform,opacity] duration-[var(--duration-fast)]',
          'data-starting-style:scale-50 data-starting-style:opacity-0',
          'data-ending-style:scale-50 data-ending-style:opacity-0',
        )}
      >
        <span
          data-slot="radio-group-indicator-dot"
          className={cn(
            'size-[length:var(--spacing-xs)] rounded-full',
            /* Default checked dot — Figma #27272A (neutrals-900). */
            'bg-[color:var(--theme-neutrals-900)]',
            /* Error checked — Figma white (#F9F9F9). */
            'group-aria-invalid/radio-group-item:bg-[color:var(--tw-raw-white)]',
          )}
        />
      </RadioPrimitive.Indicator>
    </RadioPrimitive.Root>
  );
}

export { RadioGroup, RadioGroupItem };
