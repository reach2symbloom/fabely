/**
 * Control Chip Group — labeled row of Rich Radio Chips (icon + text,
 * `FieldLabel choice="icon"`, Size LG).
 *
 * Figma: Controls (`16301:20374`) `type=Chip icon + text` / `Header
 * variant` — "LABEL" caption (or a `ControlHeader`) over 3 icon+text
 * chips, single-select. Composes `@/primitives/radio-group` and
 * `@/primitives/field`'s Rich Radio Chip "icon" choice — see
 * `radio-group.stories.tsx`'s `RichRadioIconChipExample` for the
 * canonical pattern this mirrors. Do not fork Field/RadioGroupItem
 * chrome here.
 */

'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';
import { Field, FieldLabel, FieldTitle } from '@/primitives/field';
import { RadioGroup, RadioGroupItem } from '@/primitives/radio-group';
import { ControlLabel } from './control-label';

export type ControlChipOption = {
  value: string;
  label: string;
  icon: React.ReactNode;
};

export type ControlChipGroupProps = {
  className?: string;
  label?: React.ReactNode;
  name?: string;
  options: ControlChipOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
};

/**
 * Icon / Block choices hide the control; `sr-only` alone loses to
 * RadioGroupItem's `relative` / `size-*`, so pin it out of flow instead.
 * `htmlFor` on FieldLabel keeps the hit target. Matches
 * `RICH_RADIO_CONTROL_HIDDEN` in `radio-group.stories.tsx`.
 */
const CHIP_RADIO_HIDDEN = [
  'pointer-events-none !absolute top-0 left-0',
  '!size-px overflow-hidden !border-0 p-0 opacity-0 !shadow-none',
  'after:hidden',
].join(' ');

/* FieldLabel's `choice="icon"` face has no hover in the primitive —
 * `not-has-data-checked:` matches field.tsx's own selector so hover never
 * fights the checked (primary gradient border) state. */
const CHIP_HOVER = 'not-has-data-checked:hover:bg-[color:var(--theme-alpha-black-switch-333)]';

/** Figma Rich Radio Chip Line 1 — Paragraph Small Regular; checked → `--foreground`. */
function ChipTitle({ children }: { children: React.ReactNode }) {
  return (
    <FieldTitle
      className={cn(
        'font-[family-name:var(--text-paragraph-small-regular-font-family)]',
        '[font-weight:var(--text-paragraph-small-regular-font-weight)]',
        'text-[length:var(--text-paragraph-small-regular-font-size)]',
        'leading-[var(--text-paragraph-small-regular-line-height)]',
        'tracking-[var(--text-paragraph-small-regular-letter-spacing)]',
        'text-[color:var(--text)]',
        'group-has-data-checked/field-label:text-[color:var(--foreground)]',
        '!w-fit whitespace-nowrap',
      )}
    >
      {children}
    </FieldTitle>
  );
}

function ControlChipGroup({
  className,
  label,
  name,
  options,
  value,
  defaultValue,
  onValueChange,
}: ControlChipGroupProps) {
  /* Multiple groups can share the same option values (e.g. two "Label"
   * chip rows on one page) — a fixed `control-chip-${value}` id collides
   * across instances and breaks every FieldLabel past the first. */
  const instanceId = React.useId();

  return (
    <div
      data-slot="control-chip-group"
      className={cn('flex w-full flex-col gap-[var(--spacing-sm)]', className)}
    >
      {label != null ? <ControlLabel>{label}</ControlLabel> : null}
      <RadioGroup
        name={name}
        value={value}
        defaultValue={defaultValue ?? options[0]?.value}
        onValueChange={(next) => onValueChange?.(next as string)}
        className="flex w-fit flex-row flex-wrap gap-[var(--spacing-xs)]"
      >
        {options.map((option) => (
          <FieldLabel
            key={option.value}
            choice="icon"
            htmlFor={`${instanceId}-${option.value}`}
            className={CHIP_HOVER}
          >
            <RadioGroupItem
              value={option.value}
              id={`${instanceId}-${option.value}`}
              className={CHIP_RADIO_HIDDEN}
            />
            {/* Not orientation="horizontal" — that forces FieldTitle to
                120px when no radio sits inside Field. */}
            <Field
              className={cn(
                '!flex !h-full !w-fit !flex-row !items-center',
                '[&>*]:!w-auto !gap-[var(--spacing-xs)]',
              )}
            >
              <span
                aria-hidden="true"
                className="flex size-[length:var(--icon-md)] shrink-0 items-center justify-center text-[color:var(--foreground)]"
              >
                {option.icon}
              </span>
              <ChipTitle>{option.label}</ChipTitle>
            </Field>
          </FieldLabel>
        ))}
      </RadioGroup>
    </div>
  );
}

export { ControlChipGroup };
