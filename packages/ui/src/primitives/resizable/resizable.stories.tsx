import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState, type ReactNode } from 'react';

import { InlineSegmentedControl } from '../../../stories/InlineSegmentedControl';
import { PlaygroundPanel } from '../../../stories/PlaygroundPanel';
import {
  PRIMITIVE_PLAYGROUND_CONTROL_GRID,
  PrimitiveGalleryItem,
  PrimitivePage,
} from '../../../stories/PrimitivePage';

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from './resizable';

/**
 * Component Storybook IA (see docs/DESIGN.md "Component Story Structure"):
 * Overview first — Playground + shadcn Resizable docs (Demo / Vertical /
 * Handle / RTL).
 *
 * Figma: https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=222-27733
 *
 * Note: react-resizable-panels Group forces inline `height/width: 100%`, so
 * size the *wrapper* — className height on the Group is ignored.
 */

const meta = {
  title: 'Design System/Primitives/Resizable',
  component: ResizablePanelGroup,
  tags: ['ai-generated'],
  parameters: { layout: 'centered' },
} satisfies Meta;

export default meta;
type Story = StoryObj;

const PANEL_BODY = [
  'flex h-full items-center justify-center',
  'p-[var(--spacing-xl)]',
].join(' ');

const PANEL_LABEL = [
  'font-[family-name:var(--text-paragraph-small-medium-font-family)]',
  '[font-weight:var(--text-paragraph-small-medium-font-weight)]',
  'text-[length:var(--text-paragraph-small-medium-font-size)]',
  'leading-[var(--text-paragraph-small-medium-line-height)]',
  'text-[color:var(--foreground)]',
].join(' ');

/**
 * Size lives on this shell — Group fills it via inline 100%.
 * shadcn preview uses `h-80`; Handle demo also uses `max-w-sm` / `min-h-[200px]`.
 */
const SHELL_DEMO = [
  'h-80 w-full',
  'overflow-hidden',
  'rounded-[length:var(--rounded-lg)]',
  'border border-[color:var(--border)]',
].join(' ');

const SHELL_HANDLE = [
  'h-80 w-full max-w-sm',
  'min-h-[length:var(--spacing-5xl)]',
  'overflow-hidden',
  'rounded-[length:var(--rounded-lg)]',
  'border border-[color:var(--border)]',
].join(' ');

type Orientation = 'horizontal' | 'vertical';

function PanelLabel({ children }: { children: string }) {
  return (
    <div className={PANEL_BODY}>
      <span className={PANEL_LABEL}>{children}</span>
    </div>
  );
}

function Shell({
  className,
  children,
}: {
  className: string;
  children: ReactNode;
}) {
  return <div className={className}>{children}</div>;
}

/* ---------- Canonical examples (shadcn docs) ---------- */

/** Nested three-panel demo — shadcn `resizable-demo` (preview `h-80`). */
function DemoExample({ withHandle = false }: { withHandle?: boolean }) {
  return (
    <Shell className={SHELL_DEMO}>
      <ResizablePanelGroup
        key={`demo-${withHandle}`}
        orientation="horizontal"
      >
        <ResizablePanel defaultSize="25%" minSize="15%">
          <PanelLabel>One</PanelLabel>
        </ResizablePanel>
        <ResizableHandle withHandle={withHandle} />
        <ResizablePanel defaultSize="75%" minSize="30%">
          <ResizablePanelGroup orientation="vertical">
            <ResizablePanel defaultSize="30%" minSize="15%">
              <PanelLabel>Two</PanelLabel>
            </ResizablePanel>
            <ResizableHandle withHandle={withHandle} />
            <ResizablePanel defaultSize="70%" minSize="25%">
              <PanelLabel>Three</PanelLabel>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </Shell>
  );
}

/** shadcn Vertical — Header / Content. */
function VerticalExample({ withHandle = true }: { withHandle?: boolean }) {
  return (
    <Shell className={SHELL_DEMO}>
      <ResizablePanelGroup
        key={`vertical-${withHandle}`}
        orientation="vertical"
      >
        <ResizablePanel defaultSize="25%" minSize="15%">
          <PanelLabel>Header</PanelLabel>
        </ResizablePanel>
        <ResizableHandle withHandle={withHandle} />
        <ResizablePanel defaultSize="75%" minSize="30%">
          <PanelLabel>Content</PanelLabel>
        </ResizablePanel>
      </ResizablePanelGroup>
    </Shell>
  );
}

/** shadcn Handle demo — Sidebar / Content + `withHandle`. */
function HandleExample() {
  return (
    <Shell className={SHELL_HANDLE}>
      <ResizablePanelGroup orientation="horizontal">
        <ResizablePanel defaultSize="25%" minSize="15%">
          <PanelLabel>Sidebar</PanelLabel>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize="75%" minSize="30%">
          <PanelLabel>Content</PanelLabel>
        </ResizablePanel>
      </ResizablePanelGroup>
    </Shell>
  );
}

