import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState, type ReactNode } from 'react';
import {
  ArchiveIcon,
  ClipboardPasteIcon,
  CopyIcon,
  CreditCardIcon,
  LogOutIcon,
  MailIcon,
  MessageSquareIcon,
  PencilIcon,
  PlusCircleIcon,
  ScissorsIcon,
  SettingsIcon,
  ShareIcon,
  TrashIcon,
  UserIcon,
  UserPlusIcon,
} from 'lucide-react';
import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from './context-menu';
import {
  ListItemContent,
  ListItemDescription,
  ListItemTitle,
} from '../list-item';
import { cn } from '@/lib/utils';
import { InlineSegmentedControl } from '../../../stories/InlineSegmentedControl';
import { PlaygroundPanel } from '../../../stories/PlaygroundPanel';
import {
  PRIMITIVE_PLAYGROUND_CONTROL_GRID,
  PrimitiveGalleryItem,
  PrimitivePage,
} from '../../../stories/PrimitivePage';

/**
 * Component Storybook IA (see docs/DESIGN.md "Component Story Structure"):
 * Overview first — rows compose ListItem (DESIGN.md). Mirrors Dropdown Menu.
 */

const meta = {
  title: 'Design System/Primitives/Context Menu',
  component: ContextMenu,
  tags: ['ai-generated'],
  parameters: { layout: 'centered' },
} satisfies Meta;

export default meta;
type Story = StoryObj;

const TRIGGER_SURFACE =
  'flex h-32 w-64 flex-col items-center justify-center gap-[var(--spacing-2xs)] rounded-[var(--radius)] border-[length:var(--stroke-thin)] border-dashed border-[color:var(--border)] bg-[var(--card)] text-[length:var(--text-paragraph-mini-regular-font-size)] leading-[var(--text-paragraph-mini-regular-line-height)] text-[color:var(--muted-foreground)]';

function TriggerBox({
  children = (
    <>
      <span>Right click here</span>
      <span className="text-[length:var(--text-caption-mini-font-size)]">
        Long press on touch
      </span>
    </>
  ),
  className,
}: {
  children?: ReactNode;
  className?: string;
}) {
  return (
    <ContextMenuTrigger className={cn(TRIGGER_SURFACE, className)}>
      {children}
    </ContextMenuTrigger>
  );
}

/* ---------- Canonical examples ---------- */

function DemoExample() {
  const [bookmarks, setBookmarks] = useState(true);
  const [urls, setUrls] = useState(false);
  const [person, setPerson] = useState('pedro');

  return (
    <ContextMenu>
      <TriggerBox />
      <ContextMenuContent>
        <ContextMenuGroup>
          <ContextMenuItem>
            Back
            <ContextMenuShortcut>⌘[</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem disabled>
            Forward
            <ContextMenuShortcut>⌘]</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem>
            Reload
            <ContextMenuShortcut>⌘R</ContextMenuShortcut>
          </ContextMenuItem>
        </ContextMenuGroup>
        <ContextMenuSeparator />
        <ContextMenuGroup>
          <ContextMenuSub>
            <ContextMenuSubTrigger>More Tools</ContextMenuSubTrigger>
            <ContextMenuSubContent>
              <ContextMenuGroup>
                <ContextMenuItem>
                  Save Page As…
                  <ContextMenuShortcut>⇧⌘S</ContextMenuShortcut>
                </ContextMenuItem>
                <ContextMenuItem>Create Shortcut…</ContextMenuItem>
                <ContextMenuItem>Name Window…</ContextMenuItem>
              </ContextMenuGroup>
              <ContextMenuSeparator />
              <ContextMenuGroup>
                <ContextMenuItem>Developer Tools</ContextMenuItem>
              </ContextMenuGroup>
            </ContextMenuSubContent>
          </ContextMenuSub>
        </ContextMenuGroup>
        <ContextMenuSeparator />
        <ContextMenuGroup>
          <ContextMenuCheckboxItem
            checked={bookmarks}
            onCheckedChange={setBookmarks}
          >
            Show Bookmarks Bar
            <ContextMenuShortcut>⌘⇧B</ContextMenuShortcut>
          </ContextMenuCheckboxItem>
          <ContextMenuCheckboxItem checked={urls} onCheckedChange={setUrls}>
            Show Full URLs
          </ContextMenuCheckboxItem>
        </ContextMenuGroup>
        <ContextMenuSeparator />
        <ContextMenuRadioGroup value={person} onValueChange={setPerson}>
          <ContextMenuLabel>People</ContextMenuLabel>
          <ContextMenuRadioItem value="pedro">Pedro Duarte</ContextMenuRadioItem>
          <ContextMenuRadioItem value="colm">Colm Tuite</ContextMenuRadioItem>
        </ContextMenuRadioGroup>
      </ContextMenuContent>
    </ContextMenu>
  );
}

