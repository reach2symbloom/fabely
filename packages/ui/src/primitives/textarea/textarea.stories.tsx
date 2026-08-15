import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import { InlineSegmentedControl } from '../../../stories/InlineSegmentedControl';
import { PlaygroundPanel } from '../../../stories/PlaygroundPanel';
import {
  PRIMITIVE_PLAYGROUND_CONTROL_GRID,
  PrimitiveGalleryItem,
  PrimitivePage,
} from '../../../stories/PrimitivePage';
import { Button } from '../button';
import { DirectionProvider } from '../direction';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '../field';

import { Textarea } from './textarea';
import type { TextareaProps, TextareaTextStyle, TextareaVariant } from './textarea';

/**
 * Component Storybook IA (see docs/DESIGN.md "Component Story Structure"):
 * Overview first — Playground, Variants gallery, usage, a11y — then focused
 * example pages from the shadcn Textarea guide + Figma Textarea axes.
 */

type TextareaRoundness = NonNullable<TextareaProps['roundness']>;

function HeadingExample() {
  return (
    <div className="w-full max-w-md">
      <Textarea
        variant="quiet"
        textStyle="heading"
        resizable={false}
        aria-label="Book title"
        defaultValue="The Lumithra Prophecy and the Aurora Sorceress"
      />
    </div>
  );
}

