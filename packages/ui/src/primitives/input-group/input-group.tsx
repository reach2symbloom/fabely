/**
 * Fabely Input Group primitive — addons around Foundations Input / Textarea
 * with the [shadcn Input Group](https://ui.shadcn.com/docs/components/base/input-group) API.
 *
 * Vendor (`src/components/ui/input-group.tsx`) stays untouched. The group shell
 * owns Figma Input (`16:1738`) chrome (fill, focus, invalid, radius, height,
 * pad) for Default, Ghost, and Quiet. `InputGroupInput` / `InputGroupTextarea`
 * stay bare inside the shell.
 */

'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';
import { Button, IconButton } from '../button';
import type { ButtonProps, ButtonSize, IconButtonSize } from '../button';
import { Input } from '../input';
import type { InputProps } from '../input';
import { Textarea } from '../textarea';
import type { TextareaProps } from '../textarea';

type InputGroupSize = NonNullable<InputProps['size']>;
type InputGroupVariant = NonNullable<InputProps['variant']>;
type InputGroupRoundness = NonNullable<InputProps['roundness']>;

type InputGroupContextValue = {
  size: InputGroupSize;
  variant: InputGroupVariant;
  roundness: InputGroupRoundness;
};

const InputGroupContext = React.createContext<InputGroupContextValue>({
  size: 'default',
  variant: 'default',
  roundness: 'default',
});

function useInputGroup() {
  return React.useContext(InputGroupContext);
}

/** Fixed height for inline; block / textarea must clear it (`!h-auto`). */
const BLOCK_AUTO_HEIGHT = [
  'has-[>[data-align=block-start]]:!h-auto',
  'has-[>[data-align=block-end]]:!h-auto',
  'has-[textarea]:!h-auto',
].join(' ');

const BLOCK_SHELL_RESET = [
  'has-[>[data-align=block-start]]:px-0',
  'has-[>[data-align=block-end]]:px-0',
  'has-[>[data-align=block-start]]:gap-0',
  'has-[>[data-align=block-end]]:gap-0',
].join(' ');

/** Inline button addons only — even 2px inset; stretch so pad reads equal.
 *  Do not apply when the button lives in a block addon (header/footer strip). */
const BUTTON_SHELL_HUG = [
  'has-[[data-slot=input-group-addon][data-align=inline-start]_[data-slot=input-group-button]]:!p-[var(--spacing-3xs)]',
  'has-[[data-slot=input-group-addon][data-align=inline-end]_[data-slot=input-group-button]]:!p-[var(--spacing-3xs)]',
  'has-[[data-slot=input-group-addon][data-align=inline-start]_[data-slot=input-group-button]]:!gap-[var(--spacing-3xs)]',
  'has-[[data-slot=input-group-addon][data-align=inline-end]_[data-slot=input-group-button]]:!gap-[var(--spacing-3xs)]',
  'has-[[data-slot=input-group-addon][data-align=inline-start]_[data-slot=input-group-button]]:items-stretch',
  'has-[[data-slot=input-group-addon][data-align=inline-end]_[data-slot=input-group-button]]:items-stretch',
].join(' ');

