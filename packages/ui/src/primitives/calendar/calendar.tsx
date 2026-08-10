/**
 * Fabely Calendar primitive — DayPicker chrome with Foundations tokens.
 *
 * API ground truth: shadcn Calendar
 * (https://ui.shadcn.com/docs/components/base/calendar) + React DayPicker.
 * No Figma set — Accordion / Breadcrumb precedent: faithful restyle only.
 *
 * Vendor chrome lives in `src/components/ui/calendar.tsx` (untouched). This
 * primitive owns the public surface: Foundations spacing / radius / type /
 * icon sizes, Fabely Button for day + nav chrome, RTL logical radii.
 */
'use client';

import * as React from 'react';
import {
  DayPicker,
  getDefaultClassNames,
  type DayButton,
  type Locale,
} from 'react-day-picker';
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import {
  Button,
  buttonVariants,
  type ButtonVariant,
} from '../button';

const WEEKDAY_TYPE = [
  'text-[length:var(--text-paragraph-mini-regular-font-size)]',
  'leading-[var(--text-paragraph-mini-regular-line-height)]',
  'tracking-[var(--text-paragraph-mini-regular-letter-spacing)]',
  '[font-weight:var(--font-weight-paragraph-regular)]',
].join(' ');

const CAPTION_TYPE = [
  'text-[length:var(--text-paragraph-small-medium-font-size)]',
  'leading-[var(--text-paragraph-small-medium-line-height)]',
  'tracking-[var(--text-paragraph-small-medium-letter-spacing)]',
  '[font-weight:var(--font-weight-paragraph-medium)]',
].join(' ');

