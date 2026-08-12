import type { Meta, StoryObj } from '@storybook/react-vite';
import { parseDate } from 'chrono-node';
import { addDays, format } from 'date-fns';
import { arSA } from 'date-fns/locale';
import { CalendarIcon, ChevronDownIcon } from 'lucide-react';
import { useState } from 'react';
import { type DateRange } from 'react-day-picker';
import { arSA as arSADayPicker } from 'react-day-picker/locale';

import { Button } from '../button';
import { Calendar } from '../calendar';
import { Field, FieldGroup, FieldLabel } from '../field';
import { Input as TextInput } from '../input';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '../input-group';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../popover';
import { InlineSegmentedControl } from '../../../stories/InlineSegmentedControl';
import { PlaygroundPanel } from '../../../stories/PlaygroundPanel';
import {
  PRIMITIVE_PLAYGROUND_CONTROL_GRID,
  PrimitiveGalleryItem,
  PrimitivePage,
} from '../../../stories/PrimitivePage';

import { DatePicker } from './date-picker';

/**
 * Component Storybook IA (see docs/DESIGN.md "Component Story Structure"):
 * Overview first — Playground, Variants gallery, usage, a11y — then focused
 * example pages. shadcn Date Picker guide = Popover + Calendar.
 */

const meta = {
  title: 'Design System/Primitives/Date Picker',
  component: DatePicker,
  tags: ['ai-generated'],
  parameters: { layout: 'centered' },
} satisfies Meta;

export default meta;
type Story = StoryObj;

function formatLocaleDate(date: Date | undefined) {
  if (!date) return '';
  return date.toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

function isValidDate(date: Date | undefined) {
  if (!date) return false;
  return !Number.isNaN(date.getTime());
}

/* ---------- Playground ---------- */

function DatePickerPlayground() {
  const [date, setDate] = useState<Date | undefined>();
  const [disabled, setDisabled] = useState(false);

  return (
    <PlaygroundPanel
      preview={
        <DatePicker
          value={date}
          onChange={setDate}
          disabled={disabled}
          className="min-w-[12rem]"
        />
      }
      controls={
        <div className={PRIMITIVE_PLAYGROUND_CONTROL_GRID}>
          <InlineSegmentedControl
            label="Disabled"
            value={disabled ? 'on' : 'off'}
            onChange={(v) => setDisabled(v === 'on')}
            options={[
              { value: 'off', label: 'Off' },
              { value: 'on', label: 'On' },
            ]}
          />
        </div>
      }
    />
  );
}

export const Overview: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => (
    <PrimitivePage
      title="Date Picker"
      description="Popover + Calendar composition for picking a date (or range). Guide-style — not a registry component."
      playground={<DatePickerPlayground />}
      variants={
        <div className="flex flex-col gap-[var(--spacing-xl)]">
          <PrimitiveGalleryItem label="Basic">
            <DatePicker />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="With value">
            <DatePicker value={new Date(2026, 5, 1)} />
          </PrimitiveGalleryItem>
        </div>
      }
      usageGuidance={
        <ul className="list-disc space-y-2 ps-5 text-sm text-muted-foreground">
          <li>
            Prefer <code>DatePicker</code> for a single date; compose Popover +
            Calendar yourself for range, DOB dropdowns, or input hosts.
          </li>
          <li>
            Pass controlled <code>value</code> / <code>onChange</code> when the
            date feeds a form.
          </li>
          <li>
            Popover is still thin-pass — Calendar chrome is Foundations-matched.
          </li>
        </ul>
      }
      accessibility={
        <ul className="list-disc space-y-2 ps-5 text-sm text-muted-foreground">
          <li>
            Pair with Field + <code>FieldLabel</code> and give the trigger an{' '}
            <code>id</code> matching the label.
          </li>
          <li>
            Calendar day grid uses DayPicker keyboard navigation inside the
            popover.
          </li>
          <li>
            Icon-only calendar triggers need an <code>aria-label</code>.
          </li>
        </ul>
      }
    />
  ),
};

