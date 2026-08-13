/**
 * Fabely Checkbox — Base UI checkbox restyled with Foundations tokens.
 *
 * Figma: Checkbox (Checked? False | True | Indeterminate × State). Public API
 * matches [shadcn Checkbox](https://ui.shadcn.com/docs/components/base/checkbox):
 * `checked` / `defaultChecked` / `onCheckedChange`, `indeterminate`, `disabled`,
 * `aria-invalid`. Import from this primitive, not `src/components/ui/checkbox`.
 */

'use client';

import { Checkbox as CheckboxPrimitive } from '@base-ui/react/checkbox';
import { CheckIcon, MinusIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

function Checkbox({ className, ...props }: CheckboxPrimitive.Root.Props) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        'peer relative flex size-[length:var(--spacing-md)] shrink-0 items-center justify-center',
        'rounded-[length:var(--rounded-sm)]',
        'border-[length:var(--stroke-thin)] border-[color:var(--theme-neutrals-600)]',
        'bg-[color:var(--background)] text-[color:var(--primary-foreground)]',
        'outline-none transition-[color,background-color,border-color,box-shadow]',
        /* Expanded hit target — same geometry as shadcn base-nova. */
        'after:absolute after:-inset-x-3 after:-inset-y-2',
        /* Checked / indeterminate — primary fill (shadcn), not flat white/black. */
        'data-checked:border-[color:var(--primary)] data-checked:bg-[color:var(--primary)]',
        'data-indeterminate:border-[color:var(--primary)] data-indeterminate:bg-[color:var(--primary)]',
        /* Focus — Figma spread-3 ring; primary control uses primary ring. */
        'focus-visible:shadow-[var(--effect-focus-ring-primary)]',
        /* Error — destructive border; filled destructive when checked. */
        'aria-invalid:border-[color:var(--destructive)]',
        'aria-invalid:data-checked:border-[color:var(--destructive)]',
        'aria-invalid:data-checked:bg-[color:var(--destructive)]',
        'aria-invalid:data-indeterminate:border-[color:var(--destructive)]',
        'aria-invalid:data-indeterminate:bg-[color:var(--destructive)]',
        'aria-invalid:focus-visible:shadow-[var(--effect-focus-ring-error)]',
        /* Disabled checked glyph muted (Figma alpha-60); field host can mute all. */
        'disabled:cursor-not-allowed',
        'disabled:data-checked:[&_svg]:opacity-60',
        'disabled:data-indeterminate:[&_svg]:opacity-60',
        'group-has-disabled/field:opacity-50',
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className={cn(
          'grid place-content-center text-current',
          /* Base UI enter/exit — scale pop on select / deselect. */
          'transition-[transform,opacity] duration-150',
          'data-starting-style:scale-50 data-starting-style:opacity-0',
          'data-ending-style:scale-50 data-ending-style:opacity-0',
          '[&>svg]:size-[length:var(--icon-xs)]',
          'data-indeterminate:[&_[data-slot=checkbox-check]]:hidden',
          'data-indeterminate:[&_[data-slot=checkbox-minus]]:block',
        )}
      >
        <CheckIcon data-slot="checkbox-check" aria-hidden="true" />
        <MinusIcon
          data-slot="checkbox-minus"
          aria-hidden="true"
          className="hidden"
        />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };
