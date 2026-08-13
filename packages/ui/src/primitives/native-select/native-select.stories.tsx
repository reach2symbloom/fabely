import type { Meta, StoryObj } from '@storybook/react-vite';
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
  FieldError,
  FieldLabel,
} from '../field';

import {
  NativeSelect,
  NativeSelectOptGroup,
  NativeSelectOption,
} from './native-select';

/**
 * Component Storybook IA (see docs/DESIGN.md "Component Story Structure"):
 * Native HTML select with Input-aligned Foundations chrome. Prefer Select for
 * designed popups; this is for OS pickers / simple forms.
 */

const meta = {
  title: 'Design System/Primitives/Native Select',
  component: NativeSelect,
  tags: ['ai-generated'],
  parameters: { layout: 'centered' },
} satisfies Meta;

export default meta;
type Story = StoryObj;

function FruitOptions() {
  return (
    <>
      <NativeSelectOption value="">Select a fruit</NativeSelectOption>
      <NativeSelectOption value="apple">Apple</NativeSelectOption>
      <NativeSelectOption value="banana">Banana</NativeSelectOption>
      <NativeSelectOption value="blueberry">Blueberry</NativeSelectOption>
      <NativeSelectOption value="pineapple">Pineapple</NativeSelectOption>
    </>
  );
}

function DefaultExample() {
  return (
    <NativeSelect defaultValue="apple" aria-label="Fruit">
      <FruitOptions />
    </NativeSelect>
  );
}

function GroupsExample() {
  return (
    <NativeSelect defaultValue="frontend" aria-label="Department">
      <NativeSelectOptGroup label="Engineering">
        <NativeSelectOption value="frontend">Frontend</NativeSelectOption>
        <NativeSelectOption value="backend">Backend</NativeSelectOption>
        <NativeSelectOption value="devops">DevOps</NativeSelectOption>
      </NativeSelectOptGroup>
      <NativeSelectOptGroup label="Sales">
        <NativeSelectOption value="sales-rep">Sales Rep</NativeSelectOption>
        <NativeSelectOption value="account-manager">
          Account Manager
        </NativeSelectOption>
        <NativeSelectOption value="sales-director">
          Sales Director
        </NativeSelectOption>
      </NativeSelectOptGroup>
      <NativeSelectOptGroup label="Other">
        <NativeSelectOption value="support">Customer Support</NativeSelectOption>
        <NativeSelectOption value="product">Product Manager</NativeSelectOption>
        <NativeSelectOption value="ops">Operations Manager</NativeSelectOption>
      </NativeSelectOptGroup>
    </NativeSelect>
  );
}

function DisabledExample() {
  return (
    <NativeSelect disabled defaultValue="apple" aria-label="Fruit">
      <FruitOptions />
    </NativeSelect>
  );
}

function InvalidExample() {
  return (
    <Field data-invalid>
      <FieldLabel htmlFor="native-select-invalid">Error state</FieldLabel>
      <FieldContent>
        <NativeSelect
          id="native-select-invalid"
          aria-invalid
          defaultValue="apple"
        >
          <FruitOptions />
        </NativeSelect>
        <FieldError>Please choose a different option.</FieldError>
      </FieldContent>
    </Field>
  );
}

function RtlExample() {
  return (
    <div dir="rtl">
      <NativeSelect defaultValue="todo" aria-label="الحالة">
        <NativeSelectOption value="">اختر الحالة</NativeSelectOption>
        <NativeSelectOption value="todo">مهام</NativeSelectOption>
        <NativeSelectOption value="progress">قيد التنفيذ</NativeSelectOption>
        <NativeSelectOption value="done">منجز</NativeSelectOption>
        <NativeSelectOption value="cancelled">ملغي</NativeSelectOption>
      </NativeSelect>
    </div>
  );
}

function NativeSelectPlayground() {
  const [size, setSize] = useState<'sm' | 'default'>('default');
  const [disabled, setDisabled] = useState(false);
  const [invalid, setInvalid] = useState(false);

  return (
    <PlaygroundPanel
      preview={
        <NativeSelect
          size={size}
          disabled={disabled}
          aria-invalid={invalid || undefined}
          aria-label="Fruit"
          defaultValue="apple"
        >
          <FruitOptions />
        </NativeSelect>
      }
      controls={
        <div className={PRIMITIVE_PLAYGROUND_CONTROL_GRID}>
          <InlineSegmentedControl
            label="Size"
            value={size}
            options={[
              { value: 'sm', label: 'Sm' },
              { value: 'default', label: 'Default' },
            ]}
            onChange={(v) => setSize(v as 'sm' | 'default')}
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
      title="Native Select"
      description={
        <>
          Native <code>&lt;select&gt;</code> with Input-aligned Foundations
          chrome. Use for OS pickers and simple forms; prefer{' '}
          <code>Select</code> for designed popups.
        </>
      }
      playground={<NativeSelectPlayground />}
      variants={
        <div className="flex flex-wrap gap-6">
          <PrimitiveGalleryItem label="Default">
            <DefaultExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Groups">
            <GroupsExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Disabled">
            <DisabledExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Invalid">
            <InvalidExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="RTL">
            <RtlExample />
          </PrimitiveGalleryItem>
        </div>
      }
      usageGuidance={
        <ul className="list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
          <li>
            Good for settings-style fields, mobile system menus, and lightweight
            forms — not only &quot;system settings.&quot;
          </li>
          <li>
            Reach for custom <code>Select</code> when you need ListItem rows,
            animations, or non-native chrome.
          </li>
          <li>
            Pair with <code>Field</code> + <code>aria-invalid</code> for errors.
          </li>
        </ul>
      }
      accessibility={
        <ul className="list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
          <li>
            Real native control — keyboard and AT behave like the platform
            select.
          </li>
          <li>
            Always provide an accessible name (<code>aria-label</code> or{' '}
            <code>FieldLabel</code> / <code>htmlFor</code>).
          </li>
          <li>
            Chevron is decorative (<code>aria-hidden</code>).
          </li>
        </ul>
      }
    />
  ),
};

export const Default: Story = {
  render: () => <DefaultExample />,
};

export const Groups: Story = {
  render: () => <GroupsExample />,
};

export const Disabled: Story = {
  render: () => <DisabledExample />,
};

export const Invalid: Story = {
  render: () => <InvalidExample />,
};

export const Rtl: Story = {
  render: () => <RtlExample />,
};
