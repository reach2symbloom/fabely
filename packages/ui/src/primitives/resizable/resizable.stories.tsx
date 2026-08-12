import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

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
 * Overview first — Playground + shadcn Resizable docs (Horizontal / Vertical /
 * Handle / Nested / RTL).
 *
 * Figma: https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=222-27733
 */

const meta = {
  title: 'Design System/Primitives/Resizable',
  component: ResizablePanelGroup,
  tags: ['ai-generated'],
  parameters: { layout: 'centered' },
} satisfies Meta;

export default meta;
type Story = StoryObj;

const PANEL_LABEL =
  'flex h-full items-center justify-center font-[family-name:var(--text-paragraph-small-regular-font-family)] text-[length:var(--text-paragraph-small-regular-font-size)] leading-[var(--text-paragraph-small-regular-line-height)] text-[color:var(--muted-foreground)]';

const SHELL =
  'h-80 w-full max-w-xl overflow-hidden rounded-[length:var(--rounded-lg)] border border-[color:var(--border)]';

type Orientation = 'horizontal' | 'vertical';

/* ---------- Canonical examples (shadcn docs) ---------- */

/** Nested three-panel demo from shadcn Resizable. */
function DemoExample({ withHandle = false }: { withHandle?: boolean }) {
  return (
    <ResizablePanelGroup
      orientation="horizontal"
      className={SHELL}
    >
      <ResizablePanel defaultSize="25%">
        <div className={PANEL_LABEL}>One</div>
      </ResizablePanel>
      <ResizableHandle withHandle={withHandle} />
      <ResizablePanel defaultSize="75%">
        <ResizablePanelGroup orientation="vertical">
          <ResizablePanel defaultSize="25%">
            <div className={PANEL_LABEL}>Two</div>
          </ResizablePanel>
          <ResizableHandle withHandle={withHandle} />
          <ResizablePanel defaultSize="75%">
            <div className={PANEL_LABEL}>Three</div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}

function VerticalExample({ withHandle = false }: { withHandle?: boolean }) {
  return (
    <ResizablePanelGroup orientation="vertical" className={SHELL}>
      <ResizablePanel defaultSize="35%">
        <div className={PANEL_LABEL}>Header</div>
      </ResizablePanel>
      <ResizableHandle withHandle={withHandle} />
      <ResizablePanel defaultSize="65%">
        <div className={PANEL_LABEL}>Content</div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}

function HandleExample() {
  return (
    <ResizablePanelGroup orientation="horizontal" className={SHELL}>
      <ResizablePanel defaultSize="30%">
        <div className={PANEL_LABEL}>Sidebar</div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize="70%">
        <div className={PANEL_LABEL}>Content</div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}

function HorizontalExample({ withHandle = false }: { withHandle?: boolean }) {
  return (
    <ResizablePanelGroup orientation="horizontal" className={SHELL}>
      <ResizablePanel defaultSize="40%">
        <div className={PANEL_LABEL}>Sidebar</div>
      </ResizablePanel>
      <ResizableHandle withHandle={withHandle} />
      <ResizablePanel defaultSize="60%">
        <div className={PANEL_LABEL}>Content</div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}

function RtlExample() {
  return (
    <div dir="rtl" className="w-full max-w-xl">
      <p className="mb-[var(--spacing-sm)] text-[color:var(--muted-foreground)]">
        العربية (RTL)
      </p>
      <ResizablePanelGroup orientation="horizontal" className={SHELL}>
        <ResizablePanel defaultSize="30%">
          <div className={PANEL_LABEL}>واحد</div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize="40%">
          <div className={PANEL_LABEL}>اثنان</div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize="30%">
          <div className={PANEL_LABEL}>ثلاثة</div>
        </ResizablePanel>
      </ResizablePanelGroup>
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
        orientation === 'vertical' ? (
          <VerticalExample withHandle={withHandle} />
        ) : (
          <HorizontalExample withHandle={withHandle} />
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
      description="Accessible resizable panel groups. Handle chrome matches Figma Resizable (border rail + optional 6-dot grip)."
      playground={<ResizablePlayground />}
      variants={
        <div className="flex flex-col gap-[var(--spacing-xl)]">
          <PrimitiveGalleryItem label="Demo (nested)">
            <DemoExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Vertical">
            <VerticalExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Handle">
            <HandleExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="RTL">
            <RtlExample />
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
            Use <code>withHandle</code> on the handle for the Figma grip; omit
            for a rail-only separator.
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
            Focus ring uses Foundations{' '}
            <code>--effect-focus-ring-secondary</code>.
          </li>
          <li>
            Prefer labeled panel content; the grip icon is decorative (
            <code>aria-hidden</code>).
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

export const Handle: Story = {
  name: 'Handle',
  render: () => <HandleExample />,
};

export const RTL: Story = {
  name: 'RTL',
  render: () => <RtlExample />,
};
