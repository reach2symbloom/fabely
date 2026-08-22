import type { Meta, StoryObj } from '@storybook/react-vite';
import { InfoIcon, SearchIcon, XIcon } from 'lucide-react';
import { useState } from 'react';

import { InlineSegmentedControl } from '../../../stories/InlineSegmentedControl';
import { PlaygroundPanel } from '../../../stories/PlaygroundPanel';
import {
  PRIMITIVE_PLAYGROUND_CONTROL_GRID,
  PrimitiveGalleryItem,
  PrimitivePage,
} from '../../../stories/PrimitivePage';
import { Badge } from '../badge';
import { Button } from '../button';
import { ButtonGroup } from '../button-group';
import { DirectionProvider } from '../direction';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '../field';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '../input-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../select';

import { Input } from './input';
import type { InputProps } from './input';

/**
 * Component Storybook IA (see docs/DESIGN.md "Component Story Structure"):
 * Overview first — Playground, Variants gallery, usage, a11y — then focused
 * example pages from the shadcn Input guide + Figma Input axes.
 */

type InputSize = NonNullable<InputProps['size']>;
type InputRoundness = NonNullable<InputProps['roundness']>;
type InputVariant = NonNullable<InputProps['variant']>;

const meta = {
  title: 'Design System/Primitives/Input',
  component: Input,
  tags: ['ai-generated'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

/* ---------- Canonical examples ---------- */

function BasicExample() {
  return (
    <div className="w-full max-w-xs">
      <Input placeholder="Email" type="email" />
    </div>
  );
}

function FieldExample() {
  return (
    <div className="flex w-full max-w-xs flex-col gap-4">
      <Field>
        <FieldLabel htmlFor="input-username">Username</FieldLabel>
        <Input id="input-username" placeholder="shadcn" autoComplete="username" />
        <FieldDescription>
          Choose a unique username for your account.
        </FieldDescription>
      </Field>
    </div>
  );
}

function FieldGroupExample() {
  return (
    <div className="flex w-full max-w-xs flex-col gap-4">
      <form
        className="flex flex-col gap-4"
        onSubmit={(event) => event.preventDefault()}
      >
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="input-name">Name</FieldLabel>
            <Input id="input-name" placeholder="Evil Rabbit" autoComplete="name" />
          </Field>
          <Field>
            <FieldLabel htmlFor="input-email">Email</FieldLabel>
            <Input
              id="input-email"
              type="email"
              placeholder="hello@fabely.com"
              autoComplete="email"
            />
            <FieldDescription>
              We&apos;ll send updates to this address.
            </FieldDescription>
          </Field>
        </FieldGroup>
        <div className="flex gap-2">
          <Button type="button" variant="outline">
            Reset
          </Button>
          <Button type="submit">Submit</Button>
        </div>
      </form>
    </div>
  );
}

function DisabledExample() {
  return (
    <div className="flex w-full max-w-xs flex-col gap-4">
      <Field data-disabled>
        <FieldLabel htmlFor="input-disabled">Email</FieldLabel>
        <Input
          id="input-disabled"
          type="email"
          placeholder="hello@fabely.com"
          disabled
        />
        <FieldDescription>This field is currently disabled.</FieldDescription>
      </Field>
    </div>
  );
}

function InvalidExample() {
  return (
    <div className="flex w-full max-w-xs flex-col gap-4">
      <Field data-invalid>
        <FieldLabel htmlFor="input-invalid">Invalid Input</FieldLabel>
        <Input
          id="input-invalid"
          defaultValue="not-an-email"
          aria-invalid
        />
        <FieldError>This field contains validation errors.</FieldError>
      </Field>
    </div>
  );
}

function FileExample() {
  return (
    <div className="flex w-full max-w-xs flex-col gap-4">
      <Field>
        <FieldLabel htmlFor="input-file">Picture</FieldLabel>
        <Input id="input-file" type="file" />
        <FieldDescription>Select a picture to upload.</FieldDescription>
      </Field>
    </div>
  );
}

function InlineExample() {
  return (
    <div className="flex w-full max-w-xs flex-col gap-4">
      <Field orientation="horizontal">
        <FieldLabel htmlFor="input-inline">Search</FieldLabel>
        <div className="flex flex-1 gap-2">
          <Input id="input-inline" placeholder="Query…" className="flex-1" />
          <Button type="button">Search</Button>
        </div>
      </Field>
    </div>
  );
}

function GridExample() {
  return (
    <div className="grid w-full max-w-md grid-cols-2 gap-4">
      <Field>
        <FieldLabel htmlFor="input-first">First Name</FieldLabel>
        <Input id="input-first" placeholder="Evil" autoComplete="given-name" />
      </Field>
      <Field>
        <FieldLabel htmlFor="input-last">Last Name</FieldLabel>
        <Input id="input-last" placeholder="Rabbit" autoComplete="family-name" />
      </Field>
    </div>
  );
}

function RequiredExample() {
  return (
    <div className="flex w-full max-w-xs flex-col gap-4">
      <Field>
        <FieldLabel htmlFor="input-required">
          Required Field <span className="text-destructive">*</span>
        </FieldLabel>
        <Input id="input-required" required placeholder="Required" />
        <FieldDescription>This field must be filled out.</FieldDescription>
      </Field>
    </div>
  );
}

function BadgeExample() {
  return (
    <div className="flex w-full max-w-xs flex-col gap-4">
      <Field>
        <FieldLabel htmlFor="input-badge" className="flex items-center gap-2">
          Webhook URL
          <Badge variant="secondary">Beta</Badge>
        </FieldLabel>
        <Input
          id="input-badge"
          placeholder="https://example.com/webhook"
          type="url"
        />
      </Field>
    </div>
  );
}

function InputGroupExample() {
  return (
    <div className="flex w-full max-w-xs flex-col gap-4">
      <Field>
        <FieldLabel htmlFor="input-group-url">Website URL</FieldLabel>
        <InputGroup>
          <InputGroupAddon>
            <InfoIcon />
          </InputGroupAddon>
          <InputGroupInput
            id="input-group-url"
            placeholder="example.com"
          />
          <InputGroupAddon align="inline-end">https://</InputGroupAddon>
        </InputGroup>
      </Field>
    </div>
  );
}

function ButtonGroupExample() {
  return (
    <div className="flex w-full max-w-xs flex-col gap-4">
      <Field>
        <FieldLabel htmlFor="input-button-group">Search</FieldLabel>
        <ButtonGroup aria-label="Search">
          <Input
            id="input-button-group"
            placeholder="Search…"
            className="min-w-0 flex-1"
          />
          <Button type="button">Search</Button>
        </ButtonGroup>
      </Field>
    </div>
  );
}

function FormExample() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <form
        className="flex flex-col gap-4"
        onSubmit={(event) => event.preventDefault()}
      >
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="form-name">Name</FieldLabel>
            <Input id="form-name" placeholder="Evil Rabbit" autoComplete="name" />
          </Field>
          <Field>
            <FieldLabel htmlFor="form-email">Email</FieldLabel>
            <Input
              id="form-email"
              type="email"
              placeholder="hello@fabely.com"
              autoComplete="email"
            />
            <FieldDescription>
              We&apos;ll never share your email with anyone.
            </FieldDescription>
          </Field>
          <Field>
            <FieldLabel htmlFor="form-phone">Phone</FieldLabel>
            <Input id="form-phone" type="tel" placeholder="+1 555 000 0000" />
          </Field>
          <Field>
            <FieldLabel htmlFor="form-country">Country</FieldLabel>
            <Select defaultValue="us">
              <SelectTrigger id="form-country" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="us">United States</SelectItem>
                <SelectItem value="ca">Canada</SelectItem>
                <SelectItem value="mx">Mexico</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <FieldLabel htmlFor="form-address">Address</FieldLabel>
            <Input
              id="form-address"
              placeholder="123 Main St"
              autoComplete="street-address"
            />
          </Field>
        </FieldGroup>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline">
            Cancel
          </Button>
          <Button type="submit">Submit</Button>
        </div>
      </form>
    </div>
  );
}

