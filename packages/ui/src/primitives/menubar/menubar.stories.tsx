import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import {
  CheckIcon,
  CopyIcon,
  FileIcon,
  FilePlusIcon,
  FolderIcon,
  FolderOpenIcon,
  PrinterIcon,
  SaveIcon,
  ShareIcon,
} from 'lucide-react';

import { InlineSegmentedControl } from '../../../stories/InlineSegmentedControl';
import { PlaygroundPanel } from '../../../stories/PlaygroundPanel';
import {
  PRIMITIVE_PLAYGROUND_CONTROL_GRID,
  PrimitiveGalleryItem,
  PrimitivePage,
} from '../../../stories/PrimitivePage';

import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarGroup,
  MenubarItem,
  MenubarLabel,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from './menubar';

/**
 * Component Storybook IA (see docs/DESIGN.md "Component Story Structure"):
 * Overview first — bar + triggers Foundations; menus compose Dropdown Menu /
 * ListItem. shadcn Menubar guide (Base UI Menubar).
 */

const meta = {
  title: 'Design System/Primitives/Menubar',
  component: Menubar,
  tags: ['ai-generated'],
  parameters: { layout: 'centered' },
} satisfies Meta;

export default meta;
type Story = StoryObj;

/* ---------- Canonical examples ---------- */

function DefaultExample() {
  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarGroup>
            <MenubarItem>
              New Tab <MenubarShortcut>⌘T</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
              New Window <MenubarShortcut>⌘N</MenubarShortcut>
            </MenubarItem>
          </MenubarGroup>
          <MenubarSeparator />
          <MenubarGroup>
            <MenubarItem>Share</MenubarItem>
            <MenubarItem>Print</MenubarItem>
          </MenubarGroup>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Edit</MenubarTrigger>
        <MenubarContent>
          <MenubarGroup>
            <MenubarItem>
              Undo <MenubarShortcut>⌘Z</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
              Redo <MenubarShortcut>⇧⌘Z</MenubarShortcut>
            </MenubarItem>
          </MenubarGroup>
          <MenubarSeparator />
          <MenubarGroup>
            <MenubarItem>
              Cut <MenubarShortcut>⌘X</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
              Copy <MenubarShortcut>⌘C</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
              Paste <MenubarShortcut>⌘V</MenubarShortcut>
            </MenubarItem>
          </MenubarGroup>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>View</MenubarTrigger>
        <MenubarContent>
          <MenubarGroup>
            <MenubarItem inset>Reload</MenubarItem>
            <MenubarItem disabled inset>
              Force Reload
            </MenubarItem>
          </MenubarGroup>
          <MenubarSeparator />
          <MenubarGroup>
            <MenubarItem inset>Toggle Fullscreen</MenubarItem>
          </MenubarGroup>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Profiles</MenubarTrigger>
        <MenubarContent>
          <MenubarRadioGroup defaultValue="benoit">
            <MenubarLabel inset>People</MenubarLabel>
            <MenubarRadioItem value="andy">Andy</MenubarRadioItem>
            <MenubarRadioItem value="benoit">Benoit</MenubarRadioItem>
            <MenubarRadioItem value="luis">Luis</MenubarRadioItem>
          </MenubarRadioGroup>
          <MenubarSeparator />
          <MenubarGroup>
            <MenubarItem inset>Edit…</MenubarItem>
            <MenubarItem inset>Add Profile…</MenubarItem>
          </MenubarGroup>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}

function CheckboxExample() {
  const [bookmarks, setBookmarks] = useState(true);
  const [urls, setUrls] = useState(false);

  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>View</MenubarTrigger>
        <MenubarContent>
          <MenubarGroup>
            <MenubarLabel>Appearance</MenubarLabel>
            <MenubarCheckboxItem
              checked={bookmarks}
              onCheckedChange={setBookmarks}
            >
              Show Bookmarks Bar
            </MenubarCheckboxItem>
            <MenubarCheckboxItem checked={urls} onCheckedChange={setUrls}>
              Show Full URLs
            </MenubarCheckboxItem>
          </MenubarGroup>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}

