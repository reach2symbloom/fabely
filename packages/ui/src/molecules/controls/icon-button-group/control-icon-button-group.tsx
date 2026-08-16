/**
 * Control Icon Button Group — labeled row of single-select Icon Buttons.
 *
 * Figma: Controls (`16301:20374`) `type=Chip icon` — "LABEL" caption over 4
 * square Icon Buttons (Figma placeholder glyph `Icon / square-dashed`), one
 * shown selected (`--primary` border + `--effect-focus-ring-primary`).
 * Composes `@/primitives/button/icon-button` — selection styling is applied
 * via `data-selected`, not a primitive change.
 */

'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';
import { IconButton } from '@/primitives/button/icon-button';
import { ControlLabel } from '../control-label';

export type ControlIconButtonOption = {
  value: string;
  /** Accessible name — also used as the button's `aria-label`. */
  label: string;
  icon: React.ReactNode;
};

export type ControlIconButtonGroupProps = {
  className?: string;
  label?: React.ReactNode;
  options: ControlIconButtonOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
};

const SELECTED_CHROME = [
  'data-[selected=true]:border-[color:var(--primary)]',
  'data-[selected=true]:text-[color:var(--foreground)]',
  'data-[selected=true]:shadow-[var(--effect-focus-ring-primary)]',
].join(' ');

function ControlIconButtonGroup({
  className,
  label,
  options,
  value,
  defaultValue,
  onValueChange,
}: ControlIconButtonGroupProps) {
  const [uncontrolled, setUncontrolled] = React.useState(
    defaultValue ?? options[0]?.value,
  );
  const selected = value ?? uncontrolled;

  return (
    <div
      data-slot="control-icon-button-group"
      className={cn('flex w-full flex-col gap-[var(--spacing-sm)]', className)}
      role="group"
      aria-label={typeof label === 'string' ? label : undefined}
    >
      {label != null ? <ControlLabel>{label}</ControlLabel> : null}
      <div className="flex items-start gap-[var(--spacing-xs)]">
        {options.map((option) => {
          const isSelected = option.value === selected;
          return (
            <IconButton
              key={option.value}
              aria-label={option.label}
              aria-pressed={isSelected}
              data-selected={isSelected}
              variant="outline"
              size="lg"
              className={SELECTED_CHROME}
              onClick={() => {
                setUncontrolled(option.value);
                onValueChange?.(option.value);
              }}
            >
              {option.icon}
            </IconButton>
          );
        })}
      </div>
    </div>
  );
}

export { ControlIconButtonGroup };
