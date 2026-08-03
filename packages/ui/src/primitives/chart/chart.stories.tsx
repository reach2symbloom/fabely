import type { Meta, StoryObj } from '@storybook/react-vite';
import { Bar, BarChart, XAxis } from 'recharts';
import { ChartContainer, type ChartConfig } from './chart';

import {
  PrimitivePage,
  PRIMITIVE_PAGE_SECTION_PLACEHOLDER,
} from '../../../stories/PrimitivePage';

/**
 * Thin-pass Storybook stub (see docs/DESIGN.md "Component Story Structure"
 * and src/primitives/README.md). Overview uses PrimitivePage; sections not
 * yet written use PRIMITIVE_PAGE_SECTION_PLACEHOLDER.
 */

const meta = {
  title: 'Design System/Primitives/Chart',
  component: ChartContainer,
  tags: ['ai-generated'],
  parameters: { layout: 'centered' },
} satisfies Meta;

export default meta;
type Story = StoryObj;

const chartConfig = {
  value: { label: 'Value', color: 'var(--primary)' },
} satisfies ChartConfig;

const chartData = [
  { name: 'One', value: 12 },
  { name: 'Two', value: 18 },
  { name: 'Three', value: 9 },
];


export const Overview: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => (
    <PrimitivePage
      title="Chart"
      description="Unstyled placeholder — not yet matched to Figma."
      playground={PRIMITIVE_PAGE_SECTION_PLACEHOLDER}
      variants={PRIMITIVE_PAGE_SECTION_PLACEHOLDER}
      usageGuidance={PRIMITIVE_PAGE_SECTION_PLACEHOLDER}
      accessibility={PRIMITIVE_PAGE_SECTION_PLACEHOLDER}
    />
  ),
};

export const Default: Story = {
  render: () => (
    <ChartContainer config={chartConfig} className="h-48 w-72">
      <BarChart data={chartData}>
        <XAxis dataKey="name" />
        <Bar dataKey="value" fill="var(--color-value)" radius={4} />
      </BarChart>
    </ChartContainer>
  ),
};