function BasicExample() {
  return (
    <ContextMenu>
      <TriggerBox />
      <ContextMenuContent>
        <ContextMenuGroup>
          <ContextMenuItem>
            <UserIcon />
            <ListItemContent>
              <ListItemTitle>Profile</ListItemTitle>
              <ListItemDescription>
                Name, photo, and preferences
              </ListItemDescription>
            </ListItemContent>
            <ContextMenuShortcut>⇧⌘P</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem>
            <CreditCardIcon />
            Billing
            <ContextMenuShortcut>⌘B</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem>
            <SettingsIcon />
            Settings
            <ContextMenuShortcut>⌘S</ContextMenuShortcut>
          </ContextMenuItem>
        </ContextMenuGroup>
      </ContextMenuContent>
    </ContextMenu>
  );
}

function SubmenuExample() {
  return (
    <ContextMenu>
      <TriggerBox />
      <ContextMenuContent>
        <ContextMenuGroup>
          <ContextMenuItem>
            <MailIcon />
            Email
          </ContextMenuItem>
          <ContextMenuItem>
            <MessageSquareIcon />
            Message
          </ContextMenuItem>
        </ContextMenuGroup>
        <ContextMenuSeparator />
        <ContextMenuGroup>
          <ContextMenuSub>
            <ContextMenuSubTrigger>
              <UserPlusIcon />
              Invite users
            </ContextMenuSubTrigger>
            <ContextMenuSubContent>
              <ContextMenuGroup>
                <ContextMenuItem>
                  <MailIcon />
                  Email
                </ContextMenuItem>
                <ContextMenuItem>
                  <MessageSquareIcon />
                  Message
                </ContextMenuItem>
              </ContextMenuGroup>
              <ContextMenuSeparator />
              <ContextMenuGroup>
                <ContextMenuItem>
                  <PlusCircleIcon />
                  More…
                </ContextMenuItem>
              </ContextMenuGroup>
            </ContextMenuSubContent>
          </ContextMenuSub>
        </ContextMenuGroup>
      </ContextMenuContent>
    </ContextMenu>
  );
}

function ShortcutsExample() {
  return (
    <ContextMenu>
      <TriggerBox />
      <ContextMenuContent>
        <ContextMenuGroup>
          <ContextMenuItem>
            New Tab
            <ContextMenuShortcut>⌘T</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem>
            New Window
            <ContextMenuShortcut>⌘N</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem>
            New Incognito Window
            <ContextMenuShortcut>⇧⌘N</ContextMenuShortcut>
          </ContextMenuItem>
        </ContextMenuGroup>
        <ContextMenuSeparator />
        <ContextMenuGroup>
          <ContextMenuItem>
            Close Tab
            <ContextMenuShortcut>⌘W</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem>
            Close Window
            <ContextMenuShortcut>⇧⌘W</ContextMenuShortcut>
          </ContextMenuItem>
        </ContextMenuGroup>
      </ContextMenuContent>
    </ContextMenu>
  );
}

function GroupsExample() {
  return (
    <ContextMenu>
      <TriggerBox />
      <ContextMenuContent>
        <ContextMenuGroup>
          <ContextMenuLabel>File</ContextMenuLabel>
          <ContextMenuItem>New File</ContextMenuItem>
          <ContextMenuItem>Open…</ContextMenuItem>
          <ContextMenuItem>Save</ContextMenuItem>
        </ContextMenuGroup>
        <ContextMenuSeparator />
        <ContextMenuGroup>
          <ContextMenuLabel>Edit</ContextMenuLabel>
          <ContextMenuItem>Cut</ContextMenuItem>
          <ContextMenuItem>Copy</ContextMenuItem>
          <ContextMenuItem>Paste</ContextMenuItem>
        </ContextMenuGroup>
        <ContextMenuSeparator />
        <ContextMenuGroup>
          <ContextMenuLabel>View</ContextMenuLabel>
          <ContextMenuItem>Zoom In</ContextMenuItem>
          <ContextMenuItem>Zoom Out</ContextMenuItem>
          <ContextMenuItem>Reset Zoom</ContextMenuItem>
        </ContextMenuGroup>
      </ContextMenuContent>
    </ContextMenu>
  );
}

