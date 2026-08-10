import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import {
  CreditCardIcon,
  LogOutIcon,
  MailIcon,
  MessageSquareIcon,
  PlusCircleIcon,
  SettingsIcon,
  UserIcon,
  UserPlusIcon,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from './dropdown-menu';
import {
  ListItemContent,
  ListItemDescription,
  ListItemTitle,
} from '../list-item';
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
 * Overview first — rows compose ListItem (DESIGN.md).
 */

const meta = {
  title: 'Design System/Primitives/Dropdown Menu',
  component: DropdownMenu,
  tags: ['ai-generated'],
  parameters: { layout: 'centered' },
} satisfies Meta;

export default meta;
type Story = StoryObj;

/* ---------- Canonical examples ---------- */

function BasicExample() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="secondary" />}>
        Open
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuItem>
            <UserIcon />
            <ListItemContent>
              <ListItemTitle>Profile</ListItemTitle>
              <ListItemDescription>
                Name, photo, and preferences
              </ListItemDescription>
            </ListItemContent>
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <CreditCardIcon />
            <ListItemContent>
              <ListItemTitle>Billing</ListItemTitle>
              <ListItemDescription>
                Plans, invoices, and payment methods
              </ListItemDescription>
            </ListItemContent>
            <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <SettingsIcon />
            Settings
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem variant="destructive">
            <LogOutIcon />
            Log out
            <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function CheckboxesExample() {
  const [bookmarks, setBookmarks] = useState(true);
  const [urls, setUrls] = useState(false);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="secondary" />}>
        Checkboxes
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuLabel>Appearance</DropdownMenuLabel>
          <DropdownMenuCheckboxItem
            checked={bookmarks}
            onCheckedChange={setBookmarks}
          >
            Show Bookmarks Bar
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem checked={urls} onCheckedChange={setUrls}>
            Show Full URLs
          </DropdownMenuCheckboxItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function RadioExample() {
  const [position, setPosition] = useState('bottom');

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="secondary" />}>
        Radio
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuRadioGroup value={position} onValueChange={setPosition}>
          <DropdownMenuLabel>Panel Position</DropdownMenuLabel>
          <DropdownMenuRadioItem value="top">Top</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="bottom">Bottom</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="right">Right</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function SubmenuExample() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="secondary" />}>
        Submenu
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <MailIcon />
            Email
          </DropdownMenuItem>
          <DropdownMenuItem>
            <MessageSquareIcon />
            Message
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <UserPlusIcon />
              Invite users
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <MailIcon />
                  Email
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <MessageSquareIcon />
                  Message
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <PlusCircleIcon />
                  More…
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/* ---------- Playground ---------- */

function DropdownMenuPlayground() {
  const [withIcons, setWithIcons] = useState(true);
  const [withShortcut, setWithShortcut] = useState(true);

  return (
    <PlaygroundPanel
      preview={
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="secondary" />}>
            Open menu
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuGroup>
              <DropdownMenuLabel>Account</DropdownMenuLabel>
              <DropdownMenuItem>
                {withIcons ? <UserIcon /> : null}
                Profile
                {withShortcut ? (
                  <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                ) : null}
              </DropdownMenuItem>
              <DropdownMenuItem>
                {withIcons ? <SettingsIcon /> : null}
                Settings
                {withShortcut ? (
                  <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                ) : null}
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem variant="destructive">
                {withIcons ? <LogOutIcon /> : null}
                Log out
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
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
      title="Dropdown Menu"
      description={
        <>
          shadcn composition API; every leaf row renders through{' '}
          <code>ListItem</code>. Checkbox/radio indicators sit in{' '}
          <code>ListItemMedia</code> (leading) — not vendor’s right-side check.
        </>
      }
      playground={<DropdownMenuPlayground />}
      variants={
        <div className="flex flex-wrap gap-6">
          <PrimitiveGalleryItem label="Basic">
            <BasicExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Checkboxes">
            <CheckboxesExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Radio">
            <RadioExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Submenu">
            <SubmenuExample />
          </PrimitiveGalleryItem>
        </div>
      }
      usageGuidance={
        <ul className="list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
          <li>
            Two-line rows: compose <code>ListItemContent</code> with{' '}
            <code>ListItemTitle</code> + <code>ListItemDescription</code>.
          </li>
          <li>
            Do not style rows inline — <code>DropdownMenuItem</code> composes{' '}
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
            Base UI Menu provides keyboard navigation; highlight maps to
            ListItem <code>data-highlighted</code>.
          </li>
          <li>
            Checkbox/radio selection uses <code>aria-checked</code> from the
            menu primitive; selected paint via ListItem{' '}
            <code>selected</code> / <code>data-checked</code>.
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

export const Checkboxes: Story = {
  render: () => <CheckboxesExample />,
};

export const Radio: Story = {
  render: () => <RadioExample />,
};

export const Submenu: Story = {
  render: () => <SubmenuExample />,
};
