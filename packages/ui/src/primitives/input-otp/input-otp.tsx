/**
 * Fabely Input OTP primitive — `input-otp` restyled from Figma Input OTP
 * (`140:11468`) with the [shadcn Input OTP](https://ui.shadcn.com/docs/components/base/input-otp) API.
 *
 * Vendor (`src/components/ui/input-otp.tsx`) stays untouched. Slots are
 * connected (Left / Middle / Right): fill `--background`, border `--input`,
 * focus secondary ring, error destructive border + error ring.
 */

'use client';

import * as React from 'react';
import { OTPInput, OTPInputContext } from 'input-otp';
import { MinusIcon } from 'lucide-react';
import { cva } from 'class-variance-authority';

import { cn } from '@/lib/utils';

type InputOTPSize = 'mini' | 'small' | 'default' | 'large';

type InputOTPContextValue = {
  size: InputOTPSize;
};

const InputOTPSizeContext = React.createContext<InputOTPContextValue>({
  size: 'default',
});

function useInputOTPSize() {
  return React.useContext(InputOTPSizeContext);
}

const inputOTPSlotVariants = cva(
  [
    'relative flex shrink-0 items-center justify-center',
    'border-y border-r border-[length:var(--stroke-thin)] border-[color:var(--input)]',
    'bg-[color:var(--background)]',
    'font-[family-name:var(--font-family-body)]',
    '[font-weight:var(--text-paragraph-small-regular-font-weight)]',
    'text-[color:var(--foreground)]',
    'outline-none transition-[color,background-color,border-color,box-shadow]',
    'first:border-l',
    /* Active slot — Figma Focus: secondary ring only (border stays input). */
    'data-[active=true]:z-10',
    'data-[active=true]:shadow-[var(--effect-focus-ring-secondary)]',
    /* Error — destructive border; keep background fill (not Input error fill). */
    'aria-invalid:border-[color:var(--destructive)]',
    'data-[active=true]:aria-invalid:shadow-[var(--effect-focus-ring-error)]',
  ].join(' '),
  {
    variants: {
      size: {
        mini: [
          'size-[length:var(--spacing-xl)]',
          'first:rounded-l-[length:var(--rounded-sm)]',
          'last:rounded-r-[length:var(--rounded-sm)]',
          'text-[length:var(--text-paragraph-mini-regular-font-size)]',
          'leading-[var(--text-paragraph-mini-regular-line-height)]',
          'tracking-[var(--text-paragraph-mini-regular-letter-spacing)]',
        ].join(' '),
        small: [
          'size-[length:var(--spacing-2xl)]',
          'first:rounded-l-[length:var(--rounded-md)]',
          'last:rounded-r-[length:var(--rounded-md)]',
          'text-[length:var(--text-paragraph-small-regular-font-size)]',
          'leading-[var(--text-paragraph-small-regular-line-height)]',
          'tracking-[var(--text-paragraph-small-regular-letter-spacing)]',
        ].join(' '),
        default: [
          'size-[length:var(--spacing-9)]',
          'first:rounded-l-[length:var(--rounded-lg)]',
          'last:rounded-r-[length:var(--rounded-lg)]',
          'text-[length:var(--text-paragraph-small-regular-font-size)]',
          'leading-[var(--text-paragraph-small-regular-line-height)]',
          'tracking-[var(--text-paragraph-small-regular-letter-spacing)]',
        ].join(' '),
        large: [
          'size-[length:var(--spacing-3xl)]',
          'first:rounded-l-[length:var(--rounded-lg)]',
          'last:rounded-r-[length:var(--rounded-lg)]',
          'text-[length:var(--text-paragraph-small-regular-font-size)]',
          'leading-[var(--text-paragraph-small-regular-line-height)]',
          'tracking-[var(--text-paragraph-small-regular-letter-spacing)]',
        ].join(' '),
      },
    },
    defaultVariants: {
      size: 'default',
    },
  },
);

const caretSize: Record<InputOTPSize, string> = {
  mini: 'h-[length:var(--spacing-sm)]',
  small: 'h-[length:var(--spacing-md)]',
  default: 'h-[length:var(--spacing-md)]',
  large: 'h-[length:var(--spacing-lg)]',
};

type InputOTPProps = Omit<
  React.ComponentProps<typeof OTPInput>,
  'size' | 'render'
> & {
  containerClassName?: string;
  /** Figma Size — Mini · Small · Default · Large (not the HTML size attr). */
  size?: InputOTPSize;
  children?: React.ReactNode;
};

function InputOTP({
  className,
  containerClassName,
  size = 'default',
  ...props
}: InputOTPProps) {
  const ctx = React.useMemo(
    () => ({ size: size ?? 'default' }) satisfies InputOTPContextValue,
    [size],
  );

  return (
    <InputOTPSizeContext.Provider value={ctx}>
      <OTPInput
        data-slot="input-otp"
        data-size={size}
        containerClassName={cn(
          'flex items-center has-disabled:opacity-50',
          containerClassName,
        )}
        spellCheck={false}
        className={cn('disabled:cursor-not-allowed', className)}
        {...(props as React.ComponentProps<typeof OTPInput>)}
      />
    </InputOTPSizeContext.Provider>
  );
}

function InputOTPGroup({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="input-otp-group"
      className={cn('flex items-center', className)}
      {...props}
    />
  );
}

function InputOTPSlot({
  index,
  className,
  ...props
}: React.ComponentProps<'div'> & {
  index: number;
}) {
  const { size } = useInputOTPSize();
  const inputOTPContext = React.useContext(OTPInputContext);
  const { char, placeholderChar, hasFakeCaret, isActive } =
    inputOTPContext?.slots[index] ?? {};
  const display = char ?? placeholderChar ?? null;
  const isPlaceholder = char == null && placeholderChar != null;

  return (
    <div
      data-slot="input-otp-slot"
      data-active={isActive}
      className={cn(inputOTPSlotVariants({ size }), className)}
      {...props}
    >
      {display != null ? (
        <span
          className={cn(
            isPlaceholder && 'text-[color:var(--muted-foreground)] opacity-50',
          )}
        >
          {display}
        </span>
      ) : null}
      {hasFakeCaret ? (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div
            className={cn(
              'w-px animate-caret-blink bg-[color:var(--foreground)] duration-1000',
              caretSize[size],
            )}
          />
        </div>
      ) : null}
    </div>
  );
}

function InputOTPSeparator({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="input-otp-separator"
      role="separator"
      className={cn(
        'flex items-center px-[var(--spacing-2xs)] text-[color:var(--muted-foreground)]',
        '[&_svg]:size-[length:var(--icon-sm)] [&_svg]:shrink-0',
        className,
      )}
      {...props}
    >
      <MinusIcon aria-hidden="true" />
    </div>
  );
}

export {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
  inputOTPSlotVariants,
};

export type { InputOTPSize, InputOTPProps };

export {
  REGEXP_ONLY_CHARS,
  REGEXP_ONLY_DIGITS,
  REGEXP_ONLY_DIGITS_AND_CHARS,
} from 'input-otp';
