/**
 * Fabely Textarea primitive — multi-line field from Figma Textarea
 * (`16:1745`) with the shadcn Textarea API.
 *
 * Vendor file (`src/components/ui/textarea.tsx`) stays untouched.
 *
 * Figma axes → props:
 * - Roundness Default | Round → `roundness`
 * - Style Default | Ghost | Quiet → `variant` (parity with Input)
 * - Type Body | Heading → `textStyle` (Heading 2 for inline titles)
 * - State Empty | Placeholder | Value | Focus | Error | Error Focus | Disabled
 *   → native value / placeholder / focus-visible / aria-invalid / disabled
 * - Show resizable → `resizable` (native CSS resize; no custom grip glyph)
 * - Show character count → `showCharacterCount` (needs `maxLength`)
 *
 * Focus border uses the Primary outline mask-composite ring (same recipe as
 * Button `primaryOutline` / `GRADIENT_BORDER`) on a shell — not a dual-layer
 * background on the `<textarea>`. Textareas can't host `::before`.
 *
 * Inside Input Group the shell uses `display: contents` so the control stays a
 * direct flex child (group `h-full` / bare chrome keep working).
 */

'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';
import { selectAllOnModA } from '@/lib/select-all-on-mod-a';

/**
 * Shell owns the Primary gradient focus ring (`::before` mask-composite) and,
 * when resizable, right/bottom inset so the native grip clears the border.
 * Fill lives on both shell (inset gap) and textarea (face).
 */
const textareaShellVariants = cva(
  [
    'relative w-full min-w-0',
    'border-[length:var(--stroke-thin)] border-solid border-transparent',
    /* Ring only while focused — keep `before` out of the tree otherwise so a
     * failed mask can't paint over the field. Default variant shows it. */
    "before:pointer-events-none before:absolute before:z-10 before:hidden before:rounded-[inherit] before:content-['']",
    'before:inset-[calc(var(--stroke-thin)*-1)]',
    'before:border-[length:var(--stroke-thin)] before:border-solid before:border-transparent',
    'before:[background:var(--gradient-primary-top-bottom)_border-box]',
    'before:[mask:linear-gradient(#000_0_0)_padding-box_exclude,linear-gradient(#000_0_0)]',
    'before:[-webkit-mask:linear-gradient(#000_0_0)_padding-box,linear-gradient(#000_0_0)]',
    'before:[-webkit-mask-composite:xor]',
    'has-[[aria-invalid=true]]:border-[color:var(--destructive)]',
    'has-[[aria-invalid=true]]:bg-[color:var(--background)]',
    'has-[[aria-invalid=true]:focus-visible]:shadow-[var(--effect-focus-ring-error)]',
    'has-[:disabled]:border-[color:var(--input)]',
    'has-[:disabled]:bg-[color:var(--background)]',
    'has-[:disabled]:opacity-30',
    'has-[:disabled]:shadow-[var(--shadow-xs-black)]',
    'group-has-disabled/field:opacity-30',
    'in-data-[slot=input-group]:contents',
  ].join(' '),
  {
    variants: {
      variant: {
        default: [
          'bg-[color:var(--theme-alpha-black-switch-333)]',
          'has-[:focus-visible:not([aria-invalid=true])]:before:block',
          'has-[:focus-visible:not([aria-invalid=true])]:shadow-[var(--effect-focus-ring-secondary)]',
        ].join(' '),
        ghost: [
          'bg-transparent',
          'has-[:focus-visible:not([aria-invalid=true])]:bg-[color:var(--theme-alpha-black-switch-333)]',
          'has-[:focus-visible:not([aria-invalid=true])]:border-[color:var(--theme-alpha-black-switch-333)]',
          'has-[:focus-visible:not([aria-invalid=true])]:shadow-[var(--effect-focus-ring-secondary)]',
        ].join(' '),
        quiet: [
          'bg-transparent',
          'hover:bg-[color:var(--theme-alpha-black-switch-333)]',
          'has-[:focus-visible:not([aria-invalid=true])]:border-[color:var(--border)]',
          'has-[:focus-visible:not([aria-invalid=true])]:shadow-none',
          'has-[:disabled]:hover:bg-[color:var(--background)]',
        ].join(' '),
      },
      roundness: {
        default: 'rounded-[length:var(--rounded-lg)]',
        round: 'rounded-[length:var(--radius)]',
      },
      resizable: {
        true: '',
        false: '',
      },
    },
    compoundVariants: [
      {
        resizable: true,
        roundness: 'default',
        class: 'pr-[var(--spacing-1-25)] pb-[var(--spacing-1-25)]',
      },
      {
        resizable: true,
        roundness: 'round',
        class: 'pr-[var(--spacing-1-75)] pb-[var(--spacing-1-75)]',
      },
    ],
    defaultVariants: {
      variant: 'default',
      roundness: 'default',
      resizable: true,
    },
  },
);

