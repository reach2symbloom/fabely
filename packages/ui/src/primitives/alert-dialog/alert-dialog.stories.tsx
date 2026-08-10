import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { BluetoothIcon, CircleFadingPlusIcon, Trash2Icon } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './alert-dialog';
import type { AlertDialogContentSize } from './alert-dialog';
import { Button } from '../button';
import type { ButtonVariant } from '../button';
import { InlineSegmentedControl } from '../../../stories/InlineSegmentedControl';
import { PlaygroundPanel } from '../../../stories/PlaygroundPanel';
import {
  PRIMITIVE_PLAYGROUND_CONTROL_GRID,
  PrimitiveGalleryItem,
  PrimitivePage,
} from '../../../stories/PrimitivePage';

/**
 * Component Storybook IA (see docs/DESIGN.md "Component Story Structure"):
 * Overview is always the first page — description, interactive Playground
 * at the top, then a gallery composing the canonical examples below, usage
 * guidance, and a11y notes. Each example below stays its own focused page.
 *
 * Phase 1: full shadcn Alert Dialog API surface; vendor styling only — no
 * Figma tokens yet. Trigger / Action / Cancel compose our Button primitive.
 */

const meta = {
  title: 'Design System/Primitives/Alert Dialog',
  component: AlertDialog,
  tags: ['ai-generated'],
  parameters: { layout: 'centered' },
} satisfies Meta;

export default meta;
type Story = StoryObj;

/* ---------- Canonical examples (shadcn docs patterns) ---------- */

