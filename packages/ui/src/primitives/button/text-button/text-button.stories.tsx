import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { ArrowRightIcon, PlusIcon } from 'lucide-react';
import { Button, buttonVariants } from './text-button';
import type { ButtonSize } from './text-button';
import type { ButtonRoundness, ButtonVariant } from '../shared';
import { Spinner } from '../../spinner';
import { InlineSegmentedControl } from '../../../../stories/InlineSegmentedControl';
import { PlaygroundPanel } from '../../../../stories/PlaygroundPanel';
import {
  PRIMITIVE_PLAYGROUND_CONTROL_GRID,
  PrimitiveGalleryItem,
  PrimitivePage,
} from '../../../../stories/PrimitivePage';

/**
 * Component Storybook IA (see docs/DESIGN.md "Component Story Structure"):
 * Overview first — Playground, Variants gallery, usage, a11y — then focused
 * example pages. Phase 2: Figma Button axes (not shadcn defaults).
 */

const meta = {
  title: 'Design System/Primitives/Button/Text Button',
  component: Button,
  tags: ['ai-generated'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

const VARIANTS: { variant: ButtonVariant; label: string }[] = [
  { variant: 'primary', label: 'Primary' },
  { variant: 'primaryOutline', label: 'Primary outline' },
  { variant: 'secondary', label: 'Secondary' },
  { variant: 'tertiary', label: 'Tertiary' },
  { variant: 'ghost', label: 'Ghost' },
  { variant: 'destructive', label: 'Destructive' },
  { variant: 'fiaFilled', label: 'Fia filled' },
  { variant: 'fiaOutline', label: 'Fia Outline' },
];

const SIZES: { size: ButtonSize; label: string }[] = [
  { size: 'mini', label: 'Mini' },
  { size: 'small', label: 'Small' },
  { size: 'default', label: 'Default' },
  { size: 'large', label: 'Large' },
  { size: 'extraLarge', label: 'Extra Large' },
];

const ROUNDNESSES: { roundness: ButtonRoundness; label: string }[] = [
  { roundness: 'default', label: 'Roundrect' },
  { roundness: 'round', label: 'Round' },
];

/* ---------- Canonical examples ---------- */

function DefaultExample() {
  return <Button>Label</Button>;
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
    <div className="flex flex-wrap items-end gap-4">
      {SIZES.map(({ size, label }) => (
        <div key={size} className="flex flex-col items-center gap-2">
          <Button size={size}>Label</Button>
          <span className="font-sans text-xs text-muted-foreground">{label}</span>
        </div>
      ))}
    </div>
  );
}

function ShapeExample() {
  return (
    <div className="flex flex-col gap-6">
      {ROUNDNESSES.map(({ roundness, label }) => (
        <div key={roundness}>
          <p className="mb-3 font-sans text-xs text-muted-foreground">{label}</p>
          <div className="flex flex-wrap items-center gap-3">
            <Button roundness={roundness}>Label</Button>
            <Button roundness={roundness} variant="secondary">
              Label
            </Button>
            <Button roundness={roundness} variant="fiaFilled" data-icon="inline-start">
              <PlusIcon data-icon="inline-start" />
              Label
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}

function WithIconExample() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button data-icon="inline-start">
        <PlusIcon data-icon="inline-start" />
        Add
      </Button>
      <Button variant="primaryOutline" data-icon="inline-end">
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

function SpinnerExample() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button disabled data-icon="inline-start">
        <Spinner data-icon="inline-start" />
        Please wait
      </Button>
      <Button variant="primaryOutline" disabled data-icon="inline-start">
        <Spinner data-icon="inline-start" />
        Loading
      </Button>
    </div>
  );
}

function DisabledExample() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {VARIANTS.map(({ variant, label }) => (
        <Button key={variant} variant={variant} disabled>
          {label}
        </Button>
      ))}
    </div>
  );
}

/** Forces pressed styles via `data-pressed` (mirrors `:active` in the primitive). */
function PressedExample() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {VARIANTS.map(({ variant, label }) => (
        <Button key={variant} variant={variant} data-pressed>
          {label}
        </Button>
      ))}
    </div>
  );
}

/** `buttonVariants` on a plain `<a>` — not `render={<a />}`. */
function AsLinkExample() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <a className={buttonVariants({ variant: 'primary' })} href="#">
        Primary link
      </a>
      <a className={buttonVariants({ variant: 'primaryOutline' })} href="#">
        Outline link
      </a>
      <a className={buttonVariants({ variant: 'secondary' })} href="#">
        Secondary link
      </a>
      <a className={buttonVariants({ variant: 'ghost' })} href="#">
        Ghost link
      </a>
    </div>
  );
}

function RtlExample() {
  return (
    <div dir="rtl" className="flex flex-wrap items-center gap-3">
      <Button data-icon="inline-start">
        <PlusIcon data-icon="inline-start" />
        إضافة
      </Button>
      <Button variant="primaryOutline" data-icon="inline-end">
        التالي
        <ArrowRightIcon data-icon="inline-end" />
      </Button>
      <Button variant="secondary">زر</Button>
    </div>
  );
}

