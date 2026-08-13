import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  BotIcon,
  ChevronDownIcon,
  MinusIcon,
  MoreHorizontalIcon,
  PlusIcon,
  SearchIcon,
} from 'lucide-react';
import {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
} from './button-group';
import { Button, IconButton } from '../button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../dropdown-menu';
import { Input } from '../input';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '../input-group';
import { Label } from '../label';
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from '../popover';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../select';
import { InlineSegmentedControl } from '../../../stories/InlineSegmentedControl';
import { PlaygroundPanel } from '../../../stories/PlaygroundPanel';
import {
  PRIMITIVE_PLAYGROUND_CONTROL_GRID,
  PrimitiveGalleryItem,
  PrimitivePage,
} from '../../../stories/PrimitivePage';

/**
 * Hierarchy (see README):
 * - **Fused** — one ButtonGroup; children share edges (Position CSS).
 * - **Spaced toolbar** — outer ButtonGroup whose children are ButtonGroups;
 *   gap `--spacing-xs` between clusters. Prefer this over Separator for outline.
 */

const meta = {
  title: 'Design System/Primitives/Button Group',
  component: ButtonGroup,
  tags: ['ai-generated'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof ButtonGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

type Orientation = 'horizontal' | 'vertical';
type GroupVariant = 'outline' | 'ghost';
type GroupRoundness = 'default' | 'round';
type PlaygroundMode = 'fused' | 'spaced';
type PlaygroundSize = 'small' | 'default' | 'large';

/**
 * Text ↔ Icon height parity for fused rows.
 * small 32↔sm · default 40↔lg · large 44↔lg (stretch closes the 4px gap).
 */
function iconSizeForText(
  size: PlaygroundSize
): 'sm' | 'default' | 'lg' {
  if (size === 'small') return 'sm';
  return 'lg';
}

/* ---------- Canonical examples ---------- */

/** Spaced clusters via nested groups — three optional columns. */
function SpacedToolbarExample({
  variant = 'outline',
  size = 'default',
  roundness = 'default',
}: {
  variant?: GroupVariant;
  size?: PlaygroundSize;
  roundness?: GroupRoundness;
} = {}) {
  const iconSize = iconSizeForText(size);

  return (
    <ButtonGroup aria-label="Toolbar" roundness={roundness}>
      <ButtonGroup roundness={roundness}>
        <IconButton
          variant={variant}
          size={iconSize}
          roundness={roundness}
          aria-label="Go back"
        >
          <ArrowLeftIcon />
        </IconButton>
      </ButtonGroup>
      <ButtonGroup roundness={roundness}>
        <Button variant={variant} size={size} roundness={roundness}>
          Copy
        </Button>
        <Button variant={variant} size={size} roundness={roundness}>
          Move
        </Button>
      </ButtonGroup>
      <ButtonGroup roundness={roundness}>
        <Button variant={variant} size={size} roundness={roundness}>
          Share
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <IconButton
                variant={variant}
                size={iconSize}
                roundness={roundness}
                aria-label="More options"
              />
            }
          >
            <MoreHorizontalIcon />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuGroup>
              <DropdownMenuItem>Edit</DropdownMenuItem>
              <DropdownMenuItem>Duplicate</DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </ButtonGroup>
    </ButtonGroup>
  );
}

function FusedExample({
  variant = 'outline',
  size = 'default',
  roundness = 'default',
}: {
  variant?: GroupVariant;
  size?: PlaygroundSize;
  roundness?: GroupRoundness;
} = {}) {
  return (
    <ButtonGroup aria-label="Actions" roundness={roundness}>
      <Button variant={variant} size={size} roundness={roundness}>
        Copy
      </Button>
      <Button variant={variant} size={size} roundness={roundness}>
        Move
      </Button>
      <Button variant={variant} size={size} roundness={roundness}>
        Share
      </Button>
    </ButtonGroup>
  );
}

/** Text + icon in one fused strip — height parity check. */
function HeightParityExample({
  roundness = 'default',
}: {
  roundness?: GroupRoundness;
} = {}) {
  return (
    <div className="flex flex-col items-start gap-[length:var(--spacing-md)]">
      {(['small', 'default', 'large'] as const).map((size) => (
        <ButtonGroup key={size} aria-label={size} roundness={roundness}>
          <Button variant="outline" size={size} roundness={roundness}>
            Label
          </Button>
          <Button
            variant="outline"
            size={size}
            roundness={roundness}
            data-icon="inline-start"
          >
            <PlusIcon data-icon="inline-start" />
            With icon
          </Button>
          <IconButton
            variant="outline"
            size={iconSizeForText(size)}
            roundness={roundness}
            aria-label="More"
          >
            <MoreHorizontalIcon />
          </IconButton>
        </ButtonGroup>
      ))}
    </div>
  );
}

function ShapeExample() {
  return (
    <div className="flex flex-col items-start gap-[length:var(--spacing-md)]">
      <SpacedToolbarExample roundness="default" />
      <SpacedToolbarExample roundness="round" />
    </div>
  );
}

function OrientationExample() {
  return (
    <ButtonGroup orientation="vertical" aria-label="Quantity" roundness="default">
      <IconButton variant="outline" aria-label="Increase">
        <PlusIcon />
      </IconButton>
      <IconButton variant="outline" aria-label="Decrease">
        <MinusIcon />
      </IconButton>
    </ButtonGroup>
  );
}

function SizesExample() {
  return (
    <div className="flex flex-col items-start gap-[length:var(--spacing-md)]">
      {(['small', 'default', 'large'] as const).map((size) => (
        <ButtonGroup key={size} aria-label={size}>
          <Button variant="outline" size={size}>
            {size === 'small' ? 'Small' : size === 'large' ? 'Large' : 'Default'}
          </Button>
          <Button variant="outline" size={size}>
            Button
          </Button>
          <Button variant="outline" size={size}>
            Group
          </Button>
        </ButtonGroup>
      ))}
    </div>
  );
}

function SeparatorExample() {
  return (
    <ButtonGroup aria-label="Clipboard">
      <Button variant="outline">Copy</Button>
      <ButtonGroupSeparator />
      <Button variant="outline">Paste</Button>
    </ButtonGroup>
  );
}

function SplitExample() {
  return (
    <ButtonGroup aria-label="Create">
      <Button variant="outline">Button</Button>
      <ButtonGroupSeparator />
      <IconButton variant="outline" size="lg" aria-label="More options">
        <ChevronDownIcon />
      </IconButton>
    </ButtonGroup>
  );
}

function InputExample() {
  return (
    <ButtonGroup aria-label="Search">
      <Input placeholder="Search…" className="min-w-48" />
      <IconButton variant="outline" aria-label="Search">
        <SearchIcon />
      </IconButton>
    </ButtonGroup>
  );
}

function InputGroupExample() {
  return (
    <ButtonGroup aria-label="Search with shortcut">
      <ButtonGroup>
        <Button variant="outline">Search</Button>
      </ButtonGroup>
      <ButtonGroup>
        <InputGroup>
          <InputGroupInput placeholder="Type a query…" />
          <InputGroupAddon>⌘K</InputGroupAddon>
        </InputGroup>
      </ButtonGroup>
    </ButtonGroup>
  );
}

function DropdownExample() {
  return (
    <ButtonGroup aria-label="Follow">
      <Button variant="primary">Follow</Button>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={<IconButton variant="primary" aria-label="Follow options" />}
        >
          <ChevronDownIcon />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuGroup>
            <DropdownMenuItem>Mute conversation</DropdownMenuItem>
            <DropdownMenuItem>Mark as read</DropdownMenuItem>
            <DropdownMenuItem>Report</DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem variant="destructive">Block</DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </ButtonGroup>
  );
}

function SelectExample() {
  return (
    <ButtonGroup aria-label="Amount">
      <Select defaultValue="$">
        <SelectTrigger className="w-16">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="$">$</SelectItem>
            <SelectItem value="€">€</SelectItem>
            <SelectItem value="£">£</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <Input placeholder="0.00" className="min-w-28" />
    </ButtonGroup>
  );
}

function PopoverExample() {
  return (
    <ButtonGroup aria-label="Copilot">
      <Button variant="outline" data-icon="inline-start">
        <BotIcon data-icon="inline-start" />
        Copilot
      </Button>
      <Popover>
        <PopoverTrigger
          render={
            <IconButton variant="outline" aria-label="Copilot info" />
          }
        >
          <ChevronDownIcon />
        </PopoverTrigger>
        <PopoverContent align="end" className="w-64">
          <PopoverHeader>
            <PopoverTitle>Copilot</PopoverTitle>
            <PopoverDescription>
              Ask for help drafting, summarizing, or exploring this thread.
            </PopoverDescription>
          </PopoverHeader>
        </PopoverContent>
      </Popover>
    </ButtonGroup>
  );
}

function TextExample() {
  return (
    <ButtonGroup aria-label="Labeled field">
      <ButtonGroupText render={<Label htmlFor="bg-name" />}>
        Name
      </ButtonGroupText>
      <Input id="bg-name" placeholder="Type something…" className="min-w-48" />
    </ButtonGroup>
  );
}

function GhostExample() {
  return <FusedExample variant="ghost" />;
}

function PaginationExample() {
  return (
    <ButtonGroup aria-label="Pagination">
      <IconButton variant="outline" aria-label="Previous page">
        <ArrowLeftIcon />
      </IconButton>
      <Button variant="outline">1</Button>
      <Button variant="outline">2</Button>
      <Button variant="outline">3</Button>
      <IconButton variant="outline" aria-label="Next page">
        <ArrowRightIcon />
      </IconButton>
    </ButtonGroup>
  );
}

function RtlExample() {
  return (
    <div dir="rtl">
      <FusedExample />
    </div>
  );
}

/* ---------- Playground ---------- */

function ButtonGroupPlayground() {
  const [mode, setMode] = useState<PlaygroundMode>('spaced');
  const [orientation, setOrientation] = useState<Orientation>('horizontal');
  const [variant, setVariant] = useState<GroupVariant>('outline');
  const [roundness, setRoundness] = useState<GroupRoundness>('default');
  const [size, setSize] = useState<PlaygroundSize>('default');
  const [showCol1, setShowCol1] = useState(true);
  const [showCol2, setShowCol2] = useState(true);
  const [showCol3, setShowCol3] = useState(true);

  const iconSize = iconSizeForText(size);

  const fusedPreview = (
    <ButtonGroup
      orientation={orientation}
      roundness={roundness}
      aria-label="Fused actions"
    >
      <Button variant={variant} size={size} roundness={roundness}>
        Copy
      </Button>
      <Button
        variant={variant}
        size={size}
        roundness={roundness}
        data-icon="inline-start"
      >
        <PlusIcon data-icon="inline-start" />
        Add
      </Button>
      <IconButton
        variant={variant}
        size={iconSize}
        roundness={roundness}
        aria-label="More options"
      >
        <MoreHorizontalIcon />
      </IconButton>
    </ButtonGroup>
  );

  const spacedPreview = (
    <ButtonGroup
      orientation={orientation}
      roundness={roundness}
      aria-label="Toolbar"
    >
      {showCol1 ? (
        <ButtonGroup roundness={roundness}>
          <IconButton
            variant={variant}
            size={iconSize}
            roundness={roundness}
            aria-label="Go back"
          >
            <ArrowLeftIcon />
          </IconButton>
        </ButtonGroup>
      ) : null}
      {showCol2 ? (
        <ButtonGroup roundness={roundness}>
          <Button variant={variant} size={size} roundness={roundness}>
            Copy
          </Button>
          <Button variant={variant} size={size} roundness={roundness}>
            Move
          </Button>
        </ButtonGroup>
      ) : null}
      {showCol3 ? (
        <ButtonGroup roundness={roundness}>
          <Button variant={variant} size={size} roundness={roundness}>
            Share
          </Button>
          <IconButton
            variant={variant}
            size={iconSize}
            roundness={roundness}
            aria-label="More options"
          >
            <MoreHorizontalIcon />
          </IconButton>
        </ButtonGroup>
      ) : null}
    </ButtonGroup>
  );

  return (
    <PlaygroundPanel
      preview={mode === 'spaced' ? spacedPreview : fusedPreview}
      controls={
        <div className={PRIMITIVE_PLAYGROUND_CONTROL_GRID}>
          <div className="col-span-2">
            <InlineSegmentedControl
              label="Layout"
              value={mode}
              options={[
                { value: 'spaced', label: 'Spaced toolbar' },
                { value: 'fused', label: 'Fused cluster' },
              ]}
              onChange={(v) => setMode(v as PlaygroundMode)}
              fullWidth
            />
          </div>
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
            label="Shape"
            value={roundness}
            options={[
              { value: 'default', label: 'Roundrect' },
              { value: 'round', label: 'Round' },
            ]}
            onChange={(v) => setRoundness(v as GroupRoundness)}
            fullWidth
          />
          <InlineSegmentedControl
            label="Variant"
            value={variant}
            options={[
              { value: 'outline', label: 'Outline' },
              { value: 'ghost', label: 'Ghost' },
            ]}
            onChange={(v) => setVariant(v as GroupVariant)}
            fullWidth
          />
          <InlineSegmentedControl
            label="Size"
            value={size}
            options={[
              { value: 'small', label: 'Small' },
              { value: 'default', label: 'Default' },
              { value: 'large', label: 'Large' },
            ]}
            onChange={(v) => setSize(v as PlaygroundSize)}
            fullWidth
          />
          {mode === 'spaced' ? (
            <>
              <InlineSegmentedControl
                label="Column 1"
                value={showCol1 ? 'on' : 'off'}
                options={[
                  { value: 'off', label: 'Off' },
                  { value: 'on', label: 'On' },
                ]}
                onChange={(v) => setShowCol1(v === 'on')}
                fullWidth
              />
              <InlineSegmentedControl
                label="Column 2"
                value={showCol2 ? 'on' : 'off'}
                options={[
                  { value: 'off', label: 'Off' },
                  { value: 'on', label: 'On' },
                ]}
                onChange={(v) => setShowCol2(v === 'on')}
                fullWidth
              />
              <InlineSegmentedControl
                label="Column 3"
                value={showCol3 ? 'on' : 'off'}
                options={[
                  { value: 'off', label: 'Off' },
                  { value: 'on', label: 'On' },
                ]}
                onChange={(v) => setShowCol3(v === 'on')}
                fullWidth
              />
            </>
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
      title="Button Group"
      description={
        <>
          Joins related actions. <strong>Fused</strong> = shared edges.{' '}
          <strong>Spaced toolbar</strong> = nest groups (gap{' '}
          <code>--spacing-xs</code>). Shape is roundrect (
          <code>--rounded-lg</code>) or round (<code>--rounded-full</code>).
          Mix text + icon in one strip — heights stretch to match.
        </>
      }
      playground={<ButtonGroupPlayground />}
      variants={
        <div className="flex flex-wrap gap-4">
          <PrimitiveGalleryItem label="Spaced toolbar">
            <SpacedToolbarExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Round spaced">
            <SpacedToolbarExample roundness="round" />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Fused">
            <FusedExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Height parity">
            <HeightParityExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Ghost fused">
            <GhostExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Orientation">
            <OrientationExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Sizes">
            <SizesExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Separator">
            <SeparatorExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Split">
            <SplitExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="With text">
            <TextExample />
          </PrimitiveGalleryItem>
        </div>
      }
      usageGuidance={
        <ul className="list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
          <li>
            <strong>Fused:</strong> siblings inside one{' '}
            <code>ButtonGroup</code> share borders / radii.
          </li>
          <li>
            <strong>Spaced:</strong> nest <code>ButtonGroup</code>s — gap is
            automatic. Do not use Separator to space Outline clusters.
          </li>
          <li>
            <strong>Shape:</strong> set <code>roundness</code> on the group and
            matching children (<code>default</code> | <code>round</code>).
          </li>
          <li>
            <strong>Height parity:</strong> Text <code>small</code>↔ Icon{' '}
            <code>sm</code>; Text <code>default</code>/<code>large</code>↔ Icon{' '}
            <code>lg</code>. Mixed rows also stretch icon segments.
          </li>
          <li>
            Figma Outline → <code>variant=&quot;outline&quot;</code>; Ghost →{' '}
            <code>ghost</code>. Always set <code>aria-label</code>.
          </li>
        </ul>
      }
      accessibility={
        <ul className="list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
          <li>
            Root has <code>role=&quot;group&quot;</code>. Tab moves between
            focusable children.
          </li>
          <li>
            Icon-only segments need <code>aria-label</code> on each{' '}
            <code>IconButton</code>.
          </li>
        </ul>
      }
    />
  ),
};

export const Default: Story = {
  name: 'Spaced Toolbar',
  render: () => <SpacedToolbarExample />,
};

export const Fused: Story = {
  render: () => <FusedExample />,
};

export const Orientation: Story = {
  render: () => <OrientationExample />,
};

export const Sizes: Story = {
  render: () => <SizesExample />,
};

export const Shape: Story = {
  render: () => <ShapeExample />,
};

export const HeightParity: Story = {
  name: 'Height Parity',
  render: () => <HeightParityExample />,
};

export const Nested: Story = {
  name: 'Spaced (nested)',
  render: () => <SpacedToolbarExample />,
};

export const Separator: Story = {
  render: () => <SeparatorExample />,
};

export const Split: Story = {
  render: () => <SplitExample />,
};

export const InputStory: Story = {
  name: 'Input',
  render: () => <InputExample />,
};

export const InputGroupStory: Story = {
  name: 'Input Group',
  render: () => <InputGroupExample />,
};

export const DropdownMenuStory: Story = {
  name: 'Dropdown Menu',
  render: () => <DropdownExample />,
};

export const SelectStory: Story = {
  name: 'Select',
  render: () => <SelectExample />,
};

export const PopoverStory: Story = {
  name: 'Popover',
  render: () => <PopoverExample />,
};

export const WithText: Story = {
  name: 'With Text',
  render: () => <TextExample />,
};

export const Pagination: Story = {
  render: () => <PaginationExample />,
};

export const RTL: Story = {
  render: () => <RtlExample />,
};
