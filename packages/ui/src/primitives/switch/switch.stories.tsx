/**
 * Component Storybook IA (see docs/DESIGN.md "Component Story Structure"):
 * Overview first — Playground, Variants gallery, usage, a11y — then focused
 * example pages. shadcn Switch guide (Base UI Switch).
 */

import type { Meta, StoryObj } from '@storybook/react-vite';
import { MoonFog, Sun2 } from '@solar-icons/react';
import { useState } from 'react';

import { InlineSegmentedControl } from '../../../stories/InlineSegmentedControl';
import { PlaygroundPanel } from '../../../stories/PlaygroundPanel';
import {
  PRIMITIVE_PLAYGROUND_CONTROL_GRID,
  PrimitiveGalleryItem,
  PrimitivePage,
} from '../../../stories/PrimitivePage';
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from '../field';
import { DirectionProvider } from '../direction';

import { Switch, type SwitchSize } from './switch';
import { SwitchLight } from './switch-light';

const meta = {
  title: 'Design System/Primitives/Switch',
  component: Switch,
  tags: ['ai-generated'],
  parameters: { layout: 'centered' },
} satisfies Meta;

export default meta;
type Story = StoryObj;

const SIZES: SwitchSize[] = ['sm', 'default'];

/** shadcn switch-demo. */
function DemoExample() {
  return (
    <Field orientation="horizontal">
      <Switch id="airplane-mode" />
      <FieldLabel htmlFor="airplane-mode">Airplane Mode</FieldLabel>
    </Field>
  );
}

/** shadcn switch-description. */
function DescriptionExample() {
  return (
    <Field orientation="horizontal" className="max-w-sm">
      <Switch id="share-devices" defaultChecked />
      <FieldContent>
        <FieldLabel htmlFor="share-devices">Share across devices</FieldLabel>
        <FieldDescription>
          Focus is shared across devices, and turns off when you leave the app.
        </FieldDescription>
      </FieldContent>
    </Field>
  );
}

/** shadcn switch-choice-card — FieldLabel wraps Field for clickable card chrome. */
function ChoiceCardExample() {
  return (
    <FieldGroup className="w-80 max-w-full gap-[length:var(--spacing-md)]">
      <FieldLabel htmlFor="share-card">
        <Field orientation="horizontal" className="items-start">
          <FieldContent>
            <FieldTitle>Share across devices</FieldTitle>
            <FieldDescription>
              Focus is shared across devices, and turns off when you leave the
              app.
            </FieldDescription>
          </FieldContent>
          <Switch id="share-card" defaultChecked className="ms-auto" />
        </Field>
      </FieldLabel>
      <FieldLabel htmlFor="notifications-card">
        <Field orientation="horizontal" className="items-start">
          <FieldContent>
            <FieldTitle>Enable notifications</FieldTitle>
            <FieldDescription>
              Receive notifications when focus mode is enabled or disabled.
            </FieldDescription>
          </FieldContent>
          <Switch id="notifications-card" className="ms-auto" />
        </Field>
      </FieldLabel>
    </FieldGroup>
  );
}

/** shadcn switch-disabled. */
function DisabledExample() {
  return (
    <Field orientation="horizontal" data-disabled>
      <Switch id="disabled-switch" disabled />
      <FieldLabel htmlFor="disabled-switch">Disabled</FieldLabel>
    </Field>
  );
}

/** shadcn switch-invalid. */
function InvalidExample() {
  return (
    <Field orientation="horizontal" data-invalid className="max-w-sm">
      <Switch id="terms-switch" aria-invalid />
      <FieldContent>
        <FieldLabel htmlFor="terms-switch">
          Accept terms and conditions
        </FieldLabel>
        <FieldDescription>
          You must accept the terms and conditions to continue.
        </FieldDescription>
      </FieldContent>
    </Field>
  );
}

/** shadcn switch-sizes. */
function SizeExample() {
  return (
    <FieldGroup className="gap-[length:var(--spacing-md)]">
      <Field orientation="horizontal">
        <Switch id="size-sm" size="sm" />
        <FieldLabel htmlFor="size-sm">Small</FieldLabel>
      </Field>
      <Field orientation="horizontal">
        <Switch id="size-default" size="default" defaultChecked />
        <FieldLabel htmlFor="size-default">Default</FieldLabel>
      </Field>
    </FieldGroup>
  );
}

/** shadcn switch-rtl. */
function RtlExample() {
  return (
    <DirectionProvider direction="rtl">
      <div dir="rtl" className="max-w-sm">
        <Field orientation="horizontal">
          <Switch id="rtl-share" defaultChecked />
          <FieldContent>
            <FieldLabel htmlFor="rtl-share">المشاركة عبر الأجهزة</FieldLabel>
            <FieldDescription>
              يتم مشاركة التركيز عبر الأجهزة، ويتم إيقاف تشغيله عند مغادرة
              التطبيق.
            </FieldDescription>
          </FieldContent>
        </Field>
      </div>
    </DirectionProvider>
  );
}

