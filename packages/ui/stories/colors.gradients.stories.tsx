import type { Meta, StoryObj } from '@storybook/react-vite';
import type { CSSProperties } from 'react';
import { ColorSwatchTable, type ColorToken } from './ColorSwatchTable';

const meta = {
  title: 'Design System/Foundations/Colors/Gradients',
  tags: ['ai-generated'],
  parameters: { layout: 'padded' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const primaryTokens: ColorToken[] = [
  {
    name: 'Top → Bottom',
    cssVar: '--gradient-primary-top-bottom',
    reference: '--tw-raw-primary-gradient-1, --tw-raw-primary-gradient-2',
  },
  {
    name: 'Bottom → Top',
    cssVar: '--gradient-primary-bottom-top',
    reference: '--tw-raw-primary-gradient-1, --tw-raw-primary-gradient-2',
  },
  {
    name: 'Left → Right',
    cssVar: '--gradient-primary-left-right',
    reference: '--tw-raw-primary-gradient-1, --tw-raw-primary-gradient-2',
  },
  {
    name: 'Right → Left',
    cssVar: '--gradient-primary-right-left',
    reference: '--tw-raw-primary-gradient-1, --tw-raw-primary-gradient-2',
  },
];

const panelStyle: CSSProperties = {
  width: 160,
  height: 100,
  borderRadius: 8,
  border: '1px solid var(--border)',
};

function Panel({ token }: { token: ColorToken }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center' }}>
      <div style={{ ...panelStyle, background: `var(${token.cssVar})` }} />
      <span style={{ fontFamily: 'ui-sans-serif, system-ui, sans-serif', fontSize: 13, opacity: 0.75 }}>
        {token.name}
      </span>
    </div>
  );
}

/** Gradients — a category within Colors for reusable brand gradient treatments, not
 * component-specific effects (see Foundations/Effects for those). Primary is the first gradient
 * in this category. */
export const Primary: Story = {
  render: () => (
    <div>
      <p style={{ fontFamily: 'ui-sans-serif, system-ui, sans-serif', opacity: 0.75 }}>
        A two-stop linear-gradient between the existing{' '}
        <code>--tw-raw-primary-gradient-1/2</code> pole colors (see Colors/Raw), in the four
        canonical directions. Unlike the rest of Colors, there's no separate raw layer for
        Gradients specifically — Figma has no "gradient" variable type, so the raw pole colors
        are the only Figma-authored asset; this token is built directly from them via{' '}
        <code>var()</code>. No new color values are introduced here.
      </p>

      <div style={{ display: 'flex', gap: 24, marginBottom: 32, flexWrap: 'wrap' }}>
        {primaryTokens.map((t) => (
          <Panel key={t.cssVar} token={t} />
        ))}
      </div>

      <ColorSwatchTable tokens={primaryTokens} referenceLabel="Aliases (tw-raw)" />
    </div>
  ),
};
