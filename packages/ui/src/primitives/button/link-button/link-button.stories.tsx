import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { ArrowRightIcon, PlusIcon } from 'lucide-react';
import {
  ButtonLink,
  buttonLinkVariants,
  type ButtonLinkSize,
  type ButtonLinkVariant,
} from './link-button';
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
 * example pages. Figma Link Button set `11:2014`.
 */

const meta = {
  title: 'Design System/Primitives/Button/Link Button',
  component: ButtonLink,
  tags: ['ai-generated'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof ButtonLink>;

export default meta;
type Story = StoryObj<typeof meta>;

const VARIANTS: { variant: ButtonLinkVariant; label: string }[] = [
  { variant: 'tertiary', label: 'Tertiary' },
  { variant: 'secondary', label: 'Secondary' },
  { variant: 'primary', label: 'Primary' },
  { variant: 'fia', label: 'Fia' },
];

const SIZES: { size: ButtonLinkSize; label: string }[] = [
  { size: 'mini', label: 'Mini' },
  { size: 'default', label: 'Default' },
  { size: 'lg', label: 'Large' },
];

/* ---------- Canonical examples ---------- */

function DefaultExample() {
  return <ButtonLink>Label</ButtonLink>;
}

function VariantsExample() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      {VARIANTS.map(({ variant, label }) => (
        <ButtonLink key={variant} variant={variant}>
          {label}
        </ButtonLink>
      ))}
    </div>
  );
}

function SizesExample() {
  return (
    <div className="flex flex-wrap items-end gap-4">
      {SIZES.map(({ size, label }) => (
        <div key={size} className="flex flex-col items-center gap-2">
          <ButtonLink size={size}>Label</ButtonLink>
          <span className="font-sans text-xs text-muted-foreground">{label}</span>
        </div>
      ))}
    </div>
  );
}

function WithIconExample() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <ButtonLink>
        <PlusIcon />
        Add
      </ButtonLink>
      <ButtonLink variant="secondary">
        Next
        <ArrowRightIcon />
      </ButtonLink>
      <ButtonLink variant="fia">
        <PlusIcon />
        Label
        <ArrowRightIcon />
      </ButtonLink>
    </div>
  );
}

function HoverUnderlineExample() {
  return (
    <div className="flex flex-col gap-3">
      <p className="font-sans text-xs text-muted-foreground">
        Hover or press — underline only (color unchanged).
      </p>
      <div className="flex flex-wrap items-center gap-4">
        {VARIANTS.map(({ variant, label }) => (
          <ButtonLink key={variant} variant={variant}>
            {label}
          </ButtonLink>
        ))}
      </div>
    </div>
  );
}

function PressedExample() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      {VARIANTS.map(({ variant, label }) => (
        <ButtonLink key={variant} variant={variant} data-pressed>
          {label}
        </ButtonLink>
      ))}
    </div>
  );
}

function DisabledExample() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      {VARIANTS.map(({ variant, label }) => (
        <ButtonLink key={variant} variant={variant} disabled>
          {label}
        </ButtonLink>
      ))}
    </div>
  );
}

/** `buttonLinkVariants` on a plain `<a>` — not `render={<a />}`. */
function AsAnchorExample() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <a className={buttonLinkVariants({ variant: 'tertiary' })} href="#">
        Tertiary link
      </a>
      <a className={buttonLinkVariants({ variant: 'secondary' })} href="#">
        Secondary link
      </a>
      <a className={buttonLinkVariants({ variant: 'primary' })} href="#">
        Primary link
      </a>
      <a className={buttonLinkVariants({ variant: 'fia' })} href="#">
        Fia link
      </a>
    </div>
  );
}

