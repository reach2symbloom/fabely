import type { Meta, StoryObj } from '@storybook/react-vite';
import { RefreshCwIcon } from 'lucide-react';
import { useState } from 'react';

import { InlineSegmentedControl } from '../../../stories/InlineSegmentedControl';
import { PlaygroundPanel } from '../../../stories/PlaygroundPanel';
import {
  PRIMITIVE_PLAYGROUND_CONTROL_GRID,
  PrimitiveGalleryItem,
  PrimitivePage,
} from '../../../stories/PrimitivePage';
import { Button } from '../button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../card';
import { DirectionProvider } from '../direction';
import { Field, FieldDescription, FieldLabel } from '../field';

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
  REGEXP_ONLY_DIGITS,
  REGEXP_ONLY_DIGITS_AND_CHARS,
} from './input-otp';
import type { InputOTPSize } from './input-otp';

/**
 * Component Storybook IA (see docs/DESIGN.md "Component Story Structure"):
 * Overview first — Playground, Variants gallery, usage, a11y — then focused
 * example pages. Figma Input OTP + shadcn Input OTP guide.
 */

const meta = {
  title: 'Design System/Primitives/Input OTP',
  component: InputOTP,
  tags: ['ai-generated'],
  parameters: { layout: 'centered' },
} satisfies Meta;

export default meta;
type Story = StoryObj;

function SixSlots({
  invalid,
  size = 'default',
}: {
  invalid?: boolean;
  size?: InputOTPSize;
}) {
  return (
    <InputOTP maxLength={6} size={size}>
      <InputOTPGroup>
        <InputOTPSlot index={0} aria-invalid={invalid || undefined} />
        <InputOTPSlot index={1} aria-invalid={invalid || undefined} />
        <InputOTPSlot index={2} aria-invalid={invalid || undefined} />
      </InputOTPGroup>
      <InputOTPSeparator />
      <InputOTPGroup>
        <InputOTPSlot index={3} aria-invalid={invalid || undefined} />
        <InputOTPSlot index={4} aria-invalid={invalid || undefined} />
        <InputOTPSlot index={5} aria-invalid={invalid || undefined} />
      </InputOTPGroup>
    </InputOTP>
  );
}

function playgroundOutcome({
  size,
  state,
  digits,
  separated,
}: {
  size: InputOTPSize;
  state: 'empty' | 'value' | 'invalid' | 'disabled';
  digits: 4 | 6;
  separated: boolean;
}): string {
  const sizeBit =
    size === 'default'
      ? ''
      : size === 'mini'
        ? 'compact '
        : `${size} `;
  const shape = separated
    ? `${digits}-digit code with a gap between groups`
    : `${digits}-digit PIN in one connected group`;
  let stateBit = '';
  if (state === 'invalid') {
    stateBit =
      ' — error turns slot borders red and uses the soft error focus ring';
  } else if (state === 'disabled') {
    stateBit = ' — disabled so the whole control looks dimmed';
  } else if (state === 'value') {
    stateBit = ' — showing a sample code';
  }
  return `A ${sizeBit}${shape}${stateBit}.`;
}

function InputOTPPlayground() {
  const [size, setSize] = useState<InputOTPSize>('default');
  const [state, setState] = useState<
    'empty' | 'value' | 'invalid' | 'disabled'
  >('empty');
  const [digits, setDigits] = useState<4 | 6>(6);
  const [separated, setSeparated] = useState(true);

  const invalid = state === 'invalid';
  const disabled = state === 'disabled';
  const value =
    state === 'value' || state === 'invalid'
      ? digits === 4
        ? '1234'
        : '123456'
      : undefined;
  const outcome = playgroundOutcome({ size, state, digits, separated });

  const slots = Array.from({ length: digits }, (_, i) => (
    <InputOTPSlot key={i} index={i} aria-invalid={invalid || undefined} />
  ));

  return (
    <PlaygroundPanel
      preview={
        <div className="flex flex-col items-start gap-[var(--spacing-sm)]">
          <InputOTP
            maxLength={digits}
            size={size}
            value={value}
            disabled={disabled}
            pattern={REGEXP_ONLY_DIGITS}
          >
            {separated && digits === 6 ? (
              <>
                <InputOTPGroup>{slots.slice(0, 3)}</InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>{slots.slice(3)}</InputOTPGroup>
              </>
            ) : (
              <InputOTPGroup>{slots}</InputOTPGroup>
            )}
          </InputOTP>
          <p className="max-w-xs text-start font-[family-name:var(--font-family-body)] text-[length:var(--text-paragraph-mini-regular-font-size)] leading-[var(--text-paragraph-mini-regular-line-height)] text-[color:var(--muted-foreground)]">
            {outcome}
          </p>
        </div>
      }
      controls={
        <div className={PRIMITIVE_PLAYGROUND_CONTROL_GRID}>
          <div className="col-span-2">
            <InlineSegmentedControl
              label="Size"
              value={size}
              onChange={(v) => setSize(v as InputOTPSize)}
              options={[
                { value: 'mini', label: 'Mini' },
                { value: 'small', label: 'Small' },
                { value: 'default', label: 'Default' },
                { value: 'large', label: 'Large' },
              ]}
            />
          </div>
          <div className="col-span-2">
            <InlineSegmentedControl
              label="State"
              value={state}
              onChange={(v) =>
                setState(v as 'empty' | 'value' | 'invalid' | 'disabled')
              }
              options={[
                { value: 'empty', label: 'Empty' },
                { value: 'value', label: 'Value' },
                { value: 'invalid', label: 'Error' },
                { value: 'disabled', label: 'Disabled' },
              ]}
            />
          </div>
          <InlineSegmentedControl
            label="Digits"
            value={String(digits)}
            onChange={(v) => setDigits(Number(v) as 4 | 6)}
            options={[
              { value: '4', label: '4' },
              { value: '6', label: '6' },
            ]}
          />
          <InlineSegmentedControl
            label="Groups"
            value={separated ? 'split' : 'joined'}
            onChange={(v) => setSeparated(v === 'split')}
            options={[
              { value: 'joined', label: 'Joined' },
              { value: 'split', label: 'Split' },
            ]}
          />
        </div>
      }
    />
  );
}

