import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState, type ReactNode } from 'react';
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxCollection,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
  ComboboxSeparator,
  ComboboxTrigger,
  ComboboxValue,
  useComboboxAnchor,
} from './combobox';
import { Button } from '../button';
import { InlineSegmentedControl } from '../../../stories/InlineSegmentedControl';
import { PlaygroundPanel } from '../../../stories/PlaygroundPanel';
import {
  PRIMITIVE_PLAYGROUND_CONTROL_GRID,
  PrimitiveGalleryItem,
  PrimitivePage,
} from '../../../stories/PrimitivePage';

/**
 * Component Storybook IA (see docs/DESIGN.md "Component Story Structure"):
 * Overview first — Playground, Variants, usage, a11y — then focused pages
 * aligned with shadcn Combobox docs + Figma Select & Combobox field chrome.
 *
 * Deferred: Input Group addon, Size/Ghost field axes (README → Deferred).
 */

const meta = {
  title: 'Design System/Primitives/Combobox',
  component: Combobox,
  tags: ['ai-generated'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Combobox>;

export default meta;
type Story = StoryObj<typeof meta>;

const FRAMEWORKS = [
  'Next.js',
  'SvelteKit',
  'Nuxt.js',
  'Remix',
  'Astro',
] as const;

type Framework = { label: string; value: string };

const FRAMEWORK_OBJECTS: Framework[] = [
  { label: 'Next.js', value: 'next' },
  { label: 'SvelteKit', value: 'sveltekit' },
  { label: 'Nuxt', value: 'nuxt' },
  { label: 'Remix', value: 'remix' },
  { label: 'Astro', value: 'astro' },
];

const TIMEZONES = [
  {
    value: 'Americas',
    items: ['(GMT-5) New York', '(GMT-8) Los Angeles', '(GMT-6) Chicago'],
  },
  {
    value: 'Europe',
    items: ['(GMT+0) London', '(GMT+1) Paris', '(GMT+1) Berlin'],
  },
  {
    value: 'Asia/Pacific',
    items: ['(GMT+9) Tokyo', '(GMT+8) Singapore', '(GMT+11) Sydney'],
  },
] as const;

function LimitationNotice({ children }: { children: ReactNode }) {
  return (
    <div className="flex gap-2 rounded-lg border border-dashed border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
      <span aria-hidden="true">⚠️</span>
      <span>{children}</span>
    </div>
  );
}

/* ---------- Canonical examples ---------- */

function BasicExample({
  disabled,
  invalid,
  showClear,
  autoHighlight,
}: {
  disabled?: boolean;
  invalid?: boolean;
  showClear?: boolean;
  autoHighlight?: boolean;
} = {}) {
  return (
    <Combobox
      items={[...FRAMEWORKS]}
      disabled={disabled}
      autoHighlight={autoHighlight}
    >
      <ComboboxInput
        placeholder="Select a framework"
        disabled={disabled}
        aria-invalid={invalid || undefined}
        showClear={showClear}
        className="w-72"
      />
      <ComboboxContent>
        <ComboboxEmpty>No items found.</ComboboxEmpty>
        <ComboboxList>
          {(item) => (
            <ComboboxItem key={item} value={item}>
              {item}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}

function MultipleExample() {
  const anchor = useComboboxAnchor();
  const [value, setValue] = useState<string[]>([]);

  return (
    <Combobox
      items={[...FRAMEWORKS]}
      multiple
      value={value}
      onValueChange={(next) => setValue(next as string[])}
    >
      {/* Anchor the popup to the chips field so width stays stable as chips wrap. */}
      <ComboboxChips ref={anchor} className="w-72">
        <ComboboxValue>
          {(values) => (
            <>
              {(values as string[]).map((item) => (
                <ComboboxChip key={item}>{item}</ComboboxChip>
              ))}
              <ComboboxChipsInput placeholder="Add framework" />
            </>
          )}
        </ComboboxValue>
      </ComboboxChips>
      <ComboboxContent anchor={anchor}>
        <ComboboxEmpty>No items found.</ComboboxEmpty>
        <ComboboxList>
          {(item) => (
            <ComboboxItem key={item} value={item}>
              {item}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}

function GroupsExample() {
  return (
    <Combobox items={[...TIMEZONES]}>
      <ComboboxInput placeholder="Select a timezone" className="w-80" />
      <ComboboxContent>
        <ComboboxEmpty>No timezones found.</ComboboxEmpty>
        <ComboboxList>
          {(group, index) => (
            <ComboboxGroup key={group.value} items={group.items}>
              <ComboboxLabel>{group.value}</ComboboxLabel>
              <ComboboxCollection>
                {(item) => (
                  <ComboboxItem key={item} value={item}>
                    {item}
                  </ComboboxItem>
                )}
              </ComboboxCollection>
              {index < TIMEZONES.length - 1 ? <ComboboxSeparator /> : null}
            </ComboboxGroup>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}

function CustomItemsExample() {
  return (
    <Combobox
      items={FRAMEWORK_OBJECTS}
      itemToStringValue={(framework: Framework) => framework.label}
    >
      <ComboboxInput placeholder="Select a framework" className="w-72" />
      <ComboboxContent>
        <ComboboxEmpty>No items found.</ComboboxEmpty>
        <ComboboxList>
          {(framework: Framework) => (
            <ComboboxItem key={framework.value} value={framework}>
              <span className="flex min-w-0 flex-col">
                <span>{framework.label}</span>
                <span className="text-[length:var(--text-paragraph-mini-regular-font-size)] text-muted-foreground">
                  {framework.value}
                </span>
              </span>
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}

function PopupExample() {
  return (
    <Combobox items={[...FRAMEWORKS]}>
      <ComboboxTrigger
        render={<Button variant="outline" size="small" />}
        className="gap-[var(--spacing-xs)]"
      >
        Select framework
      </ComboboxTrigger>
      <ComboboxContent className="min-w-56">
        <div className="p-[var(--spacing-xs)] pb-0">
          <ComboboxInput
            showTrigger={false}
            placeholder="Search…"
            className="w-full"
          />
        </div>
        <ComboboxEmpty>No items found.</ComboboxEmpty>
        <ComboboxList>
          {(item) => (
            <ComboboxItem key={item} value={item}>
              {item}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}

function RtlExample() {
  const items = ['التكنولوجيا', 'التصميم', 'المنتج', 'التسويق'] as const;

  return (
    <div dir="rtl">
      <Combobox items={[...items]}>
        <ComboboxInput placeholder="الفئات" className="w-72" />
        <ComboboxContent>
          <ComboboxEmpty>لا توجد نتائج.</ComboboxEmpty>
          <ComboboxList>
            {(item) => (
              <ComboboxItem key={item} value={item}>
                {item}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </div>
  );
}

/* ---------- Playground ---------- */

type PlaygroundVariant =
  | 'basic'
  | 'multiple'
  | 'clear'
  | 'groups'
  | 'invalid'
  | 'disabled';

function ComboboxPlayground() {
  const [variant, setVariant] = useState<PlaygroundVariant>('basic');

  let preview: ReactNode;
  switch (variant) {
    case 'multiple':
      preview = <MultipleExample />;
      break;
    case 'clear':
      preview = <BasicExample showClear />;
      break;
    case 'groups':
      preview = <GroupsExample />;
      break;
    case 'invalid':
      preview = <BasicExample invalid />;
      break;
    case 'disabled':
      preview = <BasicExample disabled />;
      break;
    default:
      preview = <BasicExample />;
  }

  return (
    <PlaygroundPanel
      preview={preview}
      controls={
        <div className={PRIMITIVE_PLAYGROUND_CONTROL_GRID}>
          <div className="col-span-2">
            <InlineSegmentedControl
              label="Composition"
              value={variant}
              onChange={setVariant}
              options={[
                { value: 'basic', label: 'Basic' },
                { value: 'multiple', label: 'Multiple' },
                { value: 'clear', label: 'Clear' },
                { value: 'groups', label: 'Groups' },
                { value: 'invalid', label: 'Invalid' },
                { value: 'disabled', label: 'Disabled' },
              ]}
              fullWidth
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
      title="Combobox"
      description={
        <>
          Autocomplete input with suggestions. Foundations field chrome from
          Figma Select & Combobox; popup rows via ListItem. API matches{' '}
          <a
            href="https://ui.shadcn.com/docs/components/base/combobox"
            className="underline underline-offset-4"
          >
            shadcn Combobox
          </a>
          .
        </>
      }
      playground={<ComboboxPlayground />}
      variants={
        <div className="flex flex-wrap gap-4">
          <PrimitiveGalleryItem label="Basic">
            <BasicExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Multiple">
            <MultipleExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Clear Button">
            <BasicExample showClear />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Groups">
            <GroupsExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Custom Items">
            <CustomItemsExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Invalid">
            <BasicExample invalid />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Disabled">
            <BasicExample disabled />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Auto Highlight">
            <BasicExample autoHighlight />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Popup">
            <PopupExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="RTL">
            <RtlExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Input Group">
            <div className="flex max-w-sm flex-col gap-3">
              <LimitationNotice>
                Input Group addon composition deferred until Input Group is
                Foundations-matched.
              </LimitationNotice>
              <BasicExample />
            </div>
          </PrimitiveGalleryItem>
        </div>
      }
      usageGuidance={
        <ul className="list-disc space-y-2 ps-5 text-sm text-muted-foreground">
          <li>
            Pass <code>items</code> on <code>Combobox</code>; render list items
            with a function child on <code>ComboboxList</code>.
          </li>
          <li>
            Use <code>itemToStringValue</code> when items are objects; use{' '}
            <code>multiple</code> + chips for multi-select.
          </li>
          <li>
            Trigger glyph is Chevrons up-down (Figma Combobox decoration), not
            a single chevron.
          </li>
        </ul>
      }
      accessibility={
        <ul className="list-disc space-y-2 ps-5 text-sm text-muted-foreground">
          <li>
            Pair with a visible FieldLabel in product; set{' '}
            <code>aria-invalid</code> for errors.
          </li>
          <li>Clear and chip-remove controls expose accessible names.</li>
        </ul>
      }
    />
  ),
};

export const Basic: Story = {
  render: () => <BasicExample />,
};

export const Multiple: Story = {
  render: () => <MultipleExample />,
};

export const ClearButton: Story = {
  name: 'Clear Button',
  render: () => <BasicExample showClear />,
};

export const Groups: Story = {
  render: () => <GroupsExample />,
};

export const CustomItems: Story = {
  name: 'Custom Items',
  render: () => <CustomItemsExample />,
};

export const Invalid: Story = {
  render: () => <BasicExample invalid />,
};

export const Disabled: Story = {
  render: () => <BasicExample disabled />,
};

export const AutoHighlight: Story = {
  name: 'Auto Highlight',
  render: () => <BasicExample autoHighlight />,
};

export const Popup: Story = {
  render: () => <PopupExample />,
};

export const RTL: Story = {
  name: 'RTL',
  render: () => <RtlExample />,
};
