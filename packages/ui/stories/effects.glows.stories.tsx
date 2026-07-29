import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useState, type CSSProperties } from 'react';
import { PendingNotice, SectionHeading } from './ColorSwatchTable';

const meta = {
  title: 'Design System/Foundations/Effects/Glows',
  tags: ['ai-generated'],
  parameters: { layout: 'padded' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

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

function GlowCard({ token }: { token: GlowToken }) {
  const resolved = useResolvedValue(token.cssVar);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      <div
        style={{
          width: 140,
          height: 90,
          borderRadius: 10,
          background: 'var(--card)',
          boxShadow: `var(${token.cssVar})`,
        }}
      />
      <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: 12, opacity: 0.75 }}>{token.name}</div>
      <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: 11, opacity: 0.6 }}>{resolved || '…'}</div>
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
  render: () => (
    <div>
      <PendingNotice>
        <strong>Glows</strong> are semantic visual-emphasis effects — not elevation. Elevation is
        the Shadows foundation's exclusive concern; these effects happen to be implemented as
        drop-shadow geometry (the same mechanism Shadows uses), but represent a different kind of
        intent: interaction/emphasis, not surface elevation. No values here are renamed from
        Figma's own tokens or implementation.
      </PendingNotice>

      <SectionHeading>Interactive Example</SectionHeading>
      <div style={{ display: 'flex', gap: 32, padding: '16px 0' }}>
        {glows.map((g) => (
          <GlowCard key={g.cssVar} token={g} />
        ))}
      </div>

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
  ),
};