function RtlExample() {
  return (
    <DirectionProvider direction="rtl">
      <div dir="rtl" className="flex w-full max-w-xs flex-col gap-4">
        <Field>
          <FieldLabel htmlFor="input-rtl">مفتاح API</FieldLabel>
          <Input id="input-rtl" placeholder="sk_live_…" />
          <FieldDescription>
            مفتاح API الخاص بك مشفر ومخزن بأمان.
          </FieldDescription>
        </Field>
      </div>
    </DirectionProvider>
  );
}

function SizesExample() {
  const sizes: { size: InputSize; label: string }[] = [
    { size: 'mini', label: 'Mini' },
    { size: 'small', label: 'Small' },
    { size: 'default', label: 'Regular' },
    { size: 'large', label: 'Large' },
  ];
  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      {sizes.map(({ size, label }) => (
        <div key={size} className="flex flex-col gap-1">
          <span className="text-xs text-muted-foreground">{label}</span>
          <Input size={size} placeholder={`${label} input`} />
        </div>
      ))}
    </div>
  );
}

function RoundnessExample() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      <Input roundness="default" placeholder="Default roundness" />
      <Input roundness="round" placeholder="Round" />
    </div>
  );
}

function VariantsExample() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      <Input variant="default" placeholder="Default style" />
      <Input variant="ghost" placeholder="Ghost style" />
      <Input variant="quiet" placeholder="Quiet style" />
    </div>
  );
}

