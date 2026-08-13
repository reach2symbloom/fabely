import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useState } from 'react';
import { addDays, format } from 'date-fns';
import { arSA } from 'react-day-picker/locale';
import type { DateRange } from 'react-day-picker';
import { Calendar } from './calendar';
import { InlineSegmentedControl } from '../../../stories/InlineSegmentedControl';
import { PlaygroundPanel } from '../../../stories/PlaygroundPanel';
import {
  PRIMITIVE_PLAYGROUND_CONTROL_GRID,
  PrimitiveGalleryItem,
  PrimitivePage,
} from '../../../stories/PrimitivePage';

/**
 * Component Storybook IA (see docs/DESIGN.md "Component Story Structure"):
 * Overview first — Playground, Variants gallery, usage, a11y — then focused
 * example pages. No Figma; patterns follow shadcn Calendar docs.
 */

const meta = {
  title: 'Design System/Primitives/Calendar',
  component: Calendar,
  tags: ['ai-generated'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Calendar>;

export default meta;
type Story = StoryObj<typeof meta>;

type CaptionLayout = 'label' | 'dropdown';
type SelectionMode = 'single' | 'range';

const FIXED = new Date(2026, 7, 10);

/* ---------- Canonical examples ---------- */

function BasicExample() {
  const [date, setDate] = useState<Date | undefined>(FIXED);
  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      defaultMonth={FIXED}
      className="rounded-[var(--rounded-lg)] border-[length:var(--stroke-thin)] border-[color:var(--border)]"
    />
  );
}

function RangeExample() {
  const from = new Date(FIXED.getFullYear(), 0, 12);
  const [range, setRange] = useState<DateRange | undefined>({
    from,
    to: addDays(from, 30),
  });
  return (
    <Calendar
      mode="range"
      defaultMonth={range?.from}
      selected={range}
      onSelect={setRange}
      numberOfMonths={2}
      className="rounded-[var(--rounded-lg)] border-[length:var(--stroke-thin)] border-[color:var(--border)]"
    />
  );
}

function CaptionExample() {
  const [date, setDate] = useState<Date | undefined>(FIXED);
  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      captionLayout="dropdown"
      defaultMonth={FIXED}
      startMonth={new Date(1926, 0)}
      endMonth={new Date(2036, 11)}
      className="rounded-[var(--rounded-lg)] border-[length:var(--stroke-thin)] border-[color:var(--border)]"
    />
  );
}

function WeekNumbersExample() {
  const [date, setDate] = useState<Date | undefined>(FIXED);
  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      showWeekNumber
      defaultMonth={FIXED}
      className="rounded-[var(--rounded-lg)] border-[length:var(--stroke-thin)] border-[color:var(--border)]"
    />
  );
}

function BookedDatesExample() {
  const [date, setDate] = useState<Date | undefined>(FIXED);
  const booked = [addDays(FIXED, 2), addDays(FIXED, 5), addDays(FIXED, 9)];
  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      defaultMonth={FIXED}
      disabled={booked}
      modifiers={{ booked }}
      modifiersClassNames={{
        booked:
          '[&>button]:line-through [&>button]:opacity-60',
      }}
      className="rounded-[var(--rounded-lg)] border-[length:var(--stroke-thin)] border-[color:var(--border)]"
    />
  );
}

function CustomCellSizeExample() {
  const [date, setDate] = useState<Date | undefined>(FIXED);
  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      defaultMonth={FIXED}
      className="rounded-[var(--rounded-lg)] border-[length:var(--stroke-thin)] border-[color:var(--border)] [--cell-size:var(--spacing-11)] md:[--cell-size:var(--spacing-3xl)]"
    />
  );
}

function RtlExample() {
  const [date, setDate] = useState<Date | undefined>(FIXED);
  return (
    <div dir="rtl">
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        defaultMonth={FIXED}
        locale={arSA}
        dir="rtl"
        className="rounded-[var(--rounded-lg)] border-[length:var(--stroke-thin)] border-[color:var(--border)]"
      />
    </div>
  );
}

function TimezoneExample() {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [timeZone, setTimeZone] = useState<string | undefined>(undefined);

  useEffect(() => {
    setTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone);
  }, []);

  return (
    <div className="flex flex-col items-start gap-[length:var(--spacing-sm)]">
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        timeZone={timeZone}
        defaultMonth={FIXED}
        className="rounded-[var(--rounded-lg)] border-[length:var(--stroke-thin)] border-[color:var(--border)]"
      />
      <p className="text-[length:var(--text-paragraph-mini-regular-font-size)] text-[color:var(--muted-foreground)]">
        {timeZone ? `Time zone: ${timeZone}` : 'Detecting time zone…'}
        {date ? ` · Selected ${format(date, 'PPP')}` : null}
      </p>
    </div>
  );
}

/* ---------- Playground ---------- */