type CalendarProps = React.ComponentProps<typeof DayPicker> & {
  /**
   * Variant for month nav buttons (previous / next).
   * Defaults to `ghost` — matches shadcn Calendar.
   */
  buttonVariant?: Extract<
    ButtonVariant,
    'ghost' | 'outline' | 'tertiary' | 'secondary'
  >;
};

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = 'label',
  buttonVariant = 'ghost',
  locale,
  formatters,
  components,
  ...props
}: CalendarProps) {
  const defaultClassNames = getDefaultClassNames();

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        'group/calendar bg-[var(--background)] p-[var(--spacing-sm)]',
        /* Cell box — Foundations; vendor used --radius-4xl / --spacing(8). */
        '[--cell-radius:var(--rounded-lg)]',
        '[--cell-size:var(--spacing-2xl)]',
        'in-data-[slot=card-content]:bg-transparent',
        'in-data-[slot=popover-content]:bg-transparent',
        String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
        String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
        className
      )}
      captionLayout={captionLayout}
      locale={locale}
      formatters={{
        formatMonthDropdown: (date) =>
          date.toLocaleString(locale?.code, { month: 'short' }),
        ...formatters,
      }}
      classNames={{
        root: cn('w-fit', defaultClassNames.root),
        months: cn(
          'relative flex flex-col gap-[length:var(--spacing-md)] md:flex-row',
          defaultClassNames.months
        ),
        month: cn(
          'flex w-full flex-col gap-[length:var(--spacing-md)]',
          defaultClassNames.month
        ),
        nav: cn(
          'absolute inset-x-0 top-0 flex w-full items-center justify-between gap-[length:var(--spacing-2xs)]',
          defaultClassNames.nav
        ),
        button_previous: cn(
          buttonVariants({ variant: buttonVariant, size: 'mini' }),
          'size-(--cell-size) p-0 select-none aria-disabled:opacity-50',
          defaultClassNames.button_previous
        ),
        button_next: cn(
          buttonVariants({ variant: buttonVariant, size: 'mini' }),
          'size-(--cell-size) p-0 select-none aria-disabled:opacity-50',
          defaultClassNames.button_next
        ),
        month_caption: cn(
          'flex h-(--cell-size) w-full items-center justify-center px-(--cell-size)',
          defaultClassNames.month_caption
        ),
        dropdowns: cn(
          'flex h-(--cell-size) w-full items-center justify-center',
          'gap-[length:var(--spacing-1-5)]',
          CAPTION_TYPE,
          defaultClassNames.dropdowns
        ),
        dropdown_root: cn(
          'relative rounded-[var(--cell-radius)]',
          defaultClassNames.dropdown_root
        ),
        dropdown: cn(
          'absolute inset-0 bg-[var(--popover)] opacity-0',
          defaultClassNames.dropdown
        ),
        caption_label: cn(
          'select-none',
          CAPTION_TYPE,
          captionLayout === 'label'
            ? ''
            : [
                'flex items-center gap-[length:var(--spacing-2xs)]',
                'rounded-[var(--cell-radius)]',
                "[&>svg]:size-[length:var(--icon-xs)]",
                '[&>svg]:text-[color:var(--muted-foreground)]',
              ].join(' '),
          defaultClassNames.caption_label
        ),
        month_grid: cn('w-full border-collapse', defaultClassNames.month_grid),
        weekdays: cn('flex', defaultClassNames.weekdays),
        weekday: cn(
          'flex-1 rounded-[var(--cell-radius)] select-none',
          WEEKDAY_TYPE,
          'text-[color:var(--muted-foreground)]',
          defaultClassNames.weekday
        ),
        week: cn(
          'mt-[length:var(--spacing-xs)] flex w-full',
          defaultClassNames.week
        ),
        week_number_header: cn(
          'w-(--cell-size) select-none',
          defaultClassNames.week_number_header
        ),
        week_number: cn(
          WEEKDAY_TYPE,
          'text-[color:var(--muted-foreground)] select-none',
          defaultClassNames.week_number
        ),
        day: cn(
          'group/day relative aspect-square h-full w-full p-0 text-center select-none',
          'rounded-[var(--cell-radius)]',
          /*
           * Week-row wrap — round the tinted band + day button at the start/end
           * of each week (shadcn range). `!` beats range_middle `rounded-none`.
           */
          '[&:last-child[data-selected=true]]:rounded-e-[var(--cell-radius)]!',
          '[&:last-child[data-selected=true]_button]:rounded-e-[var(--cell-radius)]!',
          props.showWeekNumber
            ? [
                '[&:nth-child(2)[data-selected=true]]:rounded-s-[var(--cell-radius)]!',
                '[&:nth-child(2)[data-selected=true]_button]:rounded-s-[var(--cell-radius)]!',
              ].join(' ')
            : [
                '[&:first-child[data-selected=true]]:rounded-s-[var(--cell-radius)]!',
                '[&:first-child[data-selected=true]_button]:rounded-s-[var(--cell-radius)]!',
              ].join(' '),
          defaultClassNames.day
        ),
        range_start: cn(
          'relative isolate z-0 rounded-s-[var(--cell-radius)]',
          'bg-[color-mix(in_srgb,var(--primary)_14%,transparent)]',
          'after:absolute after:inset-y-0 after:end-0 after:w-[length:var(--spacing-md)]',
          'after:bg-[color-mix(in_srgb,var(--primary)_14%,transparent)]',
          defaultClassNames.range_start
        ),
        range_middle: cn(
          'rounded-none bg-[color-mix(in_srgb,var(--primary)_14%,transparent)]',
          defaultClassNames.range_middle
        ),
        range_end: cn(
          'relative isolate z-0 rounded-e-[var(--cell-radius)]',
          'bg-[color-mix(in_srgb,var(--primary)_14%,transparent)]',
          'after:absolute after:inset-y-0 after:start-0 after:w-[length:var(--spacing-md)]',
          'after:bg-[color-mix(in_srgb,var(--primary)_14%,transparent)]',
          defaultClassNames.range_end
        ),
        today: cn(
          /* Outline lives on the day button — cell stays clear so range tint shows through. */
          'rounded-[var(--cell-radius)] bg-transparent',
          defaultClassNames.today
        ),
        outside: cn(
          'text-[color:var(--muted-foreground)] aria-selected:text-[color:var(--muted-foreground)]',
          defaultClassNames.outside
        ),
        disabled: cn(
          'text-[color:var(--muted-foreground)] opacity-50',
          defaultClassNames.disabled
        ),
        hidden: cn('invisible', defaultClassNames.hidden),
        ...classNames,
      }}
      components={{
        Root: ({ className: rootClassName, rootRef, ...rootProps }) => (
          <div
            data-slot="calendar"
            ref={rootRef}
            className={cn(rootClassName)}
            {...rootProps}
          />
        ),
        Chevron: ({ className: chevronClassName, orientation, ...chevronProps }) => {
          const iconClass = cn(
            'size-[length:var(--icon-sm)]',
            chevronClassName
          );
          if (orientation === 'left') {
            return <ChevronLeftIcon className={iconClass} {...chevronProps} />;
          }
          if (orientation === 'right') {
            return <ChevronRightIcon className={iconClass} {...chevronProps} />;
          }
          return <ChevronDownIcon className={iconClass} {...chevronProps} />;
        },
        DayButton: ({ ...dayProps }) => (
          <CalendarDayButton locale={locale} {...dayProps} />
        ),
        WeekNumber: ({ children, ...weekProps }) => (
          <td {...weekProps}>
            <div className="flex size-(--cell-size) items-center justify-center text-center">
              {children}
            </div>
          </td>
        ),
        ...components,
      }}
      {...props}
    />
  );
}