const inputGroupVariants = cva(
  [
    'group/input-group relative flex w-full min-w-0 items-center overflow-clip',
    'border-[length:var(--stroke-thin)] border-transparent',
    'outline-none transition-[color,background-color,border-color,box-shadow,opacity]',
    'has-[[data-slot=input-group-control][aria-invalid=true]]:border-[color:var(--destructive)]',
    'has-[[data-slot=input-group-control][aria-invalid=true]]:bg-[color:var(--background)]',
    'has-[[data-slot=input-group-control][aria-invalid=true]]:focus-within:shadow-[var(--effect-focus-ring-error)]',
    /* Error icons — inherit currentColor via destructive text on addon SVGs. */
    'has-[[data-slot=input-group-control][aria-invalid=true]]:[&_[data-slot=input-group-addon]_svg]:text-[color:var(--destructive)]',
    'has-disabled:pointer-events-none has-disabled:cursor-not-allowed has-disabled:opacity-50',
    'has-[>[data-align=block-end]]:flex-col',
    'has-[>[data-align=block-start]]:flex-col',
    'in-data-[slot=combobox-content]:focus-within:border-inherit',
    'in-data-[slot=combobox-content]:focus-within:shadow-none',
    BLOCK_AUTO_HEIGHT,
  ].join(' '),
  {
    variants: {
      variant: {
        default: [
          'bg-[color:var(--theme-alpha-black-switch-333)]',
          'has-[[data-slot=input-group-control]:focus-visible]:shadow-[var(--effect-focus-ring-secondary)]',
        ].join(' '),
        ghost: [
          'bg-transparent',
          'focus-within:bg-[color:var(--theme-alpha-black-switch-333)]',
          'focus-within:border-[color:var(--theme-alpha-black-switch-333)]',
          'has-[[data-slot=input-group-control]:focus-visible]:shadow-[var(--effect-focus-ring-secondary)]',
        ].join(' '),
        /**
         * Inline / in-chrome field: rest transparent, hover fills alpha-333
         * independently of focus. Focus is a semantic `--border` — no ring
         * and no extra fill (the value slot must not paint over prepend).
         */
        quiet: [
          'bg-transparent',
          'hover:bg-[color:var(--theme-alpha-black-switch-333)]',
          'focus-within:border-[color:var(--border)]',
          'has-[[data-slot=input-group-control]:focus-visible]:border-[color:var(--border)]',
          'has-[[data-slot=input-group-control]:focus-visible]:shadow-none',
          'has-[[data-slot=input-group-control][aria-invalid=true]]:hover:bg-[color:var(--background)]',
        ].join(' '),
      },
      size: {
        /* Figma Decoration ↔ field gap (Input shell) — not Prepend↔value 2xs. */
        mini: [
          'h-[length:var(--spacing-xl)]',
          'min-h-[length:var(--spacing-xl)]',
          'gap-[var(--spacing-2xs)]',
          'px-[var(--spacing-1-5)]',
          BLOCK_SHELL_RESET,
          BUTTON_SHELL_HUG,
        ].join(' '),
        small: [
          'h-[length:var(--spacing-2xl)]',
          'min-h-[length:var(--spacing-2xl)]',
          'gap-[var(--spacing-1-5)]',
          'px-[var(--spacing-xs)]',
          BLOCK_SHELL_RESET,
          BUTTON_SHELL_HUG,
        ].join(' '),
        default: [
          'h-[length:var(--spacing-3xl)]',
          'min-h-[length:var(--spacing-9)]',
          'gap-[var(--spacing-xs)]',
          'px-[var(--spacing-sm)]',
          BLOCK_SHELL_RESET,
          BUTTON_SHELL_HUG,
        ].join(' '),
        large: [
          'h-[length:var(--spacing-4xl)]',
          'min-h-[length:var(--spacing-3xl)]',
          'gap-[var(--spacing-sm)]',
          'px-[var(--spacing-md)]',
          BLOCK_SHELL_RESET,
          BUTTON_SHELL_HUG,
        ].join(' '),
      },
      roundness: {
        default: [
          'rounded-[length:var(--rounded-lg)]',
          '[--input-group-radius:var(--rounded-lg)]',
          'has-[[data-slot=input-group-control]:focus-visible]:border-[color:var(--neutrals-new-400)]',
          'has-[>[data-align=block-end]]:rounded-[length:var(--rounded-lg)]',
          'has-[>[data-align=block-start]]:rounded-[length:var(--rounded-lg)]',
          'has-[textarea]:rounded-[length:var(--rounded-lg)]',
        ].join(' '),
        round: [
          'rounded-[length:var(--rounded-full)]',
          '[--input-group-radius:var(--rounded-full)]',
          'has-[[data-slot=input-group-control]:focus-visible]:border-[color:var(--theme-alpha-black-switch-15)]',
          'has-[>[data-align=block-end]]:rounded-[length:var(--rounded-lg)]',
          'has-[>[data-align=block-start]]:rounded-[length:var(--rounded-lg)]',
          'has-[textarea]:rounded-[length:var(--rounded-lg)]',
        ].join(' '),
      },
    },
    compoundVariants: [
      {
        roundness: 'default',
        size: 'mini',
        class: [
          'rounded-[length:var(--rounded-md)]',
          '[--input-group-radius:var(--rounded-md)]',
        ].join(' '),
      },
      {
        variant: 'quiet',
        class: [
          'focus-within:border-[color:var(--border)]',
          'has-[[data-slot=input-group-control]:focus-visible]:border-[color:var(--border)]',
          'has-[[data-slot=input-group-control]:focus-visible]:shadow-none',
        ].join(' '),
      },
    ],
    defaultVariants: {
      variant: 'default',
      size: 'default',
      roundness: 'default',
    },
  },
);

function InputGroup({
  className,
  variant = 'default',
  size = 'default',
  roundness = 'default',
  ...props
}: React.ComponentProps<'div'> & VariantProps<typeof inputGroupVariants>) {
  const ctx = React.useMemo(
    () =>
      ({
        size: size ?? 'default',
        variant: variant ?? 'default',
        roundness: roundness ?? 'default',
      }) satisfies InputGroupContextValue,
    [size, variant, roundness],
  );

  return (
    <InputGroupContext.Provider value={ctx}>
      <div
        data-slot="input-group"
        data-variant={variant}
        data-size={size}
        data-roundness={roundness}
        role="group"
        className={cn(
          inputGroupVariants({ variant, size, roundness }),
          className,
        )}
        {...props}
      />
    </InputGroupContext.Provider>
  );
}

