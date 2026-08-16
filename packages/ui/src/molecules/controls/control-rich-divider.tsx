/**
 * Control Rich Divider — labeled Select field for picking a section-divider
 * ornament, quiet "Select & Combobox" chrome.
 *
 * Figma: Controls (`16301:20374`) `type=Custom dropdown` — "SECTION DIVIDER"
 * field: a rule / ornament / rule preview inside a bordered, transparent
 * field, chevron decoration from Select itself. Composes
 * `@/primitives/select` (field + popup/item behavior) and
 * `@/primitives/separator` (the flanking rules) — only the trigger's
 * content is custom here.
 */

'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';
import { Separator } from '@/primitives/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/primitives/select';
import { ControlLabel } from './control-label';
import { SectionDividerOrnament } from './assets/section-divider-ornament';

export type ControlRichDividerOption = {
  value: string;
  /** Accessible / listed name for this divider style. */
  label: string;
  /** Defaults to the exported Section Divider ornament. */
  ornament?: React.ReactNode;
};

export type ControlRichDividerProps = {
  className?: string;
  label?: React.ReactNode;
  options: ControlRichDividerOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
};

const TRIGGER_CHROME = [
  'h-[length:var(--spacing-4xl)] w-full justify-between',
  'gap-0 pr-[var(--spacing-xs)] pl-[var(--spacing-sm)] py-[var(--spacing-xs)]',
  'rounded-[length:var(--rounded-lg)]',
  'border-[length:var(--stroke-thin)] border-[color:var(--theme-alpha-black-switch-10)]',
  'bg-transparent',
].join(' ');

function DividerPreview({
  ornament,
  className,
}: {
  ornament?: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      data-slot="control-rich-divider-preview"
      className={cn(
        'flex min-w-0 flex-1 items-center gap-[var(--spacing-sm)]',
        'text-[color:var(--muted-foreground)]',
        className,
      )}
    >
      <Separator className="min-w-0 flex-1" />
      <span className="h-[26px] w-[88px] shrink-0">
        {ornament ?? <SectionDividerOrnament className="size-full" />}
      </span>
      <Separator className="min-w-0 flex-1" />
    </span>
  );
}

function ControlRichDivider({
  className,
  label,
  options,
  value,
  defaultValue,
  onValueChange,
}: ControlRichDividerProps) {
  const [uncontrolled, setUncontrolled] = React.useState(
    defaultValue ?? options[0]?.value,
  );
  const selected = value ?? uncontrolled;
  const activeOption =
    options.find((option) => option.value === selected) ?? options[0];

  return (
    <div
      data-slot="control-rich-divider"
      className={cn('flex w-full flex-col gap-[var(--spacing-sm)]', className)}
    >
      {label != null ? <ControlLabel>{label}</ControlLabel> : null}
      <Select
        value={selected}
        onValueChange={(next) => {
          setUncontrolled(next as string);
          onValueChange?.(next as string);
        }}
      >
        <SelectTrigger className={TRIGGER_CHROME}>
          <DividerPreview ornament={activeOption?.ornament} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              <DividerPreview ornament={option.ornament} className="h-6 w-32" />
              <span className="sr-only">{option.label}</span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export { ControlRichDivider };