function IconsExample() {
  return (
    <ContextMenu>
      <TriggerBox />
      <ContextMenuContent>
        <ContextMenuGroup>
          <ContextMenuItem>
            <CopyIcon />
            Copy
            <ContextMenuShortcut>⌘C</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem>
            <ScissorsIcon />
            Cut
            <ContextMenuShortcut>⌘X</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem>
            <ClipboardPasteIcon />
            Paste
            <ContextMenuShortcut>⌘V</ContextMenuShortcut>
          </ContextMenuItem>
        </ContextMenuGroup>
      </ContextMenuContent>
    </ContextMenu>
  );
}

function CheckboxesExample() {
  const [bookmarks, setBookmarks] = useState(true);
  const [urls, setUrls] = useState(false);

  return (
    <ContextMenu>
      <TriggerBox />
      <ContextMenuContent>
        <ContextMenuGroup>
          <ContextMenuLabel>Appearance</ContextMenuLabel>
          <ContextMenuCheckboxItem
            checked={bookmarks}
            onCheckedChange={setBookmarks}
          >
            Show Bookmarks Bar
          </ContextMenuCheckboxItem>
          <ContextMenuCheckboxItem checked={urls} onCheckedChange={setUrls}>
            Show Full URLs
          </ContextMenuCheckboxItem>
        </ContextMenuGroup>
      </ContextMenuContent>
    </ContextMenu>
  );
}

function RadioExample() {
  const [position, setPosition] = useState('bottom');

  return (
    <ContextMenu>
      <TriggerBox />
      <ContextMenuContent>
        <ContextMenuRadioGroup value={position} onValueChange={setPosition}>
          <ContextMenuLabel>Panel Position</ContextMenuLabel>
          <ContextMenuRadioItem value="top">Top</ContextMenuRadioItem>
          <ContextMenuRadioItem value="bottom">Bottom</ContextMenuRadioItem>
          <ContextMenuRadioItem value="right">Right</ContextMenuRadioItem>
        </ContextMenuRadioGroup>
      </ContextMenuContent>
    </ContextMenu>
  );
}

function DestructiveExample() {
  return (
    <ContextMenu>
      <TriggerBox />
      <ContextMenuContent>
        <ContextMenuGroup>
          <ContextMenuItem>
            <PencilIcon />
            Edit
          </ContextMenuItem>
          <ContextMenuItem>
            <ShareIcon />
            Share
          </ContextMenuItem>
          <ContextMenuItem>
            <ArchiveIcon />
            Archive
          </ContextMenuItem>
        </ContextMenuGroup>
        <ContextMenuSeparator />
        <ContextMenuGroup>
          <ContextMenuItem variant="destructive">
            <TrashIcon />
            Delete
            <ContextMenuShortcut>⌘⌫</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem variant="destructive">
            <LogOutIcon />
            Log out
          </ContextMenuItem>
        </ContextMenuGroup>
      </ContextMenuContent>
    </ContextMenu>
  );
}

/** shadcn docs' "RTL" — wrap in `dir="rtl"` with Arabic copy. */
function RtlExample() {
  return (
    <div dir="rtl">
      <ContextMenu>
        <TriggerBox>
          <span>انقر بزر الماوس الأيمن هنا</span>
          <span className="text-[length:var(--text-caption-mini-font-size)]">
            اضغط مطولاً هنا
          </span>
        </TriggerBox>
        <ContextMenuContent side="inline-end">
          <ContextMenuGroup>
            <ContextMenuItem>
              <UserIcon />
              الملف الشخصي
              <ContextMenuShortcut>⇧⌘P</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuItem>
              <SettingsIcon />
              الإعدادات
              <ContextMenuShortcut>⌘S</ContextMenuShortcut>
            </ContextMenuItem>
          </ContextMenuGroup>
          <ContextMenuSeparator />
          <ContextMenuGroup>
            <ContextMenuItem variant="destructive">
              <LogOutIcon />
              تسجيل الخروج
            </ContextMenuItem>
          </ContextMenuGroup>
        </ContextMenuContent>
      </ContextMenu>
    </div>
  );
}

/* ---------- Playground ---------- */

