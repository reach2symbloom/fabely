/**
 * Control Rich Divider — labeled Select field for picking a section-divider
 * ornament, quiet "Select & Combobox" chrome.
 *
 * Figma: Controls (`16301:20374`) `type=Custom dropdown` — "SECTION DIVIDER"
 * field: the ornament glyph centered inside a bordered, transparent field,
 * chevron decoration from Select itself. Composes `@/primitives/select`
 * (field + popup/item behavior) — only the trigger's content is custom
 * here. No flanking rule lines — the glyph alone is the preview; Foundations
 * Separator is not used by this piece.
 *
 * Figma's frame is 224–300 wide (Hug); the field stretches full-width
 * within that range rather than pinning one value.
 */

'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';
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
    /*
     * Fills whatever box it's placed in (trigger vs. popup row size it
     * differently below) — sizing the glyph itself here would cap how
     * large the trigger preview can render. `size-full`, not `h-full
     * w-full`: Select's own trigger chrome forces any `<svg>` whose
     * className doesn't contain "size-" down to `--icon-sm` (16px) —
     * see `[&_svg:not([class*='size-'])]` in select.tsx. `size-full`
     * both satisfies that exclusion and sets height/width together.
     */
    label: 'Ornament',
    ornament: <SectionDividerOrnament className="size-full" />,
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
  {
    value: 'plain',
    label: 'Plain',
    ornament: <span className={GLYPH_CLASS}>—</span>,
  },
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
  /* Same rest→hover fill step as the other quiet fields (Dropdown). */
  'hover:bg-[color:var(--theme-alpha-black-switch-333)]',
].join(' ');

/** The glyph alone, centered — used for both the trigger and popup rows. */
function OrnamentPreview({
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
        'flex min-w-0 flex-1 items-center justify-center text-[color:var(--muted-foreground)]',
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
          {/* Fills the trigger's full content height (48px field − 2×8px
              padding = 32px = --spacing-2xl) so the glyph reads at size,
              not as a small centered sliver. */}
          <OrnamentPreview
            ornament={activeOption?.ornament}
            className="h-[length:var(--spacing-2xl)]"
          />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              <OrnamentPreview
                ornament={option.ornament}
                className="h-[length:var(--spacing-lg)] w-fit flex-none"
              />
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export { ControlRichDivider, DEFAULT_RICH_DIVIDER_OPTIONS };