function BasicExample() {
  return (
    <AlertDialog>
      <AlertDialogTrigger render={<Button variant="secondary" />}>
        Show Dialog
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel variant="tertiary">Cancel</AlertDialogCancel>
          <AlertDialogAction>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function SmallExample() {
  return (
    <AlertDialog>
      <AlertDialogTrigger render={<Button variant="secondary" />}>
        Show Dialog
      </AlertDialogTrigger>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogTitle>Allow accessory to connect?</AlertDialogTitle>
          <AlertDialogDescription>
            Do you want to allow the USB accessory to connect to this device?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel variant="tertiary">Don&apos;t allow</AlertDialogCancel>
          <AlertDialogAction>Allow</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function MediaExample() {
  return (
    <AlertDialog>
      <AlertDialogTrigger render={<Button variant="secondary" />}>
        Share Project
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogMedia>
            <CircleFadingPlusIcon />
          </AlertDialogMedia>
          <AlertDialogTitle>Share this project?</AlertDialogTitle>
          <AlertDialogDescription>
            Anyone with the link will be able to view and edit this project.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel variant="tertiary">Cancel</AlertDialogCancel>
          <AlertDialogAction>Share</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function SmallWithMediaExample() {
  return (
    <AlertDialog>
      <AlertDialogTrigger render={<Button variant="secondary" />}>
        Show Dialog
      </AlertDialogTrigger>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia>
            <BluetoothIcon />
          </AlertDialogMedia>
          <AlertDialogTitle>Allow accessory to connect?</AlertDialogTitle>
          <AlertDialogDescription>
            Do you want to allow the USB accessory to connect to this device?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel variant="tertiary">Don&apos;t allow</AlertDialogCancel>
          <AlertDialogAction>Allow</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function DestructiveExample() {
  return (
    <AlertDialog>
      <AlertDialogTrigger render={<Button variant="destructive" />}>
        Delete Chat
      </AlertDialogTrigger>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
            <Trash2Icon />
          </AlertDialogMedia>
          <AlertDialogTitle>Delete chat?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete this chat conversation. View{' '}
            <a href="#">Settings</a> delete any memories saved during this chat.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel variant="tertiary">Cancel</AlertDialogCancel>
          <AlertDialogAction variant="destructive">Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

/** shadcn docs' "RTL" — wrap in `dir="rtl"` with Arabic copy. */
function RtlExample() {
  return (
    <div dir="rtl" className="flex flex-wrap gap-4">
      <AlertDialog>
        <AlertDialogTrigger render={<Button variant="secondary" />}>
          إظهار الحوار
        </AlertDialogTrigger>
        <AlertDialogContent dir="rtl">
          <AlertDialogHeader>
            <AlertDialogTitle>هل أنت متأكد تمامًا؟</AlertDialogTitle>
            <AlertDialogDescription>
              لا يمكن التراجع عن هذا الإجراء. سيؤدي هذا إلى حذف حسابك نهائيًا من
              خوادمنا.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel variant="tertiary">إلغاء</AlertDialogCancel>
            <AlertDialogAction>متابعة</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog>
        <AlertDialogTrigger render={<Button variant="secondary" />}>
          إظهار الحوار (صغير)
        </AlertDialogTrigger>
        <AlertDialogContent size="sm" dir="rtl">
          <AlertDialogHeader>
            <AlertDialogMedia>
              <BluetoothIcon />
            </AlertDialogMedia>
            <AlertDialogTitle>السماح للملحق بالاتصال؟</AlertDialogTitle>
            <AlertDialogDescription>
              هل تريد السماح لملحق USB بالاتصال بهذا الجهاز؟
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel variant="tertiary">عدم السماح</AlertDialogCancel>
            <AlertDialogAction>السماح</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

/* ---------- Playground ---------- */

const TRIGGER_VARIANTS: { variant: ButtonVariant; label: string }[] = [
  { variant: 'primary', label: 'Primary' },
  { variant: 'primaryOutline', label: 'Primary outline' },
  { variant: 'secondary', label: 'Secondary' },
  { variant: 'tertiary', label: 'Tertiary' },
  { variant: 'ghost', label: 'Ghost' },
  { variant: 'destructive', label: 'Destructive' },
  { variant: 'fiaFilled', label: 'Fia filled' },
  { variant: 'fiaOutline', label: 'Fia Outline' },
];

function AlertDialogPlayground() {
  const [size, setSize] = useState<AlertDialogContentSize>('default');
  const [media, setMedia] = useState(false);
  const [destructive, setDestructive] = useState(false);
  const [triggerVariant, setTriggerVariant] =
    useState<ButtonVariant>('secondary');

  const title = destructive
    ? 'Delete chat?'
    : size === 'sm'
      ? 'Allow accessory to connect?'
      : 'Are you absolutely sure?';

  const description = destructive
    ? 'This will permanently delete this chat conversation. View Settings delete any memories saved during this chat.'
    : size === 'sm'
      ? 'Do you want to allow the USB accessory to connect to this device?'
      : 'This action cannot be undone. This will permanently delete your account and remove your data from our servers.';

  const cancelLabel = size === 'sm' && !destructive ? "Don't allow" : 'Cancel';
  const actionLabel = destructive ? 'Delete' : size === 'sm' ? 'Allow' : 'Continue';

  return (
    <PlaygroundPanel
      preview={
        <AlertDialog>
          <AlertDialogTrigger render={<Button variant={triggerVariant} />}>
            Show Dialog
          </AlertDialogTrigger>
          <AlertDialogContent size={size}>
            <AlertDialogHeader>
              {media ? (
                <AlertDialogMedia
                  className={
                    destructive
                      ? 'bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive'
                      : undefined
                  }
                >
                  {destructive ? <Trash2Icon /> : <CircleFadingPlusIcon />}
                </AlertDialogMedia>
              ) : null}
              <AlertDialogTitle>{title}</AlertDialogTitle>
              <AlertDialogDescription>{description}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel variant="tertiary">{cancelLabel}</AlertDialogCancel>
              <AlertDialogAction variant={destructive ? 'destructive' : 'primary'}>
                {actionLabel}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      }
      controls={
        <div className={PRIMITIVE_PLAYGROUND_CONTROL_GRID}>
          <div className="col-span-2">
            <InlineSegmentedControl
              label="Trigger"
              value={triggerVariant}
              options={TRIGGER_VARIANTS.map(({ variant, label }) => ({
                value: variant,
                label,
              }))}
              onChange={setTriggerVariant}
              fullWidth
            />
          </div>

          <InlineSegmentedControl
            label="Size"
            value={size}
            options={[
              { value: 'default', label: 'Default' },
              { value: 'sm', label: 'Small' },
            ]}
            onChange={setSize}
            fullWidth
          />

          <InlineSegmentedControl
            label="Media"
            value={media ? 'on' : 'off'}
            options={[
              { value: 'off', label: 'Off' },
              { value: 'on', label: 'On' },
            ]}
            onChange={(v) => setMedia(v === 'on')}
            fullWidth
          />

          <InlineSegmentedControl
            label="Destructive"
            value={destructive ? 'on' : 'off'}
            options={[
              { value: 'off', label: 'Off' },
              { value: 'on', label: 'On' },
            ]}
            onChange={(v) => setDestructive(v === 'on')}
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
      title="Alert Dialog"
      description={
        <>
          Phase 1 — full shadcn Alert Dialog API surface on Base UI. Dialog chrome
          keeps vendor styling; Trigger, Action, and Cancel compose our Button
          primitive. No Figma / Foundations remapping yet. Content <code>size</code>{' '}
          is <code>default</code> | <code>sm</code>.
        </>
      }
      playground={<AlertDialogPlayground />}
      variants={
        <div className="flex flex-wrap gap-4">
          <PrimitiveGalleryItem label="Basic">
            <BasicExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Small">
            <SmallExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Media">
            <MediaExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Small with Media">
            <SmallWithMediaExample />
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
            Compose with the documented tree: Trigger + Content → Header (optional
            Media, Title, Description) + Footer (Cancel, Action).
          </li>
          <li>
            Prefer <code>{"render={<Button variant=\"…\" />}"}</code> on{' '}
            <code>AlertDialogTrigger</code> — always our Button primitive, not the
            vendor button. Trigger accepts any Button variant;{' '}
            <code>secondary</code> is only the demo default.
          </li>
          <li>
            <strong>Fabely convention:</strong> <code>AlertDialogCancel</code>{' '}
            defaults to Button <code>tertiary</code> (not shadcn{' '}
            <code>outline</code>).
          </li>
          <li>
            Set <code>size=&quot;sm&quot;</code> on <code>AlertDialogContent</code> for
            the compact layout (footer becomes a two-column grid).
          </li>
          <li>
            Destructive flows: pass <code>variant=&quot;destructive&quot;</code> on{' '}
            <code>AlertDialogAction</code> (and optionally the trigger / media).
          </li>
          <li>
            <strong>Do not invent</strong> props beyond the shadcn docs — only{' '}
            <code>size</code> is Alert-Dialog-specific; button look comes from
            Button.
          </li>
        </ul>
      }
      accessibility={
        <ul className="list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
          <li>
            Always provide <code>AlertDialogTitle</code> (and usually Description)
            — Base UI wires them for the accessible name / description.
          </li>
          <li>
            Alert dialogs interrupt; reserve them for confirmations that need an
            explicit response (Cancel vs Continue / Delete).
          </li>
          <li>
            <code>AlertDialogCancel</code> is a Base UI Close. Action is a plain
            Button — wire dismiss yourself when the action should also close.
          </li>
          <li>
            Media icons are decorative when Title/Description carry the meaning —
            keep them <code>aria-hidden</code> if needed, or ensure the title
            states the intent.
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

export const Small: Story = {
  render: () => <SmallExample />,
};

export const Media: Story = {
  render: () => <MediaExample />,
};

export const SmallWithMedia: Story = {
  name: 'Small with Media',
  render: () => <SmallWithMediaExample />,
};

export const Destructive: Story = {
  render: () => <DestructiveExample />,
};

export const RTL: Story = {
  render: () => <RtlExample />,
};