function ContextMenuPlayground() {
  const [withIcons, setWithIcons] = useState(true);
  const [withShortcut, setWithShortcut] = useState(true);

  return (
    <PlaygroundPanel
      preview={
        <ContextMenu>
          <TriggerBox />
          <ContextMenuContent>
            <ContextMenuGroup>
              <ContextMenuLabel>Account</ContextMenuLabel>
              <ContextMenuItem>
                {withIcons ? <UserIcon /> : null}
                Profile
                {withShortcut ? (
                  <ContextMenuShortcut>⇧⌘P</ContextMenuShortcut>
                ) : null}
              </ContextMenuItem>
              <ContextMenuItem>
                {withIcons ? <SettingsIcon /> : null}
                Settings
                {withShortcut ? (
                  <ContextMenuShortcut>⌘S</ContextMenuShortcut>
                ) : null}
              </ContextMenuItem>
            </ContextMenuGroup>
            <ContextMenuSeparator />
            <ContextMenuGroup>
              <ContextMenuItem variant="destructive">
                {withIcons ? <LogOutIcon /> : null}
                Log out
              </ContextMenuItem>
            </ContextMenuGroup>
          </ContextMenuContent>
        </ContextMenu>
      }
      controls={
        <div className={PRIMITIVE_PLAYGROUND_CONTROL_GRID}>
          <InlineSegmentedControl
            label="Icons"
            value={withIcons ? 'on' : 'off'}
            options={[
              { value: 'off', label: 'Off' },
              { value: 'on', label: 'On' },
            ]}
            onChange={(v) => setWithIcons(v === 'on')}
            fullWidth
          />
          <InlineSegmentedControl
            label="Shortcuts"
            value={withShortcut ? 'on' : 'off'}
            options={[
              { value: 'off', label: 'Off' },
              { value: 'on', label: 'On' },
            ]}
            onChange={(v) => setWithShortcut(v === 'on')}
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
      title="Context Menu"
      description={
        <>
          Right-click / long-press menu; every leaf row renders through{' '}
          <code>ListItem</code>. Same surface and composition as Dropdown Menu.
          Checkbox/radio indicators sit in <code>ListItemMedia</code>{' '}
          (leading).
        </>
      }
      playground={<ContextMenuPlayground />}
      variants={
        <div className="flex flex-wrap gap-6">
          <PrimitiveGalleryItem label="Demo">
            <DemoExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Basic">
            <BasicExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Submenu">
            <SubmenuExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Shortcuts">
            <ShortcutsExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Groups">
            <GroupsExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Icons">
            <IconsExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Checkboxes">
            <CheckboxesExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Radio">
            <RadioExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Destructive">
            <DestructiveExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="RTL">
            <RtlExample />
          </PrimitiveGalleryItem>
        </div>
      }
      usageGuidance={
        <ul className="list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
          <li>
            Trigger with right-click (desktop) or long-press (touch). Keep{' '}
            <code>select-none</code> on the trigger surface.
          </li>
          <li>
            <code>ContextMenuLabel</code> must sit inside{' '}
            <code>ContextMenuGroup</code> or <code>ContextMenuRadioGroup</code>{' '}
            (Base UI).
          </li>
          <li>
            Do not style rows inline — <code>ContextMenuItem</code> composes{' '}
            <code>ListItem</code>.
          </li>
          <li>
            Leading icons and checkbox/radio indicators use{' '}
            <code>ListItemMedia</code>; shortcuts and submenu chevrons use{' '}
            <code>ListItemTrailing</code>.
          </li>
          <li>
            <code>variant=&quot;destructive&quot;</code> maps to ListItem
            destructive.
          </li>
          <li>
            Separator is full-bleed (cancels Content padding) with{' '}
            <code>--stroke-thin</code> / <code>--border</code> /{' '}
            <code>--spacing-xs</code>.
          </li>
        </ul>
      }
      accessibility={
        <ul className="list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
          <li>
            Base UI Context Menu provides keyboard navigation once open;
            highlight maps to ListItem <code>data-highlighted</code>.
          </li>
          <li>
            Checkbox/radio selection uses <code>aria-checked</code> from the
            menu primitive; selected paint via ListItem{' '}
            the checkmark indicator; checkbox rows do not use ListItem
            selected fill (hover / highlight only).
          </li>
          <li>
            For RTL, wrap in <code>dir=&quot;rtl&quot;</code> and prefer{' '}
            <code>side=&quot;inline-end&quot;</code> for logical placement.
          </li>
        </ul>
      }
    />
  ),
};

/* ---------- Individual example pages ---------- */

export const Demo: Story = {
  render: () => <DemoExample />,
};

export const Basic: Story = {
  render: () => <BasicExample />,
};

export const Submenu: Story = {
  render: () => <SubmenuExample />,
};

export const Shortcuts: Story = {
  render: () => <ShortcutsExample />,
};

export const Groups: Story = {
  render: () => <GroupsExample />,
};

export const Icons: Story = {
  render: () => <IconsExample />,
};

export const Checkboxes: Story = {
  render: () => <CheckboxesExample />,
};

export const Radio: Story = {
  render: () => <RadioExample />,
};

export const Destructive: Story = {
  render: () => <DestructiveExample />,
};

export const RTL: Story = {
  name: 'RTL',
  render: () => <RtlExample />,
};
