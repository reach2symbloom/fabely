import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useState, type CSSProperties } from 'react';
import { useArgs } from 'storybook/preview-api';
import { PendingNotice, SectionHeading } from './ColorSwatchTable';

type Variant = 'Primary' | 'Primary Glow' | 'Secondary' | 'Sidebar' | 'Success' | 'Alert' | 'Error';
type Surface = 'Canvas' | 'Card' | 'Sidebar';
type Control = 'Input' | 'Button';
type Args = { variant: Variant; surface: Surface; control: Control };

const meta = {
  title: 'Design System/Foundations/Effects/Focus Rings',
  tags: ['ai-generated'],
  parameters: { layout: 'padded' },
} satisfies Meta;

export default meta;
type Story = StoryObj<Meta<Args>>;

const variantArgType = {
  control: { type: 'inline-radio' },
  options: ['Primary', 'Primary Glow', 'Secondary', 'Sidebar', 'Success', 'Alert', 'Error'],
} as const;

const surfaceArgType = {
  control: { type: 'inline-radio' },
  options: ['Canvas', 'Card', 'Sidebar'],
} as const;

const controlArgType = {
  control: { type: 'inline-radio' },
  options: ['Input', 'Button'],
} as const;

type FocusRingToken = {
  name: Variant;
  cssVar: string;
  reference: string;
  note?: string;
};

const focusRings: FocusRingToken[] = [
  { name: 'Primary', cssVar: '--effect-focus-ring-primary', reference: 'var(--ring-primary)' },
  {
    name: 'Primary Glow',
    cssVar: '--effect-focus-ring-primary-glow',
    reference: 'var(--ring-primary) + var(--theme-neutrals-600) glow',
    note: 'Two shadow layers, not one — the same ring-primary outline plus a soft theme-neutrals-600 glow behind it.',
  },
  { name: 'Secondary', cssVar: '--effect-focus-ring-secondary', reference: 'var(--ring)' },
  { name: 'Sidebar', cssVar: '--effect-focus-ring-sidebar', reference: 'var(--sidebar-ring)' },
  {
    name: 'Success',
    cssVar: '--effect-focus-ring-success',
    reference: 'var(--tw-raw-success-700)',
    note: 'Figma binds this directly to the raw value, not the semantic --ring-success token (which holds a different value) — preserved as-is.',
  },
  {
    name: 'Alert',
    cssVar: '--effect-focus-ring-alert',
    reference: 'var(--tw-raw-alert-800)',
    note: 'Figma binds this directly to the raw value, not the semantic --ring-alert token (which holds a different value) — preserved as-is.',
  },
  { name: 'Error', cssVar: '--effect-focus-ring-error', reference: 'var(--ring-error)' },
];

const ringByVariant: Record<Variant, FocusRingToken> = Object.fromEntries(
  focusRings.map((r) => [r.name, r]),
) as Record<Variant, FocusRingToken>;

function useResolvedValue(cssVar: string) {
  const [value, setValue] = useState('');
  useEffect(() => {
    setValue(getComputedStyle(document.documentElement).getPropertyValue(cssVar).trim());
  }, [cssVar]);
  return value;
}

const cellStyle: CSSProperties = {
  padding: '10px 12px',
  borderBottom: '1px solid var(--border)',
  verticalAlign: 'middle',
};
const monoCell: CSSProperties = { ...cellStyle, fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', fontSize: 12 };

/** Generic clickable segmented control, reused for Variant/Surface/Control —
 * same inline-args pattern established by the Typography stories (synced
 * to Storybook's Controls panel via useArgs, inline is primary). */
function InlineSegmentedControl<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: T[];
  onChange: (v: T) => void;
}) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ fontFamily: 'ui-sans-serif, system-ui, sans-serif', fontSize: 12, opacity: 0.7, marginBottom: 6 }}>
        {label}
      </div>
      <div
        role="radiogroup"
        aria-label={label}
        style={{ display: 'inline-flex', flexWrap: 'wrap', gap: 4, padding: 4, border: '1px solid var(--border)', borderRadius: 8 }}
      >
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            role="radio"
            aria-checked={value === opt}
            onClick={() => onChange(opt)}
            style={{
              fontFamily: 'ui-sans-serif, system-ui, sans-serif',
              fontSize: 13,
              padding: '6px 14px',
              borderRadius: 6,
              border: 'none',
              cursor: 'pointer',
              background: value === opt ? 'var(--primary)' : 'transparent',
              color: value === opt ? 'var(--primary-foreground)' : 'inherit',
            }}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

/** The surface the control sits on — lets designers evaluate a focus ring
 * in the contexts it actually appears in (bare canvas, a card, or the
 * sidebar itself — relevant since "Sidebar" is a real usage context, not
 * just a color name). */
function surfaceContainerStyle(surface: Surface): CSSProperties {
  switch (surface) {
    case 'Canvas':
      return { background: 'var(--background)' };
    case 'Card':
      return { background: 'var(--card)', border: '1px solid var(--border)' };
    case 'Sidebar':
      return { background: 'var(--sidebar)', border: '1px solid var(--sidebar-border)' };
  }
}

