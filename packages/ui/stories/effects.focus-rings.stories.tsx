import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useState, type CSSProperties } from 'react';
import { PendingNotice, SectionHeading } from './ColorSwatchTable';

const meta = {
  title: 'Design System/Foundations/Effects/Focus Rings',
  tags: ['ai-generated'],
  parameters: { layout: 'padded' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

type FocusRingToken = {
  name: string;
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

/** Simulates a focused control (rather than requiring the viewer to actually
 * click/tab into something) so the purpose of each ring is immediately
 * visible without interaction. */
function FocusedControl({ token }: { token: FocusRingToken }) {
  const resolved = useResolvedValue(token.cssVar);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      <div
        style={{
          width: 120,
          height: 40,
          borderRadius: 8,
          background: 'var(--secondary)',
          color: 'var(--secondary-foreground)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'ui-sans-serif, system-ui, sans-serif',
          fontSize: 13,
          boxShadow: `var(${token.cssVar})`,
        }}
      >
        Button
      </div>
      <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: 12, opacity: 0.75 }}>{token.name}</div>
      <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: 11, opacity: 0.6, maxWidth: 140, textAlign: 'center' }}>
        {resolved || '…'}
      </div>
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
  render: () => (
    <div>
      <PendingNotice>
        <strong>Focus Rings</strong> are semantic visual-emphasis effects for focused/active
        interactive elements — not elevation. Each ring's color is preserved exactly as Figma
        binds it: most reference an existing semantic color token; a couple reference the raw
        color layer directly (flagged per-row below) rather than their own semantic ring token,
        which is Figma's actual current wiring, not something normalized away here.
      </PendingNotice>

      <SectionHeading>Interactive Example</SectionHeading>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 32, padding: '16px 0' }}>
        {focusRings.map((r) => (
          <FocusedControl key={r.cssVar} token={r} />
        ))}
      </div>

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
  ),
};
