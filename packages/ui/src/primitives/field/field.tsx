/**
 * Fabely Field primitive — form-field composition from Figma Field
 * (`842:49181` / Vertical `120:13754`, Horizontal `120:13775`) with the
 * shadcn Field API.
 *
 * Vendor file (`src/components/ui/field.tsx`) stays untouched. Control chrome
 * (Input, Select, …) stays on those primitives — Field owns layout, helper /
 * error type, and orientation. Caption type / color come from Label.
 */

'use client';

import { useMemo } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { CircleAlertIcon, InfoIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Label, labelTypeClassName } from '../label';
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
        /* Figma Horizontal Field — label column 120px, control flexes.
         * Radio/Checkbox beside multi-line content: Aligner `pt` = `--spacing-3xs`. */
        horizontal:
          'flex-row items-center has-[>[data-slot=field-content]]:items-start *:data-[slot=field-label]:w-[120px] *:data-[slot=field-label]:shrink-0 *:data-[slot=field-label]:grow-0 has-[[role=checkbox]]:*:data-[slot=field-label]:w-auto has-[[role=radio]]:*:data-[slot=field-label]:w-auto has-[[role=switch]]:*:data-[slot=field-label]:w-auto has-[[data-slot=switch]]:*:data-[slot=field-label]:w-auto has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio],[role=switch]]:mt-[length:var(--spacing-3xs)]',
        responsive:
          'flex-col *:w-full [&>.sr-only]:w-auto @md/field-group:flex-row @md/field-group:items-center @md/field-group:*:w-auto @md/field-group:has-[>[data-slot=field-content]]:items-start @md/field-group:*:data-[slot=field-label]:w-[120px] @md/field-group:*:data-[slot=field-label]:shrink-0 @md/field-group:*:data-[slot=field-label]:grow-0 @md/field-group:has-[[role=checkbox]]:*:data-[slot=field-label]:w-auto @md/field-group:has-[[role=radio]]:*:data-[slot=field-label]:w-auto @md/field-group:has-[[role=switch]]:*:data-[slot=field-label]:w-auto @md/field-group:has-[[data-slot=switch]]:*:data-[slot=field-label]:w-auto @md/field-group:has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio],[role=switch]]:mt-[length:var(--spacing-3xs)]',
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

type FieldLabelChoice = 'card' | 'icon' | 'block';

function FieldLabel({
  className,
  choice,
  ...props
}: React.ComponentProps<typeof Label> & {
  /**
   * Rich Radio Chip host when wrapping Field (`19:5987`).
   * Omit for plain labels. Default nested-Field chrome = Card.
   */
  choice?: FieldLabelChoice;
}) {
  return (
    <Label
      data-slot="field-label"
      data-choice={choice}
      className={cn(
        /* Type / color / invalid / disabled come from Label. */
        'group/field-label peer/field-label flex w-fit gap-[var(--spacing-xs)] select-none',
        /* —— Card (default when Field is nested) — Figma Size=Card ——
         * Unchecked: hairline + alpha-10. Checked: primary gradient border +
         * focus ring (Avatar / Button primaryOutline recipe). */
        'has-[>[data-slot=field]]:w-full has-[>[data-slot=field]]:flex-col',
        'has-[>[data-slot=field]]:rounded-[length:var(--rounded-lg)]',
        'has-[>[data-slot=field]]:border-[length:var(--stroke-hairline)]',
        'has-[>[data-slot=field]]:border-solid',
        'has-[>[data-slot=field]]:border-[color:var(--theme-alpha-black-switch-10)]',
        '*:data-[slot=field]:p-[var(--spacing-sm)]',
        'has-data-checked:border-[length:var(--stroke-thin)]',
        'has-data-checked:border-transparent',
        'has-data-checked:overflow-clip',
        'has-data-checked:[background:linear-gradient(var(--background),var(--background))_padding-box,var(--gradient-primary-top-bottom)_border-box]',
        'has-data-checked:shadow-[var(--effect-focus-ring-primary)]',
        /* —— Icon SM/LG — hug width; fixed 40px height; pad `--spacing-2-5`.
         * Unchecked fill/border must NOT stay on when checked. */
        'data-[choice=icon]:relative',
        'data-[choice=icon]:inline-flex',
        'data-[choice=icon]:w-fit',
        'data-[choice=icon]:max-w-fit',
        'data-[choice=icon]:shrink-0',
        'data-[choice=icon]:gap-0',
        'data-[choice=icon]:items-center',
        'data-[choice=icon]:h-[length:var(--spacing-3xl)]',
        'data-[choice=icon]:has-[>[data-slot=field]]:w-fit',
        'data-[choice=icon]:has-[>[data-slot=field]]:flex-row',
        'data-[choice=icon]:has-[>[data-slot=field]]:items-center',
        'data-[choice=icon]:has-[>[data-slot=field]]:border-[length:var(--stroke-thin)]',
        'data-[choice=icon]:not-has-data-checked:border-[color:var(--border)]',
        'data-[choice=icon]:not-has-data-checked:bg-[color:var(--background)]',
        'data-[choice=icon]:*:data-[slot=field]:h-full',
        'data-[choice=icon]:*:data-[slot=field]:w-fit',
        'data-[choice=icon]:*:data-[slot=field]:p-[var(--spacing-2-5)]',
        'data-[choice=icon]:has-data-checked:border-[length:var(--stroke-thin)]',
        'data-[choice=icon]:has-data-checked:border-transparent',
        'data-[choice=icon]:has-data-checked:overflow-clip',
        'data-[choice=icon]:has-data-checked:[background:linear-gradient(var(--background),var(--background))_padding-box,var(--gradient-primary-top-bottom)_border-box]',
        'data-[choice=icon]:has-data-checked:shadow-[var(--effect-focus-ring-primary)]',
        /* —— Block — Figma Icon=True, Size=LG, Orientation=Vertical —— */
        'data-[choice=block]:relative',
        'data-[choice=block]:gap-0',
        'data-[choice=block]:has-[>[data-slot=field]]:w-[110px]',
        'data-[choice=block]:has-[>[data-slot=field]]:border-[length:var(--stroke-thin)]',
        'data-[choice=block]:not-has-data-checked:border-[color:var(--theme-alpha-black-switch-10)]',
        'data-[choice=block]:not-has-data-checked:bg-[color:var(--tw-raw-black)]',
        'data-[choice=block]:*:data-[slot=field]:px-[var(--spacing-2-5)]',
        'data-[choice=block]:*:data-[slot=field]:pt-[var(--spacing-2xs)]',
        'data-[choice=block]:*:data-[slot=field]:pb-[var(--spacing-xs)]',
        'data-[choice=block]:has-data-checked:border-[length:var(--stroke-thin)]',
        'data-[choice=block]:has-data-checked:border-transparent',
        'data-[choice=block]:has-data-checked:overflow-clip',
        'data-[choice=block]:has-data-checked:[background:linear-gradient(var(--tw-raw-black),var(--tw-raw-black))_padding-box,var(--gradient-primary-top-bottom)_border-box]',
        'data-[choice=block]:has-data-checked:shadow-[var(--effect-focus-ring-primary)]',
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
        labelTypeClassName,
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
export type { FieldLabelChoice };
