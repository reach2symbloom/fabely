import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState, type ReactNode } from 'react';
import {
  CalculatorIcon,
  CalendarIcon,
  CreditCardIcon,
  SettingsIcon,
  SmileIcon,
  UserIcon,
  HomeIcon,
  InboxIcon,
  FileTextIcon,
  FolderIcon,
  CopyIcon,
  ScissorsIcon,
  ClipboardPasteIcon,
  TrashIcon,
} from 'lucide-react';
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from './command';
import { Button } from '../button';
import { InlineSegmentedControl } from '../../../stories/InlineSegmentedControl';
import { PlaygroundPanel } from '../../../stories/PlaygroundPanel';
import {
  PRIMITIVE_PLAYGROUND_CONTROL_GRID,
  PrimitiveGalleryItem,
  PrimitivePage,
} from '../../../stories/PrimitivePage';

/**
 * Component Storybook IA (see docs/DESIGN.md "Component Story Structure"):
 * Overview first — Playground, Variants, usage, a11y — then focused pages
 * aligned with shadcn Command docs + Figma Command / Command Item.
 *
 * Deferred: Dialog host, Input Group, Square icon style (README → Deferred).
 */

const meta = {
  title: 'Design System/Primitives/Command',
  component: Command,
  tags: ['ai-generated'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Command>;

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

function DemoExample() {
  return (
    <Command className="max-w-sm">
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          <CommandItem>
            <CalendarIcon />
            <span>Calendar</span>
          </CommandItem>
          <CommandItem>
            <SmileIcon />
            <span>Search Emoji</span>
          </CommandItem>
          <CommandItem>
            <CalculatorIcon />
            <span>Calculator</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Settings">
          <CommandItem>
            <UserIcon />
            <span>Profile</span>
            <CommandShortcut>⌘P</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <CreditCardIcon />
            <span>Billing</span>
            <CommandShortcut>⌘B</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <SettingsIcon />
            <span>Settings</span>
            <CommandShortcut>⌘S</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  );
}

function BasicExample() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <LimitationNotice>
        CommandDialog uses thin-pass Dialog until Dialog is Foundations-matched.
      </LimitationNotice>
      <Button
        variant="outline"
        size="small"
        className="w-fit"
        onClick={() => setOpen(true)}
      >
        Open Menu
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command>
          <CommandInput placeholder="Type a command or search..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Suggestions">
              <CommandItem>Calendar</CommandItem>
              <CommandItem>Search Emoji</CommandItem>
              <CommandItem>Calculator</CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </div>
  );
}

function ShortcutsExample() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <Button
        variant="outline"
        size="small"
        className="w-fit"
        onClick={() => setOpen(true)}
      >
        Open Menu
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command>
          <CommandInput placeholder="Type a command or search..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Settings">
              <CommandItem>
                <UserIcon />
                <span>Profile</span>
                <CommandShortcut>⌘P</CommandShortcut>
              </CommandItem>
              <CommandItem>
                <CreditCardIcon />
                <span>Billing</span>
                <CommandShortcut>⌘B</CommandShortcut>
              </CommandItem>
              <CommandItem>
                <SettingsIcon />
                <span>Settings</span>
                <CommandShortcut>⌘S</CommandShortcut>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </div>
  );
}

function GroupsExample() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <Button
        variant="outline"
        size="small"
        className="w-fit"
        onClick={() => setOpen(true)}
      >
        Open Menu
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command>
          <CommandInput placeholder="Type a command or search..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Suggestions">
              <CommandItem>
                <CalendarIcon />
                <span>Calendar</span>
              </CommandItem>
              <CommandItem>
                <SmileIcon />
                <span>Search Emoji</span>
              </CommandItem>
              <CommandItem>
                <CalculatorIcon />
                <span>Calculator</span>
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Settings">
              <CommandItem>
                <UserIcon />
                <span>Profile</span>
                <CommandShortcut>⌘P</CommandShortcut>
              </CommandItem>
              <CommandItem>
                <SettingsIcon />
                <span>Settings</span>
                <CommandShortcut>⌘S</CommandShortcut>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </div>
  );
}

function ScrollableExample() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <Button
        variant="outline"
        size="small"
        className="w-fit"
        onClick={() => setOpen(true)}
      >
        Open Menu
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command>
          <CommandInput placeholder="Type a command or search..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Navigation">
              <CommandItem>
                <HomeIcon />
                <span>Home</span>
                <CommandShortcut>⌘H</CommandShortcut>
              </CommandItem>
              <CommandItem>
                <InboxIcon />
                <span>Inbox</span>
                <CommandShortcut>⌘I</CommandShortcut>
              </CommandItem>
              <CommandItem>
                <FileTextIcon />
                <span>Documents</span>
                <CommandShortcut>⌘D</CommandShortcut>
              </CommandItem>
              <CommandItem>
                <FolderIcon />
                <span>Folders</span>
                <CommandShortcut>⌘F</CommandShortcut>
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Actions">
              <CommandItem>
                <CopyIcon />
                <span>Copy</span>
                <CommandShortcut>⌘C</CommandShortcut>
              </CommandItem>
              <CommandItem>
                <ScissorsIcon />
                <span>Cut</span>
                <CommandShortcut>⌘X</CommandShortcut>
              </CommandItem>
              <CommandItem>
                <ClipboardPasteIcon />
                <span>Paste</span>
                <CommandShortcut>⌘V</CommandShortcut>
              </CommandItem>
              <CommandItem>
                <TrashIcon />
                <span>Delete</span>
                <CommandShortcut>⌘⌫</CommandShortcut>
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Settings">
              <CommandItem>
                <UserIcon />
                <span>Profile</span>
              </CommandItem>
              <CommandItem>
                <CreditCardIcon />
                <span>Billing</span>
              </CommandItem>
              <CommandItem>
                <SettingsIcon />
                <span>Settings</span>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </div>
  );
}

