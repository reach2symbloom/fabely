import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
} from 'recharts';
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from './chart';
import { InlineSegmentedControl } from '../../../stories/InlineSegmentedControl';
import { PlaygroundPanel } from '../../../stories/PlaygroundPanel';
import {
  PRIMITIVE_PLAYGROUND_CONTROL_GRID,
  PrimitiveGalleryItem,
  PrimitivePage,
} from '../../../stories/PrimitivePage';

/**
 * Component Storybook IA (see docs/DESIGN.md "Component Story Structure"):
 * Overview first — Playground, Variants gallery, usage, a11y — then focused
 * example pages. Figma chart colors + shadcn / Recharts composition.
 */

const meta = {
  title: 'Design System/Primitives/Chart',
  component: ChartContainer,
  tags: ['ai-generated'],
  parameters: { layout: 'centered' },
} satisfies Meta;

export default meta;
type Story = StoryObj;

const chartData = [
  { month: 'January', desktop: 186, mobile: 80 },
  { month: 'February', desktop: 305, mobile: 200 },
  { month: 'March', desktop: 237, mobile: 120 },
  { month: 'April', desktop: 73, mobile: 190 },
  { month: 'May', desktop: 209, mobile: 130 },
  { month: 'June', desktop: 214, mobile: 140 },
];

const chartConfig = {
  desktop: {
    label: 'Desktop',
    color: 'var(--chart-1)',
  },
  mobile: {
    label: 'Mobile',
    color: 'var(--chart-2)',
  },
} satisfies ChartConfig;

const BAR_RADIUS = 5; /* Foundations --rounded-sm */

type TooltipIndicator = 'dot' | 'line' | 'dashed';

function BarExample({
  showGrid = true,
  showLegend = true,
  showTooltip = true,
  indicator = 'dot',
  dir,
}: {
  showGrid?: boolean;
  showLegend?: boolean;
  showTooltip?: boolean;
  indicator?: TooltipIndicator;
  dir?: 'ltr' | 'rtl';
} = {}) {
  return (
    <ChartContainer
      config={chartConfig}
      className="min-h-[200px] w-full max-w-lg"
      dir={dir}
    >
      <BarChart accessibilityLayer data={chartData}>
        {showGrid ? <CartesianGrid vertical={false} /> : null}
        <XAxis
          dataKey="month"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => String(value).slice(0, 3)}
        />
        {showTooltip ? (
          <ChartTooltip
            content={<ChartTooltipContent indicator={indicator} />}
          />
        ) : null}
        {showLegend ? (
          <ChartLegend content={<ChartLegendContent />} />
        ) : null}
        <Bar
          dataKey="desktop"
          fill="var(--color-desktop)"
          radius={BAR_RADIUS}
        />
        <Bar
          dataKey="mobile"
          fill="var(--color-mobile)"
          radius={BAR_RADIUS}
        />
      </BarChart>
    </ChartContainer>
  );
}

/* ---------- Playground ---------- */

function ChartPlayground() {
  const [showGrid, setShowGrid] = useState(true);
  const [showLegend, setShowLegend] = useState(true);
  const [showTooltip, setShowTooltip] = useState(true);
  const [indicator, setIndicator] = useState<TooltipIndicator>('dot');

  return (
    <PlaygroundPanel
      preview={
        <BarExample
          showGrid={showGrid}
          showLegend={showLegend}
          showTooltip={showTooltip}
          indicator={indicator}
        />
      }
      controls={
        <div className={PRIMITIVE_PLAYGROUND_CONTROL_GRID}>
          <InlineSegmentedControl
            label="Grid"
            value={showGrid ? 'on' : 'off'}
            options={[
              { value: 'off', label: 'Off' },
              { value: 'on', label: 'On' },
            ]}
            onChange={(v) => setShowGrid(v === 'on')}
            fullWidth
          />
          <InlineSegmentedControl
            label="Legend"
            value={showLegend ? 'on' : 'off'}
            options={[
              { value: 'off', label: 'Off' },
              { value: 'on', label: 'On' },
            ]}
            onChange={(v) => setShowLegend(v === 'on')}
            fullWidth
          />
          <InlineSegmentedControl
            label="Tooltip"
            value={showTooltip ? 'on' : 'off'}
            options={[
              { value: 'off', label: 'Off' },
              { value: 'on', label: 'On' },
            ]}
            onChange={(v) => setShowTooltip(v === 'on')}
            fullWidth
          />
          <InlineSegmentedControl
            label="Indicator"
            value={indicator}
            options={[
              { value: 'dot', label: 'Dot' },
              { value: 'line', label: 'Line' },
              { value: 'dashed', label: 'Dashed' },
            ]}
            onChange={(v) => setIndicator(v as TooltipIndicator)}
            fullWidth
          />
        </div>
      }
    />
  );
}

/* ---------- Stories ---------- */

export const Overview: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => (
    <PrimitivePage
      title="Chart"
      description={
        <>
          Recharts composition helpers — <code>ChartContainer</code>, tooltip,
          and legend — themed with Figma <code>--chart-1</code>…{' '}
          <code>--chart-5</code>. Build charts with Recharts; import helpers
          from this primitive. API follows{' '}
          <a
            href="https://ui.shadcn.com/docs/components/base/chart"
            className="underline underline-offset-2"
          >
            shadcn Chart
          </a>
          .
        </>
      }
      playground={<ChartPlayground />}
      variants={
        <div className="flex w-full flex-col gap-8">
          <PrimitiveGalleryItem label="Basic">
            <BarExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Tooltip line">
            <BarExample indicator="line" showLegend={false} />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="No legend">
            <BarExample showLegend={false} />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="RTL">
            <BarExample dir="rtl" />
          </PrimitiveGalleryItem>
        </div>
      }
      usageGuidance={
        <ul className="list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
          <li>
            Define a <code>ChartConfig</code> with labels and{' '}
            <code>var(--chart-*)</code> (or theme) colors — not hex in app code.
          </li>
          <li>
            Reference series fills as <code>var(--color-KEY)</code> after the
            config keys.
          </li>
          <li>
            Give <code>ChartContainer</code> a height (
            <code>min-h-*</code> / <code>h-*</code> / <code>aspect-*</code>) so
            Recharts can measure.
          </li>
          <li>
            Prefer <code>accessibilityLayer</code> on the Recharts root chart.
          </li>
        </ul>
      }
      accessibility={
        <ul className="list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
          <li>
            Pass <code>accessibilityLayer</code> on <code>BarChart</code> /{' '}
            <code>LineChart</code> for keyboard and screen-reader support.
          </li>
          <li>
            Tooltip and legend text come from <code>ChartConfig</code> labels —
            keep them human-readable.
          </li>
        </ul>
      }
    />
  ),
};

export const Default: Story = {
  name: 'Basic',
  render: () => <BarExample />,
};

export const TooltipLine: Story = {
  name: 'Tooltip line',
  render: () => <BarExample indicator="line" showLegend={false} />,
};

export const NoLegend: Story = {
  name: 'No legend',
  render: () => <BarExample showLegend={false} />,
};

export const RTL: Story = {
  render: () => <BarExample dir="rtl" />,
};
