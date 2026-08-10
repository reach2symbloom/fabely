import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import {
  ArchiveIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  AudioLinesIcon,
  BotIcon,
  ChevronDownIcon,
  MinusIcon,
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
 * Component Storybook IA (see docs/DESIGN.md "Component Story Structure"):
 * Overview first. API from shadcn Button Group; join radii from Figma
 * Button Group (`784:82792`) → `--rounded-lg`.
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

/* ---------- Canonical examples ---------- */

function DefaultExample() {
  return (
    <ButtonGroup aria-label="Actions">
      <Button variant="primaryOutline">Archive</Button>
      <Button variant="primaryOutline">Report</Button>
      <Button variant="primaryOutline">Snooze</Button>
    </ButtonGroup>
  );
}

function OrientationExample() {
  return (
    <ButtonGroup orientation="vertical" aria-label="Quantity">
      <IconButton variant="primaryOutline" aria-label="Increase">
        <PlusIcon />
      </IconButton>
      <IconButton variant="primaryOutline" aria-label="Decrease">
        <MinusIcon />
      </IconButton>
    </ButtonGroup>
  );
}

function SizesExample() {
  return (
    <div className="flex flex-col items-start gap-[length:var(--spacing-md)]">
      <ButtonGroup aria-label="Small">
        <Button variant="primaryOutline" size="small">
          Small
        </Button>
        <Button variant="primaryOutline" size="small">
          Button
        </Button>
        <Button variant="primaryOutline" size="small">
          Group
        </Button>
      </ButtonGroup>
      <ButtonGroup aria-label="Default">
        <Button variant="primaryOutline">Default</Button>
        <Button variant="primaryOutline">Button</Button>
        <Button variant="primaryOutline">Group</Button>
      </ButtonGroup>
      <ButtonGroup aria-label="Large">
        <Button variant="primaryOutline" size="large">
          Large
        </Button>
        <Button variant="primaryOutline" size="large">
          Button
        </Button>
        <Button variant="primaryOutline" size="large">
          Group
        </Button>
      </ButtonGroup>
    </div>
  );
}

function NestedExample() {
  return (
    <ButtonGroup aria-label="Media">
      <ButtonGroup>
        <Button variant="primaryOutline" data-icon="inline-start">
          <PlusIcon data-icon="inline-start" />
          Add
        </Button>
      </ButtonGroup>
      <ButtonGroup>
        <IconButton variant="primaryOutline" aria-label="Voice mode">
          <AudioLinesIcon />
        </IconButton>
      </ButtonGroup>
    </ButtonGroup>
  );
}

function SeparatorExample() {
  return (
    <ButtonGroup aria-label="Clipboard">
      <Button variant="secondary">Copy</Button>
      <ButtonGroupSeparator />
      <Button variant="secondary">Paste</Button>
    </ButtonGroup>
  );
}

function SplitExample() {
  return (
    <ButtonGroup aria-label="Create">
      <Button variant="primary">Button</Button>
      <ButtonGroupSeparator />
      <IconButton variant="primary" aria-label="More options">
        <ChevronDownIcon />
      </IconButton>
    </ButtonGroup>
  );
}

function InputExample() {
  return (
    <ButtonGroup aria-label="Search">
      <Input placeholder="Search…" className="min-w-48" />
      <IconButton variant="primaryOutline" aria-label="Search">
        <SearchIcon />
      </IconButton>
    </ButtonGroup>
  );
}

function InputGroupExample() {
  return (
    <ButtonGroup aria-label="Search with shortcut">
      <ButtonGroup>
        <Button variant="primaryOutline">Search</Button>
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
      <Button variant="primaryOutline" data-icon="inline-start">
        <BotIcon data-icon="inline-start" />
        Copilot
      </Button>
      <Popover>
        <PopoverTrigger
          render={
            <IconButton variant="primaryOutline" aria-label="Copilot info" />
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
  return (
    <ButtonGroup aria-label="Ghost actions">
      <Button variant="ghost">Archive</Button>
      <Button variant="ghost">Report</Button>
      <Button variant="ghost">Snooze</Button>
    </ButtonGroup>
  );
}

function PaginationExample() {
  return (
    <ButtonGroup aria-label="Pagination">
      <IconButton variant="primaryOutline" aria-label="Previous page">
        <ArrowLeftIcon />
      </IconButton>
      <Button variant="primaryOutline">1</Button>
      <Button variant="primaryOutline">2</Button>
      <Button variant="primaryOutline">3</Button>
      <IconButton variant="primaryOutline" aria-label="Next page">
        <ArrowRightIcon />
      </IconButton>
    </ButtonGroup>
  );
}

function RtlExample() {
  return (
    <div dir="rtl">
      <ButtonGroup aria-label="إجراءات">
        <Button variant="primaryOutline">أرشفة</Button>
        <Button variant="primaryOutline">تقرير</Button>
        <Button variant="primaryOutline">تأجيل</Button>
      </ButtonGroup>
    </div>
  );
}

/* ---------- Playground ---------- */

function ButtonGroupPlayground() {
  const [orientation, setOrientation] = useState<Orientation>('horizontal');
  const [variant, setVariant] = useState<'primaryOutline' | 'ghost' | 'secondary'>(
    'primaryOutline'
  );
  const [size, setSize] = useState<'small' | 'default' | 'large'>('default');
  const [withSeparator, setWithSeparator] = useState(false);

  return (
    <PlaygroundPanel
      preview={
        <ButtonGroup orientation={orientation} aria-label="Playground group">
          <Button variant={variant} size={size} data-icon="inline-start">
            <ArchiveIcon data-icon="inline-start" />
            Archive
          </Button>
          {withSeparator ? <ButtonGroupSeparator /> : null}
          <Button variant={variant} size={size}>
            Report
          </Button>
          <Button variant={variant} size={size}>
            Snooze
          </Button>
        </ButtonGroup>
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
            label="Child variant"
            value={variant}
            options={[
              { value: 'primaryOutline', label: 'Outline' },
              { value: 'secondary', label: 'Secondary' },
              { value: 'ghost', label: 'Ghost' },
            ]}
            onChange={(v) =>
              setVariant(v as 'primaryOutline' | 'ghost' | 'secondary')
            }
            fullWidth
          />
          <div className="col-span-2">
            <InlineSegmentedControl
              label="Child size"
              value={size}
              options={[
                { value: 'small', label: 'Small' },
                { value: 'default', label: 'Default' },
                { value: 'large', label: 'Large' },
              ]}
              onChange={(v) => setSize(v as 'small' | 'default' | 'large')}
              fullWidth
            />
          </div>
          <div className="col-span-2">
            <InlineSegmentedControl
              label="Separator"
              value={withSeparator ? 'on' : 'off'}
              options={[
                { value: 'off', label: 'Off' },
                { value: 'on', label: 'On' },
              ]}
              onChange={(v) => setWithSeparator(v === 'on')}
              fullWidth
            />
          </div>
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
          Groups related buttons with joined edges and{' '}
          <code>--rounded-lg</code> end caps (Figma Button Group). Size and
          chrome live on child Text / Icon Buttons. Prefer this for actions;
          use Toggle Group for mutually exclusive state.
        </>
      }
      playground={<ButtonGroupPlayground />}
      variants={
        <div className="flex flex-wrap gap-4">
          <PrimitiveGalleryItem label="Default">
            <DefaultExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Ghost">
            <GhostExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Orientation">
            <OrientationExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Sizes">
            <SizesExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Nested">
            <NestedExample />
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
            Always set <code>aria-label</code> (or <code>aria-labelledby</code>)
            on the group.
          </li>
          <li>
            Figma Outline → child <code>primaryOutline</code> /{' '}
            <code>secondary</code> / <code>fiaOutline</code>; Ghost →{' '}
            <code>ghost</code>. Position (Left / Middle / Right) is CSS, not a
            prop.
          </li>
          <li>
            Outline children usually need no separator; filled / secondary
            pairs benefit from <code>ButtonGroupSeparator</code>.
          </li>
          <li>
            Nest <code>ButtonGroup</code>s when you need a gap between clusters.
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
  render: () => <DefaultExample />,
};

export const Orientation: Story = {
  render: () => <OrientationExample />,
};

export const Sizes: Story = {
  render: () => <SizesExample />,
};

export const Nested: Story = {
  render: () => <NestedExample />,
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