function HorizontalExample({ withHandle = true }: { withHandle?: boolean }) {
  return (
    <Shell className={SHELL_HANDLE}>
      <ResizablePanelGroup
        key={`horizontal-${withHandle}`}
        orientation="horizontal"
      >
        <ResizablePanel defaultSize="25%" minSize="15%">
          <PanelLabel>Sidebar</PanelLabel>
        </ResizablePanel>
        <ResizableHandle withHandle={withHandle} />
        <ResizablePanel defaultSize="75%" minSize="30%">
          <PanelLabel>Content</PanelLabel>
        </ResizablePanel>
      </ResizablePanelGroup>
    </Shell>
  );
}

function RtlExample() {
  return (
    <div dir="rtl" className="w-full">
      <p className="mb-[var(--spacing-sm)] text-[color:var(--muted-foreground)]">
        العربية (RTL)
      </p>
      <Shell className={SHELL_DEMO}>
        <ResizablePanelGroup orientation="horizontal">
          <ResizablePanel defaultSize="30%" minSize="15%">
            <PanelLabel>واحد</PanelLabel>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize="40%" minSize="20%">
            <PanelLabel>اثنان</PanelLabel>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize="30%" minSize="15%">
            <PanelLabel>ثلاثة</PanelLabel>
          </ResizablePanel>
        </ResizablePanelGroup>
      </Shell>
    </div>
  );
}

/* ---------- Playground ---------- */

function ResizablePlayground() {
  const [orientation, setOrientation] = useState<Orientation>('horizontal');
  const [withHandle, setWithHandle] = useState(true);

  return (
    <PlaygroundPanel
      previewAlign="stretch"
      preview={
        <div className="flex w-full justify-center">
          {orientation === 'vertical' ? (
            <div className="w-full max-w-xl">
              <VerticalExample withHandle={withHandle} />
            </div>
          ) : (
            <HorizontalExample withHandle={withHandle} />
          )}
        </div>
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
            onChange={(v) => setOrientation(v as Orientation)}
            fullWidth
          />
          <InlineSegmentedControl
            label="Handle"
            value={withHandle ? 'on' : 'off'}
            options={[
              { value: 'on', label: 'Grip on' },
              { value: 'off', label: 'Grip off' },
            ]}
            onChange={(v) => setWithHandle(v === 'on')}
            fullWidth
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
      title="Resizable"
      description="Accessible resizable panel groups. Optional withHandle shows the border grip pill on the rail."
      playground={<ResizablePlayground />}
      variants={
        /* Stacked column — do not use GalleryItem `fill` (`basis-full` stretches tile height). */
        <div className="flex w-full flex-col gap-[var(--spacing-xl)]">
          <PrimitiveGalleryItem label="Demo (nested)">
            <div className="w-full max-w-xl">
              <DemoExample />
            </div>
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Vertical">
            <div className="w-full max-w-xl">
              <VerticalExample />
            </div>
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Handle">
            <HandleExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="RTL">
            <div className="w-full max-w-xl">
              <RtlExample />
            </div>
          </PrimitiveGalleryItem>
        </div>
      }
      usageGuidance={
        <ul className="list-disc space-y-[var(--spacing-xs)] ps-[var(--spacing-md)]">
          <li>
            Compose <code>ResizablePanelGroup</code> →{' '}
            <code>ResizablePanel</code> / <code>ResizableHandle</code>.
          </li>
          <li>
            Pass percentage strings for sizes in v4 (e.g.{' '}
            <code>defaultSize=&quot;50%&quot;</code>).
          </li>
          <li>
            Size the parent of the group — Group forces{' '}
            <code>height/width: 100%</code> inline.
          </li>
          <li>
            Use <code>withHandle</code> for the visible grip pill; omit for a
            rail-only separator.
          </li>
        </ul>
      }
      accessibility={
        <ul className="list-disc space-y-[var(--spacing-xs)] ps-[var(--spacing-md)]">
          <li>
            Keyboard-resizable via react-resizable-panels; focus the handle and
            use arrow keys.
          </li>
          <li>
            Focus / drag uses <code>--muted-foreground</code> on the rail
            (slightly lighter than border — not white).
          </li>
        </ul>
      }
    />
  ),
};

export const Demo: Story = {
  render: () => (
    <div className="w-[min(100%,36rem)]">
      <DemoExample />
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <div className="w-[min(100%,36rem)]">
      <VerticalExample />
    </div>
  ),
};

export const Handle: Story = {
  name: 'Handle',
  render: () => <HandleExample />,
};

export const RTL: Story = {
  name: 'RTL',
  render: () => (
    <div className="w-[min(100%,36rem)]">
      <RtlExample />
    </div>
  ),
};
