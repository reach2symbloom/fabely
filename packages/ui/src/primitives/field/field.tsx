/**
 * Fabely Field primitive — form-field composition from Figma Field
 * (`842:49181` / Vertical `120:13754`, Horizontal `120:13775`) with the
 * shadcn Field API.
 *
 * Vendor file (`src/components/ui/field.tsx`) stays untouched. Control chrome
 * (Input, Select, …) stays on those primitives — Field owns layout, label /
 * helper / error type, and orientation.
 */

'use client';

import { useMemo } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { CircleAlertIcon, InfoIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Label } from '../label';
import { Separator } from '../separator';

function FieldSet({ className, ...props }: React.ComponentProps<'fieldset'>) {
  return (
    <fieldset
      data-slot="field-set"
      className={cn(
        'flex flex-col gap-[var(--spacing-xl)]',
        'has-[>[data-slot=checkbox-group]]:gap-[var(--spacing-sm)]',
        'has-[>[data-slot=radio-group]]:gap-[var(--spacing-sm)]',
        className,
      )}
      {...props}
    />
  );
}

function FieldLegend({
  className,
  variant = 'legend',
  ...props
}: React.ComponentProps<'legend'> & { variant?: 'legend' | 'label' }) {
  return (
    <legend
      data-slot="field-legend"
      data-variant={variant}
      className={cn(
        'mb-[var(--spacing-sm)]',
        'font-[family-name:var(--font-family-body)]',
        'data-[variant=legend]:text-[length:var(--text-paragraph-regular-medium-font-size)]',
        'data-[variant=legend]:leading-[var(--text-paragraph-regular-medium-line-height)]',
        'data-[variant=legend]:tracking-[var(--text-paragraph-regular-medium-letter-spacing)]',
        'data-[variant=legend]:[font-weight:var(--text-paragraph-regular-medium-font-weight)]',
        'data-[variant=label]:text-[length:var(--text-paragraph-small-medium-font-size)]',
        'data-[variant=label]:leading-[var(--text-paragraph-small-medium-line-height)]',
        'data-[variant=label]:tracking-[var(--text-paragraph-small-medium-letter-spacing)]',
        'data-[variant=label]:[font-weight:var(--text-paragraph-small-medium-font-weight)]',
        'text-[color:var(--foreground)]',
        className,
      )}
      {...props}
    />
  );
}

function FieldGroup({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="field-group"
      className={cn(
        'group/field-group @container/field-group flex w-full flex-col',
        'gap-[var(--spacing-xl)]',
        'data-[slot=checkbox-group]:gap-[var(--spacing-sm)]',
        '*:data-[slot=field-group]:gap-[var(--spacing-md)]',
        className,
      )}
      {...props}
    />
  );
}

const fieldVariants = cva(
  [
    'group/field flex w-full',
    /* Label ↔ control ↔ helper: 2xs (4) + 2px → `--spacing-1-5` (6). */
    'gap-[var(--spacing-1-5)]',
    /* Checkbox / radio + label rows need more air than stacked Text Value. */
    'has-[[role=checkbox]]:gap-[var(--spacing-sm)]',
    'has-[[role=radio]]:gap-[var(--spacing-sm)]',
    /* Invalid colors label + FieldError only — not Description (Figma). */
  ].join(' '),
  {
    variants: {
      orientation: {
        vertical: 'flex-col *:w-full [&>.sr-only]:w-auto',
        /* Figma Horizontal Field — label column 120px, control flexes. */
        horizontal:
          'flex-row items-center has-[>[data-slot=field-content]]:items-start *:data-[slot=field-label]:w-[120px] *:data-[slot=field-label]:shrink-0 *:data-[slot=field-label]:grow-0 has-[[role=checkbox]]:*:data-[slot=field-label]:w-auto has-[[role=radio]]:*:data-[slot=field-label]:w-auto has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px',
        responsive:
          'flex-col *:w-full [&>.sr-only]:w-auto @md/field-group:flex-row @md/field-group:items-center @md/field-group:*:w-auto @md/field-group:has-[>[data-slot=field-content]]:items-start @md/field-group:*:data-[slot=field-label]:w-[120px] @md/field-group:*:data-[slot=field-label]:shrink-0 @md/field-group:*:data-[slot=field-label]:grow-0 @md/field-group:has-[[role=checkbox]]:*:data-[slot=field-label]:w-auto @md/field-group:has-[[role=radio]]:*:data-[slot=field-label]:w-auto @md/field-group:has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px',
      },
    },
    defaultVariants: {
      orientation: 'vertical',
    },
  },
);

function Field({
  className,
  orientation = 'vertical',
  ...props
}: React.ComponentProps<'div'> & VariantProps<typeof fieldVariants>) {
  return (
    <div
      role="group"
      data-slot="field"
      data-orientation={orientation}
      className={cn(fieldVariants({ orientation }), className)}
      {...props}
    />
  );
}

function FieldContent({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="field-content"
      className={cn(
        'group/field-content flex flex-1 flex-col gap-[var(--spacing-1-5)]',
        className,
      )}
      {...props}
    />
  );
}

