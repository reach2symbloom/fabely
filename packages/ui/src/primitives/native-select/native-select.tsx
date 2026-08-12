/**
 * Fabely Native Select — styled native `<select>` for OS pickers / simple forms.
 *
 * Public API matches [shadcn Native Select]
 * (https://ui.shadcn.com/docs/components/base/native-select). Prefer
 * [Select](../select) when you need a designed popup; use this for native
 * browser behavior, mobile system menus, or lightweight settings-style fields.
 *
 * Chrome aligns with [Input](../input) Foundations tokens. Vendor
 * (`src/components/ui/native-select.tsx`) stays untouched.
 */

import * as React from 'react';
import { ChevronDownIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

type NativeSelectProps = Omit<React.ComponentProps<'select'>, 'size'> & {
  size?: 'sm' | 'default';
};

function NativeSelect({
  className,
  size = 'default',
  ...props
}: NativeSelectProps) {
  return (
    <div
      className={cn(
        'group/native-select relative w-fit has-[select:disabled]:opacity-50',
        className
      )}
      data-slot="native-select-wrapper"
      data-size={size}
    >
      <select
        data-slot="native-select"
        data-size={size}
        className={cn(
          'w-full min-w-0 appearance-none outline-none select-none',
          'border-[length:var(--stroke-thin)] border-transparent',
          'rounded-[length:var(--rounded-lg)]',
          'bg-[color:var(--theme-alpha-black-switch-333)]',
          'font-[family-name:var(--font-family-body)]',
          '[font-weight:var(--text-paragraph-small-regular-font-weight)]',
          'text-[length:var(--text-paragraph-small-regular-font-size)]',
          'leading-[var(--text-paragraph-small-regular-line-height)]',
          'text-[color:var(--foreground)]',
          'py-[var(--spacing-2xs)] pl-[var(--spacing-md)] pr-[var(--spacing-3xl)]',
          'transition-[color,background-color,border-color,box-shadow,opacity]',
          'focus-visible:shadow-[var(--effect-focus-ring-secondary)]',
          'disabled:pointer-events-none disabled:cursor-not-allowed',
          'aria-invalid:border-[color:var(--destructive)]',
          'aria-invalid:bg-[color:var(--background)]',
          'aria-invalid:focus-visible:shadow-[var(--effect-focus-ring-error)]',
          'data-[size=default]:h-[length:var(--spacing-3xl)]',
          'data-[size=default]:min-h-[length:var(--spacing-9)]',
          'data-[size=sm]:h-[length:var(--spacing-2xl)]',
          'data-[size=sm]:min-h-[length:var(--spacing-2xl)]',
          'data-[size=sm]:rounded-[length:var(--rounded-md)]',
          'data-[size=sm]:pl-[var(--spacing-xs)]',
          'data-[size=sm]:text-[length:var(--text-paragraph-mini-regular-font-size)]',
          'data-[size=sm]:leading-[var(--text-paragraph-mini-regular-line-height)]',
        )}
        {...props}
      />
      <ChevronDownIcon
        aria-hidden="true"
        data-slot="native-select-icon"
        className={cn(
          'pointer-events-none absolute top-1/2 right-[var(--spacing-xs)] -translate-y-1/2 select-none',
          'size-[length:var(--icon-sm)]',
          'text-[color:var(--muted-foreground)]',
          'group-data-[size=sm]/native-select:right-[var(--spacing-2xs)]',
        )}
      />
    </div>
  );
}

function NativeSelectOption({
  className,
  ...props
}: React.ComponentProps<'option'>) {
  return (
    <option
      data-slot="native-select-option"
      className={cn('bg-[Canvas] text-[CanvasText]', className)}
      {...props}
    />
  );
}

function NativeSelectOptGroup({
  className,
  ...props
}: React.ComponentProps<'optgroup'>) {
  return (
    <optgroup
      data-slot="native-select-optgroup"
      className={cn('bg-[Canvas] text-[CanvasText]', className)}
      {...props}
    />
  );
}

export {
  NativeSelect,
  NativeSelectOptGroup,
  NativeSelectOption,
  type NativeSelectProps,
};