function CalendarDayButton({
  className,
  day,
  modifiers,
  locale,
  ...props
}: React.ComponentProps<typeof DayButton> & { locale?: Partial<Locale> }) {
  const defaultClassNames = getDefaultClassNames();
  const ref = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus();
  }, [modifiers.focused]);

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="mini"
      data-day={day.date.toLocaleDateString(locale?.code)}
      data-selected-single={
        modifiers.selected &&
        !modifiers.range_start &&
        !modifiers.range_end &&
        !modifiers.range_middle
      }
      data-range-start={modifiers.range_start}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      data-today={modifiers.today || undefined}
      className={cn(
        'relative isolate z-10 flex aspect-square size-auto h-auto w-full',
        'min-w-(--cell-size) flex-col gap-[length:var(--spacing-2xs)] border-0',
        'leading-none font-[family-name:var(--font-family-body)]',
        '[font-weight:var(--font-weight-paragraph-regular)]',
        'group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10',
        'group-data-[focused=true]/day:shadow-[var(--effect-focus-ring-secondary)]',
        /* Today — bordered roundrect only when not selected / in range.
         * Inside a range the outline breaks the continuous band. */
        'data-[today]:rounded-[var(--cell-radius)]',
        'data-[today]:border-[length:var(--stroke-thin)]',
        'data-[today]:border-[color:var(--border)]',
        'data-[today]:bg-transparent',
        'data-[today]:text-[color:var(--foreground)]',
        'data-[today][data-selected-single=true]:border-transparent',
        'data-[today][data-range-start=true]:border-transparent',
        'data-[today][data-range-end=true]:border-transparent',
        'data-[today][data-range-middle=true]:border-transparent',
        'data-[today][data-range-middle=true]:rounded-none',
        /* Selected caps — solid primary */
        'data-[range-end=true]:rounded-[var(--cell-radius)]',
        'data-[range-end=true]:rounded-e-[var(--cell-radius)]',
        'data-[range-end=true]:bg-[var(--primary)]',
        'data-[range-end=true]:text-[color:var(--primary-foreground)]',
        'data-[range-start=true]:rounded-[var(--cell-radius)]',
        'data-[range-start=true]:rounded-s-[var(--cell-radius)]',
        'data-[range-start=true]:bg-[var(--primary)]',
        'data-[range-start=true]:text-[color:var(--primary-foreground)]',
        'data-[selected-single=true]:bg-[var(--primary)]',
        'data-[selected-single=true]:text-[color:var(--primary-foreground)]',
        /* Range middle — tinted band (cell paints continuous strip; square
         * except week-row edges via day first/last selectors above) */
        'data-[range-middle=true]:rounded-none',
        'data-[range-middle=true]:bg-transparent',
        'data-[range-middle=true]:text-[color:var(--foreground)]',
        /*
         * Hover — selected days keep primary ink; use opacity instead of
         * ghost’s hover:text-foreground (washes selected → white/light).
         */
        'data-[selected-single=true]:hover:bg-[var(--primary)]',
        'data-[selected-single=true]:hover:text-[color:var(--primary-foreground)]',
        'data-[selected-single=true]:hover:opacity-[var(--opacity-hover-soft)]',
        'data-[range-start=true]:hover:bg-[var(--primary)]',
        'data-[range-start=true]:hover:text-[color:var(--primary-foreground)]',
        'data-[range-start=true]:hover:opacity-[var(--opacity-hover-soft)]',
        'data-[range-end=true]:hover:bg-[var(--primary)]',
        'data-[range-end=true]:hover:text-[color:var(--primary-foreground)]',
        'data-[range-end=true]:hover:opacity-[var(--opacity-hover-soft)]',
        'data-[range-middle=true]:hover:bg-[color-mix(in_srgb,var(--primary)_22%,transparent)]',
        'data-[range-middle=true]:hover:text-[color:var(--foreground)]',
        'data-[range-middle=true]:hover:opacity-100',
        '[&>span]:text-[length:var(--text-paragraph-mini-regular-font-size)]',
        '[&>span]:opacity-70',
        defaultClassNames.day,
        className
      )}
      {...props}
    />
  );
}

export { Calendar, CalendarDayButton };
export type { CalendarProps };
