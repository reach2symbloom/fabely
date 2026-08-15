/**
 * Cycle Switch — advances through a finite option list in one direction.
 *
 * Figma: Cycle switch (`16399:23372`). Not a binary Switch — open options,
 * click advances, wraps. Tooltip explains the cycle.
 *
 * Placement: YES — reusable chrome with different option lists. Lives in
 * `src/atoms/cycle-switch/`.
 *
 * Overlap: Switch / Switch Light are binary; Toggle Group shows all options.
 * Compose Tooltip; do not extend Switch.
 */

'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/primitives/tooltip';

export type CycleSwitchOption = {
  value: string;
  label: React.ReactNode;
};

export type CycleSwitchProps = Omit<
  React.ComponentProps<'button'>,
  'children' | 'onClick' | 'type' | 'value'
> & {
  /** Ordered options; click advances to the next (wraps). */
  options: CycleSwitchOption[];
  /** Controlled value. */
  value?: string;
  /** Uncontrolled initial value — defaults to `options[0].value`. */
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /**
   * Hover tip. Figma default copy; pass `false` to hide, or override.
   */
  tooltip?: React.ReactNode | false;
  /** Required when labels alone are ambiguous. */
  'aria-label'?: string;
};

const labelType = [
  'font-[family-name:var(--text-paragraph-small-regular-font-family)]',
  '[font-weight:var(--text-paragraph-small-regular-font-weight)]',
  'text-[length:var(--text-paragraph-small-regular-font-size)]',
  'leading-[var(--text-paragraph-small-regular-line-height)]',
  'tracking-[var(--text-paragraph-small-regular-letter-spacing)]',
].join(' ');

const DEFAULT_TOOLTIP = 'Cycle between outline views';

const EYE_LID_PATH =
  'M2 12C2 13.6394 2.42496 14.1915 3.27489 15.2957C4.97196 17.5004 7.81811 20 12 20C16.1819 20 19.028 17.5004 20.7251 15.2957C21.575 14.1915 22 13.6394 22 12C22 10.3606 21.575 9.80853 20.7251 8.70433C19.028 6.49956 16.1819 4 12 4C7.81811 4 4.97196 6.49956 3.27489 8.70433C2.42496 9.80853 2 10.3606 2 12Z';

const EYE_IRIS_PATH =
  'M8.25 12C8.25 9.92893 9.92893 8.25 12 8.25C14.0711 8.25 15.75 9.92893 15.75 12C15.75 14.0711 14.0711 15.75 12 15.75C9.92893 15.75 8.25 14.0711 8.25 12ZM9.75 12C9.75 10.7574 10.7574 9.75 12 9.75C13.2426 9.75 14.25 10.7574 14.25 12C14.25 13.2426 13.2426 14.25 12 14.25C10.7574 14.25 9.75 13.2426 9.75 12Z';

/**
 * Solar Bold Duotone Eye, filled with Figma `gradients/primary` in the same
 * SVG (`url(#id)`). A CSS mask with black fills luminance-masks to
 * transparent in WebKit, so the glyph inherited the label’s muted color
 * and never read as primary. Secondary lid uses `--icon-solar-secondary-opacity`.
 */
function CycleSwitchEyeIcon({ className }: { className?: string }) {
  const rawId = React.useId();
  const gradientId = `cycle-switch-primary-${rawId.replace(/:/g, '')}`;
  const fill = `url(#${gradientId})`;

  return (
    <svg
      aria-hidden
      data-slot="cycle-switch-icon"
      viewBox="0 0 24 24"
      fill="none"
      className={cn(
        'size-[length:var(--icon-sm)] shrink-0',
        className,
      )}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0.5" x2="1" y2="0.5">
          <stop offset="0" stopColor="var(--tw-raw-primary-gradient-1)" />
          <stop offset="1" stopColor="var(--tw-raw-primary-gradient-2)" />
        </linearGradient>
      </defs>
      <path
        d={EYE_LID_PATH}
        fill={fill}
        style={{ opacity: 'var(--icon-solar-secondary-opacity)' }}
      />
      <path d={EYE_IRIS_PATH} fill={fill} fillRule="evenodd" clipRule="evenodd" />
    </svg>
  );
}

function CycleSwitch({
  options,
  value: valueProp,
  defaultValue,
  onValueChange,
  tooltip = DEFAULT_TOOLTIP,
  className,
  disabled,
  'aria-label': ariaLabelProp,
  ...props
}: CycleSwitchProps) {
  const fallback = options[0]?.value ?? '';
  const isControlled = valueProp !== undefined;
  const [uncontrolled, setUncontrolled] = React.useState(
    defaultValue ?? fallback,
  );
  const value = isControlled ? valueProp : uncontrolled;

  const index = Math.max(
    0,
    options.findIndex((option) => option.value === value),
  );
  const current = options[index] ?? options[0];

  function advance() {
    if (!options.length || disabled) return;
    const next = options[(index + 1) % options.length];
    if (!next) return;
    if (!isControlled) setUncontrolled(next.value);
    onValueChange?.(next.value);
  }

  const ariaLabel =
    ariaLabelProp ??
    (typeof current?.label === 'string'
      ? current.label
      : 'Cycle selection');

  const triggerClassName = cn(
    'inline-flex h-[length:var(--spacing-xl)] shrink-0 items-center',
    'gap-[var(--spacing-2xs)]',
    'rounded-[length:var(--rounded-full)]',
    'ps-[var(--spacing-1-5)] pe-[var(--spacing-xs)]',
    'border border-solid',
    'border-[color:var(--theme-alpha-black-switch-333)]',
    'bg-[color:var(--theme-alpha-white-no-switch-5)]',
    'outline-none select-none',
    labelType,
    'transition-[color,background-color,border-color] duration-[var(--duration-fast)] ease-[var(--ease-emphasized)]',
    'hover:border-[color:var(--theme-alpha-black-switch-5)]',
    'hover:bg-[color:var(--theme-alpha-white-no-switch-10)]',
    'focus-visible:shadow-[var(--effect-focus-ring-secondary)]',
    'disabled:pointer-events-none disabled:opacity-50',
    className,
  );

  const trigger = (
    <button
      type="button"
      data-slot="cycle-switch"
      data-value={current?.value}
      disabled={disabled || options.length === 0}
      aria-label={ariaLabel}
      aria-valuetext={
        typeof current?.label === 'string' ? current.label : undefined
      }
      onClick={advance}
      className={triggerClassName}
      {...props}
    >
      <CycleSwitchEyeIcon />
      <span className="whitespace-nowrap text-[color:var(--muted-foreground)]">
        {current?.label}
      </span>
    </button>
  );

  if (tooltip === false || tooltip == null || tooltip === '') {
    return trigger;
  }

  return (
    <Tooltip>
      <TooltipTrigger delay={0} render={trigger} />
      <TooltipContent side="bottom" sideOffset={8}>
        {tooltip}
      </TooltipContent>
    </Tooltip>
  );
}

export { CycleSwitch };