const meta = {
  title: 'Design System/Primitives/Textarea',
  component: Textarea,
  tags: ['ai-generated'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

/* ---------- Canonical examples ---------- */

function BasicExample() {
  return (
    <div className="w-full max-w-xs">
      <Textarea placeholder="Type your message here." aria-label="Message" />
    </div>
  );
}

function FieldExample() {
  return (
    <div className="flex w-full max-w-xs flex-col gap-4">
      <Field>
        <FieldLabel htmlFor="textarea-message">Message</FieldLabel>
        <Textarea
          id="textarea-message"
          placeholder="Type your message here."
        />
        <FieldDescription>Enter your message below.</FieldDescription>
      </Field>
    </div>
  );
}

function DisabledExample() {
  return (
    <div className="flex w-full max-w-xs flex-col gap-4">
      <Field data-disabled>
        <FieldLabel htmlFor="textarea-disabled">Message</FieldLabel>
        <Textarea
          id="textarea-disabled"
          placeholder="Type your message here."
          defaultValue="Value"
          disabled
        />
      </Field>
    </div>
  );
}

function InvalidExample() {
  return (
    <div className="flex w-full max-w-xs flex-col gap-4">
      <Field data-invalid>
        <FieldLabel htmlFor="textarea-invalid">Message</FieldLabel>
        <Textarea
          id="textarea-invalid"
          defaultValue="Value"
          aria-invalid
        />
        <FieldDescription>Please enter a valid message.</FieldDescription>
        <FieldError>This field contains validation errors.</FieldError>
      </Field>
    </div>
  );
}

function ButtonExample() {
  return (
    <div className="flex w-full max-w-xs flex-col gap-4">
      <Textarea placeholder="Type your message here." aria-label="Message" />
      <Button type="button" className="w-fit">
        Send message
      </Button>
    </div>
  );
}

function CharacterCountExample() {
  return (
    <div className="w-full max-w-xs">
      <Textarea
        placeholder="Type your message here."
        aria-label="Message"
        showCharacterCount
        maxLength={500}
      />
    </div>
  );
}

function RoundExample() {
  return (
    <div className="w-full max-w-xs">
      <Textarea
        roundness="round"
        placeholder="Type your message here."
        aria-label="Message"
        defaultValue="Value"
      />
    </div>
  );
}

function RtlExample() {
  return (
    <DirectionProvider direction="rtl">
      <div dir="rtl" className="flex w-full max-w-xs flex-col gap-4">
        <Field>
          <FieldLabel htmlFor="textarea-rtl">التعليقات</FieldLabel>
          <Textarea
            id="textarea-rtl"
            placeholder="شاركنا أفكارك حول خدمتنا."
          />
          <FieldDescription>شاركنا أفكارك حول خدمتنا.</FieldDescription>
        </Field>
      </div>
    </DirectionProvider>
  );
}

function TextareaPlayground() {
  const [roundness, setRoundness] = useState<TextareaRoundness>('default');
  const [variant, setVariant] = useState<TextareaVariant>('default');
  const [textStyle, setTextStyle] = useState<TextareaTextStyle>('body');
  const [resizable, setResizable] = useState(true);
  const [disabled, setDisabled] = useState(false);
  const [invalid, setInvalid] = useState(false);
  const [showCharacterCount, setShowCharacterCount] = useState(false);

  return (
    <PlaygroundPanel
      preview={
        <div className="w-full max-w-md">
          <Textarea
            variant={variant}
            textStyle={textStyle}
            roundness={roundness}
            resizable={textStyle === 'heading' ? false : resizable}
            disabled={disabled}
            aria-invalid={invalid || undefined}
            showCharacterCount={showCharacterCount}
            maxLength={showCharacterCount ? 500 : undefined}
            placeholder={
              textStyle === 'heading' ? 'Book title' : 'Type your message here.'
            }
            aria-label={textStyle === 'heading' ? 'Book title' : 'Message'}
            defaultValue={
              textStyle === 'heading'
                ? 'The Lumithra Prophecy and the Aurora Sorceress'
                : undefined
            }
          />
        </div>
      }
      controls={
        <div className={PRIMITIVE_PLAYGROUND_CONTROL_GRID}>
          <InlineSegmentedControl
            label="Variant"
            value={variant}
            options={[
              { value: 'default', label: 'Default' },
              { value: 'ghost', label: 'Ghost' },
              { value: 'quiet', label: 'Quiet' },
            ]}
            onChange={(v) => setVariant(v as TextareaVariant)}
            fullWidth
          />
          <InlineSegmentedControl
            label="Type"
            value={textStyle}
            options={[
              { value: 'body', label: 'Body' },
              { value: 'heading', label: 'Heading' },
            ]}
            onChange={(v) => setTextStyle(v as TextareaTextStyle)}
            fullWidth
          />
          <InlineSegmentedControl
            label="Roundness"
            value={roundness}
            options={[
              { value: 'default', label: 'Default' },
              { value: 'round', label: 'Round' },
            ]}
            onChange={(v) => setRoundness(v as TextareaRoundness)}
            fullWidth
          />
          <InlineSegmentedControl
            label="Resizable"
            value={resizable ? 'on' : 'off'}
            options={[
              { value: 'off', label: 'Off' },
              { value: 'on', label: 'On' },
            ]}
            onChange={(v) => setResizable(v === 'on')}
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
            label="Invalid"
            value={invalid ? 'on' : 'off'}
            options={[
              { value: 'off', label: 'Off' },
              { value: 'on', label: 'On' },
            ]}
            onChange={(v) => setInvalid(v === 'on')}
            fullWidth
          />
          <InlineSegmentedControl
            label="Character count"
            value={showCharacterCount ? 'on' : 'off'}
            options={[
              { value: 'off', label: 'Off' },
              { value: 'on', label: 'On' },
            ]}
            onChange={(v) => setShowCharacterCount(v === 'on')}
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
      title="Textarea"
      description={
        <>
          Multi-line field from Figma{' '}
          <a
            href="https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=16-1745"
            target="_blank"
            rel="noreferrer"
          >
            Textarea
          </a>{' '}
          with the{' '}
          <a
            href="https://ui.shadcn.com/docs/components/base/textarea"
            target="_blank"
            rel="noreferrer"
          >
            shadcn Textarea
          </a>{' '}
          API. Labels and helpers compose via Field.
        </>
      }
      playground={<TextareaPlayground />}
      variants={
        <div className="flex flex-wrap gap-6">
          <PrimitiveGalleryItem label="Default">
            <BasicExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Field">
            <FieldExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Disabled">
            <DisabledExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Invalid">
            <InvalidExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="With button">
            <ButtonExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Character count">
            <CharacterCountExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Round">
            <RoundExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Heading (quiet)">
            <HeadingExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="RTL">
            <RtlExample />
          </PrimitiveGalleryItem>
        </div>
      }
      usageGuidance={
        <ul className="list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
          <li>
            Pair with <code>Field</code>, <code>FieldLabel</code>, and{' '}
            <code>FieldDescription</code> for labeled forms.
          </li>
          <li>
            Use <code>InputGroupTextarea</code> inside Input Group so the shell
            owns chrome; bare control stays unstyled there.
          </li>
          <li>
            <code>showCharacterCount</code> needs <code>maxLength</code>.
          </li>
          <li>
            <code>variant</code> matches Input (<code>default</code> /{' '}
            <code>ghost</code> / <code>quiet</code>). Quiet heading titles use{' '}
            <code>textStyle=&quot;heading&quot;</code> and{' '}
            <code>resizable=&#123;false&#125;</code> — wraps, no grip.
          </li>
          <li>
            <code>resizable</code> maps to CSS <code>resize-y</code> (Figma grip
            is not redrawn — browser handle).
          </li>
          <li>
            Focus uses a Primary gradient border (mask-composite ring on the
            shell), not a gradient fill. Input Group suppresses that ring.
          </li>
        </ul>
      }
      accessibility={
        <ul className="list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
          <li>
            Always provide an accessible name (<code>aria-label</code> or{' '}
            <code>FieldLabel</code> / <code>htmlFor</code>).
          </li>
          <li>
            Invalid: <code>data-invalid</code> on Field +{' '}
            <code>aria-invalid</code> on the control.
          </li>
          <li>
            Disabled: <code>data-disabled</code> on Field +{' '}
            <code>disabled</code> on the control.
          </li>
          <li>
            Character count uses <code>aria-live=&quot;polite&quot;</code>.
          </li>
        </ul>
      }
    />
  ),
};

export const Default: Story = {
  render: () => <BasicExample />,
};

export const FieldStory: Story = {
  name: 'Field',
  render: () => <FieldExample />,
};

export const Disabled: Story = {
  render: () => <DisabledExample />,
};

export const Invalid: Story = {
  render: () => <InvalidExample />,
};

export const WithButton: Story = {
  name: 'Button',
  render: () => <ButtonExample />,
};

export const CharacterCount: Story = {
  render: () => <CharacterCountExample />,
};

export const Round: Story = {
  render: () => <RoundExample />,
};

export const Heading: Story = {
  render: () => <HeadingExample />,
};

export const RTL: Story = {
  render: () => <RtlExample />,
};