function FocusRingPreview({ variant, surface, control }: { variant: Variant; surface: Surface; control: Control }) {
  const token = ringByVariant[variant];
  const shared: CSSProperties = {
    width: control === 'Input' ? 200 : 120,
    height: 40,
    borderRadius: 8,
    fontFamily: 'ui-sans-serif, system-ui, sans-serif',
    fontSize: 13,
    boxShadow: `var(${token.cssVar})`,
  };
  return (
    <div
      style={{
        ...surfaceContainerStyle(surface),
        borderRadius: 12,
        padding: 40,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
      }}
    >
      {control === 'Input' ? (
        <input
          type="text"
          placeholder="Input"
          readOnly
          style={{
            ...shared,
            border: '1px solid var(--input)',
            background: 'var(--background)',
            color: 'inherit',
            padding: '0 12px',
            outline: 'none',
          }}
        />
      ) : (
        <div
          style={{
            ...shared,
            background: 'var(--secondary)',
            color: 'var(--secondary-foreground)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          Button
        </div>
      )}
    </div>
  );
}

function FocusRingRow({ token }: { token: FocusRingToken }) {
  const resolved = useResolvedValue(token.cssVar);
  return (
    <tr>
      <td style={cellStyle}>
        <div
          style={{
            width: 64,
            height: 36,
            borderRadius: 6,
            background: 'var(--secondary)',
            boxShadow: `var(${token.cssVar})`,
          }}
        />
      </td>
      <td style={cellStyle}>{token.name}</td>
      <td style={monoCell}>{token.cssVar}</td>
      <td style={monoCell}>{token.reference}</td>
      <td style={monoCell}>{resolved || '…'}</td>
      <td style={{ ...cellStyle, opacity: 0.75, fontSize: 13, maxWidth: 260 }}>{token.note ?? ''}</td>
    </tr>
  );
}

export const Overview: Story = {
  argTypes: { variant: variantArgType, surface: surfaceArgType, control: controlArgType },
  args: { variant: 'Primary', surface: 'Canvas', control: 'Button' },
  render: () => {
    const [args, updateArgs] = useArgs<Args>();
    const variant: Variant = args.variant ?? 'Primary';
    const surface: Surface = args.surface ?? 'Canvas';
    const control: Control = args.control ?? 'Button';
    return (
      <div>
        <PendingNotice>
          <strong>Focus Rings</strong> are semantic visual-emphasis effects for focused/active
          interactive elements — not elevation. Each ring's color is preserved exactly as Figma
          binds it: most reference an existing semantic color token; a couple reference the raw
          color layer directly (flagged per-row below) rather than their own semantic ring token,
          which is Figma's actual current wiring, not something normalized away here.
        </PendingNotice>

        <SectionHeading>Interactive Example</SectionHeading>
        <InlineSegmentedControl
          label="Variant"
          value={variant}
          options={['Primary', 'Primary Glow', 'Secondary', 'Sidebar', 'Success', 'Alert', 'Error']}
          onChange={(v) => updateArgs({ variant: v })}
        />
        <InlineSegmentedControl
          label="Surface"
          value={surface}
          options={['Canvas', 'Card', 'Sidebar']}
          onChange={(s) => updateArgs({ surface: s })}
        />
        <InlineSegmentedControl
          label="Control"
          value={control}
          options={['Input', 'Button']}
          onChange={(c) => updateArgs({ control: c })}
        />
        <FocusRingPreview variant={variant} surface={surface} control={control} />

        <SectionHeading>Reference Table</SectionHeading>
        <table style={{ borderCollapse: 'collapse', width: '100%', marginBottom: 24 }}>
          <thead>
            <tr>
              <th style={{ ...cellStyle, textAlign: 'left' }}>Preview</th>
              <th style={{ ...cellStyle, textAlign: 'left' }}>Token</th>
              <th style={{ ...cellStyle, textAlign: 'left' }}>CSS Variable</th>
              <th style={{ ...cellStyle, textAlign: 'left' }}>Aliases</th>
              <th style={{ ...cellStyle, textAlign: 'left' }}>Resolved Value</th>
              <th style={{ ...cellStyle, textAlign: 'left' }}>Note</th>
            </tr>
          </thead>
          <tbody>
            {focusRings.map((r) => (
              <FocusRingRow key={r.cssVar} token={r} />
            ))}
          </tbody>
        </table>

        <SectionHeading>Architecture Notes</SectionHeading>
        <PendingNotice>
          Effects represent interaction and visual emphasis; Shadows represent elevation. Focus
          rings derive their color from semantic color tokens (<code>--ring</code>,{' '}
          <code>--ring-primary</code>, <code>--sidebar-ring</code>, <code>--ring-error</code>)
          wherever Figma binds one — Success and Alert currently reference the raw color layer
          directly instead, which is preserved exactly rather than silently aliased to their
          differently-valued semantic counterparts. "Primary Glow" demonstrates that an effect may
          contain more than one shadow layer internally; consumers should think in terms of
          semantic intent (which ring to use, for what purpose) rather than how many shadow layers
          implement it.
        </PendingNotice>
      </div>
    );
  },
};
