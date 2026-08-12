import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import { Button } from '../button';
import { Field, FieldGroup, FieldLabel } from '../field';
import { Input } from '../input';
import { Label } from '../label';
import { InlineSegmentedControl } from '../../../stories/InlineSegmentedControl';
import { PlaygroundPanel } from '../../../stories/PlaygroundPanel';
import {
  PRIMITIVE_PLAYGROUND_CONTROL_GRID,
  PrimitiveGalleryItem,
  PrimitivePage,
} from '../../../stories/PrimitivePage';

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './sheet';

/**
 * Component Storybook IA (see docs/DESIGN.md "Component Story Structure"):
 * Overview first — Playground + shadcn Sheet docs demos (Demo / Side /
 * No Close Button / RTL).
 *
 * Docs: https://ui.shadcn.com/docs/components/base/sheet
 * Figma: Sheet (Orientation Left | Right; Scrollable variants)
 */

type SheetSide = 'top' | 'right' | 'bottom' | 'left';

const SHEET_SIDES = ['top', 'right', 'bottom', 'left'] as const;

const meta = {
  title: 'Design System/Primitives/Sheet',
  component: Sheet,
  tags: ['ai-generated'],
  parameters: { layout: 'centered' },
} satisfies Meta;

export default meta;
type Story = StoryObj;

