import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useState, type CSSProperties } from 'react';
import { PendingNotice, SectionHeading } from './ColorSwatchTable';

const meta = {
  title: 'Design System/Foundations/Shadows',
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
  padding: '8px 12px',
  borderBottom: '1px solid var(--border)',
  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
  fontSize: 13,
  verticalAlign: 'top',
};

// Each variant previews against a fixed background matching the surface it's
// designed for (light card for sm-light, dark card for sm-dark) — regardless
// of the page's active Light/Dark toggle — so both polarities are visible
// side by side for comparison, which is the whole point of this POC.
function PolarityCard({
  label,
  cssVar,
  cardBg,
  cardText,
}: {
  label: string;
  cssVar: string;
  cardBg: string;
  cardText: string;
}) {
  const resolved = useResolvedValue(cssVar);
  return (
    <tr>
      <td style={cellStyle}>
        <div
          style={{
            width: 160,
            height: 100,
            background: cardBg,
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              width: 96,
              height: 56,
              borderRadius: 6,
              background: cardBg,
              color: cardText,
              boxShadow: `var(${cssVar})`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 11,
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
            }}
          >
            {label}
          </div>
        </div>
      </td>
      <td style={cellStyle}>{label}</td>
      <td style={cellStyle}>{cssVar}</td>
      <td style={cellStyle}>{resolved || '…'}</td>
    </tr>
  );
}

export const ShadowSmPoc: Story = {
  name: 'sm (POC)',
  render: () => (
    <div>
      <PendingNotice>
        <strong>Proof of concept — sm only.</strong> Figma's "sm" shadow token specifies one
        Light-mode color (<code>--theme-alpha-black-no-switch-10</code>) applied to both of its
        shadow layers. This POC splits <code>sm</code> into two semantic variants —{' '}
        <code>sm-light</code> and <code>sm-dark</code> — that share the exact same geometry (two
        stacked layers: <code>0 1px 3px 0</code> and <code>0 1px 2px -1px</code>) and differ{' '}
        <strong>only</strong> in which existing Alpha color they reference:
        <code>--theme-alpha-black-no-switch-10</code> for light,{' '}
        <code>--theme-alpha-white-no-switch-10</code> for dark. Neither is a new color — both
        already exist in the Alpha theme layer. Preview cards below render against a fixed
        light/dark background (not the page's Light/Dark toggle) so both polarities are visible
        at once for review.
        <br />
        <br />
        Not yet implemented, pending review of this pattern: <code>2xs</code>, <code>xs</code>,{' '}
        <code>md</code>, <code>lg</code>, <code>xl</code>, <code>2xl</code>, <code>upper</code>,{' '}
        <code>left</code>, <code>right</code>.
      </PendingNotice>

      <SectionHeading>shadows / sm</SectionHeading>
      <table style={{ borderCollapse: 'collapse', width: '100%', marginBottom: 24 }}>
        <thead>
          <tr>
            <th style={{ ...cellStyle, textAlign: 'left' }}>Preview</th>
            <th style={{ ...cellStyle, textAlign: 'left' }}>Token</th>
            <th style={{ ...cellStyle, textAlign: 'left' }}>CSS Variable</th>
            <th style={{ ...cellStyle, textAlign: 'left' }}>Resolved Value</th>
          </tr>
        </thead>
        <tbody>
          <PolarityCard
            label="sm-light"
            cssVar="--shadow-sm-light"
            cardBg="var(--tw-raw-white)"
            cardText="var(--tw-raw-black)"
          />
          <PolarityCard
            label="sm-dark"
            cssVar="--shadow-sm-dark"
            cardBg="var(--tw-raw-black)"
            cardText="var(--tw-raw-white)"
          />
        </tbody>
      </table>
    </div>
  ),
};
