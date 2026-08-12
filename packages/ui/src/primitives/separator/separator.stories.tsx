import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import { InlineSegmentedControl } from '../../../stories/InlineSegmentedControl';
import { PlaygroundPanel } from '../../../stories/PlaygroundPanel';
import {
  PRIMITIVE_PLAYGROUND_CONTROL_GRID,
  PrimitiveGalleryItem,
  PrimitivePage,
} from '../../../stories/PrimitivePage';

import { Separator } from './separator';

/**
 * Component Storybook IA (see docs/DESIGN.md "Component Story Structure"):
 * Overview first — Playground + shadcn Separator docs (Vertical / Menu /
 * List / RTL).
 *
 * Docs: https://ui.shadcn.com/docs/components/base/separator
 * Figma: Separator (Divider) — Spacing × Orientation × Size
 */

const meta = {
  title: 'Design System/Primitives/Separator',
  component: Separator,
  tags: ['ai-generated'],
  parameters: { layout: 'centered' },
} satisfies Meta;

export default meta;
type Story = StoryObj;

const TITLE = [
  'font-[family-name:var(--text-paragraph-small-medium-font-family)]',
  '[font-weight:var(--text-paragraph-small-medium-font-weight)]',
  'text-[length:var(--text-paragraph-small-medium-font-size)]',
  'leading-[var(--text-paragraph-small-medium-line-height)]',
  'text-[color:var(--foreground)]',
].join(' ');

const BODY = [
  'font-[family-name:var(--text-paragraph-mini-regular-font-family)]',
  '[font-weight:var(--text-paragraph-mini-regular-font-weight)]',
  'text-[length:var(--text-paragraph-mini-regular-font-size)]',
  'leading-[var(--text-paragraph-mini-regular-line-height)]',
  'text-[color:var(--muted-foreground)]',
].join(' ');

/** shadcn separator-demo — horizontal between title and body. */
function DemoExample() {
  return (
    <div className="flex w-[length:var(--spacing-10xl)] flex-col gap-[var(--spacing-md)]">
      <div className="flex flex-col gap-[var(--spacing-2xs)]">
        <h4 className={TITLE}>Fabely</h4>
        <p className={BODY}>The foundation for your design system.</p>
      </div>
      <Separator />
      <div className="flex flex-col gap-[var(--spacing-2xs)]">
        <p className={BODY}>
          A set of beautifully designed components you can customize, extend,
          and build on.
        </p>
      </div>
    </div>
  );
}

/** shadcn vertical — Blog | Docs | Source. */
function VerticalExample() {
  return (
    <div className="flex h-[length:var(--spacing-3xl)] items-center gap-[var(--spacing-md)]">
      <span className={TITLE}>Blog</span>
      <Separator orientation="vertical" />
      <span className={TITLE}>Docs</span>
      <Separator orientation="vertical" />
      <span className={TITLE}>Source</span>
    </div>
  );
}

/** shadcn menu — vertical separators between labeled columns. */
function MenuExample() {
  return (
    <div className="flex h-[length:var(--spacing-5xl)] items-stretch gap-[var(--spacing-md)]">
      <div className="flex flex-col justify-center gap-[var(--spacing-3xs)]">
        <span className={TITLE}>Settings</span>
        <span className={BODY}>Manage preferences</span>
      </div>
      <Separator orientation="vertical" />
      <div className="flex flex-col justify-center gap-[var(--spacing-3xs)]">
        <span className={TITLE}>Account</span>
        <span className={BODY}>Profile &amp; security</span>
      </div>
      <Separator orientation="vertical" />
      <div className="flex flex-col justify-center gap-[var(--spacing-3xs)]">
        <span className={TITLE}>Help</span>
        <span className={BODY}>Support &amp; docs</span>
      </div>
    </div>
  );
}