function FieldLabel({
  className,
  ...props
}: React.ComponentProps<typeof Label>) {
  return (
    <Label
      data-slot="field-label"
      className={cn(
        'group/field-label peer/field-label flex w-fit gap-[var(--spacing-xs)] select-none',
        'font-[family-name:var(--text-paragraph-small-medium-font-family)]',
        '[font-weight:var(--text-paragraph-small-medium-font-weight)]',
        'text-[length:var(--text-paragraph-small-medium-font-size)]',
        'leading-[var(--text-paragraph-small-medium-line-height)]',
        'tracking-[var(--text-paragraph-small-medium-letter-spacing)]',
        'text-[color:var(--foreground)]',
        'group-data-[disabled=true]/field:opacity-50',
        'group-data-[invalid=true]/field:text-destructive',
        /* Choice-card host (Field nested inside Label). */
        'has-data-checked:bg-[color:var(--accent)]',
        'has-[>[data-slot=field]]:w-full has-[>[data-slot=field]]:flex-col',
        'has-[>[data-slot=field]]:rounded-[length:var(--radius)]',
        'has-[>[data-slot=field]]:border has-[>[data-slot=field]]:border-[color:var(--border)]',
        '*:data-[slot=field]:p-[var(--spacing-md)]',
        className,
      )}
      {...props}
    />
  );
}

function FieldTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="field-label"
      className={cn(
        'flex w-fit items-center gap-[var(--spacing-xs)]',
        'font-[family-name:var(--text-paragraph-small-medium-font-family)]',
        '[font-weight:var(--text-paragraph-small-medium-font-weight)]',
        'text-[length:var(--text-paragraph-small-medium-font-size)]',
        'leading-[var(--text-paragraph-small-medium-line-height)]',
        'tracking-[var(--text-paragraph-small-medium-letter-spacing)]',
        'text-[color:var(--foreground)]',
        'group-data-[disabled=true]/field:opacity-50',
        'group-data-[invalid=true]/field:text-destructive',
        className,
      )}
      {...props}
    />
  );
}

function FieldDescription({
  className,
  children,
  ...props
}: React.ComponentProps<'p'>) {
  return (
    <p
      data-slot="field-description"
      className={cn(
        /* Figma Inline message — info icon + Paragraph Small Regular. */
        'flex items-center gap-[var(--spacing-xs)] text-start text-balance',
        'font-[family-name:var(--text-paragraph-small-regular-font-family)]',
        '[font-weight:var(--text-paragraph-small-regular-font-weight)]',
        'text-[length:var(--text-paragraph-small-regular-font-size)]',
        'leading-[var(--text-paragraph-small-regular-line-height)]',
        'tracking-[var(--text-paragraph-small-regular-letter-spacing)]',
        'text-[color:var(--muted-foreground)]',
        '[[data-variant=legend]+&]:-mt-[var(--spacing-2xs)]',
        '[&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-primary',
        '[&_svg]:pointer-events-none [&_svg]:shrink-0',
        "[&_svg:not([class*='size-'])]:size-[length:var(--icon-sm)]",
        className,
      )}
      {...props}
    >
      <InfoIcon aria-hidden="true" />
      <span className="min-w-0 flex-1">{children}</span>
    </p>
  );
}

function FieldSeparator({
  children,
  className,
  ...props
}: React.ComponentProps<'div'> & {
  children?: React.ReactNode;
}) {
  return (
    <div
      data-slot="field-separator"
      data-content={!!children}
      className={cn(
        'relative -my-[var(--spacing-xs)] h-5',
        'text-[length:var(--text-paragraph-small-regular-font-size)]',
        className,
      )}
      {...props}
    >
      <Separator className="absolute inset-0 top-1/2" />
      {children ? (
        <span
          className="relative mx-auto block w-fit bg-background px-[var(--spacing-xs)] text-[color:var(--muted-foreground)]"
          data-slot="field-separator-content"
        >
          {children}
        </span>
      ) : null}
    </div>
  );
}

function FieldError({
  className,
  children,
  errors,
  ...props
}: React.ComponentProps<'div'> & {
  errors?: Array<{ message?: string } | undefined>;
}) {
  const content = useMemo(() => {
    if (children) {
      return children;
    }

    if (!errors?.length) {
      return null;
    }

    const uniqueErrors = [
      ...new Map(errors.map((error) => [error?.message, error])).values(),
    ];

    if (uniqueErrors.length === 1) {
      return uniqueErrors[0]?.message;
    }

    return (
      <ul className="ms-[var(--spacing-md)] flex list-disc flex-col gap-[var(--spacing-2xs)]">
        {uniqueErrors.map(
          (error, index) =>
            error?.message ? <li key={index}>{error.message}</li> : null,
        )}
      </ul>
    );
  }, [children, errors]);

  if (!content) {
    return null;
  }

  return (
    <div
      role="alert"
      data-slot="field-error"
      className={cn(
        /* Figma Inline message (Error) — circle-alert + destructive. */
        'flex items-center gap-[var(--spacing-xs)]',
        'font-[family-name:var(--text-paragraph-small-regular-font-family)]',
        '[font-weight:var(--text-paragraph-small-regular-font-weight)]',
        'text-[length:var(--text-paragraph-small-regular-font-size)]',
        'leading-[var(--text-paragraph-small-regular-line-height)]',
        'tracking-[var(--text-paragraph-small-regular-letter-spacing)]',
        'text-destructive',
        '[&_svg]:pointer-events-none [&_svg]:shrink-0',
        "[&_svg:not([class*='size-'])]:size-[length:var(--icon-sm)]",
        className,
      )}
      {...props}
    >
      <CircleAlertIcon aria-hidden="true" />
      <span className="min-w-0 flex-1">{content}</span>
    </div>
  );
}

export {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldContent,
  FieldTitle,
  fieldVariants,
};
