/**
 * Fabely Date Picker — Popover + Calendar composition helpers.
 *
 * Not a registry component: shadcn documents Date Picker as a
 * [guide](https://ui.shadcn.com/docs/components/base/date-picker) built from
 * Popover and Calendar (no `DatePicker` root in the registry). This module
 * exports a reusable single-date shell; range / DOB / input variants are
 * composed in stories the same way product code should.
 *
 * Calendar is Foundations-matched; Popover is still thin-pass — see README
 * Deferred.
 */

'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { ChevronDownIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '../button';
import { Calendar } from '../calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../popover';

interface DatePickerProps {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  placeholder?: string;
  id?: string;
  disabled?: boolean;
  className?: string;
  /** Popover align — defaults to `start`. */
  align?: 'start' | 'center' | 'end';
}

/** Single-date picker: outline Button trigger + Calendar in Popover. */
function DatePicker({
  value,
  onChange,
  placeholder = 'Pick a date',
  id,
  disabled,
  className,
  align = 'start',
}: DatePickerProps) {
  const [uncontrolled, setUncontrolled] = React.useState<Date | undefined>();
  const date = value !== undefined ? value : uncontrolled;
  const setDate = onChange ?? setUncontrolled;

  return (
    <Popover>
      <PopoverTrigger
        disabled={disabled}
        render={
          <Button
            id={id}
            variant="outline"
            disabled={disabled}
            data-empty={!date}
            className={cn(
              'justify-between text-start [font-weight:var(--font-weight-paragraph-regular)]',
              'data-[empty=true]:text-[color:var(--muted-foreground)]',
              className,
            )}
          />
        }
      >
        {date ? format(date, 'PPP') : <span>{placeholder}</span>}
        <ChevronDownIcon data-icon="inline-end" />
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align={align}>
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          defaultMonth={date}
        />
      </PopoverContent>
    </Popover>
  );
}

export { DatePicker };
export type { DatePickerProps };
