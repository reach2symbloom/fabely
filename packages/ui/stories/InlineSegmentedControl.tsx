import { cn } from '@/lib/utils';

export type InlineSegmentedControlOption<T extends string> = {
  value: T;
  label: string;
};

type OptionsInput<T extends string> =
  | readonly InlineSegmentedControlOption<T>[]
  | readonly T[];

export type InlineSegmentedControlProps<T extends string> = {
  /** Visible label rendered above the control. */
  label?: string;
  /**
   * Accessible name for the radiogroup. Defaults to `label`.
   * Required when `label` is omitted.
   */
  ariaLabel?: string;
  value: T;
  options: OptionsInput<T>;
  onChange: (value: T) => void;
  /** Stretch the group and chips to fill the container width. */
  fullWidth?: boolean;
  className?: string;
};

function normalizeOptions<T extends string>(
  options: OptionsInput<T>
): InlineSegmentedControlOption<T>[] {
  return options.map((opt) =>
    typeof opt === 'string' ? { value: opt, label: opt } : opt
  );
}

/**
 * Shared Storybook playground segmented control — Foundations and Primitive
 * stories use this so active-chip styling stays one place.
 *
 * Selected chip: Foundations theme-alpha black/switch (flips in dark) —
 * fill `--theme-alpha-black-switch-15`, border `--theme-alpha-black-switch-40`
 * for a defined edge against the fill, text `--foreground` for contrast in
 * both modes. Transparent border on unselected chips avoids layout shift.
 */
export function InlineSegmentedControl<T extends string>({
  label,
  ariaLabel,
  value,
  options,
  onChange,
  fullWidth = false,
  className,
}: InlineSegmentedControlProps<T>) {
  const normalized = normalizeOptions(options);
  const groupLabel = ariaLabel ?? label;

  return (
    <div className={className}>
      {label ? (
        <div className="mb-1.5 font-sans text-xs text-muted-foreground">{label}</div>
      ) : null}
      <div
        role="radiogroup"
        aria-label={groupLabel}
        className={cn(
          'inline-flex flex-wrap gap-1 rounded-md border border-border p-1',
          fullWidth && 'w-full'
        )}
      >
        {normalized.map((opt) => {
          const selected = value === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(opt.value)}
              className={cn(
                'rounded-sm border px-3 py-1.5 font-sans text-sm transition-colors',
                fullWidth && 'min-w-0 flex-1',
                selected
                  ? 'border-[color:var(--theme-alpha-black-switch-40)] bg-[var(--theme-alpha-black-switch-15)] text-foreground'
                  : 'border-transparent bg-transparent text-muted-foreground hover:text-foreground'
              )}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