function FigmaMatrixExample() {
  return (
    <div className="flex flex-col gap-6">
      {SIZES.map(({ size, label }) => (
        <div key={size}>
          <p className="mb-3 font-sans text-xs text-muted-foreground">Size: {label}</p>
          <div className="flex flex-wrap items-center gap-3">
            {VARIANTS.map(({ variant, label: vLabel }) => (
              <Button key={variant} variant={variant} size={size}>
                {vLabel}
              </Button>
            ))}
          </div>
        </div>
      ))}
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

function ButtonPlayground() {
  const [variant, setVariant] = useState<ButtonVariant>('primary');
  const [size, setSize] = useState<ButtonSize>('default');
  const [roundness, setRoundness] = useState<ButtonRoundness>('default');
  const [icon, setIcon] = useState<'none' | 'start' | 'end' | 'spinner'>('none');
  const [disabled, setDisabled] = useState(false);
  const [asLink, setAsLink] = useState(false);

  const dataIcon =
    icon === 'end' ? 'inline-end' : icon === 'none' ? undefined : 'inline-start';

  const content = (
    <>
      {icon === 'start' ? <PlusIcon data-icon="inline-start" /> : null}
      {icon === 'spinner' ? <Spinner data-icon="inline-start" /> : null}
      Label
      {icon === 'end' ? <ArrowRightIcon data-icon="inline-end" /> : null}
    </>
  );

  return (
    <PlaygroundPanel
      preview={
        asLink ? (
          <a
            className={buttonVariants({ variant, size, roundness })}
            href="#"
            data-icon={dataIcon}
          >
            {content}
          </a>
        ) : (
          <Button
            variant={variant}
            size={size}
            roundness={roundness}
            disabled={disabled}
            data-icon={dataIcon}
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
            label="Shape"
            value={roundness}
            options={ROUNDNESSES.map(({ roundness: r, label }) => ({
              value: r,
              label,
            }))}
            onChange={setRoundness}
            fullWidth
          />

          <InlineSegmentedControl
            label="Icon"
            value={icon}
            options={ICON_OPTIONS}
            onChange={setIcon}
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
      title="Text Button"
      description={
        <>
          Fabely Text Button from the Figma Button set — eight variants, five sizes, and
          Roundrect / Round. Styles use Foundations tokens (Primary gradient, Fia / error
          raw swatches, theme-alpha, focus-ring effects). Sibling:{' '}
          <code>IconButton</code> under Primitives/Button/Icon Button.
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
          <PrimitiveGalleryItem label="Shape">
            <ShapeExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Figma Matrix">
            <FigmaMatrixExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="With Icon">
            <WithIconExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Spinner">
            <SpinnerExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Disabled">
            <DisabledExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Pressed">
            <PressedExample />
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
            Prefer <code>variant</code>, <code>size</code>, and <code>roundness</code> over
            one-off visual classes — all three map to the Figma Button set.
          </li>
          <li>
            <code>primary</code> is a Foundations gradient (<code>--gradient-primary-*</code>),
            not solid <code>--primary</code>. It keeps a rest-strength focus ring; keyboard focus
            uses the full primary ring.
          </li>
          <li>
            Tertiary has a quiet border; Ghost does not — they are separate variants (unlike
            Badge, where ghost mapped to Tertiary).
          </li>
          <li>
            Icons: pass an SVG child and set <code>data-icon=&quot;inline-start&quot;</code> or{' '}
            <code>&quot;inline-end&quot;</code>. For icon-only actions use{' '}
            <code>IconButton</code> (Primitives/Button/Icon Button) — it requires{' '}
            <code>aria-label</code>.
          </li>
          <li>
            <strong>Do not use</strong> <code>{"<Button render={<a />} />"}</code> for links. Use{' '}
            <code>buttonVariants</code> on a plain <code>&lt;a&gt;</code> (see As Link). Button
            Link is a separate Figma component.
          </li>
        </ul>
      }
      accessibility={
        <ul className="list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
          <li>
            Icon-leading / trailing buttons still need clear label text. Pure icon-only
            controls belong on <code>IconButton</code> with a required{' '}
            <code>aria-label</code>.
          </li>
          <li>
            Decorative icons: <code>aria-hidden=&quot;true&quot;</code>. Spinner exposes{' '}
            <code>role=&quot;status&quot;</code>.
          </li>
          <li>
            Prefer native <code>disabled</code> so focus and pointer events are suppressed.
          </li>
          <li>
            Links that look like buttons must stay real links (<code>&lt;a href&gt;</code> +{' '}
            <code>buttonVariants</code>).
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

export const Shape: Story = {
  render: () => <ShapeExample />,
};

export const FigmaMatrix: Story = {
  render: () => <FigmaMatrixExample />,
};

export const WithIcon: Story = {
  render: () => <WithIconExample />,
};

export const SpinnerStory: Story = {
  name: 'Spinner',
  render: () => <SpinnerExample />,
};

export const Disabled: Story = {
  render: () => <DisabledExample />,
};

export const Pressed: Story = {
  render: () => <PressedExample />,
};

export const AsLink: Story = {
  render: () => <AsLinkExample />,
};

export const RTL: Story = {
  render: () => <RtlExample />,
};