function RadioExample() {
  const [panel, setPanel] = useState('bottom');

  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>View</MenubarTrigger>
        <MenubarContent>
          <MenubarRadioGroup value={panel} onValueChange={setPanel}>
            <MenubarLabel>Panel Position</MenubarLabel>
            <MenubarRadioItem value="top">Top</MenubarRadioItem>
            <MenubarRadioItem value="bottom">Bottom</MenubarRadioItem>
            <MenubarRadioItem value="right">Right</MenubarRadioItem>
          </MenubarRadioGroup>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}

function SubmenuExample() {
  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarGroup>
            <MenubarSub>
              <MenubarSubTrigger>Share</MenubarSubTrigger>
              <MenubarSubContent>
                <MenubarGroup>
                  <MenubarItem>Email link</MenubarItem>
                  <MenubarItem>Messages</MenubarItem>
                  <MenubarItem>Notes</MenubarItem>
                </MenubarGroup>
              </MenubarSubContent>
            </MenubarSub>
            <MenubarItem>
              Print… <MenubarShortcut>⌘P</MenubarShortcut>
            </MenubarItem>
          </MenubarGroup>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}

function IconsExample() {
  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarGroup>
            <MenubarItem>
              <FilePlusIcon />
              New File
              <MenubarShortcut>⌘N</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
              <FolderOpenIcon />
              Open…
              <MenubarShortcut>⌘O</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
              <SaveIcon />
              Save
              <MenubarShortcut>⌘S</MenubarShortcut>
            </MenubarItem>
          </MenubarGroup>
          <MenubarSeparator />
          <MenubarGroup>
            <MenubarItem>
              <ShareIcon />
              Share
            </MenubarItem>
            <MenubarItem>
              <PrinterIcon />
              Print
              <MenubarShortcut>⌘P</MenubarShortcut>
            </MenubarItem>
          </MenubarGroup>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Edit</MenubarTrigger>
        <MenubarContent>
          <MenubarGroup>
            <MenubarItem>
              <CopyIcon />
              Copy
              <MenubarShortcut>⌘C</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
              <CheckIcon />
              Select All
              <MenubarShortcut>⌘A</MenubarShortcut>
            </MenubarItem>
          </MenubarGroup>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}

/** shadcn docs' "RTL" — wrap in `dir="rtl"` with Arabic copy. */
function RtlExample() {
  return (
    <div dir="rtl">
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>ملف</MenubarTrigger>
          <MenubarContent>
            <MenubarGroup>
              <MenubarItem>
                <FileIcon />
                تبويب جديد
                <MenubarShortcut>⌘T</MenubarShortcut>
              </MenubarItem>
              <MenubarItem>
                <FolderIcon />
                نافذة جديدة
                <MenubarShortcut>⌘N</MenubarShortcut>
              </MenubarItem>
            </MenubarGroup>
            <MenubarSeparator />
            <MenubarGroup>
              <MenubarItem>طباعة</MenubarItem>
            </MenubarGroup>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>تحرير</MenubarTrigger>
          <MenubarContent>
            <MenubarGroup>
              <MenubarItem>
                تراجع
                <MenubarShortcut>⌘Z</MenubarShortcut>
              </MenubarItem>
              <MenubarItem>
                إعادة
                <MenubarShortcut>⇧⌘Z</MenubarShortcut>
              </MenubarItem>
            </MenubarGroup>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    </div>
  );
}

/* ---------- Playground ---------- */

