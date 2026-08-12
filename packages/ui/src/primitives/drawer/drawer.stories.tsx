import type { Meta, StoryObj } from '@storybook/react-vite';
import { MinusIcon, PlusIcon } from 'lucide-react';
import { useState } from 'react';

import { useIsMobile } from '../../hooks/use-mobile';
import { Button, IconButton } from '../button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../dialog';
import { Field, FieldGroup, FieldLabel } from '../field';
import { Input } from '../input';
import { Label } from '../label';
import { RadioGroup, RadioGroupItem } from '../radio-group';
import { InlineSegmentedControl } from '../../../stories/InlineSegmentedControl';
import { PlaygroundPanel } from '../../../stories/PlaygroundPanel';
import {
  PRIMITIVE_PLAYGROUND_CONTROL_GRID,
  PrimitiveGalleryItem,
  PrimitivePage,
} from '../../../stories/PrimitivePage';

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from './drawer';

/**
 * Component Storybook IA (see docs/DESIGN.md "Component Story Structure"):
 * Overview first — Playground, Variants gallery, usage, a11y — then focused
 * example pages. Figma Drawer (Slots) + shadcn Base Drawer guide.
 */

type SwipeDirection = 'up' | 'down' | 'left' | 'right';

const meta = {
  title: 'Design System/Primitives/Drawer',
  component: Drawer,
  tags: ['ai-generated'],
  parameters: { layout: 'centered' },
} satisfies Meta;

export default meta;
type Story = StoryObj;

type MoveGoalDemoProps = {
  showSwipeHandle?: boolean;
  swipeDirection?: SwipeDirection;
  modal?: boolean;
  snapPoints?: boolean;
  nested?: boolean;
};

