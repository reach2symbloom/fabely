import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useState, type CSSProperties } from 'react';
import { useArgs } from 'storybook/preview-api';
import { EffectsNotice, EffectsSectionHeading, uiCellStyle, codeCellStyle } from './EffectsDocChrome';
import { InlineSegmentedControl } from './InlineSegmentedControl';

type Variant = 'Primary Glow 1' | 'Primary Glow 2';
type Args = { variant: Variant };

const meta = {
  title: 'Design System/Foundations/Effects/Glows',
  tags: ['ai-generated'],
  parameters: { layout: 'padded' },
} satisfies Meta;

export default meta;
type Story = StoryObj<Meta<Args>>;

const variantArgType = {
  control: { type: 'inline-radio' },
  options: ['Primary Glow 1', 'Primary Glow 2'],
} as const;

type GlowToken = {
  name: Variant;
  cssVar: string;
  reference: string;
  note?: string;
};

const glows: GlowToken[] = [
  {
    name: 'Primary Glow 1',
    cssVar: '--effect-glow-primary-1',
    reference: '0px 2px 5px 0px var(--theme-neutrals-600)',
  },
  {
    name: 'Primary Glow 2',
    cssVar: '--effect-glow-primary-2',
    reference: '0px 0px 5px 0px var(--theme-neutrals-600)',
    note: "Figma binds this to the \"Neutrals (New)\" collection — replaced here with the corresponding --theme-neutrals-600 it duplicates, per instruction.",
  },
];

const glowByVariant: Record<Variant, GlowToken> = {
  'Primary Glow 1': glows[0],
  'Primary Glow 2': glows[1],
};

function useResolvedValue(cssVar: string) {
  const [value, setValue] = useState('');
  useEffect(() => {
    setValue(getComputedStyle(document.documentElement).getPropertyValue(cssVar).trim());
  }, [cssVar]);
  return value;
}

/** Single representative specimen panel — a bordered preview panel rather
 * than a table row, matching the Typography Interactive Example pattern. */
function GlowPreview({ variant }: { variant: Variant }) {
  const token = glowByVariant[variant];
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
      <div
        style={{
          width: 140,
          height: 90,
          borderRadius: 10,
          background: 'var(--card)',
          boxShadow: `var(${token.cssVar})`,
        }}
      />
    </div>
  );
}

function GlowRow({ token }: { token: GlowToken }) {
  const resolved = useResolvedValue(token.cssVar);
  return (
    <tr>
      <td style={uiCellStyle}>
        <div style={{ width: 64, height: 48, borderRadius: 8, background: 'var(--card)', boxShadow: `var(${token.cssVar})` }} />
      </td>
      <td style={uiCellStyle}>{token.name}</td>
      <td style={codeCellStyle}>{token.cssVar}</td>
      <td style={codeCellStyle}>{resolved || '…'}</td>
      <td style={{ ...uiCellStyle, opacity: 0.75, fontSize: 13, maxWidth: 260 }}>{token.note ?? ''}</td>
    </tr>
  );
}

export const Overview: Story = {
  argTypes: { variant: variantArgType },
  args: { variant: 'Primary Glow 1' },
  render: () => {
    const [args, updateArgs] = useArgs<Args>();
    const variant: Variant = args.variant ?? 'Primary Glow 1';
    return (
      <div>
        <EffectsNotice>
          <strong>Glows</strong> are semantic visual-emphasis effects — not elevation. Elevation is
          the Shadows foundation's exclusive concern; these effects happen to be implemented as
          drop-shadow geometry (the same mechanism Shadows uses), but represent a different kind of
          intent: interaction/emphasis, not surface elevation. No values here are renamed from
          Figma's own tokens or implementation.
        </EffectsNotice>

        <EffectsSectionHeading>Interactive Example</EffectsSectionHeading>
        <InlineSegmentedControl
          value={variant}
          options={['Primary Glow 1', 'Primary Glow 2']}
          onChange={(v) => updateArgs({ variant: v })}
          ariaLabel="Variant"
          className="mb-6"
        />
        <GlowPreview variant={variant} />

        <EffectsSectionHeading>Reference Table</EffectsSectionHeading>
        <table style={{ borderCollapse: 'collapse', width: '100%', marginBottom: 24 }}>
          <thead>
            <tr>
              <th style={{ ...uiCellStyle, textAlign: 'left' }}>Preview</th>
              <th style={{ ...uiCellStyle, textAlign: 'left' }}>Token</th>
              <th style={{ ...uiCellStyle, textAlign: 'left' }}>CSS Variable</th>
              <th style={{ ...uiCellStyle, textAlign: 'left' }}>Resolved Value</th>
              <th style={{ ...uiCellStyle, textAlign: 'left' }}>Note</th>
            </tr>
          </thead>
          <tbody>
            {glows.map((g) => (
              <GlowRow key={g.cssVar} token={g} />
            ))}
          </tbody>
        </table>

        <EffectsSectionHeading>Architecture Notes</EffectsSectionHeading>
        <EffectsNotice>
          Effects represent interaction and visual emphasis; Shadows represent elevation. An effect
          may internally contain one or more shadow layers — consumers should think in terms of
          semantic intent (e.g. "this is a glow") rather than the implementation detail that it
          happens to be built from a drop shadow. No edge shadows were moved or duplicated here;
          those remain part of Shadows.
        </EffectsNotice>
      </div>
    );
  },
};
