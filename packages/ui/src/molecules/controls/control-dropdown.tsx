/**
 * Control Dropdown — labeled Select field, quiet "Input" chrome.
 *
 * Figma: Controls (`16301:20374`) `type=Dropdown` — "TYPOGRAPHY" label over a
 * filled quiet field (`--theme-alpha-black-switch-333`, rounded-lg, h-40).
 * Composes `@/primitives/select`; do not fork Select's popup/item behavior
 * here — only the trigger face changes.
 */

'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from '@/primitives/select';
import { ControlLabel } from './control-label';

type BaseUiSelectProps = React.ComponentProps<typeof Select>;

export type ControlDropdownProps = Omit<BaseUiSelectProps, 'children'> & {
  className?: string;
  label?: React.ReactNode;
  placeholder?: string;
  children: React.ReactNode;
};

const TRIGGER_CHROME = [
  'w-full justify-between gap-[var(--spacing-xs)]',
  'h-[length:var(--spacing-9)]',
  'px-[var(--spacing-sm)] py-[var(--spacing-1-875)]',
  'rounded-[length:var(--rounded-lg)] border-transparent',
  'bg-[color:var(--theme-alpha-black-switch-333)]',
  /* Same alpha ladder as Icon Button's subtleFilled rest/hover. */
  'hover:bg-[color:var(--theme-alpha-black-switch-5)]',
  'hover:text-[color:var(--foreground)]',
].join(' ');

function ControlDropdown({
  className,
  label,
  placeholder,
  children,
  ...selectProps
}: ControlDropdownProps) {
  return (
    <div
      data-slot="control-dropdown"
      className={cn('flex w-full flex-col gap-[var(--spacing-sm)]', className)}
    >
      {label != null ? <ControlLabel>{label}</ControlLabel> : null}
      <Select {...selectProps}>
        <SelectTrigger className={TRIGGER_CHROME}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>{children}</SelectContent>
      </Select>
    </div>
  );
}

export { ControlDropdown };
