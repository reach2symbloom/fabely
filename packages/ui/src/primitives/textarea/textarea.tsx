/**
 * Fabely Textarea primitive — multi-line field from Figma Textarea
 * (`16:1745`) with the shadcn Textarea API.
 *
 * Vendor file (`src/components/ui/textarea.tsx`) stays untouched.
 *
 * Figma axes → props:
 * - Roundness Default | Round → `roundness`
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
    'relative w-full',
    'border-[length:var(--stroke-thin)] border-solid border-transparent',
    'bg-[color:var(--theme-alpha-black-switch-333)]',
    /* Ring only while focused — keep `before` out of the tree otherwise so a
     * failed mask can't paint over the field. */
    "before:pointer-events-none before:absolute before:z-10 before:hidden before:rounded-[inherit] before:content-['']",
    'before:inset-[calc(var(--stroke-thin)*-1)]',
    'before:border-[length:var(--stroke-thin)] before:border-solid before:border-transparent',
    'before:[background:var(--gradient-primary-top-bottom)_border-box]',
    'before:[mask:linear-gradient(#000_0_0)_padding-box_exclude,linear-gradient(#000_0_0)]',
    'before:[-webkit-mask:linear-gradient(#000_0_0)_padding-box,linear-gradient(#000_0_0)]',
    'before:[-webkit-mask-composite:xor]',
    'has-[:focus-visible:not([aria-invalid=true])]:before:block',
    'has-[:focus-visible:not([aria-invalid=true])]:shadow-[var(--effect-focus-ring-secondary)]',
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
      roundness: 'default',
      resizable: true,
    },
  },
);

const textareaVariants = cva(
  [
    'relative z-0 flex w-full field-sizing-content border-0',
    'bg-[color:var(--theme-alpha-black-switch-333)]',
    /* ~3 lines + Default pad — Figma frame ~76; empty fields stay visible. */
    'min-h-[calc(var(--spacing-xs)*2+var(--text-paragraph-small-regular-line-height)*3)]',
    'outline-none transition-[color,background-color,opacity]',
    'font-[family-name:var(--font-family-body)]',
    '[font-weight:var(--text-paragraph-small-regular-font-weight)]',
    'text-[length:var(--text-paragraph-small-regular-font-size)]',
    'leading-[var(--text-paragraph-small-regular-line-height)]',
    'tracking-[var(--text-paragraph-small-regular-letter-spacing)]',
    'text-[color:var(--foreground)]',
    'placeholder:text-[color:var(--muted-foreground)]',
    'disabled:pointer-events-none disabled:cursor-not-allowed',
    'disabled:bg-[color:var(--background)]',
    'aria-invalid:bg-[color:var(--background)]',
  ].join(' '),
  {
    variants: {
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
          'min-h-[calc(var(--spacing-sm)*2+var(--text-paragraph-small-regular-line-height)*3)]',
        ].join(' '),
      },
      resizable: {
        true: 'resize-y',
        false: 'resize-none',
      },
    },
    defaultVariants: {
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
  roundness = 'default',
  resizable = true,
  showCharacterCount = false,
  maxLength,
  value,
  defaultValue,
  onChange,
  disabled,
  onKeyDownCapture,
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
      data-roundness={roundness}
      className={textareaShellVariants({ roundness, resizable })}
    >
      <textarea
        data-slot="textarea"
        data-roundness={roundness}
        data-resizable={resizable ? 'true' : 'false'}
        disabled={disabled}
        maxLength={maxLength}
        value={value}
        defaultValue={defaultValue}
        onChange={handleChange}
        onKeyDownCapture={(event) => {
          selectAllOnModA(event);
          onKeyDownCapture?.(event);
        }}
        className={cn(
          textareaVariants({ roundness, resizable }),
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
