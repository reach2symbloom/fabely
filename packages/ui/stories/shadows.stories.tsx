import type { Meta, StoryObj } from '@storybook/react-vite';
import { PendingNotice, SectionHeading } from './ColorSwatchTable';
import { ShadowSwatchTable, type ShadowToken } from './ShadowSwatchTable';

const meta = {
  title: 'Design System/Foundations/Shadows',
  tags: ['ai-generated'],
  parameters: { layout: 'padded' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const deviationNote =
  "Figma's color reference is the *switch* Alpha token (black in Light, white in Dark) — built here from the no-switch black/white pair at the same alpha step instead, per the explicit-polarity architecture above.";

function pair(name: string, step: string, note?: string): ShadowToken[] {
  return [
    {
      name: `${name}-black`,
      cssVar: `--shadow-${name}-black`,
      reference: `--theme-alpha-black-no-switch-${step}`,
      polarity: 'black',
      note,
    },
    {
      name: `${name}-white`,
      cssVar: `--shadow-${name}-white`,
      reference: `--theme-alpha-white-no-switch-${step}`,
      polarity: 'white',
      note,
    },
  ];
}

const scale: ShadowToken[] = [
  ...pair('2xs', '5'),
  ...pair('xs', '5'),
  ...pair('sm', '10'),
  ...pair('md', '10'),
  ...pair('lg', '10'),
  ...pair('xl', '333'),
  ...pair('2xl', '15'),
];

const directional: ShadowToken[] = [
  ...pair('upper', '10', deviationNote),
  ...pair('right', '10'),
  ...pair('left', '10', deviationNote),
];

export const AllTokens: Story = {
  render: () => (
    <div>
      <PendingNotice>
        Source: Figma "shadows" variable collection (66 entries) — composite, multi-layer
        elevation tokens. Like Stroke, Figma defines no separate unpublished primitive collection
        for Shadows — geometry (x/y/blur/spread) is literal, preserved exactly from Figma. Only
        the color layer aliases the existing Alpha theme tokens via <code>var()</code> (see{' '}
        <code>colors.css</code>) — no new colors are introduced here.
        <br />
        <br />
        Every token is published as a <strong>-black</strong> and a <strong>-white</strong>{' '}
        variant with identical geometry, differing only in which existing no-switch Alpha color
        they reference. These names describe the underlying shadow color, not a Light/Dark theme:{' '}
        <strong>shadow polarity is an explicit component decision</strong>, not theme-driven
        behavior — no token here automatically flips with the active theme. Components choose
        <code>-black</code> or <code>-white</code> directly, the same way they'd choose any other
        explicit prop.
        <br />
        <br />
        <strong>Deviation from literal Figma color references:</strong> Figma's{' '}
        <code>upper</code> and <code>left</code> tokens reference the switch Alpha color rather
        than a fixed no-switch one — flagged on the affected rows below. Per the black/white-only
        architecture, both are instead built from the no-switch pair at the same alpha step
        Figma specifies (10%), exactly like every other token here.
      </PendingNotice>

      <SectionHeading>shadows / scale</SectionHeading>
      <ShadowSwatchTable tokens={scale} />

      <SectionHeading>shadows / directional</SectionHeading>
      <ShadowSwatchTable tokens={directional} />
    </div>
  ),
};