function PatternExample() {
  return (
    <InputOTP maxLength={6} pattern={REGEXP_ONLY_DIGITS}>
      <InputOTPGroup>
        <InputOTPSlot index={0} />
        <InputOTPSlot index={1} />
        <InputOTPSlot index={2} />
        <InputOTPSlot index={3} />
        <InputOTPSlot index={4} />
        <InputOTPSlot index={5} />
      </InputOTPGroup>
    </InputOTP>
  );
}

function SeparatorExample() {
  return <SixSlots />;
}

function DisabledExample() {
  return (
    <InputOTP maxLength={6} disabled value="123456">
      <InputOTPGroup>
        <InputOTPSlot index={0} />
        <InputOTPSlot index={1} />
        <InputOTPSlot index={2} />
      </InputOTPGroup>
      <InputOTPSeparator />
      <InputOTPGroup>
        <InputOTPSlot index={3} />
        <InputOTPSlot index={4} />
        <InputOTPSlot index={5} />
      </InputOTPGroup>
    </InputOTP>
  );
}

function ControlledExample() {
  const [value, setValue] = useState('');
  return (
    <div className="flex flex-col items-start gap-[var(--spacing-sm)]">
      <InputOTP maxLength={6} value={value} onChange={setValue}>
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
        </InputOTPGroup>
        <InputOTPSeparator />
        <InputOTPGroup>
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>
      <p className="text-[length:var(--text-paragraph-mini-regular-font-size)] text-[color:var(--muted-foreground)]">
        Value: {value || '—'}
      </p>
    </div>
  );
}

function InvalidExample() {
  return <SixSlots invalid />;
}

function FourDigitsExample() {
  return (
    <InputOTP maxLength={4} pattern={REGEXP_ONLY_DIGITS}>
      <InputOTPGroup>
        <InputOTPSlot index={0} />
        <InputOTPSlot index={1} />
        <InputOTPSlot index={2} />
        <InputOTPSlot index={3} />
      </InputOTPGroup>
    </InputOTP>
  );
}

function AlphanumericExample() {
  return (
    <InputOTP maxLength={6} pattern={REGEXP_ONLY_DIGITS_AND_CHARS}>
      <InputOTPGroup>
        <InputOTPSlot index={0} />
        <InputOTPSlot index={1} />
        <InputOTPSlot index={2} />
      </InputOTPGroup>
      <InputOTPSeparator />
      <InputOTPGroup>
        <InputOTPSlot index={3} />
        <InputOTPSlot index={4} />
        <InputOTPSlot index={5} />
      </InputOTPGroup>
    </InputOTP>
  );
}

/** Form layout — Fill width (override fixed `size-*` square). */
const FORM_OTP_SLOT_FILL =
  'h-[length:var(--spacing-3xl)] min-w-0 w-auto flex-1 grow';

