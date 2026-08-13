/**
 * Fabely Label primitive — form caption from Figma Label (OC) (`842:49170`,
 * set `103:9453`) with the shadcn Label API (`htmlFor`, native `<label>`).
 *
 * Vendor file (`src/components/ui/label.tsx`) stays untouched.
 *
 * Figma axes → props:
 * - Layout Inline | Block → `layout`
 * - State Default | Error → `state`
 * - Show required → `required` (decorative `*`, not the HTML attribute)
 *
 * Type is Paragraph Small Medium. Default color `--foreground`; error
 * `--destructive`. Field hosts also pick up `group-data-[invalid]/field`.
 */

'use client';

import type { ComponentProps } from 'react';

import { Label as LabelPrimitive } from '@/components/ui/label';
import { cn } from '@/lib/utils';

export type LabelLayout = 'inline' | 'block';
export type LabelState = 'default' | 'error';

/** Paragraph Small Medium + Field invalid / disabled tone. Shared with FieldTitle. */
export const labelTypeClassName = [
  'font-[family-name:var(--text-paragraph-small-medium-font-family)]',
  '[font-weight:var(--text-paragraph-small-medium-font-weight)]',
  'text-[length:var(--text-paragraph-small-medium-font-size)]',
  'leading-[var(--text-paragraph-small-medium-line-height)]',
  'tracking-[var(--text-paragraph-small-medium-letter-spacing)]',
  'text-[color:var(--foreground)]',
  'group-data-[invalid=true]/field:text-destructive',
  'group-data-[disabled=true]/field:pointer-events-none',
  'group-data-[disabled=true]/field:opacity-50',
].join(' ');

type LabelProps = Omit<ComponentProps<typeof LabelPrimitive>, 'required'> & {
  /** Figma Layout. Inline hugs; Block fills the parent row. */
  layout?: LabelLayout;
  /** Figma State. Field invalid also tints via `group-data-[invalid]/field`. */
  state?: LabelState;
  /**
   * Figma Show required — trailing decorative `*`. Not `aria-required`;
   * set that on the control.
   */
  required?: boolean;
};

function Label({
  className,
  layout = 'inline',
  state = 'default',
  required = false,
  children,
  ...props
}: LabelProps) {
  return (
    <LabelPrimitive
      data-slot="label"
      data-layout={layout}
      data-state={state}
      data-required={required || undefined}
      className={cn(
        layout === 'block' ? 'flex w-full' : 'inline-flex w-fit',
        'items-center gap-[var(--spacing-3xs)] select-none',
        labelTypeClassName,
        'data-[state=error]:text-destructive',
        'group-data-[disabled=true]:pointer-events-none',
        'group-data-[disabled=true]:opacity-50',
        'peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
        className,
      )}
      {...props}
    >
      {children}
      {required ? <span aria-hidden="true">*</span> : null}
    </LabelPrimitive>
  );
}

export { Label };
export type { LabelProps };
