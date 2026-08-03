import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { ArrowRightIcon, PlusIcon } from 'lucide-react';
import { Button, buttonVariants } from './button';
import type { ButtonSize, ButtonVariant } from './button';
import { Spinner } from '../spinner';
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
 * Phase 1: full shadcn Button API surface; vendor styling only — no Figma
 * tokens yet.
 */

const meta = {
  title: 'Design System/Primitives/Button',
  component: Button,
  tags: ['ai-generated'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

const VARIANTS: { variant: ButtonVariant; label: string }[] = [
  { variant: 'default', label: 'Default' },
  { variant: 'outline', label: 'Outline' },
  { variant: 'secondary', label: 'Secondary' },
  { variant: 'ghost', label: 'Ghost' },
  { variant: 'destructive', label: 'Destructive' },
  { variant: 'link', label: 'Link' },
];

const SIZES: { size: ButtonSize; label: string }[] = [
  { size: 'default', label: 'Default' },
  { size: 'xs', label: 'XS' },
  { size: 'sm', label: 'SM' },
  { size: 'lg', label: 'LG' },
  { size: 'icon', label: 'Icon' },
  { size: 'icon-xs', label: 'Icon XS' },
  { size: 'icon-sm', label: 'Icon SM' },
  { size: 'icon-lg', label: 'Icon LG' },
];

const TEXT_SIZES = SIZES.filter(({ size }) => !size.startsWith('icon'));
const ICON_SIZES = SIZES.filter(({ size }) => size.startsWith('icon'));

/* ---------- Canonical examples ---------- */

function DefaultExample() {
  return <Button>Button</Button>;
}

function VariantsExample() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {VARIANTS.map(({ variant, label }) => (
        <Button key={variant} variant={variant}>
          {label}
        </Button>
      ))}
    </div>
  );
}

function SizesExample() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="mb-3 font-sans text-xs text-muted-foreground">Text sizes</p>
        <div className="flex flex-wrap items-end gap-4">
          {TEXT_SIZES.map(({ size, label }) => (
            <div key={size} className="flex flex-col items-center gap-2">
              <Button size={size}>Button</Button>
              <span className="font-sans text-xs text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>
      </div>
      <div>
        <p className="mb-3 font-sans text-xs text-muted-foreground">Icon sizes</p>
        <div className="flex flex-wrap items-end gap-4">
          {ICON_SIZES.map(({ size, label }) => (
            <div key={size} className="flex flex-col items-center gap-2">
              <Button size={size} aria-label="Add">
                <PlusIcon />
              </Button>
              <span className="font-sans text-xs text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** shadcn docs' "Icon" — icon-only button sizes. */
function IconExample() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {ICON_SIZES.map(({ size }) => (
        <Button key={size} size={size} variant="outline" aria-label="Add">
          <PlusIcon />
        </Button>
      ))}
    </div>
  );
}

/** shadcn docs' "With Icon" — `data-icon` for start/end spacing. */
function WithIconExample() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button data-icon="inline-start">
        <PlusIcon data-icon="inline-start" />
        Add
      </Button>
      <Button variant="outline" data-icon="inline-end">
        Next
        <ArrowRightIcon data-icon="inline-end" />
      </Button>
      <Button variant="secondary" data-icon="inline-start">
        <PlusIcon data-icon="inline-start" />
        New
      </Button>
    </div>
  );
}

/** shadcn docs' "Spinner" — Spinner child + `data-icon` for spacing. */
function SpinnerExample() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button disabled data-icon="inline-start">
        <Spinner data-icon="inline-start" />
        Please wait
      </Button>
      <Button variant="outline" disabled data-icon="inline-start">
        <Spinner data-icon="inline-start" />
        Loading
      </Button>
    </div>
  );
}

/**
 * Shape axis (Avatar vocabulary) — Roundrect is Foundations `--rounded-lg`
 * (12px, flat across sizes); Round adds `rounded-full`.
 */
function ShapeExample() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="mb-3 font-sans text-xs text-muted-foreground">Roundrect</p>
        <div className="flex flex-wrap items-center gap-3">
          <Button>Button</Button>
          <Button variant="outline" size="icon" aria-label="Add">
            <PlusIcon />
          </Button>
          <Button variant="secondary" data-icon="inline-start">
            <PlusIcon data-icon="inline-start" />
            Add
          </Button>
        </div>
      </div>
      <div>
        <p className="mb-3 font-sans text-xs text-muted-foreground">Round</p>
        <div className="flex flex-wrap items-center gap-3">
          <Button className="rounded-full">Button</Button>
          <Button variant="outline" className="rounded-full" size="icon" aria-label="Add">
            <PlusIcon />
          </Button>
          <Button variant="secondary" className="rounded-full" data-icon="inline-start">
            <PlusIcon data-icon="inline-start" />
            Add
          </Button>
        </div>
      </div>
    </div>
  );
}

