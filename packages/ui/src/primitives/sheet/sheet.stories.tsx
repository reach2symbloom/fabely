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
 * Overview first — Playground, Variants gallery, usage, a11y — then focused
 * example pages matching shadcn Sheet (Side / No Close / RTL).
 *
 * Docs: https://ui.shadcn.com/docs/components/base/sheet
 * Figma: Sheet (Orientation Left | Right; Scrollable variants)
 */

type SheetSide = 'top' | 'right' | 'bottom' | 'left';

const meta = {
  title: 'Design System/Primitives/Sheet',
  component: Sheet,
  tags: ['ai-generated'],
  parameters: { layout: 'centered' },
} satisfies Meta;

export default meta;
type Story = StoryObj;

function EditProfileSheet({
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
        <div className="grid flex-1 auto-rows-min gap-[var(--spacing-md)] px-[var(--spacing-md)]">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="sheet-name">Name</FieldLabel>
              <Input id="sheet-name" defaultValue="Pedro Duarte" />
            </Field>
            <Field>
              <FieldLabel htmlFor="sheet-username">Username</FieldLabel>
              <Input id="sheet-username" defaultValue="@peduarte" />
            </Field>
          </FieldGroup>
        </div>
        <SheetFooter>
          <Button type="submit">Save changes</Button>
          <SheetClose render={<Button variant="outline" />}>Close</SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

function SheetPlayground() {
  const [side, setSide] = useState<SheetSide>('right');
  const [showClose, setShowClose] = useState(true);

  return (
    <PlaygroundPanel
      preview={
        <EditProfileSheet side={side} showCloseButton={showClose} />
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
      description="Edge panel over the page — Foundations chrome from Figma Sheet; Base UI Dialog behavior. Prefer Drawer for bottom-sheet / swipe."
      playground={<SheetPlayground />}
      variants={
        <div className="flex flex-wrap gap-[var(--spacing-md)]">
          <PrimitiveGalleryItem label="Demo">
            <EditProfileSheet />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Left">
            <EditProfileSheet side="left" triggerLabel="Left" />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="No close">
            <EditProfileSheet
              showCloseButton={false}
              triggerLabel="No Close Button"
            />
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

/** shadcn sheet-demo */
export const Demo: Story = {
  render: () => <EditProfileSheet />,
};

/** shadcn Side — top / right / bottom / left */
export const Side: Story = {
  render: () => (
    <div className="flex flex-wrap gap-[var(--spacing-sm)]">
      {(['top', 'right', 'bottom', 'left'] as const).map((side) => (
        <Sheet key={side}>
          <SheetTrigger render={<Button variant="outline" />}>
            {side}
          </SheetTrigger>
          <SheetContent side={side}>
            <SheetHeader>
              <SheetTitle>Edit profile</SheetTitle>
              <SheetDescription>
                Make changes to your profile here. Click save when you&apos;re
                done.
              </SheetDescription>
            </SheetHeader>
            <div className="grid flex-1 auto-rows-min gap-[var(--spacing-md)] px-[var(--spacing-md)]">
              <div className="grid gap-[var(--spacing-xs)]">
                <Label htmlFor={`sheet-side-name-${side}`}>Name</Label>
                <Input id={`sheet-side-name-${side}`} defaultValue="Pedro Duarte" />
              </div>
              <div className="grid gap-[var(--spacing-xs)]">
                <Label htmlFor={`sheet-side-username-${side}`}>Username</Label>
                <Input
                  id={`sheet-side-username-${side}`}
                  defaultValue="@peduarte"
                />
              </div>
            </div>
            <SheetFooter>
              <Button type="submit">Save changes</Button>
              <SheetClose render={<Button variant="outline" />}>
                Close
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      ))}
    </div>
  ),
};

export const NoCloseButton: Story = {
  name: 'No Close Button',
  render: () => (
    <EditProfileSheet
      showCloseButton={false}
      triggerLabel="Open Sheet"
    />
  ),
};

export const RTL: Story = {
  render: () => (
    <div dir="rtl">
      <Sheet>
        <SheetTrigger render={<Button variant="outline" />}>فتح</SheetTrigger>
        <SheetContent side="right" dir="rtl">
          <SheetHeader>
            <SheetTitle>تعديل الملف الشخصي</SheetTitle>
            <SheetDescription>
              قم بإجراء تغييرات على ملفك الشخصي هنا. انقر فوق حفظ عند الانتهاء.
            </SheetDescription>
          </SheetHeader>
          <div className="grid flex-1 auto-rows-min gap-[var(--spacing-md)] px-[var(--spacing-md)]">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="sheet-rtl-name">الاسم</FieldLabel>
                <Input id="sheet-rtl-name" defaultValue="Pedro Duarte" />
              </Field>
              <Field>
                <FieldLabel htmlFor="sheet-rtl-username">اسم المستخدم</FieldLabel>
                <Input id="sheet-rtl-username" defaultValue="@peduarte" />
              </Field>
            </FieldGroup>
          </div>
          <SheetFooter>
            <Button type="submit">حفظ التغييرات</Button>
            <SheetClose render={<Button variant="outline" />}>إغلاق</SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  ),
};