const addonIconSize = cva('[&_svg]:pointer-events-none [&_svg]:shrink-0', {
  variants: {
    size: {
      /* Force size — Lucide sets width/height attrs that :not(size-) can miss. */
      mini: '[&_svg]:size-[length:var(--icon-xs)]',
      small: '[&_svg]:size-[length:var(--icon-sm)]',
      default: '[&_svg]:size-[length:var(--icon-sm)]',
      large: '[&_svg]:size-[length:var(--icon-md)]',
    },
  },
  defaultVariants: { size: 'default' },
});

const inputGroupAddonVariants = cva(
  [
    'flex h-auto shrink-0 cursor-text items-center justify-center',
    'gap-[var(--spacing-xs)]',
    'font-[family-name:var(--font-family-body)]',
    '[font-weight:var(--text-paragraph-small-regular-font-weight)]',
    'text-[color:var(--muted-foreground)] select-none',
    'group-data-[disabled=true]/input-group:opacity-50',
  ].join(' '),
  {
    variants: {
      align: {
        'inline-start': 'order-first self-stretch',
        'inline-end': 'order-last self-stretch',
        'block-start': [
          'order-first w-full justify-start self-stretch',
          'px-[var(--spacing-sm)] pt-[var(--spacing-sm)]',
          '[.border-b]:pb-[var(--spacing-2-5)]',
        ].join(' '),
        'block-end': [
          'order-last w-full justify-start self-stretch',
          'px-[var(--spacing-sm)] pb-[var(--spacing-sm)]',
          '[.border-t]:pt-[var(--spacing-2-5)]',
        ].join(' '),
      },
    },
    defaultVariants: {
      align: 'inline-start',
    },
  },
);

function InputGroupAddon({
  className,
  align = 'inline-start',
  ...props
}: React.ComponentProps<'div'> & VariantProps<typeof inputGroupAddonVariants>) {
  const { size } = useInputGroup();

  return (
    <div
      role="group"
      data-slot="input-group-addon"
      data-align={align}
      className={cn(
        inputGroupAddonVariants({ align }),
        addonIconSize({ size }),
        className,
      )}
      onClick={(e) => {
        if ((e.target as HTMLElement).closest('button')) {
          return;
        }
        e.currentTarget.parentElement
          ?.querySelector<HTMLElement>('[data-slot=input-group-control]')
          ?.focus();
      }}
      {...props}
    />
  );
}

type InputGroupButtonSize = 'xs' | 'sm' | 'icon-xs' | 'icon-sm';

/** Map group size → Button size so label type matches; height is `h-full`. */
const GROUP_TO_BUTTON: Record<InputGroupSize, ButtonSize> = {
  mini: 'mini',
  small: 'mini',
  default: 'small',
  large: 'default',
};

const GROUP_TO_ICON: Record<InputGroupSize, IconButtonSize> = {
  mini: 'mini',
  small: 'mini',
  default: 'sm',
  large: 'default',
};

const TEXT_SIZE: Record<'xs' | 'sm', ButtonSize> = {
  xs: 'mini',
  sm: 'small',
};

const ICON_SIZE: Record<'icon-xs' | 'icon-sm', IconButtonSize> = {
  'icon-xs': 'mini',
  'icon-sm': 'sm',
};

/**
 * Inline button hug: fill shell minus 2px inset + concentric radius.
 * Block addons keep normal Button sizing (header/footer strip).
 */
const BUTTON_INLINE_HUG = [
  'in-data-[align=inline-start]:!h-auto in-data-[align=inline-start]:min-h-0 in-data-[align=inline-start]:self-stretch',
  'in-data-[align=inline-end]:!h-auto in-data-[align=inline-end]:min-h-0 in-data-[align=inline-end]:self-stretch',
  'in-data-[align=inline-start]:rounded-[length:calc(var(--input-group-radius)-var(--spacing-3xs))]',
  'in-data-[align=inline-end]:rounded-[length:calc(var(--input-group-radius)-var(--spacing-3xs))]',
].join(' ');

