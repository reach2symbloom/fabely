/**
 * Fabely Radio Group — Base UI radio restyled with Foundations tokens.
 *
 * Figma: Radio / Radio Group (Checked? × State), twin to Checkbox so hosts can
 * swap control types. Public API matches
 * [shadcn Radio Group](https://ui.shadcn.com/docs/components/base/radio-group)
 * (Base UI Radio Group + Radio). Import from this primitive, not
 * `src/components/ui/radio-group`.
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
        'bg-[color:var(--background)] text-[color:var(--primary-foreground)]',
        'outline-none transition-[color,background-color,border-color,box-shadow]',
        'duration-[var(--duration-fast)]',
        /* Expanded hit target — same geometry as Checkbox / shadcn. */
        'after:absolute after:-inset-x-3 after:-inset-y-2',
        'data-checked:border-[color:var(--primary)] data-checked:bg-[color:var(--primary)]',
        'focus-visible:shadow-[var(--effect-focus-ring-primary)]',
        'aria-invalid:border-[color:var(--destructive)]',
        'aria-invalid:data-checked:border-[color:var(--destructive)]',
        'aria-invalid:data-checked:bg-[color:var(--destructive)]',
        'aria-invalid:focus-visible:shadow-[var(--effect-focus-ring-error)]',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'disabled:data-checked:[&_[data-slot=radio-group-indicator-dot]]:opacity-60',
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
          className="size-[length:var(--spacing-xs)] rounded-full bg-[color:var(--primary-foreground)]"
        />
      </RadioPrimitive.Indicator>
    </RadioPrimitive.Root>
  );
}

export { RadioGroup, RadioGroupItem };
