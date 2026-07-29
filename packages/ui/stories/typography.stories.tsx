import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useState, type CSSProperties } from 'react';
import { PendingNotice, SectionHeading } from './ColorSwatchTable';

const meta = {
  title: 'Design System/Foundations/Typography/Font Definitions',
  tags: ['ai-generated'],
  parameters: { layout: 'padded' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

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

const monoCell: CSSProperties = { ...cellStyle, fontFamily: 'ui-monospace, monospace', fontSize: 13 };

type FamilyRow = { name: string; cssVar: string; family: string };
const families: FamilyRow[] = [
  { name: 'Sans', cssVar: '--font-family-sans', family: 'var(--font-family-sans)' },
  { name: 'Serif', cssVar: '--font-family-serif', family: 'var(--font-family-serif)' },
  { name: 'Monospace', cssVar: '--font-family-mono', family: 'var(--font-family-mono)' },
];

function FamilyRowView({ row }: { row: FamilyRow }) {
  const resolved = useResolvedValue(row.cssVar);
  return (
    <tr>
      <td style={{ ...cellStyle, fontFamily: row.family, fontSize: 22 }}>The quick brown fox — 0123456789</td>
      <td style={monoCell}>{row.name}</td>
      <td style={monoCell}>{row.cssVar}</td>
      <td style={monoCell}>{resolved || '…'}</td>
    </tr>
  );
}

type WeightRow = { name: string; cssVar: string; family: string; implFace: string };
const sansWeights: WeightRow[] = [
  { name: 'Light', cssVar: '--font-weight-sans-light', family: 'var(--font-family-sans)', implFace: 'Light' },
  { name: 'Regular', cssVar: '--font-weight-sans-regular', family: 'var(--font-family-sans)', implFace: 'Regular' },
  { name: 'Medium', cssVar: '--font-weight-sans-medium', family: 'var(--font-family-sans)', implFace: 'Medium' },
  { name: 'Bold', cssVar: '--font-weight-sans-bold', family: 'var(--font-family-sans)', implFace: 'Semibold' },
];
const serifWeights: WeightRow[] = [
  {
    name: 'Light',
    cssVar: '--font-weight-serif-light',
    family: 'var(--font-family-serif)',
    implFace: 'Light Unlicensed Trial',
  },
];
const monoWeights: WeightRow[] = [
  { name: 'Regular', cssVar: '--font-weight-mono-regular', family: 'var(--font-family-mono)', implFace: 'Regular' },
];

function WeightRowView({ row }: { row: WeightRow }) {
  const resolved = useResolvedValue(row.cssVar);
  return (
    <tr>
      <td style={{ ...cellStyle, fontFamily: row.family, fontWeight: `var(${row.cssVar})`, fontSize: 22 }}>
        The quick brown fox — 0123456789
      </td>
      <td style={monoCell}>{row.name}</td>
      <td style={monoCell}>{row.cssVar}</td>
      <td style={monoCell}>{resolved || '…'}</td>
      <td style={{ ...cellStyle, opacity: 0.75, fontSize: 13 }}>{row.implFace}</td>
    </tr>
  );
}

function FamilyTable({ rows }: { rows: FamilyRow[] }) {
  return (
    <table style={{ borderCollapse: 'collapse', width: '100%', marginBottom: 24 }}>
      <thead>
        <tr>
          <th style={{ ...cellStyle, textAlign: 'left' }}>Specimen</th>
          <th style={{ ...cellStyle, textAlign: 'left', width: 110 }}>Token</th>
          <th style={{ ...cellStyle, textAlign: 'left', width: 200 }}>CSS Variable</th>
          <th style={{ ...cellStyle, textAlign: 'left', width: 160 }}>Resolved Value</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <FamilyRowView key={r.cssVar} row={r} />
        ))}
      </tbody>
    </table>
  );
}

function WeightTable({ rows }: { rows: WeightRow[] }) {
  return (
    <table style={{ borderCollapse: 'collapse', width: '100%', marginBottom: 24 }}>
      <thead>
        <tr>
          <th style={{ ...cellStyle, textAlign: 'left' }}>Specimen</th>
          <th style={{ ...cellStyle, textAlign: 'left', width: 100 }}>Token</th>
          <th style={{ ...cellStyle, textAlign: 'left', width: 220 }}>CSS Variable</th>
          <th style={{ ...cellStyle, textAlign: 'left', width: 90 }}>Resolved</th>
          <th style={{ ...cellStyle, textAlign: 'left', width: 160 }}>Implementation Face</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <WeightRowView key={r.cssVar} row={r} />
        ))}
      </tbody>
    </table>
  );
}

export const FontDefinitions: Story = {
  render: () => (
    <div>
      <PendingNotice>
        <strong>Layer 1 — Font Definitions.</strong> The reusable typography primitives used
        throughout the design system: font families and semantic font weights. These are the
        public API — components reference <code>--font-family-*</code> and{' '}
        <code>--font-weight-{'{family}'}-*</code> rather than a raw family string or a literal
        font-file weight. The underlying <code>@font-face</code> assets are registered in{' '}
        <code>fonts.css</code> and are unchanged here.
        <br />
        <br />
        Weight names are semantic, not literal: Gellix's design-system <strong>Bold</strong> is
        implemented by the <em>Semibold</em> face (600), not the file literally named Bold (700).
        Sharp Serif currently exposes only <strong>Light</strong>, and Fira Mono only{' '}
        <strong>Regular</strong> — every other registered face (Sharp Serif Thin/Regular/Medium/
        Bold/ExtraBold, Gellix Thin/SemiBold/Bold/ExtraBold/Black, etc.) exists in{' '}
        <code>fonts.css</code> but is intentionally not exposed as a token here: unused weights
        are implementation assets, not part of the current design system.
        <br />
        <br />
        <strong>Layer 2 — Typography Styles</strong> (complete text styles: family + weight + size
        + line-height + paragraph-spacing + letter-spacing, sourced directly from Figma) is
        pending — not yet implemented.
      </PendingNotice>

      <SectionHeading>Font Definitions / families</SectionHeading>
      <FamilyTable rows={families} />

      <SectionHeading>Font Definitions / weights — Sans (Gellix)</SectionHeading>
      <WeightTable rows={sansWeights} />

      <SectionHeading>Font Definitions / weights — Serif (Sharp Serif)</SectionHeading>
      <WeightTable rows={serifWeights} />

      <SectionHeading>Font Definitions / weights — Monospace (Fira Mono)</SectionHeading>
      <WeightTable rows={monoWeights} />
    </div>
  ),
};
