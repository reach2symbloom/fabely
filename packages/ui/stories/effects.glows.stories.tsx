import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useState, type CSSProperties } from 'react';
import { useArgs } from 'storybook/preview-api';
import { PendingNotice, SectionHeading } from './ColorSwatchTable';

type Variant = 'Primary Glow 1' | 'Primary Glow 2';
type Surface = 'Canvas' | 'Card' | 'Elevated Card' | 'Dark Surface';
type Args = { variant: Variant; surface: Surface };

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

const surfaceArgType = {
  control: { type: 'inline-radio' },
  options: ['Canvas', 'Card', 'Elevated Card', 'Dark Surface'],
} as const;

type GlowToken = {
  name: string;
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

const cellStyle: CSSProperties = {
  padding: '10px 12px',
  borderBottom: '1px solid var(--border)',
  verticalAlign: 'middle',
};
const monoCell: CSSProperties = { ...cellStyle, fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', fontSize: 12 };

/** Generic clickable segmented control, reused for both Variant and Surface
 * — same inline-args pattern established by the Typography stories
 * (synced to Storybook's Controls panel via useArgs, inline is primary). */
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
        style={{ display: 'inline-flex', gap: 4, padding: 4, border: '1px solid var(--border)', borderRadius: 8 }}
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

/** The surface the glow subject sits on/in — lets designers evaluate a
 * glow in the actual contexts it might appear (bare canvas, a card, an
 * already-elevated card, or a forced-dark surface regardless of the
 * page's active theme). */
function surfaceContainerStyle(surface: Surface): CSSProperties {
  switch (surface) {
    case 'Canvas':
      return { background: 'var(--background)' };
    case 'Card':
      return { background: 'var(--card)', border: '1px solid var(--border)' };
    case 'Elevated Card':
      // Composes an actual Shadows-foundation elevation token with the
      // surface itself, demonstrating that Effects and Shadows can layer
      // independently — the elevation here is NOT the glow being documented.
      return { background: 'var(--card)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm-black)' };
    case 'Dark Surface':
      return { background: 'var(--tw-raw-black)' };
  }
}

function GlowPreview({ variant, surface }: { variant: Variant; surface: Surface }) {
  const token = glowByVariant[variant];
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
      <td style={cellStyle}>
        <div style={{ width: 64, height: 48, borderRadius: 8, background: 'var(--card)', boxShadow: `var(${token.cssVar})` }} />
      </td>
      <td style={cellStyle}>{token.name}</td>
      <td style={monoCell}>{token.cssVar}</td>
      <td style={monoCell}>{resolved || '…'}</td>
      <td style={{ ...cellStyle, opacity: 0.75, fontSize: 13, maxWidth: 260 }}>{token.note ?? ''}</td>
    </tr>
  );
}

export const Overview: Story = {
  argTypes: { variant: variantArgType, surface: surfaceArgType },
  args: { variant: 'Primary Glow 1', surface: 'Canvas' },
  render: () => {
    const [args, updateArgs] = useArgs<Args>();
    const variant: Variant = args.variant ?? 'Primary Glow 1';
    const surface: Surface = args.surface ?? 'Canvas';
    return (
      <div>
        <PendingNotice>
          <strong>Glows</strong> are semantic visual-emphasis effects — not elevation. Elevation is
          the Shadows foundation's exclusive concern; these effects happen to be implemented as
          drop-shadow geometry (the same mechanism Shadows uses), but represent a different kind of
          intent: interaction/emphasis, not surface elevation. No values here are renamed from
          Figma's own tokens or implementation.
        </PendingNotice>

        <SectionHeading>Interactive Example</SectionHeading>
        <InlineSegmentedControl
          label="Variant"
          value={variant}
          options={['Primary Glow 1', 'Primary Glow 2']}
          onChange={(v) => updateArgs({ variant: v })}
        />
        <InlineSegmentedControl
          label="Surface"
          value={surface}
          options={['Canvas', 'Card', 'Elevated Card', 'Dark Surface']}
          onChange={(s) => updateArgs({ surface: s })}
        />
        <GlowPreview variant={variant} surface={surface} />

        <SectionHeading>Reference Table</SectionHeading>
        <table style={{ borderCollapse: 'collapse', width: '100%', marginBottom: 24 }}>
          <thead>
            <tr>
              <th style={{ ...cellStyle, textAlign: 'left' }}>Preview</th>
              <th style={{ ...cellStyle, textAlign: 'left' }}>Token</th>
              <th style={{ ...cellStyle, textAlign: 'left' }}>CSS Variable</th>
              <th style={{ ...cellStyle, textAlign: 'left' }}>Resolved Value</th>
              <th style={{ ...cellStyle, textAlign: 'left' }}>Note</th>
            </tr>
          </thead>
          <tbody>
            {glows.map((g) => (
              <GlowRow key={g.cssVar} token={g} />
            ))}
          </tbody>
        </table>

        <SectionHeading>Architecture Notes</SectionHeading>
        <PendingNotice>
          Effects represent interaction and visual emphasis; Shadows represent elevation. An effect
          may internally contain one or more shadow layers — consumers should think in terms of
          semantic intent (e.g. "this is a glow") rather than the implementation detail that it
          happens to be built from a drop shadow. No edge shadows were moved or duplicated here;
          those remain part of Shadows.
        </PendingNotice>
      </div>
    );
  },
};
