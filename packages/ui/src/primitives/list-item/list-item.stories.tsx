import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { CheckIcon, CircleDashedIcon, ChevronRightIcon } from 'lucide-react';
import {
  ListItem,
  ListItemContent,
  ListItemDescription,
  ListItemMedia,
  ListItemTitle,
  ListItemTrailing,
} from './list-item';
import type { ListItemSize, ListItemVariant } from './list-item';
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
 * example pages. Figma: Menu Item set 18:1010.
 */

const meta = {
  title: 'Design System/Primitives/ListItem',
  component: ListItem,
  tags: ['ai-generated'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof ListItem>;

export default meta;
type Story = StoryObj<typeof meta>;

const VARIANTS: { variant: ListItemVariant; label: string }[] = [
  { variant: 'default', label: 'Default' },
  { variant: 'accent', label: 'Accent' },
  { variant: 'destructive', label: 'Destructive' },
];

const SIZES: { size: ListItemSize; label: string }[] = [
  { size: 'default', label: 'Default' },
  { size: 'lg', label: 'Large' },
];

type DemoState = 'default' | 'hover' | 'focus' | 'pressed' | 'selected' | 'disabled';

function Row({
  variant = 'default',
  size = 'default',
  state = 'default',
  media = false,
  description = false,
  trailing = false,
  className,
}: {
  variant?: ListItemVariant;
  size?: ListItemSize;
  state?: DemoState;
  media?: boolean;
  description?: boolean;
  trailing?: boolean;
  className?: string;
}) {
  const selected = state === 'selected';
  const disabled = state === 'disabled';

  return (
    <ListItem
      variant={variant}
      size={size}
      selected={selected}
      disabled={disabled}
      data-hovered={state === 'hover' ? '' : undefined}
      data-focused={state === 'focus' ? '' : undefined}
      data-pressed={state === 'pressed' ? '' : undefined}
      className={className}
    >
      {media ? (
        <ListItemMedia>
          <CircleDashedIcon />
        </ListItemMedia>
      ) : null}
      <ListItemContent>
        <ListItemTitle>Label</ListItemTitle>
        {description ? (
          <ListItemDescription>Line 2</ListItemDescription>
        ) : null}
      </ListItemContent>
      {trailing ? (
        <ListItemTrailing>
          <ChevronRightIcon />
        </ListItemTrailing>
      ) : null}
    </ListItem>
  );
}

/* ---------- Canonical examples ---------- */

function DefaultExample() {
  return (
    <div className="w-56">
      <Row />
    </div>
  );
}

function VariantsExample() {
  return (
    <div className="flex w-56 flex-col gap-2">
      {VARIANTS.map(({ variant }) => (
        <Row key={variant} variant={variant} media description />
      ))}
    </div>
  );
}

function SizesExample() {
  return (
    <div className="flex w-64 flex-col gap-4">
      {SIZES.map(({ size, label }) => (
        <div key={size} className="flex flex-col gap-2">
          <span className="font-sans text-xs text-muted-foreground">{label}</span>
          <Row size={size} media description trailing />
        </div>
      ))}
    </div>
  );
}

function StatesExample() {
  const states: DemoState[] = [
    'default',
    'hover',
    'focus',
    'pressed',
    'selected',
    'disabled',
  ];
  return (
    <div className="flex flex-wrap gap-8">
      {VARIANTS.map(({ variant, label }) => (
        <div key={variant} className="flex w-44 flex-col gap-2">
          <span className="font-sans text-xs text-muted-foreground">{label}</span>
          {states.map((state) => (
            <div key={state} className="flex flex-col gap-1">
              <Row variant={variant} state={state} />
              <span className="font-sans text-[10px] text-muted-foreground capitalize">
                {state}
              </span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function WithMediaExample() {
  return (
    <div className="flex w-56 flex-col gap-2">
      <Row media />
      <Row media description />
      <Row media description trailing />
      <ListItem selected className="w-full">
        <ListItemMedia>
          <CheckIcon />
        </ListItemMedia>
        <ListItemContent>
          <ListItemTitle>Selected with check</ListItemTitle>
        </ListItemContent>
      </ListItem>
    </div>
  );
}

function CompositionExample() {
  return (
    <div className="w-64">
      <ListItem variant="default" size="default">
        <ListItemMedia>
          <CircleDashedIcon />
        </ListItemMedia>
        <ListItemContent>
          <ListItemTitle>Label</ListItemTitle>
          <ListItemDescription>Line 2</ListItemDescription>
        </ListItemContent>
        <ListItemTrailing>
          <ChevronRightIcon />
        </ListItemTrailing>
      </ListItem>
    </div>
  );
}

/* ---------- Playground ---------- */

function ListItemPlayground() {
  const [variant, setVariant] = useState<ListItemVariant>('default');
  const [size, setSize] = useState<ListItemSize>('default');
  const [state, setState] = useState<DemoState>('default');
  const [media, setMedia] = useState(true);
  const [description, setDescription] = useState(true);
  const [trailing, setTrailing] = useState(false);

  return (
    <PlaygroundPanel
      preview={
        <div className="w-64">
          <Row
            variant={variant}
            size={size}
            state={state}
            media={media}
            description={description}
            trailing={trailing}
          />
        </div>
      }
      controls={
        <div className={PRIMITIVE_PLAYGROUND_CONTROL_GRID}>
          <InlineSegmentedControl
            label="Variant"
            value={variant}
            options={VARIANTS.map(({ variant: v, label }) => ({
              value: v,
              label,
            }))}
            onChange={setVariant}
            fullWidth
          />
          <InlineSegmentedControl
            label="Size"
            value={size}
            options={SIZES.map(({ size: s, label }) => ({
              value: s,
              label,
            }))}
            onChange={setSize}
            fullWidth
          />
          <InlineSegmentedControl
            label="State"
            value={state}
            options={[
              { value: 'default', label: 'Default' },
              { value: 'hover', label: 'Hover' },
              { value: 'focus', label: 'Focus' },
              { value: 'pressed', label: 'Pressed' },
              { value: 'selected', label: 'Selected' },
              { value: 'disabled', label: 'Disabled' },
            ]}
            onChange={(v) => setState(v as DemoState)}
            fullWidth
            className="col-span-2"
          />
          <InlineSegmentedControl
            label="Media"
            value={media ? 'on' : 'off'}
            options={[
              { value: 'off', label: 'Off' },
              { value: 'on', label: 'On' },
            ]}
            onChange={(v) => setMedia(v === 'on')}
            fullWidth
          />
          <InlineSegmentedControl
            label="Line 2"
            value={description ? 'on' : 'off'}
            options={[
              { value: 'off', label: 'Off' },
              { value: 'on', label: 'On' },
            ]}
            onChange={(v) => setDescription(v === 'on')}
            fullWidth
          />
          <InlineSegmentedControl
            label="Trailing"
            value={trailing ? 'on' : 'off'}
            options={[
              { value: 'off', label: 'Off' },
              { value: 'on', label: 'On' },
            ]}
            onChange={(v) => setTrailing(v === 'on')}
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
      title="ListItem"
      description={
        <>
          Shared leaf-row atom for menus and lists. Figma source is{' '}
          <strong>Menu Item</strong> (<code>18:1010</code>); code name is
          unscoped. Quiet hover/pressed follow Button <code>@5</code> /{' '}
          <code>@10</code> (not Figma <code>@333</code>).
        </>
      }
      playground={<ListItemPlayground />}
      variants={
        <div className="flex flex-col gap-6">
          <PrimitiveGalleryItem label="Default">
            <DefaultExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Variants">
            <VariantsExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Sizes">
            <SizesExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="States">
            <StatesExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="With media">
            <WithMediaExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Full composition">
            <CompositionExample />
          </PrimitiveGalleryItem>
        </div>
      }
      usageGuidance={
        <ul className="list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
          <li>
            Compose with named children — do not invent a parallel row for
            DropdownMenuItem, CommandItem, SelectItem, etc.
          </li>
          <li>
            Optional slots: omit <code>ListItemMedia</code>,{' '}
            <code>ListItemDescription</code>, or <code>ListItemTrailing</code>.
          </li>
          <li>
            Host menus: <code>render=&#123;&lt;ListItem /&gt;&#125;</code> on
            the vendor item trigger.
          </li>
          <li>
            <code>selected</code> and pressed share paint; use{' '}
            <code>selected</code> / <code>data-selected</code> for semantics.
          </li>
        </ul>
      }
      accessibility={
        <ul className="list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
          <li>
            <code>selected</code> sets <code>aria-selected</code> and{' '}
            <code>data-selected</code>.
          </li>
          <li>
            <code>disabled</code> sets <code>aria-disabled</code> and dims via
            opacity.
          </li>
          <li>
            Focus ring uses secondary (default/accent) or error (destructive).
            Prefer keyboard focus via the host menu item’s focus management.
          </li>
        </ul>
      }
    />
  ),
};

/* ---------- Individual example pages ---------- */

export const Default: Story = {
  render: () => <DefaultExample />,
};

export const Variants: Story = {
  render: () => <VariantsExample />,
};

export const Sizes: Story = {
  render: () => <SizesExample />,
};

export const States: Story = {
  render: () => <StatesExample />,
};

export const WithMedia: Story = {
  name: 'With media',
  render: () => <WithMediaExample />,
};

export const Composition: Story = {
  name: 'Full composition',
  render: () => <CompositionExample />,
};