function InputGroupButton({
  className,
  type = 'button',
  variant = 'ghost',
  size = 'xs',
  roundness: roundnessProp,
  'aria-label': ariaLabel,
  ...props
}: Omit<ButtonProps, 'size' | 'type'> & {
  type?: 'button' | 'submit' | 'reset';
  size?: InputGroupButtonSize;
  'aria-label'?: string;
}) {
  const ctx = useInputGroup();
  /* Roundness prop still accepted for API parity; radius is nested via CSS. */
  const roundness = roundnessProp ?? ctx.roundness;
  const nestClass = cn('shadow-none', BUTTON_INLINE_HUG, className);

  if (size === 'icon-xs' || size === 'icon-sm') {
    return (
      <IconButton
        type={type}
        data-slot="input-group-button"
        data-size={size}
        variant={variant}
        size={ICON_SIZE[size] ?? GROUP_TO_ICON[ctx.size]}
        roundness={roundness}
        className={nestClass}
        aria-label={ariaLabel ?? 'Action'}
        {...props}
      />
    );
  }

  return (
    <Button
      type={type}
      data-slot="input-group-button"
      data-size={size}
      variant={variant}
      /* xs tracks group height; sm stays explicit small. */
      size={size === 'sm' ? TEXT_SIZE.sm : GROUP_TO_BUTTON[ctx.size]}
      roundness={roundness}
      className={nestClass}
      aria-label={ariaLabel}
      {...props}
    />
  );
}

const inputGroupTextVariants = cva(
  [
    'flex shrink-0 items-center gap-[var(--spacing-xs)] whitespace-nowrap',
    'font-[family-name:var(--font-family-body)]',
    '[font-weight:var(--text-paragraph-small-regular-font-weight)]',
    'text-[color:var(--muted-foreground)]',
    '[&_svg]:pointer-events-none [&_svg]:shrink-0',
  ].join(' '),
  {
    variants: {
      size: {
        mini: [
          'text-[length:var(--text-paragraph-mini-regular-font-size)]',
          'leading-[var(--text-paragraph-mini-regular-line-height)]',
        ].join(' '),
        small: [
          'text-[length:var(--text-paragraph-small-regular-font-size)]',
          'leading-[var(--text-paragraph-small-regular-line-height)]',
        ].join(' '),
        default: [
          'text-[length:var(--text-paragraph-small-regular-font-size)]',
          'leading-[var(--text-paragraph-small-regular-line-height)]',
        ].join(' '),
        large: [
          'text-[length:var(--text-paragraph-regular-regular-font-size)]',
          'leading-[var(--text-paragraph-regular-regular-line-height)]',
        ].join(' '),
      },
    },
    defaultVariants: { size: 'default' },
  },
);

function InputGroupText({ className, ...props }: React.ComponentProps<'span'>) {
  const { size } = useInputGroup();

  return (
    <span
      data-slot="input-group-text"
      className={cn(inputGroupTextVariants({ size }), className)}
      {...props}
    />
  );
}

const CONTROL_BARE = [
  /* Fill shell height so value lines up with icons (Input field-in-shell). */
  'h-full min-h-0 flex-1 self-stretch rounded-none border-0 bg-transparent px-0 py-0 shadow-none',
  'hover:bg-transparent focus:bg-transparent focus-visible:bg-transparent',
  'focus-visible:border-transparent focus-visible:shadow-none',
  'aria-invalid:border-transparent aria-invalid:bg-transparent',
  'aria-invalid:focus-visible:shadow-none',
  'disabled:bg-transparent',
].join(' ');

/** Block layouts need horizontal pad on the control (shell px is cleared). */
const CONTROL_BLOCK_PAD = [
  'group-has-[>[data-align=block-start]]/input-group:px-[var(--spacing-sm)]',
  'group-has-[>[data-align=block-end]]/input-group:px-[var(--spacing-sm)]',
  'group-has-[>[data-align=block-start]]/input-group:pb-[var(--spacing-sm)]',
  'group-has-[>[data-align=block-end]]/input-group:pt-[var(--spacing-sm)]',
].join(' ');

function InputGroupInput({
  className,
  size: sizeProp,
  variant: variantProp,
  roundness: roundnessProp,
  ...props
}: InputProps) {
  const ctx = useInputGroup();
  const size = sizeProp ?? ctx.size;
  const variant = variantProp ?? ctx.variant;
  const roundness = roundnessProp ?? ctx.roundness;

  return (
    <Input
      data-slot="input-group-control"
      size={size}
      variant={variant}
      roundness={roundness}
      className={cn(CONTROL_BARE, CONTROL_BLOCK_PAD, className)}
      {...props}
    />
  );
}

function InputGroupTextarea({
  className,
  roundness,
  resizable = false,
  showCharacterCount,
  ...props
}: TextareaProps) {
  return (
    <Textarea
      data-slot="input-group-control"
      roundness={roundness}
      resizable={resizable}
      showCharacterCount={showCharacterCount}
      className={cn(
        CONTROL_BARE,
        CONTROL_BLOCK_PAD,
        /* Beat CONTROL_BARE py-0 — match shell default horizontal pad (sm). */
        'resize-none !py-[var(--spacing-sm)]',
        className,
      )}
      {...props}
    />
  );
}

export {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupInput,
  InputGroupTextarea,
  inputGroupVariants,
  inputGroupAddonVariants,
};
export type {
  InputGroupSize,
  InputGroupVariant,
  InputGroupRoundness,
  InputGroupButtonSize,
};