function DisabledExample() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button disabled>Default</Button>
      <Button variant="outline" disabled>
        Outline
      </Button>
      <Button variant="secondary" disabled>
        Secondary
      </Button>
      <Button variant="ghost" disabled>
        Ghost
      </Button>
      <Button variant="destructive" disabled>
        Destructive
      </Button>
      <Button variant="link" disabled>
        Link
      </Button>
    </div>
  );
}

/**
 * shadcn docs' "As Link" — `buttonVariants` on a plain `<a>`.
 * Do not use `<Button render={<a />} />` (Base UI forces role="button").
 */
function AsLinkExample() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <a className={buttonVariants()} href="https://fabely.app">
        Default link
      </a>
      <a className={buttonVariants({ variant: 'outline' })} href="https://fabely.app">
        Outline link
      </a>
      <a className={buttonVariants({ variant: 'secondary' })} href="https://fabely.app">
        Secondary link
      </a>
      <a className={buttonVariants({ variant: 'ghost' })} href="https://fabely.app">
        Ghost link
      </a>
    </div>
  );
}

/** shadcn docs' "RTL" — wrap in `dir="rtl"`. */
function RtlExample() {
  return (
    <div dir="rtl" className="flex flex-wrap items-center gap-3">
      <Button data-icon="inline-start">
        <PlusIcon data-icon="inline-start" />
        إضافة
      </Button>
      <Button variant="outline" data-icon="inline-end">
        التالي
        <ArrowRightIcon data-icon="inline-end" />
      </Button>
      <Button variant="secondary">زر</Button>
    </div>
  );
}

/* ---------- Playground ---------- */

const ICON_OPTIONS: { value: 'none' | 'start' | 'end' | 'spinner'; label: string }[] = [
  { value: 'none', label: 'None' },
  { value: 'start', label: 'Start' },
  { value: 'end', label: 'End' },
  { value: 'spinner', label: 'Spinner' },
];

type ButtonShape = 'roundrect' | 'round';