export const Demo: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>();
    return (
      <DatePicker
        value={date}
        onChange={setDate}
        className="min-w-[12rem]"
      />
    );
  },
};

export const Basic: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>();
    return (
      <Field className="w-44">
        <FieldLabel htmlFor="date-picker-basic">Date</FieldLabel>
        <DatePicker
          id="date-picker-basic"
          value={date}
          onChange={setDate}
        />
      </Field>
    );
  },
};

export const RangePicker: Story = {
  name: 'Range Picker',
  render: () => {
    const [date, setDate] = useState<DateRange | undefined>({
      from: new Date(new Date().getFullYear(), 0, 20),
      to: addDays(new Date(new Date().getFullYear(), 0, 20), 20),
    });

    return (
      <Field className="w-60">
        <FieldLabel htmlFor="date-picker-range">Date Picker Range</FieldLabel>
        <Popover>
          <PopoverTrigger
            render={
              <Button
                variant="outline"
                id="date-picker-range"
                className="justify-start px-[var(--spacing-2-5)] [font-weight:var(--font-weight-paragraph-regular)]"
              />
            }
          >
            <CalendarIcon data-icon="inline-start" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, 'LLL dd, y')} -{' '}
                  {format(date.to, 'LLL dd, y')}
                </>
              ) : (
                format(date.from, 'LLL dd, y')
              )
            ) : (
              <span>Pick a date</span>
            )}
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={setDate}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      </Field>
    );
  },
};

export const DateOfBirth: Story = {
  name: 'Date of Birth',
  render: () => {
    const [open, setOpen] = useState(false);
    const [date, setDate] = useState<Date | undefined>();

    return (
      <Field className="w-44">
        <FieldLabel htmlFor="date-picker-dob">Date of birth</FieldLabel>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger
            render={
              <Button
                variant="outline"
                id="date-picker-dob"
                className="justify-start [font-weight:var(--font-weight-paragraph-regular)]"
              />
            }
          >
            {date ? date.toLocaleDateString() : 'Select date'}
          </PopoverTrigger>
          <PopoverContent
            className="w-auto overflow-hidden p-0"
            align="start"
          >
            <Calendar
              mode="single"
              selected={date}
              defaultMonth={date}
              captionLayout="dropdown"
              onSelect={(next) => {
                setDate(next);
                setOpen(false);
              }}
            />
          </PopoverContent>
        </Popover>
      </Field>
    );
  },
};

export const Input: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    const [date, setDate] = useState<Date | undefined>(new Date('2025-06-01'));
    const [month, setMonth] = useState<Date | undefined>(date);
    const [value, setValue] = useState(formatLocaleDate(date));

    return (
      <Field className="w-48">
        <FieldLabel htmlFor="date-picker-input">Subscription Date</FieldLabel>
        <InputGroup>
          <InputGroupInput
            id="date-picker-input"
            value={value}
            placeholder="June 01, 2025"
            onChange={(e) => {
              const next = new Date(e.target.value);
              setValue(e.target.value);
              if (isValidDate(next)) {
                setDate(next);
                setMonth(next);
              }
            }}
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown') {
                e.preventDefault();
                setOpen(true);
              }
            }}
          />
          <InputGroupAddon align="inline-end">
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger
                render={
                  <InputGroupButton
                    variant="ghost"
                    size="icon-xs"
                    aria-label="Select date"
                  />
                }
              >
                <CalendarIcon />
              </PopoverTrigger>
              <PopoverContent
                className="w-auto overflow-hidden p-0"
                align="end"
                alignOffset={-8}
                sideOffset={10}
              >
                <Calendar
                  mode="single"
                  selected={date}
                  month={month}
                  onMonthChange={setMonth}
                  onSelect={(next) => {
                    setDate(next);
                    setValue(formatLocaleDate(next));
                    setOpen(false);
                  }}
                />
              </PopoverContent>
            </Popover>
          </InputGroupAddon>
        </InputGroup>
      </Field>
    );
  },
};