function FormExample() {
  return (
    <Card bordered className="mx-auto w-full max-w-[400px]">
      <form
        className="contents"
        onSubmit={(e) => e.preventDefault()}
      >
        <CardHeader>
          <CardTitle>Verify your login</CardTitle>
          <CardDescription>
            Enter the verification code we sent to your email address:{' '}
            <span className="[font-weight:var(--text-paragraph-small-medium-font-weight)] text-[color:var(--foreground)]">
              m@example.com
            </span>
            .
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Field className="gap-[var(--spacing-sm)]">
            <div className="flex items-center justify-between gap-[var(--spacing-sm)]">
              <FieldLabel htmlFor="otp-verification">
                Verification code
              </FieldLabel>
              <Button
                type="button"
                variant="outline"
                size="mini"
                roundness="default"
                /* Mini + --rounded-lg reads as a pill; keep roundrect corners. */
                className="rounded-[length:var(--rounded-sm)]"
              >
                <RefreshCwIcon data-icon="inline-start" />
                Resend Code
              </Button>
            </div>
            <InputOTP
              maxLength={6}
              id="otp-verification"
              required
              size="large"
              pattern={REGEXP_ONLY_DIGITS}
              containerClassName="w-full"
            >
              {/* Figma Fill — equal-width slots; keep Large height. */}
              <InputOTPGroup className="min-w-0 flex-1">
                <InputOTPSlot index={0} className={FORM_OTP_SLOT_FILL} />
                <InputOTPSlot index={1} className={FORM_OTP_SLOT_FILL} />
                <InputOTPSlot index={2} className={FORM_OTP_SLOT_FILL} />
              </InputOTPGroup>
              <InputOTPSeparator className="mx-[var(--spacing-2xs)] shrink-0" />
              <InputOTPGroup className="min-w-0 flex-1">
                <InputOTPSlot index={3} className={FORM_OTP_SLOT_FILL} />
                <InputOTPSlot index={4} className={FORM_OTP_SLOT_FILL} />
                <InputOTPSlot index={5} className={FORM_OTP_SLOT_FILL} />
              </InputOTPGroup>
            </InputOTP>
            <FieldDescription>
              <a
                href="#otp-email-help"
                className="underline underline-offset-4 transition-colors hover:text-[color:var(--foreground)]"
              >
                I no longer have access to this email address.
              </a>
            </FieldDescription>
          </Field>
        </CardContent>
        <CardFooter className="flex-col items-stretch gap-[var(--spacing-sm)]">
          <Button type="submit" className="w-full">
            Verify
          </Button>
          <p className="text-center text-[length:var(--text-paragraph-small-regular-font-size)] leading-[var(--text-paragraph-small-regular-line-height)] text-[color:var(--muted-foreground)]">
            Having trouble signing in?{' '}
            <a
              href="#otp-support"
              className="underline underline-offset-4 transition-colors hover:text-[color:var(--foreground)]"
            >
              Contact support
            </a>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}

function RtlExample() {
  return (
    <DirectionProvider direction="rtl">
      <div dir="rtl" className="flex flex-col items-start gap-[var(--spacing-sm)]">
        <Field>
          <FieldLabel>رمز التحقق</FieldLabel>
          <SixSlots />
        </Field>
      </div>
    </DirectionProvider>
  );
}

function SizesExample() {
  return (
    <div className="flex flex-col items-start gap-[var(--spacing-md)]">
      {(['mini', 'small', 'default', 'large'] as const).map((size) => (
        <div key={size} className="flex flex-col gap-[var(--spacing-2xs)]">
          <span className="text-[length:var(--text-paragraph-mini-regular-font-size)] text-[color:var(--muted-foreground)]">
            {size}
          </span>
          <SixSlots size={size} />
        </div>
      ))}
    </div>
  );
}

export const Overview: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => (
    <PrimitivePage
      title="Input OTP"
      description="Connected OTP / PIN slots from Figma Input OTP (140:11468). Size ladder Mini→Large; focus and error rings match Foundations."
      playground={<InputOTPPlayground />}
      variants={
        <div className="flex flex-wrap gap-[var(--spacing-md)]">
          <PrimitiveGalleryItem label="Pattern (digits)">
            <PatternExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Separator">
            <SeparatorExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Disabled">
            <DisabledExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Controlled">
            <ControlledExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Invalid">
            <InvalidExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Four digits">
            <FourDigitsExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Alphanumeric">
            <AlphanumericExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Sizes">
            <SizesExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="RTL">
            <RtlExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Form" fill>
            <FormExample />
          </PrimitiveGalleryItem>
        </div>
      }
      usageGuidance={
        <ul className="list-disc space-y-2 ps-5 text-sm text-muted-foreground">
          <li>
            Compose <code>InputOTPGroup</code> + <code>InputOTPSlot</code>; use{' '}
            <code>InputOTPSeparator</code> between digit groups.
          </li>
          <li>
            Prefer <code>pattern=&#123;REGEXP_ONLY_DIGITS&#125;</code> for SMS
            codes and PINs.
          </li>
          <li>
            Mark every slot <code>aria-invalid</code> when the code is wrong so
            borders and the active ring go error.
          </li>
        </ul>
      }
      accessibility={
        <ul className="list-disc space-y-2 ps-5 text-sm text-muted-foreground">
          <li>
            One hidden input owns typing and paste; slots are the visible cells.
          </li>
          <li>
            Pair with Field label / description (and FieldError when invalid).
          </li>
        </ul>
      }
    />
  ),
};

export const Pattern: Story = {
  render: () => <PatternExample />,
};

export const Separator: Story = {
  render: () => <SeparatorExample />,
};

export const Disabled: Story = {
  render: () => <DisabledExample />,
};

export const Controlled: Story = {
  render: () => <ControlledExample />,
};

export const Invalid: Story = {
  render: () => <InvalidExample />,
};

export const FourDigits: Story = {
  name: 'Four Digits',
  render: () => <FourDigitsExample />,
};

export const Alphanumeric: Story = {
  render: () => <AlphanumericExample />,
};

export const Form: Story = {
  parameters: { layout: 'padded' },
  render: () => <FormExample />,
};

export const RTL: Story = {
  render: () => <RtlExample />,
};

export const Sizes: Story = {
  render: () => <SizesExample />,
};