function ButtonPlayground() {
  const [variant, setVariant] = useState<ButtonVariant>('default');
  const [size, setSize] = useState<ButtonSize>('default');
  const [icon, setIcon] = useState<'none' | 'start' | 'end' | 'spinner'>('none');
  const [shape, setShape] = useState<ButtonShape>('roundrect');
  const [disabled, setDisabled] = useState(false);
  const [asLink, setAsLink] = useState(false);

  const isIconSize = size.startsWith('icon');
  const dataIcon =
    icon === 'end' ? 'inline-end' : icon === 'none' ? undefined : 'inline-start';

  const content = isIconSize ? (
    <PlusIcon />
  ) : (
    <>
      {icon === 'start' ? <PlusIcon data-icon="inline-start" /> : null}
      {icon === 'spinner' ? <Spinner data-icon="inline-start" /> : null}
      Button
      {icon === 'end' ? <ArrowRightIcon data-icon="inline-end" /> : null}
    </>
  );

  const className = shape === 'round' ? 'rounded-full' : undefined;

  return (
    <PlaygroundPanel
      preview={
        asLink ? (
          <a
            className={buttonVariants({ variant, size, className })}
            href="#"
            aria-label={isIconSize ? 'Add' : undefined}
            data-icon={dataIcon}
          >
            {content}
          </a>
        ) : (
          <Button
            variant={variant}
            size={size}
            disabled={disabled}
            className={className}
            data-icon={dataIcon}
            aria-label={isIconSize ? 'Add' : undefined}
          >
            {content}
          </Button>
        )
      }
      controls={
        <div className={PRIMITIVE_PLAYGROUND_CONTROL_GRID}>
          <div className="col-span-2">
            <InlineSegmentedControl
              label="Variant"
              value={variant}
              options={VARIANTS.map(({ variant: v, label }) => ({ value: v, label }))}
              onChange={setVariant}
              fullWidth
            />
          </div>

          <div className="col-span-2">
            <InlineSegmentedControl
              label="Size"
              value={size}
              options={SIZES.map(({ size: s, label }) => ({ value: s, label }))}
              onChange={setSize}
              fullWidth
            />
          </div>

          <InlineSegmentedControl
            label="Icon"
            value={icon}
            options={ICON_OPTIONS}
            onChange={setIcon}
            fullWidth
          />

          <InlineSegmentedControl
            label="Shape"
            value={shape}
            options={[
              { value: 'roundrect', label: 'Roundrect' },
              { value: 'round', label: 'Round' },
            ]}
            onChange={setShape}
            fullWidth
          />

          <InlineSegmentedControl
            label="Disabled"
            value={disabled ? 'on' : 'off'}
            options={[
              { value: 'off', label: 'Off' },
              { value: 'on', label: 'On' },
            ]}
            onChange={(v) => setDisabled(v === 'on')}
            fullWidth
          />

          <InlineSegmentedControl
            label="As link"
            value={asLink ? 'on' : 'off'}
            options={[
              { value: 'off', label: 'Off' },
              { value: 'on', label: 'On' },
            ]}
            onChange={(v) => setAsLink(v === 'on')}
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
      title="Button"
      description={
        <>
          Displays a button or a component that looks like a button. Phase 1 exposes the full
          shadcn Button API (<code>variant</code>, <code>size</code>, <code>buttonVariants</code>)
          with vendor styling only — not yet matched to Figma. Import from this primitive, not{' '}
          <code>src/components/ui/button</code>.
        </>
      }
      playground={<ButtonPlayground />}
      variants={
        <div className="flex flex-wrap gap-4">
          <PrimitiveGalleryItem label="Default">
            <DefaultExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Variants">
            <VariantsExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Sizes">
            <SizesExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Icon">
            <IconExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="With Icon">
            <WithIconExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Spinner">
            <SpinnerExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Shape">
            <ShapeExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Disabled">
            <DisabledExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="As Link">
            <AsLinkExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="RTL">
            <RtlExample />
          </PrimitiveGalleryItem>
        </div>
      }
      usageGuidance={
        <ul className="list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
          <li>
            Prefer the <code>variant</code> and <code>size</code> props over inventing one-off
            visual classes — phase 1 tracks the shadcn surface; Figma restyle comes later.
          </li>
          <li>
            For icons, pass an SVG child and set <code>data-icon=&quot;inline-start&quot;</code> or{' '}
            <code>&quot;inline-end&quot;</code> on the button (and the icon) for correct spacing —
            no dedicated icon prop.
          </li>
          <li>
            Loading: render <code>&lt;Spinner /&gt;</code> inside the button with{' '}
            <code>data-icon</code>; typically pair with <code>disabled</code>.
          </li>
          <li>
            Shape: Roundrect is Foundations <code>--rounded-lg</code> (12px, flat for every
            size — not size-proportional like Avatar). Round is{' '}
            <code>className=&quot;rounded-full&quot;</code>. There is no <code>shape</code> prop
            yet (playground/docs vocabulary only).
          </li>
          <li>
            <strong>Do not use</strong> <code>{"<Button render={<a />} />"}</code> for links. Base
            UI&apos;s Button always applies <code>role=&quot;button&quot;</code>, which overrides
            the semantic link role on <code>&lt;a&gt;</code>. Use <code>buttonVariants</code> with
            a plain <code>&lt;a&gt;</code> instead (see As Link).
          </li>
          <li>
            For grouped actions, compose with the <code>ButtonGroup</code> primitive — see that
            component&apos;s docs.
          </li>
        </ul>
      }
      accessibility={
        <ul className="list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
          <li>
            Icon-only buttons need an accessible name (<code>aria-label</code>) — the glyph alone
            is not enough for screen readers.
          </li>
          <li>
            Decorative icons should set <code>aria-hidden=&quot;true&quot;</code> when label text
            is present; the Spinner primitive already exposes{' '}
            <code>role=&quot;status&quot;</code> and an accessible loading label.
          </li>
          <li>
            Prefer native <code>disabled</code> for non-interactive states so focus and pointer
            events are correctly suppressed.
          </li>
          <li>
            Links that look like buttons must remain real links (<code>&lt;a href&gt;</code> +{' '}
            <code>buttonVariants</code>) so keyboard and AT users get link semantics and
            affordances.
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

export const Variants: Story = {
  render: () => <VariantsExample />,
};

export const Sizes: Story = {
  render: () => <SizesExample />,
};

export const Icon: Story = {
  render: () => <IconExample />,
};

export const WithIcon: Story = {
  render: () => <WithIconExample />,
};

export const SpinnerStory: Story = {
  name: 'Spinner',
  render: () => <SpinnerExample />,
};

export const Shape: Story = {
  render: () => <ShapeExample />,
};

export const Disabled: Story = {
  render: () => <DisabledExample />,
};

export const AsLink: Story = {
  render: () => <AsLinkExample />,
};

export const RTL: Story = {
  render: () => <RtlExample />,
};
