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

function pair(name: string, step: string): ShadowToken[] {
  return [
    {
      name: `${name}-black`,
      cssVar: `--shadow-${name}-black`,
      reference: `--theme-alpha-black-no-switch-${step}`,
      polarity: 'black',
    },
    {
      name: `${name}-white`,
      cssVar: `--shadow-${name}-white`,
      reference: `--theme-alpha-white-no-switch-${step}`,
      polarity: 'white',
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

const directional: ShadowToken[] = [...pair('upper', '10'), ...pair('right', '10'), ...pair('left', '10')];

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
        explicit prop. This one rule applies to every token in the foundation, including{' '}
        <code>upper</code>, <code>right</code>, and <code>left</code> — Fabely additions to the
        scale rather than original Obra tokens, so they follow the same architecture as everything
        else here rather than a special case.
      </PendingNotice>

      <SectionHeading>shadows / scale</SectionHeading>
      <ShadowSwatchTable tokens={scale} />

      <SectionHeading>shadows / directional</SectionHeading>
      <ShadowSwatchTable tokens={directional} />
    </div>
  ),
};
