/**
 * Component Storybook IA (see docs/DESIGN.md "Component Story Structure"):
 * Overview first — Playground, Variants gallery, usage, a11y — then focused
 * example pages. shadcn Tabs guide (Base UI Tabs).
 */

import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { AppWindowIcon, CodeIcon, SquareDashedIcon } from 'lucide-react';

import { InlineSegmentedControl } from '../../../stories/InlineSegmentedControl';
import { PlaygroundPanel } from '../../../stories/PlaygroundPanel';
import {
  PRIMITIVE_PLAYGROUND_CONTROL_GRID,
  PrimitiveGalleryItem,
  PrimitivePage,
} from '../../../stories/PrimitivePage';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../card';
import { DirectionProvider } from '../direction';

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  type TabsSize,
} from './tabs';

const meta = {
  title: 'Design System/Primitives/Tabs',
  component: Tabs,
  tags: ['ai-generated'],
  parameters: { layout: 'centered' },
} satisfies Meta;

export default meta;
type Story = StoryObj;

type Variant = 'default' | 'line';

const VARIANTS: Variant[] = ['default', 'line'];
const SIZES: TabsSize[] = ['sm', 'default', 'lg'];

/** shadcn tabs-demo — Overview / Analytics / Reports / Settings + Card. */
function DemoExample() {
  return (
    <div className="flex w-full max-w-md flex-col gap-[length:var(--spacing-md)]">
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Overview</CardTitle>
              <CardDescription>
                View your key metrics and recent project activity. Track
                progress across all your active projects.
              </CardDescription>
            </CardHeader>
            <CardContent>
              You have 12 active projects and 3 pending tasks.
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Analytics</CardTitle>
              <CardDescription>
                Traffic and engagement metrics for this period.
              </CardDescription>
            </CardHeader>
            <CardContent>
              Sessions are up 8% week over week.
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>Reports</CardTitle>
              <CardDescription>
                Exportable weekly and monthly summaries.
              </CardDescription>
            </CardHeader>
            <CardContent>3 reports are ready to download.</CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
              <CardDescription>
                Notification preferences and workspace defaults.
              </CardDescription>
            </CardHeader>
            <CardContent>Manage how updates reach your team.</CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function LineExample() {
  return (
    <Tabs defaultValue="overview" className="w-full max-w-md">
      <TabsList variant="line">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
        <TabsTrigger value="reports">Reports</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">
        Project overview and recent activity.
      </TabsContent>
      <TabsContent value="analytics">
        Traffic and engagement metrics.
      </TabsContent>
      <TabsContent value="reports">Exportable weekly reports.</TabsContent>
    </Tabs>
  );
}

/** shadcn tabs-vertical — Account / Password / Notifications. */
function VerticalExample() {
  return (
    <Tabs
      defaultValue="account"
      orientation="vertical"
      className="min-h-40 w-full max-w-md"
    >
      <TabsList>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
      </TabsList>
      <TabsContent value="account">Make changes to your account here.</TabsContent>
      <TabsContent value="password">Change your password here.</TabsContent>
      <TabsContent value="notifications">
        Configure how you receive alerts.
      </TabsContent>
    </Tabs>
  );
}

/** shadcn tabs-disabled. */
function DisabledExample() {
  return (
    <Tabs defaultValue="home">
      <TabsList>
        <TabsTrigger value="home">Home</TabsTrigger>
        <TabsTrigger value="disabled" disabled>
          Disabled
        </TabsTrigger>
      </TabsList>
      <TabsContent value="home">Home panel.</TabsContent>
    </Tabs>
  );
}

/** shadcn tabs-icons — AppWindow / Code. */
function IconsExample() {
  return (
    <Tabs defaultValue="preview">
      <TabsList>
        <TabsTrigger value="preview">
          <AppWindowIcon data-icon="inline-start" />
          Preview
        </TabsTrigger>
        <TabsTrigger value="code">
          <CodeIcon data-icon="inline-start" />
          Code
        </TabsTrigger>
      </TabsList>
      <TabsContent value="preview">Live preview panel.</TabsContent>
      <TabsContent value="code">Source code panel.</TabsContent>
    </Tabs>
  );
}

function SizeExample() {
  return (
    <div className="flex flex-col gap-[var(--spacing-md)]">
      <Tabs defaultValue="one">
        <TabsList size="sm">
          <TabsTrigger value="one">Small</TabsTrigger>
          <TabsTrigger value="two">Label</TabsTrigger>
        </TabsList>
      </Tabs>
      <Tabs defaultValue="one">
        <TabsList size="default">
          <TabsTrigger value="one">
            <SquareDashedIcon data-icon="inline-start" />
            Default
          </TabsTrigger>
          <TabsTrigger value="two">
            <SquareDashedIcon data-icon="inline-start" />
            Label
          </TabsTrigger>
        </TabsList>
      </Tabs>
      <Tabs defaultValue="one">
        <TabsList size="lg">
          <TabsTrigger value="one">Large</TabsTrigger>
          <TabsTrigger value="two">Label</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}

function RtlExample() {
  return (
    <DirectionProvider direction="rtl">
      <div dir="rtl" className="w-full max-w-md">
        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
            <TabsTrigger value="analytics">التحليلات</TabsTrigger>
            <TabsTrigger value="reports">التقارير</TabsTrigger>
            <TabsTrigger value="settings">الإعدادات</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            عرض مقاييسك الرئيسية وأنشطة المشروع الأخيرة. تتبع التقدم عبر جميع
            مشاريعك النشطة.
          </TabsContent>
          <TabsContent value="analytics">محتوى التحليلات.</TabsContent>
          <TabsContent value="reports">محتوى التقارير.</TabsContent>
          <TabsContent value="settings">محتوى الإعدادات.</TabsContent>
        </Tabs>
      </div>
    </DirectionProvider>
  );
}

function TabsPlayground() {
  const [variant, setVariant] = useState<Variant>('default');
  const [size, setSize] = useState<TabsSize>('default');
  const [showIcon, setShowIcon] = useState(true);
  const [showText, setShowText] = useState(true);

  const labels = ['Overview', 'Analytics', 'Reports'] as const;
  const values = ['overview', 'analytics', 'reports'] as const;

  return (
    <PlaygroundPanel
      preview={
        <div className="flex min-h-40 w-full max-w-md items-center justify-center overflow-visible p-[length:var(--spacing-sm)]">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList variant={variant} size={size}>
              {values.map((value, i) => {
                const label = labels[i];
                const iconOnly = showIcon && !showText;
                return (
                  <TabsTrigger
                    key={value}
                    value={value}
                    aria-label={iconOnly ? label : undefined}
                  >
                    {showIcon ? (
                      <SquareDashedIcon data-icon="inline-start" />
                    ) : null}
                    {showIcon ? (showText ? label : null) : label}
                  </TabsTrigger>
                );
              })}
            </TabsList>
            <TabsContent value="overview">
              Project overview and recent activity.
            </TabsContent>
            <TabsContent value="analytics">
              Traffic and engagement metrics.
            </TabsContent>
            <TabsContent value="reports">
              Exportable weekly reports.
            </TabsContent>
          </Tabs>
        </div>
      }
      controls={
        <div className={PRIMITIVE_PLAYGROUND_CONTROL_GRID}>
          <InlineSegmentedControl
            label="Variant"
            value={variant}
            onChange={(v) => setVariant(v as Variant)}
            options={VARIANTS.map((value) => ({ value, label: value }))}
            fullWidth
          />
          <InlineSegmentedControl
            label="Size"
            value={size}
            onChange={(v) => setSize(v as TabsSize)}
            options={SIZES.map((value) => ({ value, label: value }))}
            fullWidth
          />
          <InlineSegmentedControl
            label="Icon"
            value={showIcon ? 'y' : 'n'}
            onChange={(v) => {
              const next = v === 'y';
              setShowIcon(next);
              if (!next) setShowText(true);
            }}
            options={[
              { value: 'y', label: 'y' },
              { value: 'n', label: 'n' },
            ]}
            fullWidth
          />
          {showIcon ? (
            <InlineSegmentedControl
              label="Text"
              value={showText ? 'y' : 'n'}
              onChange={(v) => setShowText(v === 'y')}
              options={[
                { value: 'y', label: 'y' },
                { value: 'n', label: 'n' },
              ]}
              fullWidth
            />
          ) : null}
        </div>
      }
    />
  );
}

export const Overview: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => (
    <PrimitivePage
      title="Tabs"
      description="Layered content panels with a segmented or underline tab list. Figma Tab (segmented / line); shadcn Tabs + Base UI API."
      playground={<TabsPlayground />}
      variants={
        <div className="flex flex-wrap gap-[var(--spacing-md)]">
          <PrimitiveGalleryItem label="Demo">
            <DemoExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Line">
            <LineExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Vertical">
            <VerticalExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Disabled">
            <DisabledExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Icons">
            <IconsExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Size">
            <SizeExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="RTL">
            <RtlExample />
          </PrimitiveGalleryItem>
        </div>
      }
      usageGuidance={
        <ul className="list-disc space-y-2 ps-5 text-sm text-muted-foreground">
          <li>
            Compose <code>Tabs</code> → <code>TabsList</code> →{' '}
            <code>TabsTrigger</code> + matching <code>TabsContent</code> panels.
          </li>
          <li>
            Figma Tabs (segmented) → list <code>variant=&quot;default&quot;</code>;
            Tabs (line) → <code>variant=&quot;line&quot;</code>.
          </li>
          <li>
            Size on <code>TabsList</code> cascades to triggers (Small / Default /
            Large).
          </li>
          <li>
            Prefer Lucide icons sized by the trigger (
            <code>--icon-sm</code>). Icon-only triggers need{' '}
            <code>aria-label</code>.
          </li>
        </ul>
      }
      accessibility={
        <ul className="list-disc space-y-2 ps-5 text-sm text-muted-foreground">
          <li>
            Base UI Tabs — arrow keys move focus across triggers; Enter / Space
            activates.
          </li>
          <li>
            Active tab exposes <code>data-active</code> /{' '}
            <code>aria-selected</code>; panels are associated via value.
          </li>
          <li>
            Disabled triggers skip activation and focus where Base UI omits
            them from the tab order.
          </li>
        </ul>
      }
    />
  ),
};

export const Demo: Story = {
  render: () => <DemoExample />,
};

export const Line: Story = {
  render: () => <LineExample />,
};

export const Vertical: Story = {
  render: () => <VerticalExample />,
};

export const Disabled: Story = {
  render: () => <DisabledExample />,
};

export const Icons: Story = {
  render: () => <IconsExample />,
};

export const Size: Story = {
  render: () => <SizeExample />,
};

export const RTL: Story = {
  render: () => <RtlExample />,
};
