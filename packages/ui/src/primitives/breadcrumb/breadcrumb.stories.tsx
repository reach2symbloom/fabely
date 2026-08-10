import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { SlashIcon } from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from './breadcrumb';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../dropdown-menu';
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
 * example pages. No Figma; patterns follow shadcn Breadcrumb docs.
 */

const meta = {
  title: 'Design System/Primitives/Breadcrumb',
  component: Breadcrumb,
  tags: ['ai-generated'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Breadcrumb>;

export default meta;
type Story = StoryObj<typeof meta>;

type SeparatorStyle = 'chevron' | 'slash';

/* ---------- Canonical examples ---------- */

function BasicExample() {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="/components">Components</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}

function CustomSeparatorExample() {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <SlashIcon />
        </BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbLink href="/components">Components</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <SlashIcon />
        </BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}

/** Collapsed trail — ellipsis opens a menu of hidden crumbs. */
function CollapsedExample() {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <BreadcrumbEllipsis aria-label="Show more breadcrumbs" />
              }
            />
            <DropdownMenuContent align="start">
              <DropdownMenuItem>Documentation</DropdownMenuItem>
              <DropdownMenuItem>Themes</DropdownMenuItem>
              <DropdownMenuItem>GitHub</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="/components">Components</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}

/** Custom link via Base UI `render` — same pattern as routing libraries. */
function LinkComponentExample() {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink render={<a href="/" />}>Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink render={<a href="/docs" />}>Docs</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}

function RtlExample() {
  return (
    <div dir="rtl">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">الرئيسية</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/components">المكونات</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>فتات الخبز</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}

/* ---------- Playground ---------- */

function BreadcrumbPlayground() {
  const [separator, setSeparator] = useState<SeparatorStyle>('chevron');
  const [collapsed, setCollapsed] = useState(false);

  const Sep = () =>
    separator === 'slash' ? (
      <BreadcrumbSeparator>
        <SlashIcon />
      </BreadcrumbSeparator>
    ) : (
      <BreadcrumbSeparator />
    );

  return (
    <PlaygroundPanel
      preview={
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <Sep />
            {collapsed ? (
              <>
                <BreadcrumbItem>
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <BreadcrumbEllipsis aria-label="Show more breadcrumbs" />
                      }
                    />
                    <DropdownMenuContent align="start">
                      <DropdownMenuItem>Documentation</DropdownMenuItem>
                      <DropdownMenuItem>Themes</DropdownMenuItem>
                      <DropdownMenuItem>GitHub</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </BreadcrumbItem>
                <Sep />
              </>
            ) : (
              <>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/docs">Docs</BreadcrumbLink>
                </BreadcrumbItem>
                <Sep />
              </>
            )}
            <BreadcrumbItem>
              <BreadcrumbLink href="/components">Components</BreadcrumbLink>
            </BreadcrumbItem>
            <Sep />
            <BreadcrumbItem>
              <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      }
      controls={
        <div className={PRIMITIVE_PLAYGROUND_CONTROL_GRID}>
          <InlineSegmentedControl
            label="Separator"
            value={separator}
            options={[
              { value: 'chevron', label: 'Chevron' },
              { value: 'slash', label: 'Slash' },
            ]}
            onChange={setSeparator}
            fullWidth
          />
          <InlineSegmentedControl
            label="Collapsed"
            value={collapsed ? 'on' : 'off'}
            options={[
              { value: 'off', label: 'Off' },
              { value: 'on', label: 'On' },
            ]}
            onChange={(v) => setCollapsed(v === 'on')}
            fullWidth
          />
        </div>
      }
    />
  );
}

/* ---------- Overview ---------- */

export const Overview: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => (
    <PrimitivePage
      title="Breadcrumb"
      description={
        <>
          Path hierarchy of links. No Figma source — Accordion-style Foundations
          restyle of the shadcn Breadcrumb API. Separator icons use{' '}
          <code>--icon-xs</code> (12px) so they recede under 14px labels.
        </>
      }
      playground={<BreadcrumbPlayground />}
      variants={
        <div className="flex flex-col gap-6">
          <PrimitiveGalleryItem label="Basic">
            <BasicExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Custom separator">
            <CustomSeparatorExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Collapsed">
            <CollapsedExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Link component">
            <LinkComponentExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="RTL">
            <RtlExample />
          </PrimitiveGalleryItem>
        </div>
      }
      usageGuidance={
        <ul className="list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
          <li>
            Compose with <code>BreadcrumbList</code> → items → links/page;
            put <code>BreadcrumbSeparator</code> between items.
          </li>
          <li>
            Current page uses <code>BreadcrumbPage</code> (not a link).
          </li>
          <li>
            Custom separators: pass children to <code>BreadcrumbSeparator</code>.
          </li>
          <li>
            Routing: use <code>render</code> on <code>BreadcrumbLink</code> for
            your link component.
          </li>
          <li>
            Collapsed overflow: <code>BreadcrumbEllipsis</code> is Icon Button
            (<code>ghost</code> / <code>mini</code>); compose as{' '}
            <code>
              DropdownMenuTrigger render=&#123;&lt;BreadcrumbEllipsis
              aria-label=&quot;…&quot; /&gt;&#125;
            </code>
            .
          </li>
        </ul>
      }
      accessibility={
        <ul className="list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
          <li>
            Root is a <code>nav</code> with <code>aria-label=&quot;breadcrumb&quot;</code>.
          </li>
          <li>
            <code>BreadcrumbPage</code> sets <code>aria-current=&quot;page&quot;</code>.
          </li>
          <li>
            Separators are <code>aria-hidden</code> presentation.{' '}
            <code>BreadcrumbEllipsis</code> requires <code>aria-label</code>.
          </li>
        </ul>
      }
    />
  ),
};

/* ---------- Individual example pages ---------- */

export const Basic: Story = {
  render: () => <BasicExample />,
};

export const CustomSeparator: Story = {
  name: 'Custom separator',
  render: () => <CustomSeparatorExample />,
};

export const Collapsed: Story = {
  render: () => <CollapsedExample />,
};

export const LinkComponent: Story = {
  name: 'Link component',
  render: () => <LinkComponentExample />,
};

export const RTL: Story = {
  render: () => <RtlExample />,
};