function DecorationsExample() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      {(
        [
          ['mini', 'Mini'],
          ['small', 'Small'],
          ['default', 'Regular'],
          ['large', 'Large'],
        ] as const
      ).map(([size, label]) => (
        <div key={size} className="flex flex-col gap-1">
          <span className="text-xs text-muted-foreground">{label}</span>
          <Input
            size={size}
            placeholder={`${label} search`}
            decorationLeft={<SearchIcon />}
            decorationRight={<XIcon />}
          />
        </div>
      ))}
    </div>
  );
}

function InputPlayground() {
  const [variant, setVariant] = useState<InputVariant>('default');
  const [size, setSize] = useState<InputSize>('default');
  const [roundness, setRoundness] = useState<InputRoundness>('default');
  const [state, setState] = useState<'empty' | 'value' | 'invalid' | 'disabled'>(
    'empty',
  );
  const [decorations, setDecorations] = useState<
    'none' | 'left' | 'right' | 'both'
  >('none');

  return (
    <PlaygroundPanel
      preview={
        <div className="w-full max-w-xs">
          <Input
            variant={variant}
            size={size}
            roundness={roundness}
            placeholder="Placeholder"
            defaultValue={state === 'value' || state === 'invalid' ? 'Ch 1:' : undefined}
            aria-invalid={state === 'invalid' || undefined}
            disabled={state === 'disabled'}
            decorationLeft={
              decorations === 'left' || decorations === 'both' ? (
                <SearchIcon />
              ) : undefined
            }
            decorationRight={
              decorations === 'right' || decorations === 'both' ? (
                <XIcon />
              ) : undefined
            }
          />
        </div>
      }
      controls={
        <div className={PRIMITIVE_PLAYGROUND_CONTROL_GRID}>
          <InlineSegmentedControl
            label="Style"
            value={variant}
            onChange={(value) => setVariant(value)}
            options={[
              { value: 'default', label: 'Default' },
              { value: 'ghost', label: 'Ghost' },
              { value: 'quiet', label: 'Quiet' },
            ]}
          />
          <InlineSegmentedControl
            label="Roundness"
            value={roundness}
            onChange={(value) => setRoundness(value)}
            options={[
              { value: 'default', label: 'Default' },
              { value: 'round', label: 'Round' },
            ]}
          />
          <div className="col-span-2">
            <InlineSegmentedControl
              label="Size"
              value={size}
              onChange={(value) => setSize(value)}
              options={[
                { value: 'mini', label: 'Mini' },
                { value: 'small', label: 'Small' },
                { value: 'default', label: 'Regular' },
                { value: 'large', label: 'Large' },
              ]}
            />
          </div>
          <div className="col-span-2">
            <InlineSegmentedControl
              label="State"
              value={state}
              onChange={(value) => setState(value)}
              options={[
                { value: 'empty', label: 'Empty' },
                { value: 'value', label: 'Value' },
                { value: 'invalid', label: 'Error' },
                { value: 'disabled', label: 'Disabled' },
              ]}
            />
          </div>
          <div className="col-span-2">
            <InlineSegmentedControl
              label="Decorations"
              value={decorations}
              onChange={(value) => setDecorations(value)}
              options={[
                { value: 'none', label: 'None' },
                { value: 'left', label: 'Left' },
                { value: 'right', label: 'Right' },
                { value: 'both', label: 'Both' },
              ]}
            />
          </div>
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
      title="Input"
      description="Text field from Figma Input — sizes, roundness, and Default / Ghost / Quiet style — with the shadcn Input API."
      playground={<InputPlayground />}
      variants={
        <div className="flex flex-col gap-8">
          <PrimitiveGalleryItem label="Sizes">
            <SizesExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Roundness">
            <RoundnessExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Style">
            <VariantsExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Decorations">
            <DecorationsExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="States">
            <div className="flex w-full max-w-xs flex-col gap-3">
              <Input placeholder="Placeholder" />
              <Input defaultValue="Value" />
              <Input defaultValue="Invalid" aria-invalid />
              <Input defaultValue="Disabled" disabled />
            </div>
          </PrimitiveGalleryItem>
        </div>
      }
      usageGuidance={
        <>
          <p>
            Use bare <code>Input</code> for the control chrome.{' '}
            <code>decorationLeft</code> / <code>decorationRight</code> are open
            slots (Figma Decorations) — Lucide icons now, Fade Button or similar
            later. Pair with <code>Field</code> for label / description / error,
            and <code>Input Group</code> for prepend / append text.
          </p>
          <p>
            <code>variant=&quot;quiet&quot;</code> is the in-chrome field: rest
            transparent, hover fills{' '}
            <code>--theme-alpha-black-switch-333</code>, focus is{' '}
            <code>--border</code> with no ring and no extra fill. Ghost fills
            only on focus and keeps the secondary ring.
          </p>
          <p>
            Mark validation with <code>aria-invalid</code> on the input (and{' '}
            <code>data-invalid</code> on Field when composing). Prefer{' '}
            <code>size=&quot;default&quot;</code> (Figma Regular) in forms.
          </p>
        </>
      }
      accessibility={
        <>
          <p>
            Always associate a visible or visually hidden label. Disabled
            inputs use <code>disabled</code>; invalid ones expose{' '}
            <code>aria-invalid</code> and an error message via FieldError or{' '}
            <code>aria-describedby</code>.
          </p>
          <p>
            Default and Ghost use the secondary focus ring; Quiet uses a
            semantic <code>--border</code> with no ring and no extra fill.
            Invalid focus uses the error ring. File inputs keep native file UI
            with Foundations type.
          </p>
        </>
      }
    />
  ),
};

export const Basic: Story = {
  render: () => <BasicExample />,
};

export const FieldStory: Story = {
  name: 'Field',
  render: () => <FieldExample />,
};

export const FieldGroupStory: Story = {
  name: 'Field Group',
  render: () => <FieldGroupExample />,
};

export const Disabled: Story = {
  render: () => <DisabledExample />,
};

export const Invalid: Story = {
  render: () => <InvalidExample />,
};

export const File: Story = {
  render: () => <FileExample />,
};

export const Inline: Story = {
  render: () => <InlineExample />,
};

export const Grid: Story = {
  render: () => <GridExample />,
};

export const Required: Story = {
  render: () => <RequiredExample />,
};

export const BadgeStory: Story = {
  name: 'Badge',
  render: () => <BadgeExample />,
};

export const InputGroupStory: Story = {
  name: 'Input Group',
  render: () => <InputGroupExample />,
};

export const ButtonGroupStory: Story = {
  name: 'Button Group',
  render: () => <ButtonGroupExample />,
};

export const Form: Story = {
  render: () => <FormExample />,
};

export const RTL: Story = {
  name: 'RTL',
  render: () => <RtlExample />,
};

export const Sizes: Story = {
  render: () => <SizesExample />,
};

export const Roundness: Story = {
  render: () => <RoundnessExample />,
};

export const Variants: Story = {
  name: 'Style',
  render: () => <VariantsExample />,
};

export const Decorations: Story = {
  render: () => <DecorationsExample />,
};