function MenubarPlayground() {
  const [withIcons, setWithIcons] = useState(true);
  const [withShortcut, setWithShortcut] = useState(true);

  return (
    <PlaygroundPanel
      preview={
        <Menubar>
          <MenubarMenu>
            <MenubarTrigger>File</MenubarTrigger>
            <MenubarContent>
              <MenubarGroup>
                <MenubarItem>
                  {withIcons ? <FilePlusIcon /> : null}
                  New File
                  {withShortcut ? (
                    <MenubarShortcut>⌘N</MenubarShortcut>
                  ) : null}
                </MenubarItem>
                <MenubarItem>
                  {withIcons ? <FolderOpenIcon /> : null}
                  Open…
                  {withShortcut ? (
                    <MenubarShortcut>⌘O</MenubarShortcut>
                  ) : null}
                </MenubarItem>
              </MenubarGroup>
              <MenubarSeparator />
              <MenubarGroup>
                <MenubarItem>
                  {withIcons ? <PrinterIcon /> : null}
                  Print
                  {withShortcut ? (
                    <MenubarShortcut>⌘P</MenubarShortcut>
                  ) : null}
                </MenubarItem>
              </MenubarGroup>
            </MenubarContent>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger>Edit</MenubarTrigger>
            <MenubarContent>
              <MenubarGroup>
                <MenubarItem>
                  Undo
                  {withShortcut ? (
                    <MenubarShortcut>⌘Z</MenubarShortcut>
                  ) : null}
                </MenubarItem>
                <MenubarItem>
                  Redo
                  {withShortcut ? (
                    <MenubarShortcut>⇧⌘Z</MenubarShortcut>
                  ) : null}
                </MenubarItem>
              </MenubarGroup>
            </MenubarContent>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger>View</MenubarTrigger>
            <MenubarContent>
              <MenubarGroup>
                <MenubarItem>Reload</MenubarItem>
                <MenubarItem>Toggle Fullscreen</MenubarItem>
              </MenubarGroup>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
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
      title="Menubar"
      description={
        <>
          Persistent desktop-style menu bar. Bar + triggers use Foundations;
          menus compose <code>DropdownMenu</code> / <code>ListItem</code> rows
          (same checkbox/radio leading indicators as Dropdown Menu).
        </>
      }
      playground={<MenubarPlayground />}
      variants={
        <div className="flex flex-wrap gap-6">
          <PrimitiveGalleryItem label="Default">
            <DefaultExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Checkbox">
            <CheckboxExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Radio">
            <RadioExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Submenu">
            <SubmenuExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="With Icons">
            <IconsExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="RTL">
            <RtlExample />
          </PrimitiveGalleryItem>
        </div>
      }
      usageGuidance={
        <ul className="list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
          <li>
            Prefer for app chrome with a fixed set of top-level menus — not for
            one-off overflow menus (use Dropdown Menu).
          </li>
          <li>
            Wrap labels and items in <code>MenubarGroup</code> (Base UI group
            context — same rule as Dropdown / Context Menu).
          </li>
          <li>
            Row chrome comes from Dropdown Menu / ListItem — do not restyle
            items inline.
          </li>
          <li>
            <code>MenubarShortcut</code> lands in ListItemTrailing; leading
            Lucide icons land in ListItemMedia.
          </li>
        </ul>
      }
      accessibility={
        <ul className="list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
          <li>
            Base UI Menubar provides arrow-key focus across triggers and opens
            menus on focus when navigating the bar.
          </li>
          <li>
            Open menus inherit Dropdown Menu keyboard navigation and
            ListItem <code>data-highlighted</code> styling.
          </li>
          <li>
            Checkbox / radio rows expose <code>aria-checked</code>; indicators
            sit in ListItemMedia (leading).
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

export const Checkbox: Story = {
  render: () => <CheckboxExample />,
};

export const Radio: Story = {
  render: () => <RadioExample />,
};

export const Submenu: Story = {
  render: () => <SubmenuExample />,
};

export const WithIcons: Story = {
  render: () => <IconsExample />,
};

export const Rtl: Story = {
  render: () => <RtlExample />,
};