/** shadcn sheet-demo — Edit profile with Name / Username + footer. */
function DemoExample({
  side = 'right',
  showCloseButton = true,
  triggerLabel = 'Open',
}: {
  side?: SheetSide;
  showCloseButton?: boolean;
  triggerLabel?: string;
}) {
  return (
    <Sheet>
      <SheetTrigger render={<Button variant="outline" />}>
        {triggerLabel}
      </SheetTrigger>
      <SheetContent side={side} showCloseButton={showCloseButton}>
        <SheetHeader>
          <SheetTitle>Edit profile</SheetTitle>
          <SheetDescription>
            Make changes to your profile here. Click save when you&apos;re done.
          </SheetDescription>
        </SheetHeader>
        <div className="grid flex-1 auto-rows-min gap-[var(--spacing-xl)] px-[var(--spacing-md)]">
          <div className="grid gap-[var(--spacing-sm)]">
            <Label htmlFor="sheet-demo-name">Name</Label>
            <Input id="sheet-demo-name" defaultValue="Pedro Duarte" />
          </div>
          <div className="grid gap-[var(--spacing-sm)]">
            <Label htmlFor="sheet-demo-username">Username</Label>
            <Input id="sheet-demo-username" defaultValue="@peduarte" />
          </div>
        </div>
        <SheetFooter>
          <Button type="submit">Save changes</Button>
          <SheetClose render={<Button variant="outline" />}>Close</SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

/** shadcn sheet-side — scrollable body; top/bottom capped at 50vh. */
function SideExample() {
  return (
    <div className="flex flex-wrap gap-[var(--spacing-xs)]">
      {SHEET_SIDES.map((side) => (
        <Sheet key={side}>
          <SheetTrigger
            render={<Button variant="outline" className="capitalize" />}
          >
            {side}
          </SheetTrigger>
          <SheetContent
            side={side}
            className="data-[side=bottom]:max-h-[50vh] data-[side=top]:max-h-[50vh]"
          >
            <SheetHeader>
              <SheetTitle>Edit profile</SheetTitle>
              <SheetDescription>
                Make changes to your profile here. Click save when you&apos;re
                done.
              </SheetDescription>
            </SheetHeader>
            <div className="no-scrollbar overflow-y-auto px-[var(--spacing-md)]">
              {Array.from({ length: 10 }).map((_, index) => (
                <p
                  key={index}
                  className="mb-[var(--spacing-xs)] text-[length:var(--text-paragraph-small-regular-font-size)] leading-[var(--text-paragraph-small-regular-line-height)] text-[color:var(--muted-foreground)]"
                >
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat. Duis aute
                  irure dolor in reprehenderit in voluptate velit esse cillum
                  dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                  cupidatat non proident, sunt in culpa qui officia deserunt
                  mollit anim id est laborum.
                </p>
              ))}
            </div>
            <SheetFooter>
              <Button type="submit">Save changes</Button>
              <SheetClose render={<Button variant="outline" />}>
                Cancel
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      ))}
    </div>
  );
}

/** shadcn sheet-no-close-button */
function NoCloseButtonExample() {
  return (
    <Sheet>
      <SheetTrigger render={<Button variant="outline" />}>
        Open Sheet
      </SheetTrigger>
      <SheetContent showCloseButton={false}>
        <SheetHeader>
          <SheetTitle>No Close Button</SheetTitle>
          <SheetDescription>
            This sheet doesn&apos;t have a close button in the top-right corner.
            Click outside to close.
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}

/** shadcn sheet-rtl (Arabic) — side flips to left in RTL. */
function RtlExample() {
  return (
    <div dir="rtl">
      <Sheet>
        <SheetTrigger render={<Button variant="outline" />}>فتح</SheetTrigger>
        <SheetContent dir="rtl" side="left">
          <SheetHeader>
            <SheetTitle>تعديل الملف الشخصي</SheetTitle>
            <SheetDescription>
              قم بإجراء تغييرات على ملفك الشخصي هنا. انقر حفظ عند الانتهاء.
            </SheetDescription>
          </SheetHeader>
          <FieldGroup className="px-[var(--spacing-md)]">
            <Field>
              <FieldLabel htmlFor="sheet-rtl-name">الاسم</FieldLabel>
              <Input id="sheet-rtl-name" defaultValue="Pedro Duarte" />
            </Field>
            <Field>
              <FieldLabel htmlFor="sheet-rtl-username">اسم المستخدم</FieldLabel>
              <Input id="sheet-rtl-username" defaultValue="peduarte" />
            </Field>
          </FieldGroup>
          <SheetFooter>
            <Button type="submit">حفظ التغييرات</Button>
            <SheetClose render={<Button variant="outline" />}>إغلاق</SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}

function SheetPlayground() {
  const [side, setSide] = useState<SheetSide>('right');
  const [showClose, setShowClose] = useState(true);

  return (
    <PlaygroundPanel
      preview={
        <DemoExample side={side} showCloseButton={showClose} />
      }
      controls={
        <div className={PRIMITIVE_PLAYGROUND_CONTROL_GRID}>
          <InlineSegmentedControl
            label="Side"
            value={side}
            options={[
              { value: 'top', label: 'Top' },
              { value: 'right', label: 'Right' },
              { value: 'bottom', label: 'Bottom' },
              { value: 'left', label: 'Left' },
            ]}
            onChange={(v) => setSide(v as SheetSide)}
            fullWidth
          />
          <InlineSegmentedControl
            label="Close button"
            value={showClose ? 'on' : 'off'}
            onChange={(v) => setShowClose(v === 'on')}
            options={[
              { value: 'on', label: 'On' },
              { value: 'off', label: 'Off' },
            ]}
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
      title="Sheet"
      description="Extends Dialog to show content that complements the main screen — Foundations chrome from Figma Sheet; Base UI Dialog behavior. Prefer Drawer for bottom-sheet / swipe."
      playground={<SheetPlayground />}
      variants={
        <div className="flex flex-wrap gap-[var(--spacing-md)]">
          <PrimitiveGalleryItem label="Demo">
            <DemoExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Side">
            <SideExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="No Close Button">
            <NoCloseButtonExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="RTL">
            <RtlExample />
          </PrimitiveGalleryItem>
        </div>
      }
      usageGuidance={
        <ul className="list-disc space-y-2 ps-5 text-sm text-muted-foreground">
          <li>
            Compose <code>SheetHeader</code> / <code>SheetFooter</code> around
            body content; keep Title + Description for accessibility.
          </li>
          <li>
            Set <code>side</code> on <code>SheetContent</code> (
            <code>top</code> / <code>right</code> / <code>bottom</code> /{' '}
            <code>left</code>). Figma focuses Left / Right; all four match
            shadcn.
          </li>
          <li>
            Pass <code>showCloseButton=&#123;false&#125;</code> when dismissal is
            only via overlay click or Esc.
          </li>
          <li>
            Use Drawer when you need a bottom sheet with swipe / snap, not
            Sheet.
          </li>
        </ul>
      }
      accessibility={
        <ul className="list-disc space-y-2 ps-5 text-sm text-muted-foreground">
          <li>
            Always provide <code>SheetTitle</code>; use{' '}
            <code>SheetDescription</code> for supporting context.
          </li>
          <li>
            The corner close control is an Icon Button with{' '}
            <code>aria-label=&quot;Close&quot;</code>.
          </li>
          <li>
            Focus traps inside the sheet while open; Esc dismisses when allowed
            by Base UI.
          </li>
        </ul>
      }
    />
  ),
};

/** https://ui.shadcn.com/docs/components/base/sheet — sheet-demo */
export const Demo: Story = {
  render: () => <DemoExample />,
};

/** https://ui.shadcn.com/docs/components/base/sheet — sheet-side */
export const Side: Story = {
  render: () => <SideExample />,
};

/** https://ui.shadcn.com/docs/components/base/sheet — sheet-no-close-button */
export const NoCloseButton: Story = {
  name: 'No Close Button',
  render: () => <NoCloseButtonExample />,
};

/** https://ui.shadcn.com/docs/components/base/sheet — sheet-rtl */
export const RTL: Story = {
  render: () => <RtlExample />,
};