function CalendarPlayground() {
  const [mode, setMode] = useState<SelectionMode>('single');
  const [captionLayout, setCaptionLayout] =
    useState<CaptionLayout>('label');
  const [weekNumbers, setWeekNumbers] = useState(false);
  const [bordered, setBordered] = useState(true);
  const [date, setDate] = useState<Date | undefined>(FIXED);
  const [range, setRange] = useState<DateRange | undefined>(() => {
    const from = new Date(FIXED.getFullYear(), 0, 12);
    return { from, to: addDays(from, 30) };
  });

  const shell = bordered
    ? 'rounded-[var(--rounded-lg)] border-[length:var(--stroke-thin)] border-[color:var(--border)]'
    : undefined;

  const preview =
    mode === 'single' ? (
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        captionLayout={captionLayout}
        showWeekNumber={weekNumbers}
        defaultMonth={FIXED}
        className={shell}
      />
    ) : (
      <Calendar
        mode="range"
        selected={range}
        onSelect={setRange}
        captionLayout={captionLayout}
        showWeekNumber={weekNumbers}
        defaultMonth={range?.from}
        numberOfMonths={2}
        className={shell}
      />
    );

  return (
    <PlaygroundPanel
      preview={preview}
      controls={
        <div className={PRIMITIVE_PLAYGROUND_CONTROL_GRID}>
          <InlineSegmentedControl
            label="Mode"
            value={mode}
            options={[
              { value: 'single', label: 'Single' },
              { value: 'range', label: 'Range' },
            ]}
            onChange={(v) => setMode(v as SelectionMode)}
            fullWidth
          />
          <InlineSegmentedControl
            label="Caption"
            value={captionLayout}
            options={[
              { value: 'label', label: 'Label' },
              { value: 'dropdown', label: 'Dropdown' },
            ]}
            onChange={(v) => setCaptionLayout(v as CaptionLayout)}
            fullWidth
          />
          <InlineSegmentedControl
            label="Week numbers"
            value={weekNumbers ? 'on' : 'off'}
            options={[
              { value: 'off', label: 'Off' },
              { value: 'on', label: 'On' },
            ]}
            onChange={(v) => setWeekNumbers(v === 'on')}
            fullWidth
          />
          <InlineSegmentedControl
            label="Border"
            value={bordered ? 'on' : 'off'}
            options={[
              { value: 'off', label: 'Off' },
              { value: 'on', label: 'On' },
            ]}
            onChange={(v) => setBordered(v === 'on')}
            fullWidth
          />
        </div>
      }
    />
  );
}

/* ---------- Stories ---------- */

export const Overview: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => (
    <PrimitivePage
      title="Calendar"
      description={
        <>
          Day and range selection on React DayPicker. Foundations tokens for
          cell size, radius, type, and icons; Fabely Button for day and nav
          chrome. No Figma set — API follows{' '}
          <a
            href="https://ui.shadcn.com/docs/components/base/calendar"
            className="underline underline-offset-2"
          >
            shadcn Calendar
          </a>
          .
        </>
      }
      playground={<CalendarPlayground />}
      variants={
        <div className="flex flex-wrap gap-4">
          <PrimitiveGalleryItem label="Basic">
            <BasicExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Range">
            <RangeExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Month / year">
            <CaptionExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Week numbers">
            <WeekNumbersExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Booked dates">
            <BookedDatesExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Custom cell size">
            <CustomCellSizeExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Time zone">
            <TimezoneExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="RTL">
            <RtlExample />
          </PrimitiveGalleryItem>
        </div>
      }
      usageGuidance={
        <ul className="list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
          <li>
            Prefer controlled <code>selected</code> / <code>onSelect</code> (or
            range equivalents).
          </li>
          <li>
            Override cell metrics with{' '}
            <code>[--cell-size:…]</code> / <code>[--cell-radius:…]</code> —
            Foundations tokens only.
          </li>
          <li>
            Compose a date picker with Popover once that primitive is
            Foundations-matched (see Deferred in README).
          </li>
          <li>
            Pass <code>timeZone</code> when SSR and client timezones may differ.
          </li>
        </ul>
      }
      accessibility={
        <ul className="list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
          <li>
            DayPicker provides grid keyboard navigation; keep focus rings
            visible (Foundations secondary ring).
          </li>
          <li>
            For RTL, pass both <code>dir=&quot;rtl&quot;</code> and a matching{' '}
            <code>locale</code> from <code>react-day-picker/locale</code>.
          </li>
          <li>
            Disabled / booked days stay in the tab order only when DayPicker
            allows — prefer <code>disabled</code> for unavailable dates.
          </li>
        </ul>
      }
    />
  ),
};

export const Default: Story = {
  name: 'Basic',
  render: () => <BasicExample />,
};

export const Range: Story = {
  render: () => <RangeExample />,
};

export const MonthYear: Story = {
  name: 'Month and Year',
  render: () => <CaptionExample />,
};

export const WeekNumbers: Story = {
  name: 'Week Numbers',
  render: () => <WeekNumbersExample />,
};

export const BookedDates: Story = {
  name: 'Booked Dates',
  render: () => <BookedDatesExample />,
};

export const CustomCellSize: Story = {
  name: 'Custom Cell Size',
  render: () => <CustomCellSizeExample />,
};

export const TimeZone: Story = {
  name: 'Time Zone',
  render: () => <TimezoneExample />,
};

export const RTL: Story = {
  render: () => <RtlExample />,
};