function RtlExample() {
  return (
    <div dir="rtl">
      <Command className="max-w-sm" dir="rtl">
        <CommandInput placeholder="اكتب أمرًا أو ابحث..." dir="rtl" />
        <CommandList>
          <CommandEmpty>لم يتم العثور على نتائج.</CommandEmpty>
          <CommandGroup heading="اقتراحات">
            <CommandItem>
              <CalendarIcon />
              <span>التقويم</span>
            </CommandItem>
            <CommandItem>
              <SmileIcon />
              <span>البحث عن الرموز التعبيرية</span>
            </CommandItem>
            <CommandItem>
              <CalculatorIcon />
              <span>الآلة الحاسبة</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="الإعدادات">
            <CommandItem>
              <UserIcon />
              <span>الملف الشخصي</span>
              <CommandShortcut>⌘P</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <CreditCardIcon />
              <span>الفوترة</span>
              <CommandShortcut>⌘B</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <SettingsIcon />
              <span>الإعدادات</span>
              <CommandShortcut>⌘S</CommandShortcut>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  );
}

/* ---------- Playground ---------- */

type PlaygroundVariant = 'demo' | 'basic' | 'shortcuts' | 'groups' | 'scrollable';

function CommandPlayground() {
  const [variant, setVariant] = useState<PlaygroundVariant>('demo');

  let preview: ReactNode;
  switch (variant) {
    case 'basic':
      preview = <BasicExample />;
      break;
    case 'shortcuts':
      preview = <ShortcutsExample />;
      break;
    case 'groups':
      preview = <GroupsExample />;
      break;
    case 'scrollable':
      preview = <ScrollableExample />;
      break;
    default:
      preview = <DemoExample />;
  }

  return (
    <PlaygroundPanel
      preview={preview}
      controls={
        <div className={PRIMITIVE_PLAYGROUND_CONTROL_GRID}>
          <div className="col-span-2">
            <InlineSegmentedControl
              label="Composition"
              value={variant}
              onChange={setVariant}
              options={[
                { value: 'demo', label: 'Demo' },
                { value: 'basic', label: 'Basic' },
                { value: 'shortcuts', label: 'Shortcuts' },
                { value: 'groups', label: 'Groups' },
                { value: 'scrollable', label: 'Scrollable' },
              ]}
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
      title="Command"
      description={
        <>
          Searchable command menu built on cmdk. Foundations surface and input
          from Figma Command; items use ListItem interaction tokens. API matches{' '}
          <a
            href="https://ui.shadcn.com/docs/components/base/command"
            className="underline underline-offset-4"
          >
            shadcn Command
          </a>
          .
        </>
      }
      playground={<CommandPlayground />}
      variants={
        <div className="flex flex-wrap gap-4">
          <PrimitiveGalleryItem label="Demo">
            <DemoExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Basic">
            <BasicExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Shortcuts">
            <ShortcutsExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Groups">
            <GroupsExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Scrollable">
            <ScrollableExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="RTL">
            <RtlExample />
          </PrimitiveGalleryItem>
        </div>
      }
      usageGuidance={
        <ul className="list-disc space-y-2 ps-5 text-sm text-muted-foreground">
          <li>
            Use inline <code>Command</code> with a border for embedded palettes;
            use <code>CommandDialog</code> for modal command menus.
          </li>
          <li>
            Put icons and labels as children of <code>CommandItem</code>; use{' '}
            <code>CommandShortcut</code> for keyboard hints.
          </li>
          <li>
            Group with <code>CommandGroup heading</code> and{' '}
            <code>CommandSeparator</code>.
          </li>
        </ul>
      }
      accessibility={
        <ul className="list-disc space-y-2 ps-5 text-sm text-muted-foreground">
          <li>
            CommandDialog exposes sr-only title/description for the dialog.
          </li>
          <li>
            cmdk provides listbox keyboard navigation; keep labels short and
            unique within a group.
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

export const Shortcuts: Story = {
  render: () => <ShortcutsExample />,
};

export const Groups: Story = {
  render: () => <GroupsExample />,
};

export const Scrollable: Story = {
  render: () => <ScrollableExample />,
};

export const RTL: Story = {
  name: 'RTL',
  render: () => <RtlExample />,
};