/** shadcn list — horizontal separators between rows. */
function ListExample() {
  const rows = [
    { label: 'Item 1', value: 'Value 1' },
    { label: 'Item 2', value: 'Value 2' },
    { label: 'Item 3', value: 'Value 3' },
  ];
  return (
    <div className="flex w-[length:var(--spacing-10xl)] flex-col">
      {rows.map((row, i) => (
        <div key={row.label}>
          {i > 0 ? <Separator /> : null}
          <div className="flex items-center justify-between py-[var(--spacing-sm)]">
            <span className={TITLE}>{row.label}</span>
            <span className={BODY}>{row.value}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function RtlExample() {
  return (
    <div dir="rtl" className="flex flex-col gap-[var(--spacing-sm)]">
      <p className={BODY}>العربية (RTL)</p>
      <div className="flex w-[length:var(--spacing-10xl)] flex-col gap-[var(--spacing-md)]">
        <div className="flex flex-col gap-[var(--spacing-2xs)]">
          <h4 className={TITLE}>Fabely</h4>
          <p className={BODY}>الأساس لنظام التصميم الخاص بك</p>
        </div>
        <Separator />
        <p className={BODY}>
          مجموعة من المكونات المصممة بشكل جميل يمكنك تخصيصها وتوسيعها والبناء
          عليها.
        </p>
      </div>
    </div>
  );
}

function SeparatorPlayground() {
  const [orientation, setOrientation] = useState<'horizontal' | 'vertical'>(
    'horizontal',
  );
  const [size, setSize] = useState<'thin' | 'thick'>('thin');
  const [spacing, setSpacing] = useState<'none' | 'regular' | 'spacious'>(
    'none',
  );

  return (
    <PlaygroundPanel
      previewAlign="center"
      preview={
        orientation === 'horizontal' ? (
          <div className="flex w-[length:var(--spacing-10xl)] flex-col">
            <span className={BODY}>Above</span>
            <Separator orientation="horizontal" size={size} spacing={spacing} />
            <span className={BODY}>Below</span>
          </div>
        ) : (
          <div className="flex h-[length:var(--spacing-5xl)] items-stretch gap-[var(--spacing-sm)]">
            <span className={`self-center ${BODY}`}>Start</span>
            <Separator orientation="vertical" size={size} spacing={spacing} />
            <span className={`self-center ${BODY}`}>End</span>
          </div>
        )
      }
      controls={
        <div className={PRIMITIVE_PLAYGROUND_CONTROL_GRID}>
          <InlineSegmentedControl
            label="Orientation"
            value={orientation}
            options={[
              { value: 'horizontal', label: 'Horizontal' },
              { value: 'vertical', label: 'Vertical' },
            ]}
            onChange={(v) => setOrientation(v as 'horizontal' | 'vertical')}
            fullWidth
          />
          <InlineSegmentedControl
            label="Size"
            value={size}
            options={[
              { value: 'thin', label: 'Thin' },
              { value: 'thick', label: 'Thick' },
            ]}
            onChange={(v) => setSize(v as 'thin' | 'thick')}
            fullWidth
          />
          <InlineSegmentedControl
            label="Spacing"
            value={spacing}
            options={[
              { value: 'none', label: 'None' },
              { value: 'regular', label: 'Regular' },
              { value: 'spacious', label: 'Spacious' },
            ]}
            onChange={(v) =>
              setSpacing(v as 'none' | 'regular' | 'spacious')
            }
            fullWidth
            className="col-span-2"
          />
        </div>
      }
    />
  );
}

export const Overview: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => (
    <PrimitivePage
      title="Separator"
      description="Visually or semantically separates content — Figma Separator (Divider) with Thin/Thick and spacing."
      playground={<SeparatorPlayground />}
      variants={
        <div className="flex flex-col gap-[var(--spacing-xl)]">
          <PrimitiveGalleryItem label="Demo">
            <DemoExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Vertical">
            <VerticalExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Menu">
            <MenuExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="List">
            <ListExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="RTL">
            <RtlExample />
          </PrimitiveGalleryItem>
        </div>
      }
      usageGuidance={
        <ul className="list-disc space-y-[var(--spacing-xs)] ps-[var(--spacing-md)]">
          <li>
            Default is horizontal Thin with no spacing — a 1px rule using{' '}
            <code>--theme-alpha-black-switch-5</code>.
          </li>
          <li>
            Use <code>orientation=&quot;vertical&quot;</code> between inline
            items; parent needs a definite cross-axis size (
            <code>items-stretch</code> / fixed height).
          </li>
          <li>
            Figma <code>size</code> (<code>thin</code> \| <code>thick</code>)
            and <code>spacing</code> (<code>none</code> \| <code>regular</code>{' '}
            \| <code>spacious</code>) control stroke and gutters.
          </li>
        </ul>
      }
      accessibility={
        <ul className="list-disc space-y-[var(--spacing-xs)] ps-[var(--spacing-md)]">
          <li>
            Renders with <code>role=&quot;separator&quot;</code> and{' '}
            <code>aria-orientation</code> from Base UI.
          </li>
          <li>
            Prefer semantic structure for list/section breaks when the line is
            purely decorative — still fine as a visual rule.
          </li>
        </ul>
      }
    />
  ),
};

export const Demo: Story = {
  render: () => <DemoExample />,
};

export const Vertical: Story = {
  render: () => <VerticalExample />,
};

export const Menu: Story = {
  render: () => <MenuExample />,
};

export const List: Story = {
  render: () => <ListExample />,
};

export const RTL: Story = {
  name: 'RTL',
  render: () => <RtlExample />,
};
