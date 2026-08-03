import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useState, type CSSProperties } from 'react';
import { useArgs } from 'storybook/preview-api';
import { EffectsNotice, EffectsSectionHeading, uiCellStyle, codeCellStyle } from './EffectsDocChrome';
import { InlineSegmentedControl } from './InlineSegmentedControl';

type Variant = 'Primary' | 'Primary Glow' | 'Secondary' | 'Sidebar' | 'Success' | 'Alert' | 'Error';
type Control = 'Input' | 'Button';
type Args = { variant: Variant; control: Control };

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
  { name: 'Success', cssVar: '--effect-focus-ring-success', reference: 'var(--ring-success)' },
  { name: 'Alert', cssVar: '--effect-focus-ring-alert', reference: 'var(--ring-alert)' },
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

/** Single representative specimen panel — a bordered preview panel rather
 * than a table row, matching the Typography Interactive Example pattern.
 * Control (Input/Button) is kept because a focus ring's whole purpose is to
 * be applied to a focusable control — it isn't an "environmental" option
 * the way a Surface selector would be. */
function FocusRingPreview({ variant, control }: { variant: Variant; control: Control }) {
  const token = ringByVariant[variant];
  const shared: CSSProperties = {
    width: control === 'Input' ? 200 : 120,
    height: 40,
    borderRadius: 8,
    fontFamily: 'var(--font-family-sans)',
    fontSize: 13,
    boxShadow: `var(${token.cssVar})`,
  };
  return (
    <div
      style={{
        border: '1px solid var(--border)',
        borderRadius: 8,
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
      <td style={uiCellStyle}>
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
      <td style={uiCellStyle}>{token.name}</td>
      <td style={codeCellStyle}>{token.cssVar}</td>
      <td style={codeCellStyle}>{token.reference}</td>
      <td style={codeCellStyle}>{resolved || '…'}</td>
      <td style={{ ...uiCellStyle, opacity: 0.75, fontSize: 13, maxWidth: 260 }}>{token.note ?? ''}</td>
    </tr>
  );
}

export const Overview: Story = {
  argTypes: { variant: variantArgType, control: controlArgType },
  args: { variant: 'Primary', control: 'Button' },
  render: () => {
    const [args, updateArgs] = useArgs<Args>();
    const variant: Variant = args.variant ?? 'Primary';
    const control: Control = args.control ?? 'Button';
    return (
      <div>
        <EffectsNotice>
          <strong>Focus Rings</strong> are semantic visual-emphasis effects for focused/active
          interactive elements — not elevation. Every ring color is a semantic state color
          (interaction feedback) and consumes its matching semantic color token — never a raw or
          theme-layer value directly — so each ring correctly tracks its token's value across
          Light and Dark.
        </EffectsNotice>

        <EffectsSectionHeading>Interactive Example</EffectsSectionHeading>
        {/* Variant is an unordered semantic set → select; Control is a short
         * binary choice → shared InlineSegmentedControl. */}
        <label className="mb-3 block max-w-sm">
          <span className="mb-1.5 block font-sans text-xs text-muted-foreground">Variant</span>
          <select
            value={variant}
            onChange={(e) => updateArgs({ variant: e.target.value as Variant })}
            className="w-full rounded-md border border-input bg-background px-3 py-1.5 font-sans text-sm"
          >
            {variantArgType.options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
        <InlineSegmentedControl
          label="Control"
          value={control}
          options={['Input', 'Button']}
          onChange={(c) => updateArgs({ control: c })}
          className="mb-3"
        />
        <FocusRingPreview variant={variant} control={control} />

        <EffectsSectionHeading>Reference Table</EffectsSectionHeading>
        <table style={{ borderCollapse: 'collapse', width: '100%', marginBottom: 24 }}>
          <thead>
            <tr>
              <th style={{ ...uiCellStyle, textAlign: 'left' }}>Preview</th>
              <th style={{ ...uiCellStyle, textAlign: 'left' }}>Token</th>
              <th style={{ ...uiCellStyle, textAlign: 'left' }}>CSS Variable</th>
              <th style={{ ...uiCellStyle, textAlign: 'left' }}>Aliases</th>
              <th style={{ ...uiCellStyle, textAlign: 'left' }}>Resolved Value</th>
              <th style={{ ...uiCellStyle, textAlign: 'left' }}>Note</th>
            </tr>
          </thead>
          <tbody>
            {focusRings.map((r) => (
              <FocusRingRow key={r.cssVar} token={r} />
            ))}
          </tbody>
        </table>

        <EffectsSectionHeading>Architecture Notes</EffectsSectionHeading>
        <EffectsNotice>
          Effects represent interaction and visual emphasis; Shadows represent elevation. Focus
          rings derive their color exclusively from semantic color tokens (<code>--ring</code>,{' '}
          <code>--ring-primary</code>, <code>--sidebar-ring</code>, <code>--ring-success</code>,{' '}
          <code>--ring-alert</code>, <code>--ring-error</code>) — never a raw or theme-layer value
          directly, since each ring represents a semantic interaction state. "Primary Glow" is the
          one deliberate exception: its outline still uses the semantic{' '}
          <code>--ring-primary</code>, but the soft halo behind it is the same invariant{' '}
          <code>--theme-neutrals-600</code> neutral the Glows foundation uses — that halo is a
          visual-treatment color, not a state color, so it intentionally does not switch per
          theme. Consumers should think in terms of semantic intent (which ring to use, for what
          purpose) rather than how many shadow layers implement it.
        </EffectsNotice>
      </div>
    );
  },
};