const textareaVariants = cva(
  [
    'relative z-0 flex w-full min-w-0 field-sizing-content border-0',
    'outline-none transition-[color,background-color,opacity]',
    'whitespace-pre-wrap break-words',
    'placeholder:text-[color:var(--muted-foreground)]',
    'disabled:pointer-events-none disabled:cursor-not-allowed',
    'disabled:bg-[color:var(--background)]',
    'aria-invalid:bg-[color:var(--background)]',
  ].join(' '),
  {
    variants: {
      variant: {
        default: 'bg-[color:var(--theme-alpha-black-switch-333)]',
        ghost: 'bg-transparent',
        quiet: 'bg-transparent',
      },
      textStyle: {
        body: [
          'font-[family-name:var(--font-family-body)]',
          '[font-weight:var(--text-paragraph-small-regular-font-weight)]',
          'text-[length:var(--text-paragraph-small-regular-font-size)]',
          'leading-[var(--text-paragraph-small-regular-line-height)]',
          'tracking-[var(--text-paragraph-small-regular-letter-spacing)]',
          'text-[color:var(--foreground)]',
          /* ~3 lines + Default pad — Figma frame ~76; empty fields stay visible. */
          'min-h-[calc(var(--spacing-xs)*2+var(--text-paragraph-small-regular-line-height)*3)]',
        ].join(' '),
        heading: [
          'font-[family-name:var(--text-heading-2-font-family)]',
          '[font-weight:var(--text-heading-2-font-weight)]',
          'text-[length:var(--text-heading-2-font-size)]',
          'leading-[var(--text-heading-2-line-height)]',
          'tracking-[var(--text-heading-2-letter-spacing)]',
          'text-[color:var(--text)]',
          'min-h-[length:var(--text-heading-2-line-height)]',
          /* Grow with wrap — don't become a scrollport (overflow-x-hidden
           * would compute overflow-y to auto). */
          'overflow-hidden',
        ].join(' '),
      },
      roundness: {
        default: [
          'rounded-[length:var(--rounded-lg)]',
          'px-[var(--spacing-xs)]',
          'py-[var(--spacing-xs)]',
        ].join(' '),
        round: [
          'rounded-[length:var(--radius)]',
          'px-[var(--spacing-sm)]',
          'py-[var(--spacing-sm)]',
        ].join(' '),
      },
      resizable: {
        true: 'resize-y [&::-webkit-resizer]:opacity-30',
        false: 'resize-none overflow-x-hidden',
      },
    },
    compoundVariants: [
      {
        textStyle: 'body',
        roundness: 'round',
        class:
          'min-h-[calc(var(--spacing-sm)*2+var(--text-paragraph-small-regular-line-height)*3)]',
      },
      {
        textStyle: 'heading',
        variant: 'quiet',
        class: 'block h-auto overflow-hidden px-0 py-0',
      },
      {
        textStyle: 'heading',
        variant: 'ghost',
        class: 'block h-auto overflow-hidden px-0 py-0',
      },
    ],
    defaultVariants: {
      variant: 'default',
      textStyle: 'body',
      roundness: 'default',
      resizable: true,
    },
  },
);

type TextareaProps = React.ComponentProps<'textarea'> &
  VariantProps<typeof textareaVariants> & {
    /**
     * Figma “Show character count”. Renders `{length}/{maxLength}` inside the
     * field; requires `maxLength`.
     */
    showCharacterCount?: boolean;
  };

function Textarea({
  className,
  variant = 'default',
  textStyle = 'body',
  roundness = 'default',
  resizable = true,
  showCharacterCount = false,
  maxLength,
  value,
  defaultValue,
  onChange,
  disabled,
  onKeyDownCapture,
  rows,
  ...props
}: TextareaProps) {
  const isControlled = value !== undefined;
  const [uncontrolled, setUncontrolled] = React.useState(
    () => String(defaultValue ?? ''),
  );
  const currentLength = (
    isControlled ? String(value ?? '') : uncontrolled
  ).length;
  const showCount =
    showCharacterCount && typeof maxLength === 'number' && maxLength > 0;

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!isControlled) {
      setUncontrolled(event.target.value);
    }
    onChange?.(event);
  };

  return (
    <div
      data-slot="textarea-control"
      data-variant={variant}
      data-text-style={textStyle}
      data-roundness={roundness}
      className={textareaShellVariants({ variant, roundness, resizable })}
    >
      <textarea
        data-slot="textarea"
        data-variant={variant}
        data-text-style={textStyle}
        data-roundness={roundness}
        data-resizable={resizable ? 'true' : 'false'}
        disabled={disabled}
        maxLength={maxLength}
        value={value}
        defaultValue={defaultValue}
        rows={rows ?? (textStyle === 'heading' ? 1 : undefined)}
        onChange={handleChange}
        onKeyDownCapture={(event) => {
          selectAllOnModA(event);
          onKeyDownCapture?.(event);
        }}
        className={cn(
          textareaVariants({ variant, textStyle, roundness, resizable }),
          'select-text',
          showCount &&
            (roundness === 'round'
              ? 'pb-[var(--spacing-xl)]'
              : 'pb-[var(--spacing-lg)]'),
          className,
        )}
        {...props}
      />
      {showCount ? (
        <span
          data-slot="textarea-character-count"
          aria-live="polite"
          className={cn(
            'pointer-events-none absolute z-20',
            'font-[family-name:var(--font-family-body)]',
            '[font-weight:var(--text-paragraph-mini-regular-font-weight)]',
            'text-[length:var(--text-paragraph-mini-regular-font-size)]',
            'leading-[var(--text-paragraph-mini-regular-line-height)]',
            'tracking-[var(--text-paragraph-mini-regular-letter-spacing)]',
            'text-[color:var(--muted-foreground)]',
            'tabular-nums',
            roundness === 'round'
              ? 'right-[var(--spacing-sm)] bottom-[var(--spacing-sm)]'
              : 'right-[var(--spacing-xs)] bottom-[var(--spacing-xs)]',
            disabled && 'opacity-30',
            'in-data-[slot=input-group]:hidden',
          )}
        >
          {currentLength}/{maxLength}
        </span>
      ) : null}
    </div>
  );
}

export { Textarea, textareaVariants, textareaShellVariants };
export type { TextareaProps };
export type TextareaVariant = NonNullable<
  VariantProps<typeof textareaVariants>['variant']
>;
export type TextareaTextStyle = NonNullable<
  VariantProps<typeof textareaVariants>['textStyle']
>;
