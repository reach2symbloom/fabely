import type { Meta, StoryObj } from '@storybook/react-vite';
import { ColorSwatchTable, SectionHeading, PendingNotice, type ColorToken } from './ColorSwatchTable';

const meta = {
  title: 'Design System/Foundations/Colors/theme-alpha',
  tags: ['ai-generated'],
  parameters: { layout: 'padded' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const steps: { step: string; label: string }[] = [
  { step: '0', label: '0%' },
  { step: '001', label: '0.01%' },
  { step: '333', label: '3.33%' },
  { step: '5', label: '5%' },
  { step: '10', label: '10%' },
  { step: '15', label: '15%' },
  { step: '20', label: '20%' },
  { step: '25', label: '25%' },
  { step: '30', label: '30%' },
  { step: '40', label: '40%' },
  { step: '50', label: '50%' },
  { step: '60', label: '60%' },
  { step: '70', label: '70%' },
  { step: '75', label: '75%' },
  { step: '80', label: '80%' },
  { step: '85', label: '85%' },
  { step: '90', label: '90%' },
  { step: '95', label: '95%' },
  { step: '100', label: '100%' },
];

// "switch" groups flip base color between Light and Dark — reference documents
// both; the Resolved Value column reflects whichever mode is active.
function switchGroup(prefix: string, lightVar: string, darkVar: string): ColorToken[] {
  return steps.map(({ step, label }) => ({
    name: `alpha-${step}`,
    cssVar: `--theme-alpha-${prefix}-${step}`,
    reference: `${lightVar} (Light) ↔ ${darkVar} (Dark) @ ${label}`,
  }));
}

// "no-switch" groups keep the same base color in both modes.
function noSwitchGroup(prefix: string, baseVar: string): ColorToken[] {
  return steps.map(({ step, label }) => ({
    name: `alpha-${step}`,
    cssVar: `--theme-alpha-${prefix}-${step}`,
    reference: `${baseVar} (Light & Dark) @ ${label}`,
  }));
}

const whiteSwitch = switchGroup('white-switch', '--tw-raw-white', '--tw-raw-black');
const whiteNoSwitch = noSwitchGroup('white-no-switch', '--tw-raw-white');
const blackSwitch = switchGroup('black-switch', '--tw-raw-black', '--tw-raw-white');
const blackNoSwitch = noSwitchGroup('black-no-switch', '--tw-raw-black');

export const AllTokens: Story = {
  render: () => (
    <div>
      <PendingNotice>
        Source: Figma "theme-alpha" collection. Every opacity step is aliased from{' '}
        <code>tw-raw-white</code> / <code>tw-raw-black</code> via <code>color-mix()</code> — no
        literal hex/rgba values — so tw-raw remains the single source of truth for the underlying
        color. <strong>switch</strong> groups flip their base color between Light and Dark;{' '}
        <strong>no-switch</strong> groups keep the same base color in both modes. Both behaviors
        are intentional per Figma and preserved exactly.
        <br />
        <br />
        Use the <strong>Theme</strong> toolbar toggle above to switch Light/Dark and see the
        Resolved Value column update.
      </PendingNotice>

      <SectionHeading>alpha / white / switch</SectionHeading>
      <ColorSwatchTable tokens={whiteSwitch} referenceLabel="Aliases (tw-raw)" />

      <SectionHeading>alpha / white / no-switch</SectionHeading>
      <ColorSwatchTable tokens={whiteNoSwitch} referenceLabel="Aliases (tw-raw)" />

      <SectionHeading>alpha / black / switch</SectionHeading>
      <ColorSwatchTable tokens={blackSwitch} referenceLabel="Aliases (tw-raw)" />

      <SectionHeading>alpha / black / no-switch</SectionHeading>
      <ColorSwatchTable tokens={blackNoSwitch} referenceLabel="Aliases (tw-raw)" />
    </div>
  ),
};