/** Figma Toggle Light (`5846:24869`) — soft track × Icon × Size. Solar Bold Duotone. */
function SwitchLightExample() {
  return (
    <div className="flex flex-col gap-[var(--spacing-md)]">
      <div className="flex flex-wrap items-center gap-[var(--spacing-md)]">
        <SwitchLight
          size="sm"
          aria-label="Light mini with icon"
          icon={<Sun2 weight="BoldDuotone" color="currentColor" />}
        />
        <SwitchLight
          size="sm"
          defaultChecked
          aria-label="Light mini with icon on"
          icon={<Sun2 weight="BoldDuotone" color="currentColor" />}
        />
        <SwitchLight size="sm" aria-label="Light mini" />
        <SwitchLight size="sm" defaultChecked aria-label="Light mini on" />
      </div>
      <div className="flex flex-wrap items-center gap-[var(--spacing-md)]">
        <SwitchLight
          aria-label="Light regular with icon"
          icon={<MoonFog weight="BoldDuotone" color="currentColor" />}
        />
        <SwitchLight
          defaultChecked
          aria-label="Light regular with icon on"
          icon={<MoonFog weight="BoldDuotone" color="currentColor" />}
        />
        <SwitchLight aria-label="Light regular" />
        <SwitchLight defaultChecked aria-label="Light regular on" />
      </div>
    </div>
  );
}

function SwitchPlayground() {
  const [size, setSize] = useState<SwitchSize>('default');
  const [checked, setChecked] = useState(true);
  const [disabled, setDisabled] = useState(false);

  return (
    <PlaygroundPanel
      preview={
        <div className="flex min-h-40 items-center justify-center">
          <Field orientation="horizontal">
            <Switch
              id="playground-switch"
              size={size}
              checked={checked}
              onCheckedChange={setChecked}
              disabled={disabled}
            />
            <FieldLabel htmlFor="playground-switch">Airplane Mode</FieldLabel>
          </Field>
        </div>
      }
      controls={
        <div className={PRIMITIVE_PLAYGROUND_CONTROL_GRID}>
          <InlineSegmentedControl
            label="Size"
            value={size}
            onChange={(v) => setSize(v as SwitchSize)}
            options={SIZES.map((value) => ({ value, label: value }))}
            fullWidth
          />
          <InlineSegmentedControl
            label="Checked"
            value={checked ? 'on' : 'off'}
            onChange={(v) => setChecked(v === 'on')}
            options={[
              { value: 'on', label: 'on' },
              { value: 'off', label: 'off' },
            ]}
            fullWidth
          />
          <InlineSegmentedControl
            label="Disabled"
            value={disabled ? 'y' : 'n'}
            onChange={(v) => setDisabled(v === 'y')}
            options={[
              { value: 'y', label: 'y' },
              { value: 'n', label: 'n' },
            ]}
            fullWidth
            className="col-span-2"
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
      title="Switch"
      description="A control that toggles between checked and not checked. Figma Switch (Checked? × State); shadcn Switch + Base UI API."
      playground={<SwitchPlayground />}
      variants={
        <div className="flex flex-wrap gap-[var(--spacing-md)]">
          <PrimitiveGalleryItem label="Demo">
            <DemoExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Description">
            <DescriptionExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Choice Card">
            <ChoiceCardExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Disabled">
            <DisabledExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Invalid">
            <InvalidExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Size">
            <SizeExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="RTL">
            <RtlExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Switch Light">
            <SwitchLightExample />
          </PrimitiveGalleryItem>
        </div>
      }
      usageGuidance={
        <ul className="list-disc space-y-2 ps-5 text-sm text-muted-foreground">
          <li>
            Pair with <code>Field</code> / <code>FieldLabel</code> for labeled
            rows (Description, Choice Card).
          </li>
          <li>
            Figma Checked?=True → <code>data-checked</code> / controlled{' '}
            <code>checked</code>; False → <code>data-unchecked</code>.
          </li>
          <li>
            Size <code>default</code> matches Figma 33×18; <code>sm</code>{' '}
            follows the shadcn size ladder.
          </li>
          <li>
            Soft chrome / optional icon → <code>SwitchLight</code> (Figma Toggle
            Light). Pass Solar Bold Duotone via <code>icon</code> (e.g.{' '}
            <code>MoonFog</code> / <code>Sun2</code>).
          </li>
        </ul>
      }
      accessibility={
        <ul className="list-disc space-y-2 ps-5 text-sm text-muted-foreground">
          <li>
            Switch is a checkbox role with <code>aria-checked</code>. Space /
            Enter toggles.
          </li>
          <li>
            Use <code>aria-invalid</code> for error; associate labels via{' '}
            <code>htmlFor</code> / <code>id</code>.
          </li>
          <li>
            Disabled via <code>disabled</code>; host Field may set{' '}
            <code>data-disabled</code>.
          </li>
        </ul>
      }
    />
  ),
};

export const Demo: Story = {
  render: () => <DemoExample />,
};

export const Description: Story = {
  render: () => <DescriptionExample />,
};

export const ChoiceCard: Story = {
  render: () => <ChoiceCardExample />,
};

export const Disabled: Story = {
  render: () => <DisabledExample />,
};

export const Invalid: Story = {
  render: () => <InvalidExample />,
};

export const Size: Story = {
  render: () => <SizeExample />,
};

export const RTL: Story = {
  render: () => <RtlExample />,
};

export const SwitchLightStory: Story = {
  name: 'Switch Light',
  render: () => <SwitchLightExample />,
};
