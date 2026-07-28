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

function group(prefix: string, referenceVar: string): ColorToken[] {
  return steps.map(({ step, label }) => ({
    name: `alpha-${step}`,
    cssVar: `--theme-alpha-${prefix}-${step}`,
    reference: `${referenceVar} @ ${label}`,
  }));
}

const whiteSwitchLight = group('white-switch', '--tw-raw-white');
const whiteSwitchDark = group('white-switch', '--tw-raw-black');
const whiteNoSwitch = group('white-no-switch', '--tw-raw-white');
const blackSwitchLight = group('black-switch', '--tw-raw-black');
const blackSwitchDark = group('black-switch', '--tw-raw-white');
const blackNoSwitch = group('black-no-switch', '--tw-raw-black');

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
      </PendingNotice>

      <SectionHeading>alpha / white / switch</SectionHeading>
      <p style={{ fontFamily: 'ui-sans-serif, system-ui, sans-serif', opacity: 0.75 }}>
        Light: tw-raw/white base. Dark: flips to tw-raw/black at the same opacity.
      </p>
      <SectionHeading>Light</SectionHeading>
      <ColorSwatchTable tokens={whiteSwitchLight} referenceLabel="Alias @ Opacity" />
      <SectionHeading>Dark</SectionHeading>
      <ColorSwatchTable tokens={whiteSwitchDark} referenceLabel="Alias @ Opacity" dark />

      <SectionHeading>alpha / white / no-switch</SectionHeading>
      <p style={{ fontFamily: 'ui-sans-serif, system-ui, sans-serif', opacity: 0.75 }}>
        tw-raw/white base in both Light and Dark — does not flip.
      </p>
      <SectionHeading>Light</SectionHeading>
      <ColorSwatchTable tokens={whiteNoSwitch} referenceLabel="Alias @ Opacity" />
      <SectionHeading>Dark</SectionHeading>
      <ColorSwatchTable tokens={whiteNoSwitch} referenceLabel="Alias @ Opacity" dark />

      <SectionHeading>alpha / black / switch</SectionHeading>
      <p style={{ fontFamily: 'ui-sans-serif, system-ui, sans-serif', opacity: 0.75 }}>
        Light: tw-raw/black base. Dark: flips to tw-raw/white at the same opacity.
      </p>
      <SectionHeading>Light</SectionHeading>
      <ColorSwatchTable tokens={blackSwitchLight} referenceLabel="Alias @ Opacity" />
      <SectionHeading>Dark</SectionHeading>
      <ColorSwatchTable tokens={blackSwitchDark} referenceLabel="Alias @ Opacity" dark />

      <SectionHeading>alpha / black / no-switch</SectionHeading>
      <p style={{ fontFamily: 'ui-sans-serif, system-ui, sans-serif', opacity: 0.75 }}>
        tw-raw/black base in both Light and Dark — does not flip.
      </p>
      <SectionHeading>Light</SectionHeading>
      <ColorSwatchTable tokens={blackNoSwitch} referenceLabel="Alias @ Opacity" />
      <SectionHeading>Dark</SectionHeading>
      <ColorSwatchTable tokens={blackNoSwitch} referenceLabel="Alias @ Opacity" dark />
    </div>
  ),
};
