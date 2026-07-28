import type { Meta, StoryObj } from '@storybook/react-vite';
import { ColorSwatchTable, SectionHeading, type ColorToken } from './ColorSwatchTable';

const meta = {
  title: 'Design System/Foundations/Colors/tw-raw',
  tags: ['ai-generated'],
  parameters: { layout: 'padded' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function group(prefix: string, steps: string[], mainStep?: string): ColorToken[] {
  return steps.map((step) => ({
    name: step === mainStep ? `${step} (main)` : step,
    cssVar: `--tw-raw-${prefix}-${step}`,
  }));
}

const base: ColorToken[] = [
  { name: 'white', cssVar: '--tw-raw-white' },
  { name: 'black', cssVar: '--tw-raw-black' },
];

const primaryGradient: ColorToken[] = [
  { name: '1', cssVar: '--tw-raw-primary-gradient-1' },
  { name: '2', cssVar: '--tw-raw-primary-gradient-2' },
];

const neutral: ColorToken[] = group(
  'neutral',
  ['50', '100', '150', '200', '300', '400', '500', '600', '700', '800', '850', '900', '950']
);

const fia: ColorToken[] = [
  { name: 'Ghost', cssVar: '--tw-raw-fia-ghost', note: '12% opacity per Figma' },
  ...group('fia', ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950']),
];

const secondary: ColorToken[] = [
  { name: 'Ghost', cssVar: '--tw-raw-secondary-ghost', note: '12% opacity per Figma' },
  ...group('secondary', ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950']),
];

const success: ColorToken[] = [
  { name: 'Ghost', cssVar: '--tw-raw-success-ghost', note: '12% opacity per Figma' },
  ...group('success', ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950']),
];

const error: ColorToken[] = [
  { name: 'Ghost', cssVar: '--tw-raw-error-ghost', note: '12% opacity per Figma' },
  ...group('error', ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950']),
];

const alert: ColorToken[] = [
  { name: 'Ghost', cssVar: '--tw-raw-alert-ghost', note: '8% opacity per Figma' },
  ...group('alert', ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950']),
];

const pantones: ColorToken[] = [
  { name: 'Blush', cssVar: '--tw-raw-pantones-blush' },
  { name: 'Lavendar', cssVar: '--tw-raw-pantones-lavendar' },
  { name: 'Rorange', cssVar: '--tw-raw-pantones-rorange' },
  { name: 'Salmon', cssVar: '--tw-raw-pantones-salmon' },
  { name: 'Pumpkin', cssVar: '--tw-raw-pantones-pumpkin' },
  { name: 'Saffron', cssVar: '--tw-raw-pantones-saffron' },
  { name: 'Muted olive', cssVar: '--tw-raw-pantones-muted-olive' },
  { name: 'Ginseng', cssVar: '--tw-raw-pantones-ginseng' },
  { name: 'Ginseng 2', cssVar: '--tw-raw-pantones-ginseng-2', note: '16% opacity per Figma' },
];

const blueMessaging: ColorToken[] = [
  { name: 'Ghost', cssVar: '--tw-raw-blue-messaging-ghost', note: '12% opacity per Figma' },
  ...group('blue-messaging', ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950']),
];

const sceneDesk: ColorToken[] = [
  { name: 'ghost', cssVar: '--tw-raw-scene-desk-ghost', note: '12% opacity per Figma' },
  { name: '500 (main)', cssVar: '--tw-raw-scene-desk-500' },
];

export const AllGroups: Story = {
  render: () => (
    <div>
      <p style={{ fontFamily: 'ui-sans-serif, system-ui, sans-serif', opacity: 0.75 }}>
        Layer 1 — Primitive (Raw). Source: Figma "shadcn-raw" collection, tw-raw/* group,
        light values only. These are the source of truth — no references, no aliases.
      </p>

      <SectionHeading>Base</SectionHeading>
      <ColorSwatchTable tokens={base} referenceLabel="Reference" />

      <SectionHeading>primary-gradient</SectionHeading>
      <ColorSwatchTable tokens={primaryGradient} referenceLabel="Reference" />

      <SectionHeading>neutral</SectionHeading>
      <ColorSwatchTable tokens={neutral} referenceLabel="Reference" />

      <SectionHeading>Fia</SectionHeading>
      <ColorSwatchTable tokens={fia} referenceLabel="Reference" />

      <SectionHeading>secondary</SectionHeading>
      <ColorSwatchTable tokens={secondary} referenceLabel="Reference" />

      <SectionHeading>success</SectionHeading>
      <ColorSwatchTable tokens={success} referenceLabel="Reference" />

      <SectionHeading>error</SectionHeading>
      <ColorSwatchTable tokens={error} referenceLabel="Reference" />

      <SectionHeading>alert</SectionHeading>
      <ColorSwatchTable tokens={alert} referenceLabel="Reference" />

      <SectionHeading>Pantones</SectionHeading>
      <ColorSwatchTable tokens={pantones} referenceLabel="Reference" />

      <SectionHeading>blue-messaging</SectionHeading>
      <ColorSwatchTable tokens={blueMessaging} referenceLabel="Reference" />

      <SectionHeading>scene-desk</SectionHeading>
      <ColorSwatchTable tokens={sceneDesk} referenceLabel="Reference" />
    </div>
  ),
};
