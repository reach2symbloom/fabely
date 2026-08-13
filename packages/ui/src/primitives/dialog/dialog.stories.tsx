import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import { Button } from '../button';
import { Field, FieldGroup, FieldLabel } from '../field';
import { Input } from '../input';
import { InlineSegmentedControl } from '../../../stories/InlineSegmentedControl';
import { PlaygroundPanel } from '../../../stories/PlaygroundPanel';
import {
  PRIMITIVE_PLAYGROUND_CONTROL_GRID,
  PrimitiveGalleryItem,
  PrimitivePage,
} from '../../../stories/PrimitivePage';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './dialog';

/**
 * Component Storybook IA (see docs/DESIGN.md "Component Story Structure"):
 * Overview first — Playground, Variants gallery, usage, a11y — then focused
 * example pages. Figma Dialog + shadcn Base Dialog guide.
 */

const meta = {
  title: 'Design System/Primitives/Dialog',
  component: Dialog,
  tags: ['ai-generated'],
  parameters: { layout: 'centered' },
} satisfies Meta;

export default meta;
type Story = StoryObj;

function EditProfileDialog({
  showCloseButton = true,
  triggerLabel = 'Open Dialog',
}: {
  showCloseButton?: boolean;
  triggerLabel?: string;
}) {
  return (
    <Dialog>
      <form>
        <DialogTrigger render={<Button variant="outline" />}>
          {triggerLabel}
        </DialogTrigger>
        <DialogContent
          className="sm:max-w-sm"
          showCloseButton={showCloseButton}
        >
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="dialog-name">Name</FieldLabel>
              <Input id="dialog-name" name="name" defaultValue="Pedro Duarte" />
            </Field>
            <Field>
              <FieldLabel htmlFor="dialog-username">Username</FieldLabel>
              <Input
                id="dialog-username"
                name="username"
                defaultValue="@peduarte"
              />
            </Field>
          </FieldGroup>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>
              Cancel
            </DialogClose>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}

function CustomCloseExample() {
  return (
    <Dialog>
      <DialogTrigger render={<Button variant="outline" />}>Share</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share link</DialogTitle>
          <DialogDescription>
            Anyone who has this link will be able to view this.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-[var(--spacing-xs)]">
          <Field className="flex-1">
            <FieldLabel htmlFor="dialog-link" className="sr-only">
              Link
            </FieldLabel>
            <Input
              id="dialog-link"
              defaultValue="https://ui.shadcn.com/docs/installation"
              readOnly
            />
          </Field>
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose render={<Button type="button" />}>Close</DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function StickyFooterExample() {
  return (
    <Dialog>
      <DialogTrigger render={<Button variant="outline" />}>
        Sticky Footer
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Sticky Footer</DialogTitle>
          <DialogDescription>
            This dialog has a sticky footer that stays visible while the content
            scrolls.
          </DialogDescription>
        </DialogHeader>
        <div className="no-scrollbar -mx-[var(--spacing-md)] max-h-[50vh] overflow-y-auto px-[var(--spacing-md)]">
          {Array.from({ length: 10 }).map((_, index) => (
            <p
              key={index}
              className="mb-[var(--spacing-md)] text-[length:var(--text-paragraph-small-regular-font-size)] leading-[var(--text-paragraph-small-regular-line-height)]"
            >
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </p>
          ))}
        </div>
        <DialogFooter
          className={cnFooterFade()}
        >
          <DialogClose render={<Button variant="outline" />}>Close</DialogClose>
          <Button>Continue</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function cnFooterFade() {
  return [
    '-mx-[var(--spacing-md)] -mb-[var(--spacing-md)]',
    'bg-gradient-to-b from-transparent to-[color:var(--popover)]',
    'px-[var(--spacing-md)] pb-[var(--spacing-md)] pt-[var(--spacing-md)]',
  ].join(' ');
}

function ScrollableContentExample() {
  return (
    <Dialog>
      <DialogTrigger render={<Button variant="outline" />}>
        Scrollable Content
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Scrollable Content</DialogTitle>
          <DialogDescription>
            This is a dialog with scrollable content.
          </DialogDescription>
        </DialogHeader>
        <div className="no-scrollbar -mx-[var(--spacing-md)] max-h-[50vh] overflow-y-auto px-[var(--spacing-md)]">
          {Array.from({ length: 10 }).map((_, index) => (
            <p
              key={index}
              className="mb-[var(--spacing-md)] text-[length:var(--text-paragraph-small-regular-font-size)] leading-[var(--text-paragraph-small-regular-line-height)]"
            >
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </p>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ---------- Playground ---------- */

function DialogPlayground() {
  const [showClose, setShowClose] = useState(true);

  return (
    <PlaygroundPanel
      preview={<EditProfileDialog showCloseButton={showClose} />}
      controls={
        <div className={PRIMITIVE_PLAYGROUND_CONTROL_GRID}>
          <InlineSegmentedControl
            label="Close button"
            value={showClose ? 'on' : 'off'}
            onChange={(v) => setShowClose(v === 'on')}
            options={[
              { value: 'on', label: 'On' },
              { value: 'off', label: 'Off' },
            ]}
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
      title="Dialog"
      description="Modal overlay for focused tasks — Foundations chrome from Figma Dialog, Header, and Footer; Base UI Dialog behavior."
      playground={<DialogPlayground />}
      variants={
        <div className="flex flex-wrap gap-[var(--spacing-md)]">
          <PrimitiveGalleryItem label="Demo">
            <EditProfileDialog />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="No close">
            <EditProfileDialog
              showCloseButton={false}
              triggerLabel="No Close Button"
            />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Custom close">
            <CustomCloseExample />
          </PrimitiveGalleryItem>
        </div>
      }
      usageGuidance={
        <ul className="list-disc space-y-2 ps-5 text-sm text-muted-foreground">
          <li>
            Compose <code>DialogHeader</code> / <code>DialogFooter</code> around
            body content; keep Title + Description for accessibility.
          </li>
          <li>
            Triggers use <code>render=&#123;&lt;Button /&gt;&#125;</code> (Base UI),
            not Radix <code>asChild</code>.
          </li>
          <li>
            Pass <code>showCloseButton=&#123;false&#125;</code> when dismissal is
            only via footer actions or Esc.
          </li>
        </ul>
      }
      accessibility={
        <ul className="list-disc space-y-2 ps-5 text-sm text-muted-foreground">
          <li>
            Always provide <code>DialogTitle</code>; use{' '}
            <code>DialogDescription</code> for supporting context.
          </li>
          <li>
            The corner close control is an Icon Button with{' '}
            <code>aria-label=&quot;Close&quot;</code>.
          </li>
          <li>
            Focus traps inside the dialog while open; Esc dismisses when
            allowed by Base UI.
          </li>
        </ul>
      }
    />
  ),
};

export const Demo: Story = {
  render: () => <EditProfileDialog />,
};

export const CustomCloseButton: Story = {
  name: 'Custom Close Button',
  render: () => <CustomCloseExample />,
};

export const NoCloseButton: Story = {
  name: 'No Close Button',
  render: () => (
    <EditProfileDialog
      showCloseButton={false}
      triggerLabel="No Close Button"
    />
  ),
};

export const StickyFooter: Story = {
  name: 'Sticky Footer',
  render: () => <StickyFooterExample />,
};

export const ScrollableContent: Story = {
  name: 'Scrollable Content',
  render: () => <ScrollableContentExample />,
};

export const RTL: Story = {
  render: () => (
    <div dir="rtl">
      <Dialog>
        <form>
          <DialogTrigger render={<Button variant="outline" />}>
            فتح الحوار
          </DialogTrigger>
          <DialogContent className="sm:max-w-sm" dir="rtl">
            <DialogHeader>
              <DialogTitle>تعديل الملف الشخصي</DialogTitle>
              <DialogDescription>
                قم بإجراء تغييرات على ملفك الشخصي هنا. انقر فوق حفظ عند الانتهاء.
              </DialogDescription>
            </DialogHeader>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="dialog-rtl-name">الاسم</FieldLabel>
                <Input
                  id="dialog-rtl-name"
                  name="name"
                  defaultValue="Pedro Duarte"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="dialog-rtl-username">اسم المستخدم</FieldLabel>
                <Input
                  id="dialog-rtl-username"
                  name="username"
                  defaultValue="@peduarte"
                />
              </Field>
            </FieldGroup>
            <DialogFooter>
              <DialogClose render={<Button variant="outline" />}>
                إلغاء
              </DialogClose>
              <Button type="submit">حفظ التغييرات</Button>
            </DialogFooter>
          </DialogContent>
        </form>
      </Dialog>
    </div>
  ),
};