function MoveGoalDemo({
  showSwipeHandle = true,
  swipeDirection = 'down',
  modal = true,
  snapPoints = false,
  nested = false,
}: MoveGoalDemoProps) {
  const [goal, setGoal] = useState(350);
  const [snapPoint, setSnapPoint] = useState<number | string | null>(0.5);
  const vertical =
    swipeDirection === 'down' || swipeDirection === 'up';
  const snapEnabled = snapPoints && vertical;

  function onClick(adjustment: number) {
    setGoal(Math.max(200, Math.min(400, goal + adjustment)));
  }

  return (
    <Drawer
      showSwipeHandle={showSwipeHandle}
      swipeDirection={swipeDirection}
      modal={modal}
      disablePointerDismissal={!modal}
      snapPoints={snapEnabled ? [0.25, 0.5, 1] : undefined}
      snapPoint={snapEnabled ? snapPoint : undefined}
      onSnapPointChange={snapEnabled ? setSnapPoint : undefined}
    >
      <DrawerTrigger render={<Button variant="outline" />}>
        Open Drawer
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Move Goal</DrawerTitle>
          <DrawerDescription>
            Set your daily activity goal.
            {snapEnabled
              ? ` Snap: ${snapPoint == null ? 'null' : String(snapPoint)}.`
              : null}
            {!modal ? ' Non-modal.' : null}
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-1 flex-col items-center justify-center gap-[var(--spacing-md)] overflow-y-auto p-[var(--spacing-md)]">
          <div className="flex items-center gap-[var(--spacing-md)]">
            <IconButton
              variant="outline"
              aria-label="Decrease"
              onClick={() => onClick(-10)}
              disabled={goal <= 200}
            >
              <MinusIcon />
            </IconButton>
            <div className="flex flex-col items-center text-center">
              <span
                className="font-[family-name:var(--text-heading-2-font-family)] text-[length:var(--text-heading-2-font-size)] leading-[var(--text-heading-2-line-height)] tracking-[var(--text-heading-2-letter-spacing)] [font-weight:var(--text-heading-2-font-weight)] tabular-nums"
              >
                {goal}
              </span>
              <span className="text-[length:var(--text-paragraph-small-regular-font-size)] leading-[var(--text-paragraph-small-regular-line-height)] text-[color:var(--muted-foreground)]">
                Calories/day
              </span>
            </div>
            <IconButton
              variant="outline"
              aria-label="Increase"
              onClick={() => onClick(10)}
              disabled={goal >= 400}
            >
              <PlusIcon />
            </IconButton>
          </div>
          {nested ? (
            <Drawer showSwipeHandle swipeDirection={swipeDirection} modal={modal}>
              <DrawerTrigger render={<Button variant="outline" />}>
                Open Nested
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>Nested Drawer</DrawerTitle>
                  <DrawerDescription>
                    Parent stays mounted and stacks behind.
                  </DrawerDescription>
                </DrawerHeader>
                <div className="p-[var(--spacing-md)] text-[length:var(--text-paragraph-small-regular-font-size)] text-[color:var(--muted-foreground)]">
                  Nested content.
                </div>
                <DrawerFooter>
                  <DrawerClose render={<Button variant="outline" />}>
                    Close
                  </DrawerClose>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          ) : null}
        </div>
        <DrawerFooter>
          <Button>Submit</Button>
          <DrawerClose render={<Button variant="outline" />}>Cancel</DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

function SideDrawer({
  direction,
  label,
}: {
  direction: SwipeDirection;
  label: string;
}) {
  return (
    <Drawer swipeDirection={direction} showSwipeHandle>
      <DrawerTrigger render={<Button variant="outline" />}>{label}</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{label}</DrawerTitle>
          <DrawerDescription>
            Drawer with <code>swipeDirection=&quot;{direction}&quot;</code>.
          </DrawerDescription>
        </DrawerHeader>
        <div className="p-[var(--spacing-md)] text-[length:var(--text-paragraph-small-regular-font-size)] text-[color:var(--muted-foreground)]">
          Content here.
        </div>
        <DrawerFooter>
          <DrawerClose render={<Button variant="outline" />}>Close</DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

function NestedDrawerExample({
  swipeDirection = 'down',
}: {
  swipeDirection?: SwipeDirection;
}) {
  return (
    <Drawer showSwipeHandle swipeDirection={swipeDirection}>
      <DrawerTrigger render={<Button variant="outline" />}>
        Open Drawer
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Parent Drawer</DrawerTitle>
          <DrawerDescription>
            Open a nested drawer from inside this one (
            <code>swipeDirection=&quot;{swipeDirection}&quot;</code>).
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-1 flex-col gap-[var(--spacing-md)] p-[var(--spacing-md)]">
          <Drawer showSwipeHandle swipeDirection={swipeDirection}>
            <DrawerTrigger render={<Button />}>Open Nested</DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Nested Drawer</DrawerTitle>
                <DrawerDescription>
                  Parent stays mounted and stacks behind.
                </DrawerDescription>
              </DrawerHeader>
              <div className="p-[var(--spacing-md)] text-[length:var(--text-paragraph-small-regular-font-size)] text-[color:var(--muted-foreground)]">
                Nested content.
              </div>
              <DrawerFooter>
                <DrawerClose render={<Button variant="outline" />}>
                  Close
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </div>
        <DrawerFooter>
          <DrawerClose render={<Button variant="outline" />}>Close</DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

function NestedDrawerConfigurable() {
  const [direction, setDirection] = useState<SwipeDirection>('down');

  return (
    <div className="flex flex-col items-start gap-[var(--spacing-md)]">
      <NestedDrawerExample swipeDirection={direction} />
      <InlineSegmentedControl
        label="Direction"
        value={direction}
        onChange={(v) => setDirection(v as SwipeDirection)}
        options={[
          { value: 'down', label: 'Down' },
          { value: 'up', label: 'Up' },
          { value: 'left', label: 'Left' },
          { value: 'right', label: 'Right' },
        ]}
      />
    </div>
  );
}

function NonModalExample() {
  return (
    <Drawer
      modal={false}
      disablePointerDismissal
      showSwipeHandle
      swipeDirection="right"
    >
      <DrawerTrigger render={<Button variant="outline" />}>
        Non Modal
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Non-modal Drawer</DrawerTitle>
          <DrawerDescription>
            Page stays interactive. Outside press does not dismiss.
          </DrawerDescription>
        </DrawerHeader>
        <div className="p-[var(--spacing-md)] text-[length:var(--text-paragraph-small-regular-font-size)] text-[color:var(--muted-foreground)]">
          Try interacting with content behind the drawer.
        </div>
        <DrawerFooter>
          <DrawerClose render={<Button variant="outline" />}>Close</DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

function SnapPointsExample() {
  const [snapPoint, setSnapPoint] = useState<number | string | null>(0.5);

  return (
    <Drawer
      showSwipeHandle
      snapPoints={[0.25, 0.5, 1]}
      snapPoint={snapPoint}
      onSnapPointChange={setSnapPoint}
    >
      <DrawerTrigger render={<Button variant="outline" />}>
        Open Snap Drawer
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Snap Points</DrawerTitle>
          <DrawerDescription>
            Active snap:{' '}
            {snapPoint == null ? 'null' : String(snapPoint)}
            {snapPoint === 1 ? ' (expanded)' : ''}
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex-1 overflow-y-auto p-[var(--spacing-md)]">
          <p className="text-[length:var(--text-paragraph-small-regular-font-size)] leading-[var(--text-paragraph-small-regular-line-height)] text-[color:var(--muted-foreground)]">
            Drag the handle or content to snap between 25%, 50%, and full height.
            At the full snap point the popup gets <code>data-expanded</code>.
          </p>
        </div>
        <DrawerFooter>
          <DrawerClose render={<Button variant="outline" />}>Close</DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

function ResponsiveDialogDrawer() {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen} showSwipeHandle>
        <DrawerTrigger render={<Button variant="outline" />}>
          Edit Profile
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Edit profile</DrawerTitle>
            <DrawerDescription>
              Make changes to your profile here. Click save when you&apos;re
              done.
            </DrawerDescription>
          </DrawerHeader>
          <form
            className="flex flex-1 flex-col"
            onSubmit={(e) => {
              e.preventDefault();
              setOpen(false);
            }}
          >
            <FieldGroup className="p-[var(--spacing-md)]">
              <Field>
                <FieldLabel htmlFor="drawer-responsive-name">Name</FieldLabel>
                <Input
                  id="drawer-responsive-name"
                  defaultValue="Pedro Duarte"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="drawer-responsive-username">
                  Username
                </FieldLabel>
                <Input
                  id="drawer-responsive-username"
                  defaultValue="@peduarte"
                />
              </Field>
            </FieldGroup>
            <DrawerFooter>
              <Button type="submit">Save changes</Button>
              <DrawerClose render={<Button variant="outline" />}>
                Cancel
              </DrawerClose>
            </DrawerFooter>
          </form>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setOpen(false);
        }}
      >
        <DialogTrigger render={<Button variant="outline" />}>
          Edit Profile
        </DialogTrigger>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="dialog-responsive-name">Name</FieldLabel>
              <Input id="dialog-responsive-name" defaultValue="Pedro Duarte" />
            </Field>
            <Field>
              <FieldLabel htmlFor="dialog-responsive-username">
                Username
              </FieldLabel>
              <Input
                id="dialog-responsive-username"
                defaultValue="@peduarte"
              />
            </Field>
          </FieldGroup>
          <DialogFooter>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}

function DeliveryMethodDemo() {
  return (
    <Drawer showSwipeHandle>
      <DrawerTrigger render={<Button variant="outline" />}>
        Checkout
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Delivery method</DrawerTitle>
          <DrawerDescription>
            Choose how you want your order delivered.
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex-1 overflow-y-auto p-[var(--spacing-md)]">
          <RadioGroup defaultValue="express" className="grid gap-[var(--spacing-xs)]">
            <div className="flex items-center gap-[var(--spacing-xs)]">
              <RadioGroupItem value="standard" id="drawer-delivery-standard" />
              <Label htmlFor="drawer-delivery-standard">Standard</Label>
            </div>
            <div className="flex items-center gap-[var(--spacing-xs)]">
              <RadioGroupItem value="express" id="drawer-delivery-express" />
              <Label htmlFor="drawer-delivery-express">Express</Label>
            </div>
          </RadioGroup>
        </div>
        <DrawerFooter>
          <Button>Continue</Button>
          <DrawerClose render={<Button variant="outline" />}>Cancel</DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

function DrawerPlayground() {
  const [direction, setDirection] = useState<SwipeDirection>('down');
  const [handle, setHandle] = useState(true);
  const [modal, setModal] = useState(true);
  const [snapPoints, setSnapPoints] = useState(false);
  const [nested, setNested] = useState(false);
  const vertical = direction === 'down' || direction === 'up';

  return (
    <PlaygroundPanel
      preview={
        <MoveGoalDemo
          showSwipeHandle={handle}
          swipeDirection={direction}
          modal={modal}
          snapPoints={snapPoints}
          nested={nested}
        />
      }
      controls={
        <div className={PRIMITIVE_PLAYGROUND_CONTROL_GRID}>
          <InlineSegmentedControl
            label="Direction"
            value={direction}
            onChange={(v) => {
              const next = v as SwipeDirection;
              setDirection(next);
              if (next === 'left' || next === 'right') {
                setSnapPoints(false);
              }
            }}
            options={[
              { value: 'down', label: 'Down' },
              { value: 'up', label: 'Up' },
              { value: 'left', label: 'Left' },
              { value: 'right', label: 'Right' },
            ]}
          />
          <InlineSegmentedControl
            label="Swipe handle"
            value={handle ? 'on' : 'off'}
            onChange={(v) => setHandle(v === 'on')}
            options={[
              { value: 'on', label: 'On' },
              { value: 'off', label: 'Off' },
            ]}
          />
          <InlineSegmentedControl
            label="Modal"
            value={modal ? 'on' : 'off'}
            onChange={(v) => setModal(v === 'on')}
            options={[
              { value: 'on', label: 'On' },
              { value: 'off', label: 'Off' },
            ]}
          />
          <InlineSegmentedControl
            label="Snap points"
            value={snapPoints ? 'on' : 'off'}
            onChange={(v) => {
              if (v === 'on' && !vertical) {
                setDirection('down');
              }
              setSnapPoints(v === 'on');
            }}
            options={[
              { value: 'on', label: 'On' },
              { value: 'off', label: 'Off' },
            ]}
          />
          <InlineSegmentedControl
            label="Nested"
            value={nested ? 'on' : 'off'}
            onChange={(v) => setNested(v === 'on')}
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
      title="Drawer"
      description="Swipeable overlay panel — Foundations chrome from Figma Drawer (Slots); Base UI Drawer behavior (not Vaul)."
      playground={<DrawerPlayground />}
      variants={
        <div className="flex flex-wrap gap-[var(--spacing-md)]">
          <PrimitiveGalleryItem label="Demo">
            <MoveGoalDemo />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Delivery method">
            <DeliveryMethodDemo />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Responsive">
            <ResponsiveDialogDrawer />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="RTL">
            <RtlDrawerExample />
          </PrimitiveGalleryItem>
        </div>
      }
      usageGuidance={
        <ul className="list-disc space-y-2 ps-5 text-sm text-muted-foreground">
          <li>
            Compose <code>DrawerHeader</code> / <code>DrawerFooter</code> around
            body content; keep Title + Description for accessibility.
          </li>
          <li>
            Use <code>swipeDirection</code> (<code>up</code> / <code>down</code>{' '}
            / <code>left</code> / <code>right</code>) — not Vaul{' '}
            <code>direction</code> / <code>bottom</code>.
          </li>
          <li>
            Triggers and close actions use{' '}
            <code>render=&#123;&lt;Button /&gt;&#125;</code>, not Radix{' '}
            <code>asChild</code>.
          </li>
          <li>
            Scrollable regions should be flex items with{' '}
            <code>flex-1 overflow-y-auto</code> — avoid <code>h-full</code>{' '}
            inside content-sized drawers.
          </li>
          <li>
            <code>snapPoints</code> apply to vertical drawers only (
            <code>up</code> / <code>down</code>).
          </li>
        </ul>
      }
      accessibility={
        <ul className="list-disc space-y-2 ps-5 text-sm text-muted-foreground">
          <li>
            Always provide <code>DrawerTitle</code>; use{' '}
            <code>DrawerDescription</code> for supporting context.
          </li>
          <li>
            Modal drawers trap focus and inert the page; use{' '}
            <code>modal=&#123;false&#125;</code> or{' '}
            <code>modal=&quot;trap-focus&quot;</code> when intentional.
          </li>
          <li>
            Prefer an explicit Close control in addition to swipe / overlay
            dismiss.
          </li>
        </ul>
      }
    />
  ),
};

export const Demo: Story = {
  render: () => <MoveGoalDemo />,
};

export const Position: Story = {
  name: 'Position',
  render: () => (
    <div className="flex flex-wrap gap-[var(--spacing-xs)]">
      <SideDrawer direction="down" label="Down" />
      <SideDrawer direction="up" label="Up" />
      <SideDrawer direction="left" label="Left" />
      <SideDrawer direction="right" label="Right" />
    </div>
  ),
};

export const SwipeHandle: Story = {
  name: 'Swipe Handle',
  render: () => <MoveGoalDemo showSwipeHandle />,
};

export const Nested: Story = {
  render: () => <NestedDrawerConfigurable />,
};

export const NonModal: Story = {
  name: 'Non Modal',
  render: () => <NonModalExample />,
};

export const SnapPoints: Story = {
  name: 'Snap Points',
  render: () => <SnapPointsExample />,
};

export const Responsive: Story = {
  render: () => <ResponsiveDialogDrawer />,
};

export const DeliveryMethod: Story = {
  name: 'Delivery Method',
  render: () => <DeliveryMethodDemo />,
};

function RtlDrawerExample() {
  return (
    <div dir="rtl">
      <Drawer showSwipeHandle>
        <DrawerTrigger render={<Button variant="outline" />}>
          فتح الدرج
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>تعديل الملف الشخصي</DrawerTitle>
            <DrawerDescription>
              قم بإجراء التغييرات على ملفك الشخصي هنا.
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-[var(--spacing-md)]">
            <Field>
              <FieldLabel htmlFor="drawer-rtl-name">الاسم</FieldLabel>
              <Input id="drawer-rtl-name" defaultValue="Pedro Duarte" />
            </Field>
          </div>
          <DrawerFooter>
            <Button>حفظ</Button>
            <DrawerClose render={<Button variant="outline" />}>
              إلغاء
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
}

export const RTL: Story = {
  render: () => <RtlDrawerExample />,
};