function MatrixExample() {
  return (
    <div className="flex flex-col gap-6">
      {SIZES.map(({ size, label }) => (
        <div key={size}>
          <p className="mb-3 font-sans text-xs text-muted-foreground">Size: {label}</p>
          <div className="flex flex-wrap items-center gap-4">
            {VARIANTS.map(({ variant, label: vLabel }) => (
              <ButtonLink key={variant} variant={variant} size={size}>
                {vLabel}
              </ButtonLink>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ---------- Playground ---------- */

const ICON_OPTIONS: { value: 'none' | 'start' | 'end' | 'both'; label: string }[] = [
  { value: 'none', label: 'None' },
  { value: 'start', label: 'Start' },
  { value: 'end', label: 'End' },
  { value: 'both', label: 'Both' },
];

function LinkButtonPlayground() {
  const [variant, setVariant] = useState<ButtonLinkVariant>('tertiary');
  const [size, setSize] = useState<ButtonLinkSize>('default');
  const [icon, setIcon] = useState<'none' | 'start' | 'end' | 'both'>('none');
  const [disabled, setDisabled] = useState(false);
  const [asAnchor, setAsAnchor] = useState(false);

  const content = (
    <>
      {icon === 'start' || icon === 'both' ? <PlusIcon /> : null}
      Label
      {icon === 'end' || icon === 'both' ? <ArrowRightIcon /> : null}
    </>
  );

  return (
    <PlaygroundPanel
      preview={
        asAnchor ? (
          <a className={buttonLinkVariants({ variant, size })} href="#">
            {content}
          </a>
        ) : (
          <ButtonLink variant={variant} size={size} disabled={disabled}>
            {content}
          </ButtonLink>
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
            label="As &lt;a&gt;"
            value={asAnchor ? 'on' : 'off'}
            options={[
              { value: 'off', label: 'Button' },
              { value: 'on', label: 'Anchor' },
            ]}
            onChange={(v) => setAsAnchor(v === 'on')}
            fullWidth
          />
        </div>
      }
    />
  );
}

/* ---------- Stories ---------- */

export const Overview: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => (
    <PrimitivePage
      title="Link Button"
      description={
        <>
          Text action with underline on hover and pressed. No fill or border
          chrome — Figma Link Button set (<code>11:2014</code>). Sibling of Text
          and Icon Button; does not reuse <code>buttonVariantClasses</code>.
        </>
      }
      playground={<LinkButtonPlayground />}
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
          <PrimitiveGalleryItem label="With icon">
            <WithIconExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Hover / underline">
            <HoverUnderlineExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Pressed">
            <PressedExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Disabled">
            <DisabledExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="As anchor">
            <AsAnchorExample />
          </PrimitiveGalleryItem>
        </div>
      }
      usageGuidance={
        <ul className="list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
          <li>
            Use for in-flow text actions (show more, inline CTAs). Prefer Text /
            Icon Button when you need filled or outlined chrome.
          </li>
          <li>
            Real navigation: put <code>buttonLinkVariants</code> on an{' '}
            <code>&lt;a&gt;</code> — do not use <code>render=&#123;&lt;a /&gt;&#125;</code>.
          </li>
          <li>
            Hover and pressed only add underline; colors stay on the Style axis.
          </li>
          <li>
            Figma Size=Small maps to <code>default</code> (no <code>sm</code> —
            hug height collapsed Small/Default). See README for nested instances.
          </li>
        </ul>
      }
      accessibility={
        <ul className="list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
          <li>
            <code>ButtonLink</code> is a button control — use for actions, not
            document navigation.
          </li>
          <li>
            Prefer a real <code>&lt;a href&gt;</code> (with{' '}
            <code>buttonLinkVariants</code>) when the destination is a URL.
          </li>
          <li>Focus uses the secondary focus ring token.</li>
        </ul>
      }
    />
  ),
};

export const Default: Story = {
  render: () => <DefaultExample />,
};

export const Variants: Story = {
  render: () => <VariantsExample />,
};

export const Sizes: Story = {
  render: () => <SizesExample />,
};

export const WithIcon: Story = {
  name: 'With Icon',
  render: () => <WithIconExample />,
};

export const Matrix: Story = {
  render: () => <MatrixExample />,
};

export const Disabled: Story = {
  render: () => <DisabledExample />,
};

export const Pressed: Story = {
  render: () => <PressedExample />,
};

export const AsAnchor: Story = {
  name: 'As Anchor',
  render: () => <AsAnchorExample />,
};