export const TimePicker: Story = {
  name: 'Time Picker',
  render: () => {
    const [open, setOpen] = useState(false);
    const [date, setDate] = useState<Date | undefined>();

    return (
      <FieldGroup className="max-w-xs flex-row">
        <Field>
          <FieldLabel htmlFor="date-picker-time-date">Date</FieldLabel>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger
              render={
                <Button
                  variant="outline"
                  id="date-picker-time-date"
                  className="min-w-[8rem] justify-between [font-weight:var(--font-weight-paragraph-regular)]"
                />
              }
            >
              {date ? format(date, 'PPP') : 'Select date'}
              <ChevronDownIcon data-icon="inline-end" />
            </PopoverTrigger>
            <PopoverContent
              className="w-auto overflow-hidden p-0"
              align="start"
            >
              <Calendar
                mode="single"
                selected={date}
                captionLayout="dropdown"
                defaultMonth={date}
                onSelect={(next) => {
                  setDate(next);
                  setOpen(false);
                }}
              />
            </PopoverContent>
          </Popover>
        </Field>
        <Field className="w-32">
          <FieldLabel htmlFor="date-picker-time-time">Time</FieldLabel>
          <TextInput
            type="time"
            id="date-picker-time-time"
            step="1"
            defaultValue="10:30:00"
            className="appearance-none bg-[color:var(--background)] [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
          />
        </Field>
      </FieldGroup>
    );
  },
};

export const NaturalLanguage: Story = {
  name: 'Natural Language',
  render: () => {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState('In 2 days');
    const [date, setDate] = useState<Date | undefined>(
      parseDate(value) || undefined,
    );

    return (
      <Field className="max-w-xs">
        <FieldLabel htmlFor="date-picker-nl">Schedule Date</FieldLabel>
        <InputGroup>
          <InputGroupInput
            id="date-picker-nl"
            value={value}
            placeholder="Tomorrow or next week"
            onChange={(e) => {
              setValue(e.target.value);
              const next = parseDate(e.target.value);
              if (next) setDate(next);
            }}
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown') {
                e.preventDefault();
                setOpen(true);
              }
            }}
          />
          <InputGroupAddon align="inline-end">
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger
                render={
                  <InputGroupButton
                    variant="ghost"
                    size="icon-xs"
                    aria-label="Select date"
                  />
                }
              >
                <CalendarIcon />
              </PopoverTrigger>
              <PopoverContent
                className="w-auto overflow-hidden p-0"
                align="end"
                sideOffset={8}
              >
                <Calendar
                  mode="single"
                  selected={date}
                  captionLayout="dropdown"
                  defaultMonth={date}
                  onSelect={(next) => {
                    setDate(next);
                    setValue(formatLocaleDate(next));
                    setOpen(false);
                  }}
                />
              </PopoverContent>
            </Popover>
          </InputGroupAddon>
        </InputGroup>
        <div className="px-[var(--spacing-2xs)] text-sm text-muted-foreground">
          Your post will be published on{' '}
          <span className="[font-weight:var(--font-weight-paragraph-medium)]">
            {formatLocaleDate(date)}
          </span>
          .
        </div>
      </Field>
    );
  },
};

export const RTL: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>();

    return (
      <div dir="rtl">
        <Popover>
          <PopoverTrigger
            render={
              <Button
                variant="outline"
                data-empty={!date}
                dir="rtl"
                className="min-w-[12rem] justify-between text-start [font-weight:var(--font-weight-paragraph-regular)] data-[empty=true]:text-[color:var(--muted-foreground)]"
              />
            }
          >
            {date ? (
              format(date, 'PPP', { locale: arSA })
            ) : (
              <span>اختر تاريخًا</span>
            )}
            <ChevronDownIcon data-icon="inline-end" />
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start" dir="rtl">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              defaultMonth={date}
              dir="rtl"
              locale={arSADayPicker}
            />
          </PopoverContent>
        </Popover>
      </div>
    );
  },
};
