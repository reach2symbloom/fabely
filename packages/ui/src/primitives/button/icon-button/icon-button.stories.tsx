import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { PlusIcon } from 'lucide-react';
import {
  IconButton,
  type IconButtonRoundness,
  type IconButtonSize,
  type IconButtonVariant,
} from './icon-button';
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
 * example pages. Library master: shared Button variants including outline.
 */

const meta = {
  title: 'Design System/Primitives/Button/Icon Button',
  component: IconButton,
  tags: ['ai-generated'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

const VARIANTS: { variant: IconButtonVariant; label: string }[] = [
  { variant: 'primary', label: 'Primary' },
  { variant: 'primaryOutline', label: 'Primary outline' },
  { variant: 'secondary', label: 'Secondary' },
  { variant: 'tertiary', label: 'Tertiary' },
  { variant: 'ghost', label: 'Ghost' },
  { variant: 'fade', label: 'Fade' },
  { variant: 'fadeGold', label: 'Fade gold' },
  { variant: 'destructive', label: 'Destructive' },
  { variant: 'fiaFilled', label: 'Fia filled' },
  { variant: 'fiaOutline', label: 'Fia Outline' },
  { variant: 'outline', label: 'Outline' },
];

const SIZES: { size: IconButtonSize; label: string }[] = [
  { size: 'mini', label: 'Mini' },
  { size: 'sm', label: 'Small' },
  { size: 'default', label: 'Default' },
  { size: 'lg', label: 'Large' },
];

const ROUNDNESSES: { roundness: IconButtonRoundness; label: string }[] = [
  { roundness: 'default', label: 'Roundrect' },
  { roundness: 'round', label: 'Round' },
];

/* ---------- Canonical examples ---------- */

function DefaultExample() {
  return (
    <IconButton aria-label="Add">
      <PlusIcon />
    </IconButton>
  );
}

function VariantsExample() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {VARIANTS.map(({ variant, label }) => (
        <IconButton key={variant} variant={variant} aria-label={label}>
          <PlusIcon />
        </IconButton>
      ))}
    </div>
  );
}

function SizesExample() {
  return (
    <div className="flex flex-wrap items-end gap-4">
      {SIZES.map(({ size, label }) => (
        <div key={size} className="flex flex-col items-center gap-2">
          <IconButton size={size} aria-label={label}>
            <PlusIcon />
          </IconButton>
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
            {SIZES.map(({ size }) => (
              <IconButton
                key={`${roundness}-${size}`}
                roundness={roundness}
                size={size}
                aria-label={`${label} ${size}`}
              >
                <PlusIcon />
              </IconButton>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function DisabledExample() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {VARIANTS.map(({ variant, label }) => (
        <IconButton key={variant} variant={variant} disabled aria-label={label}>
          <PlusIcon />
        </IconButton>
      ))}
    </div>
  );
}

function PressedExample() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {VARIANTS.map(({ variant, label }) => (
        <IconButton key={variant} variant={variant} data-pressed aria-label={label}>
          <PlusIcon />
        </IconButton>
      ))}
    </div>
  );
}

function MatrixExample() {
  return (
    <div className="flex flex-col gap-6">
      {SIZES.map(({ size, label }) => (
        <div key={size}>
          <p className="mb-3 font-sans text-xs text-muted-foreground">Size: {label}</p>
          <div className="flex flex-wrap items-center gap-3">
            {VARIANTS.map(({ variant, label: vLabel }) => (
              <IconButton
                key={variant}
                variant={variant}
                size={size}
                aria-label={`${vLabel} ${label}`}
              >
                <PlusIcon />
              </IconButton>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ---------- Playground ---------- */

function IconButtonPlayground() {
  const [variant, setVariant] = useState<IconButtonVariant>('primary');
  const [size, setSize] = useState<IconButtonSize>('default');
  const [roundness, setRoundness] = useState<IconButtonRoundness>('default');
  const [disabled, setDisabled] = useState(false);

  return (
    <PlaygroundPanel
      preview={
        <IconButton
          variant={variant}
          size={size}
          roundness={roundness}
          disabled={disabled}
          aria-label="Add"
        >
          <PlusIcon />
        </IconButton>
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
            label="Disabled"
            value={disabled ? 'on' : 'off'}
            options={[
              { value: 'off', label: 'Off' },
              { value: 'on', label: 'On' },
            ]}
            onChange={(v) => setDisabled(v === 'on')}
            fullWidth
          />
        </div>
      }
    />
  );
}

/* ---------- Overview ---------- */

export const Overview: Story = {
  args: { 'aria-label': 'Add' },
  parameters: { layout: 'fullscreen' },
  render: () => (
    <PrimitivePage
      title="Icon Button"
      description={
        <>
          Icon-only control unified with Button — shared variant styles and interaction
          model. Size slots share vocabulary
          with Button; values are Icon Button’s own (24 / 32 / 36 / 40). Library is master
          over Figma’s five-variant subset.
        </>
      }
      playground={<IconButtonPlayground />}
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
          <PrimitiveGalleryItem label="Matrix">
            <MatrixExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Disabled">
            <DisabledExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Pressed">
            <PressedExample />
          </PrimitiveGalleryItem>
        </div>
      }
      usageGuidance={
        <ul className="list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
          <li>
            Always pass <code>aria-label</code> — there is no visible text.
          </li>
          <li>
            Prefer a single Lucide SVG child. Size comes from the <code>size</code> slot’s{' '}
            <code>--icon-*</code> token; do not hardcode icon px.
          </li>
          <li>
            Shared Button variants plus Icon-only <code>fade</code> /{' '}
            <code>fadeGold</code> (Figma Fade button): rest icon at switch-40,
            hover/pressed full opacity, no fill. <code>fadeGold</code> paints{' '}
            <code>--primary</code> on hover. Quiet hover/pressed and
            Destructive match Button (library master).
          </li>
          <li>
            Size names align with Button where slots overlap (<code>mini</code>,{' '}
            <code>default</code>); dimensions do not — see DESIGN.md “Size slots”.
          </li>
        </ul>
      }
      accessibility={
        <ul className="list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
          <li>
            <code>aria-label</code> is required in the TypeScript API.
          </li>
          <li>
            Decorative? Still needs a name for the action — label the <em>action</em>, not the
            glyph (“Add”, not “Plus”).
          </li>
          <li>
            Prefer native <code>disabled</code> so focus and pointer events are suppressed.
          </li>
        </ul>
      }
    />
  ),
};

/* ---------- Individual example pages ---------- */

export const Default: Story = {
  args: { 'aria-label': 'Add' },
  render: () => <DefaultExample />,
};

export const Variants: Story = {
  args: { 'aria-label': 'Add' },
  render: () => <VariantsExample />,
};

export const Sizes: Story = {
  args: { 'aria-label': 'Add' },
  render: () => <SizesExample />,
};

export const Shape: Story = {
  args: { 'aria-label': 'Add' },
  render: () => <ShapeExample />,
};

export const Matrix: Story = {
  args: { 'aria-label': 'Add' },
  render: () => <MatrixExample />,
};

export const Disabled: Story = {
  args: { 'aria-label': 'Add' },
  render: () => <DisabledExample />,
};

export const Pressed: Story = {
  args: { 'aria-label': 'Add' },
  render: () => <PressedExample />,
};
