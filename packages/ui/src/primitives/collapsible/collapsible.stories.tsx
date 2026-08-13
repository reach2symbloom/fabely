import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState, type ReactNode } from 'react';
import {
  ChevronDownIcon,
  ChevronRightIcon,
  ChevronsUpDownIcon,
  FileIcon,
  FolderIcon,
  MaximizeIcon,
  MinimizeIcon,
} from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from './collapsible';
import { Button, IconButton } from '../button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../card';
import { Field, FieldGroup, FieldLabel } from '../field';
import { Input } from '../input';
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
 * example pages aligned with shadcn Collapsible docs. No Figma page; Accordion
 * milestone approach.
 *
 * Deferred: File Tree Explorer / Outline Tabs header (README → Deferred).
 */

const meta = {
  title: 'Design System/Primitives/Collapsible',
  component: Collapsible,
  tags: ['ai-generated'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Collapsible>;

export default meta;
type Story = StoryObj<typeof meta>;

function LimitationNotice({ children }: { children: ReactNode }) {
  return (
    <div className="flex gap-2 rounded-lg border border-dashed border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
      <span aria-hidden="true">⚠️</span>
      <span>{children}</span>
    </div>
  );
}

/* ---------- Canonical examples ---------- */

/** shadcn docs featured demo — Order #4189. */
function DemoExample() {
  const [open, setOpen] = useState(false);

  return (
    <Collapsible
      open={open}
      onOpenChange={setOpen}
      className="flex w-[min(100%,22rem)] flex-col gap-[var(--spacing-sm)]"
    >
      <div className="flex items-center justify-between gap-[var(--spacing-md)] px-[var(--spacing-md)]">
        <h4 className="font-[family-name:var(--font-family-body)] text-[length:var(--text-paragraph-small-medium-font-size)] leading-[var(--text-paragraph-small-medium-line-height)] [font-weight:var(--font-weight-paragraph-medium)]">
          Order #4189
        </h4>
        <CollapsibleTrigger
          render={<IconButton variant="ghost" size="sm" aria-label="Toggle details" />}
        >
          <ChevronsUpDownIcon />
        </CollapsibleTrigger>
      </div>
      <div className="flex items-center justify-between rounded-[length:var(--rounded-sm)] border-[length:var(--stroke-thin)] border-[color:var(--border)] px-[var(--spacing-md)] py-[var(--spacing-sm)] text-[length:var(--text-paragraph-small-regular-font-size)]">
        <span className="text-muted-foreground">Status</span>
        <span className="[font-weight:var(--font-weight-paragraph-medium)]">
          Shipped
        </span>
      </div>
      <CollapsibleContent className="flex flex-col gap-[var(--spacing-sm)]">
        <div className="rounded-[length:var(--rounded-sm)] border-[length:var(--stroke-thin)] border-[color:var(--border)] px-[var(--spacing-md)] py-[var(--spacing-sm)]">
          <p className="[font-weight:var(--font-weight-paragraph-medium)]">
            Shipping address
          </p>
          <p className="text-muted-foreground">100 Market St, San Francisco</p>
        </div>
        <div className="rounded-[length:var(--rounded-sm)] border-[length:var(--stroke-thin)] border-[color:var(--border)] px-[var(--spacing-md)] py-[var(--spacing-sm)]">
          <p className="[font-weight:var(--font-weight-paragraph-medium)]">
            Items
          </p>
          <p className="text-muted-foreground">2x Studio Headphones</p>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

/** shadcn Basic — Card + ghost Button trigger. */
function BasicExample() {
  return (
    <Card className="w-[min(100%,24rem)]" size="sm">
      <CardContent>
        <Collapsible className="rounded-[length:var(--rounded-sm)] data-open:bg-muted">
          <CollapsibleTrigger
            render={<Button variant="ghost" className="w-full" />}
          >
            Product details
            <ChevronDownIcon className="ms-auto size-[length:var(--icon-sm)] shrink-0 transition-transform duration-200 group-data-panel-open/button:rotate-180" />
          </CollapsibleTrigger>
          <CollapsibleContent className="flex flex-col items-start gap-[var(--spacing-sm)] p-[var(--spacing-sm)] pt-0">
            <div>
              This panel can be expanded or collapsed to reveal additional
              content.
            </div>
            <Button size="small">Learn More</Button>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
}

/** shadcn Settings Panel — Field + Input. */
function SettingsExample() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex w-[min(100%,20rem)] flex-col gap-[var(--spacing-md)]">
      <Card size="sm">
        <CardHeader>
          <CardTitle>Radius</CardTitle>
          <CardDescription>
            Set the corner radius of the element.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Collapsible
            open={open}
            onOpenChange={setOpen}
            className="flex items-start gap-[var(--spacing-sm)]"
          >
            <FieldGroup className="grid w-full grid-cols-2 gap-[var(--spacing-sm)]">
              <Field>
                <FieldLabel htmlFor="radius-x" className="sr-only">
                  Radius X
                </FieldLabel>
                <Input id="radius-x" placeholder="0" defaultValue={0} />
              </Field>
              <Field>
                <FieldLabel htmlFor="radius-y" className="sr-only">
                  Radius Y
                </FieldLabel>
                <Input id="radius-y" placeholder="0" defaultValue={0} />
              </Field>
              <CollapsibleContent className="col-span-full grid grid-cols-subgrid gap-[var(--spacing-sm)]">
                <Field>
                  <FieldLabel htmlFor="radius-x-extra" className="sr-only">
                    Radius X
                  </FieldLabel>
                  <Input id="radius-x-extra" placeholder="0" defaultValue={0} />
                </Field>
                <Field>
                  <FieldLabel htmlFor="radius-y-extra" className="sr-only">
                    Radius Y
                  </FieldLabel>
                  <Input id="radius-y-extra" placeholder="0" defaultValue={0} />
                </Field>
              </CollapsibleContent>
            </FieldGroup>
            <CollapsibleTrigger
              render={
                <IconButton
                  variant="outline"
                  size="default"
                  aria-label={open ? 'Hide extra radius' : 'Show extra radius'}
                />
              }
            >
              {open ? <MinimizeIcon /> : <MaximizeIcon />}
            </CollapsibleTrigger>
          </Collapsible>
        </CardContent>
      </Card>
    </div>
  );
}

type FileTreeItem = { name: string } | { name: string; items: FileTreeItem[] };

const FILE_TREE: FileTreeItem[] = [
  {
    name: 'components',
    items: [
      {
        name: 'ui',
        items: [
          { name: 'button.tsx' },
          { name: 'card.tsx' },
          { name: 'dialog.tsx' },
        ],
      },
      { name: 'login-form.tsx' },
    ],
  },
  {
    name: 'lib',
    items: [{ name: 'utils.ts' }, { name: 'cn.ts' }],
  },
  { name: 'app.tsx' },
  { name: 'package.json' },
];

function FileTreeNode({ item }: { item: FileTreeItem }) {
  if ('items' in item) {
    return (
      <Collapsible>
        <CollapsibleTrigger
          render={
            <Button
              variant="ghost"
              size="small"
              className="w-full justify-start transition-none"
            />
          }
        >
          <ChevronRightIcon className="size-[length:var(--icon-sm)] shrink-0 transition-transform duration-200 group-data-panel-open/button:rotate-90" />
          <FolderIcon className="size-[length:var(--icon-sm)] shrink-0" />
          {item.name}
        </CollapsibleTrigger>
        <CollapsibleContent className="ms-[var(--spacing-md)] mt-[var(--spacing-2xs)]">
          <div className="flex flex-col gap-[var(--spacing-2xs)]">
            {item.items.map((child) => (
              <FileTreeNode key={child.name} item={child} />
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    );
  }

  return (
    <Button
      variant="ghost"
      size="small"
      className="w-full justify-start gap-[var(--spacing-sm)] text-foreground"
    >
      <FileIcon className="size-[length:var(--icon-sm)] shrink-0" />
      <span>{item.name}</span>
    </Button>
  );
}

/** shadcn File Tree — Tabs header composition deferred; plain Explorer title. */
function FileTreeExample() {
  return (
    <div className="flex w-[min(100%,16rem)] flex-col gap-[var(--spacing-md)]">
      <LimitationNotice>
        shadcn File Tree uses Tabs for Explorer / Outline — composition is
        deferred; this story uses a Card title instead.
      </LimitationNotice>
      <Card size="sm">
        <CardHeader>
          <CardTitle>Explorer</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-[var(--spacing-2xs)]">
            {FILE_TREE.map((item) => (
              <FileTreeNode key={item.name} item={item} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function RtlExample() {
  const [open, setOpen] = useState(false);

  return (
    <div dir="rtl">
      <Collapsible
        open={open}
        onOpenChange={setOpen}
        className="flex w-[min(100%,22rem)] flex-col gap-[var(--spacing-sm)]"
      >
        <div className="flex items-center justify-between gap-[var(--spacing-md)] px-[var(--spacing-md)]">
          <h4 className="font-[family-name:var(--font-family-body)] text-[length:var(--text-paragraph-small-medium-font-size)] leading-[var(--text-paragraph-small-medium-line-height)] [font-weight:var(--font-weight-paragraph-medium)]">
            الطلب #4189
          </h4>
          <CollapsibleTrigger
            render={
              <IconButton variant="ghost" size="sm" aria-label="Toggle details" />
            }
          >
            <ChevronsUpDownIcon />
          </CollapsibleTrigger>
        </div>
        <div className="flex items-center justify-between rounded-[length:var(--rounded-sm)] border-[length:var(--stroke-thin)] border-[color:var(--border)] px-[var(--spacing-md)] py-[var(--spacing-sm)] text-[length:var(--text-paragraph-small-regular-font-size)]">
          <span className="text-muted-foreground">الحالة</span>
          <span className="[font-weight:var(--font-weight-paragraph-medium)]">
            تم الشحن
          </span>
        </div>
        <CollapsibleContent className="flex flex-col gap-[var(--spacing-sm)]">
          <div className="rounded-[length:var(--rounded-sm)] border-[length:var(--stroke-thin)] border-[color:var(--border)] px-[var(--spacing-md)] py-[var(--spacing-sm)]">
            <p className="[font-weight:var(--font-weight-paragraph-medium)]">
              عنوان الشحن
            </p>
            <p className="text-muted-foreground">100 Market St, San Francisco</p>
          </div>
          <div className="rounded-[length:var(--rounded-sm)] border-[length:var(--stroke-thin)] border-[color:var(--border)] px-[var(--spacing-md)] py-[var(--spacing-sm)]">
            <p className="[font-weight:var(--font-weight-paragraph-medium)]">
              العناصر
            </p>
            <p className="text-muted-foreground">2x سماعات الاستوديو</p>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}

/* ---------- Playground ---------- */

type PlaygroundComposition = 'demo' | 'basic' | 'settings' | 'file-tree';

function CollapsiblePlayground() {
  const [composition, setComposition] =
    useState<PlaygroundComposition>('demo');
  const [open, setOpen] = useState(false);

  let preview: ReactNode;
  if (composition === 'basic') {
    preview = <BasicExample />;
  } else if (composition === 'settings') {
    preview = <SettingsExample />;
  } else if (composition === 'file-tree') {
    preview = <FileTreeExample />;
  } else {
    preview = (
      <Collapsible
        open={open}
        onOpenChange={setOpen}
        className="flex w-[min(100%,22rem)] flex-col gap-[var(--spacing-sm)]"
      >
        <div className="flex items-center justify-between gap-[var(--spacing-md)] px-[var(--spacing-md)]">
          <h4 className="font-[family-name:var(--font-family-body)] text-[length:var(--text-paragraph-small-medium-font-size)] leading-[var(--text-paragraph-small-medium-line-height)] [font-weight:var(--font-weight-paragraph-medium)]">
            Order #4189
          </h4>
          <CollapsibleTrigger
            render={
              <IconButton variant="ghost" size="sm" aria-label="Toggle details" />
            }
          >
            <ChevronsUpDownIcon />
          </CollapsibleTrigger>
        </div>
        <div className="flex items-center justify-between rounded-[length:var(--rounded-sm)] border-[length:var(--stroke-thin)] border-[color:var(--border)] px-[var(--spacing-md)] py-[var(--spacing-sm)] text-[length:var(--text-paragraph-small-regular-font-size)]">
          <span className="text-muted-foreground">Status</span>
          <span className="[font-weight:var(--font-weight-paragraph-medium)]">
            {open ? 'Open' : 'Shipped'}
          </span>
        </div>
        <CollapsibleContent className="flex flex-col gap-[var(--spacing-sm)]">
          <div className="rounded-[length:var(--rounded-sm)] border-[length:var(--stroke-thin)] border-[color:var(--border)] px-[var(--spacing-md)] py-[var(--spacing-sm)]">
            <p className="[font-weight:var(--font-weight-paragraph-medium)]">
              Shipping address
            </p>
            <p className="text-muted-foreground">100 Market St, San Francisco</p>
          </div>
        </CollapsibleContent>
      </Collapsible>
    );
  }

  return (
    <PlaygroundPanel
      preview={preview}
      controls={
        <div className={PRIMITIVE_PLAYGROUND_CONTROL_GRID}>
          <div className="col-span-2">
            <InlineSegmentedControl
              label="Composition"
              value={composition}
              onChange={setComposition}
              options={[
                { value: 'demo', label: 'Demo' },
                { value: 'basic', label: 'Basic' },
                { value: 'settings', label: 'Settings' },
                { value: 'file-tree', label: 'File tree' },
              ]}
              fullWidth
            />
          </div>
          {composition === 'demo' ? (
            <InlineSegmentedControl
              label="Open"
              value={open ? 'open' : 'closed'}
              onChange={(v) => setOpen(v === 'open')}
              options={[
                { value: 'closed', label: 'Closed' },
                { value: 'open', label: 'Open' },
              ]}
              fullWidth
              className="col-span-2"
            />
          ) : null}
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
      title="Collapsible"
      description={
        <>
          Expands and collapses a panel. Foundations restyle of the shadcn /
          Base UI collapsible — no Figma page yet; demos follow the{' '}
          <a
            href="https://ui.shadcn.com/docs/components/base/collapsible"
            className="underline underline-offset-4"
          >
            shadcn docs
          </a>
          . Compose triggers with Button or IconButton via <code>render</code>.
        </>
      }
      playground={<CollapsiblePlayground />}
      variants={
        <div className="flex flex-wrap gap-4">
          <PrimitiveGalleryItem label="Demo">
            <DemoExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Basic">
            <BasicExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Settings Panel">
            <SettingsExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="File Tree">
            <FileTreeExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="RTL">
            <RtlExample />
          </PrimitiveGalleryItem>
        </div>
      }
      usageGuidance={
        <ul className="list-disc space-y-2 ps-5 text-sm text-muted-foreground">
          <li>
            Prefer <code>CollapsibleTrigger</code> with{' '}
            <code>render={'{<Button />}'}</code> or IconButton for product
            chrome; bare triggers only get a focus ring.
          </li>
          <li>
            Use <code>open</code> + <code>onOpenChange</code> when the host
            needs controlled state (settings, show more).
          </li>
          <li>
            Nest collapsibles for trees; open state on the trigger is{' '}
            <code>data-panel-open</code> (not Radix <code>data-state</code>).
          </li>
        </ul>
      }
      accessibility={
        <ul className="list-disc space-y-2 ps-5 text-sm text-muted-foreground">
          <li>
            Icon-only triggers need an accessible name (
            <code>aria-label</code> or sr-only text).
          </li>
          <li>
            Panel content stays in the accessibility tree while open; Base UI
            handles expand/collapse semantics on the trigger.
          </li>
        </ul>
      }
    />
  ),
};

export const Demo: Story = {
  render: () => <DemoExample />,
};

export const Basic: Story = {
  render: () => <BasicExample />,
};

export const SettingsPanel: Story = {
  name: 'Settings Panel',
  render: () => <SettingsExample />,
};

export const FileTree: Story = {
  name: 'File Tree',
  render: () => <FileTreeExample />,
};

export const RTL: Story = {
  name: 'RTL',
  render: () => <RtlExample />,
};
