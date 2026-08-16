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
 *
 * Figma's frame is 224–300 wide (Hug); the field stretches full-width
 * within that range rather than pinning one value.
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
  /** Omit for a continuous rule with no center glyph ("Plain"). */
  ornament?: React.ReactNode;
};

/** Text-glyph ornament, sized/tracked to sit inside the rule at the same optical weight. */
const GLYPH_CLASS = [
  'text-[length:var(--text-paragraph-small-regular-font-size)]',
  'tracking-[0.3em]',
].join(' ');

/**
 * Built-in divider styles. `Ornament` is the exported Figma asset; the
 * others are pure-CSS text glyphs so the picker has real choices without
 * needing more exported artwork.
 */
const DEFAULT_RICH_DIVIDER_OPTIONS: ControlRichDividerOption[] = [
  {
    value: 'ornament',
    label: 'Ornament',
    ornament: <SectionDividerOrnament className="h-[18px] w-24" />,
  },
  {
    value: 'dots',
    label: 'Dots',
    ornament: <span className={GLYPH_CLASS}>•••</span>,
  },
  {
    value: 'asterisks',
    label: 'Asterisks',
    ornament: <span className={GLYPH_CLASS}>∗∗∗</span>,
  },
  { value: 'plain', label: 'Plain' },
];

export type ControlRichDividerProps = {
  className?: string;
  label?: React.ReactNode;
  /** Defaults to `DEFAULT_RICH_DIVIDER_OPTIONS`. */
  options?: ControlRichDividerOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
};

const TRIGGER_CHROME = [
  'h-[length:var(--spacing-4xl)] w-full min-w-[224px] max-w-[300px] justify-between',
  'gap-0 pr-[var(--spacing-xs)] pl-[var(--spacing-sm)] py-[var(--spacing-xs)]',
  'rounded-[length:var(--rounded-lg)]',
  'border-[length:var(--stroke-thin)] border-[color:var(--theme-alpha-black-switch-10)]',
  'bg-transparent',
].join(' ');

/** Trigger preview — the actual rule/ornament/rule divider being configured. */
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
        'flex min-w-0 flex-1 items-center',
        ornament != null && 'gap-[var(--spacing-sm)]',
        'text-[color:var(--muted-foreground)]',
        className,
      )}
    >
      <Separator className="min-w-0 flex-1" />
      {ornament != null ? <span className="shrink-0">{ornament}</span> : null}
      <Separator className="min-w-0 flex-1" />
    </span>
  );
}

/**
 * Popup row preview — the glyph alone. Flanking rules belong to the one
 * divider being configured (the trigger); repeating them per list row reads
 * as a divider nested inside a divider.
 */
function OrnamentPreview({
  ornament,
  className,
}: {
  ornament?: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      data-slot="control-rich-divider-option-preview"
      className={cn(
        'flex min-w-0 items-center justify-center text-[color:var(--muted-foreground)]',
        className,
      )}
    >
      {ornament}
    </span>
  );
}

function ControlRichDivider({
  className,
  label,
  options = DEFAULT_RICH_DIVIDER_OPTIONS,
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
              <OrnamentPreview ornament={option.ornament} className="h-5 w-fit" />
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export { ControlRichDivider, DEFAULT_RICH_DIVIDER_OPTIONS };
