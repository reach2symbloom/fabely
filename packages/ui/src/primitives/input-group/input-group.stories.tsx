import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactNode } from 'react';
import {
  CopyIcon,
  CreditCardIcon,
  EyeOffIcon,
  InfoIcon,
  MailIcon,
  MoreHorizontalIcon,
  SearchIcon,
} from 'lucide-react';
import { useState } from 'react';

import { InlineSegmentedControl } from '../../../stories/InlineSegmentedControl';
import { PlaygroundPanel } from '../../../stories/PlaygroundPanel';
import {
  PRIMITIVE_PLAYGROUND_CONTROL_GRID,
  PrimitiveGalleryItem,
  PrimitivePage,
} from '../../../stories/PrimitivePage';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../dropdown-menu';
import { Kbd } from '../kbd';
import { Spinner } from '../spinner';

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from './input-group';
import type {
  InputGroupRoundness,
  InputGroupSize,
  InputGroupVariant,
} from './input-group';

/**
 * Component Storybook IA (see docs/DESIGN.md "Component Story Structure"):
 * Overview first — Playground, Variants gallery, usage, a11y — then focused
 * example pages. shadcn Input Group guide + Foundations Input chrome.
 */

const meta = {
  title: 'Design System/Primitives/Input Group',
  component: InputGroup,
  tags: ['ai-generated'],
  parameters: { layout: 'centered' },
} satisfies Meta;

export default meta;
type Story = StoryObj;

function LimitationNotice({ children }: { children: ReactNode }) {
  return (
    <p className="mb-[var(--spacing-sm)] max-w-md text-start text-[length:var(--text-paragraph-mini-regular-font-size)] text-[color:var(--muted-foreground)]">
      {children}
    </p>
  );
}

function DemoSearch() {
  return (
    <InputGroup className="w-80 max-w-full">
      <InputGroupInput placeholder="Search…" />
      <InputGroupAddon>
        <SearchIcon />
      </InputGroupAddon>
    </InputGroup>
  );
}

function AlignExample() {
  return (
    <div className="flex w-80 max-w-full flex-col gap-[var(--spacing-md)]">
      <InputGroup>
        <InputGroupInput placeholder="Inline start" />
        <InputGroupAddon align="inline-start">
          <SearchIcon />
        </InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <InputGroupInput placeholder="Inline end" />
        <InputGroupAddon align="inline-end">
          <EyeOffIcon />
        </InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <InputGroupInput placeholder="Full name" />
        <InputGroupAddon align="block-start">
          <InputGroupText>Header</InputGroupText>
        </InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <InputGroupInput placeholder="0.00" />
        <InputGroupAddon align="block-end">
          <InputGroupText>USD</InputGroupText>
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}

function IconExample() {
  return (
    <div className="flex w-80 max-w-full flex-col gap-[var(--spacing-md)]">
      <InputGroup>
        <InputGroupInput placeholder="Search…" />
        <InputGroupAddon>
          <SearchIcon />
        </InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <InputGroupInput placeholder="Email" />
        <InputGroupAddon align="inline-end">
          <MailIcon />
        </InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <InputGroupInput placeholder="Card number" />
        <InputGroupAddon align="inline-end">
          <CreditCardIcon />
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}

function TextExample() {
  return (
    <div className="flex w-80 max-w-full flex-col gap-[var(--spacing-md)]">
      {/* Figma Input — Prepend / Append muted text in shared shell */}
      <InputGroup>
        <InputGroupInput placeholder="Placeholder" />
        <InputGroupAddon>
          <InputGroupText>Prepend</InputGroupText>
        </InputGroupAddon>
        <InputGroupAddon align="inline-end">
          <InputGroupText>Append</InputGroupText>
        </InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <InputGroupInput defaultValue="Ch 1:" />
        <InputGroupAddon>
          <InputGroupText>$</InputGroupText>
        </InputGroupAddon>
        <InputGroupAddon align="inline-end">
          <InputGroupText>USD</InputGroupText>
        </InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <InputGroupInput placeholder="example" />
        <InputGroupAddon>
          <InputGroupText>https://</InputGroupText>
        </InputGroupAddon>
        <InputGroupAddon align="inline-end">
          <InputGroupText>.com</InputGroupText>
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}

function ButtonExample() {
  return (
    <div className="flex w-80 max-w-full flex-col gap-[var(--spacing-md)]">
      <InputGroup>
        <InputGroupInput placeholder="https://" />
        <InputGroupAddon align="inline-end">
          <InputGroupButton>Search</InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <InputGroupInput placeholder="Copy this" defaultValue="fabely.app" />
        <InputGroupAddon align="inline-end">
          <InputGroupButton size="icon-xs" aria-label="Copy" variant="ghost">
            <CopyIcon />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}

function KbdExample() {
  return (
    <div className="w-80 max-w-full">
      <LimitationNotice>
        Kbd addon — Foundations Kbd inside InputGroupAddon.
      </LimitationNotice>
      <InputGroup>
        <InputGroupInput placeholder="Search…" />
        <InputGroupAddon align="inline-end">
          <Kbd>⌘K</Kbd>
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}

function DropdownExample() {
  return (
    <InputGroup className="w-80 max-w-full">
      <InputGroupInput placeholder="Search in…" />
      <InputGroupAddon align="inline-end">
        <DropdownMenu>
          <DropdownMenuTrigger render={<InputGroupButton variant="ghost" />}>
            Search In…
            <MoreHorizontalIcon />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>All</DropdownMenuItem>
            <DropdownMenuItem>Files</DropdownMenuItem>
            <DropdownMenuItem>People</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </InputGroupAddon>
    </InputGroup>
  );
}

function SpinnerExample() {
  return (
    <div className="flex w-80 max-w-full flex-col gap-[var(--spacing-md)]">
      <InputGroup>
        <InputGroupInput placeholder="Saving…" disabled />
        <InputGroupAddon align="inline-end">
          <Spinner />
        </InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <InputGroupInput placeholder="Please wait…" disabled />
        <InputGroupAddon align="inline-end">
          <Spinner />
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}

function TextareaExample() {
  return (
    <div className="flex w-80 max-w-full flex-col gap-[var(--spacing-md)]">
      <InputGroup>
        <InputGroupTextarea placeholder="Write a message…" rows={4} />
        <InputGroupAddon align="block-end">
          <InputGroupText>0/280</InputGroupText>
          <InputGroupButton className="ms-auto" variant="primary" size="xs">
            Post
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <InputGroupTextarea placeholder="script.js" rows={3} />
        <InputGroupAddon
          align="block-start"
          className="border-b border-[color:var(--border)]"
        >
          <InputGroupText>
            <InfoIcon />
            script.js
          </InputGroupText>
          <InputGroupButton
            className="ms-auto"
            size="icon-xs"
            aria-label="Copy"
            variant="ghost"
          >
            <CopyIcon />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}

function RtlExample() {
  return (
    <div
      dir="rtl"
      className="flex w-80 max-w-full flex-col gap-[var(--spacing-md)]"
    >
      <InputGroup>
        <InputGroupInput placeholder="بحث…" />
        <InputGroupAddon>
          <SearchIcon />
        </InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <InputGroupInput placeholder="جاري الحفظ…" disabled />
        <InputGroupAddon align="inline-end">
          <Spinner />
        </InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <InputGroupTextarea placeholder="منطقة النص" rows={3} />
        <InputGroupAddon align="block-end">
          <InputGroupText>٠/٢٨٠</InputGroupText>
          <InputGroupButton className="ms-auto" variant="primary" size="xs">
            نشر
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}

type PlaygroundAddon = 'icon' | 'text' | 'button' | 'kbd' | 'spinner';
type PlaygroundSides = 'start' | 'end' | 'both' | 'block-start' | 'block-end';
type PlaygroundControl = 'input' | 'textarea';
type PlaygroundState = 'empty' | 'value' | 'invalid' | 'disabled';
type PlaygroundButtonKind = 'label' | 'icon';

function playgroundAddonContent(
  kind: PlaygroundAddon,
  side: 'start' | 'end',
  buttonKind: PlaygroundButtonKind,
) {
  if (kind === 'icon') {
    return side === 'start' ? <SearchIcon /> : <EyeOffIcon />;
  }
  if (kind === 'text') {
    return (
      <InputGroupText>{side === 'start' ? 'Prepend' : 'Append'}</InputGroupText>
    );
  }
  if (kind === 'button') {
    if (buttonKind === 'icon') {
      return (
        <InputGroupButton
          size="icon-xs"
          aria-label={side === 'start' ? 'Search' : 'Copy'}
          variant="ghost"
        >
          {side === 'start' ? <SearchIcon /> : <CopyIcon />}
        </InputGroupButton>
      );
    }
    return (
      <InputGroupButton>{side === 'start' ? 'Search' : 'Go'}</InputGroupButton>
    );
  }
  if (kind === 'kbd') {
    return side === 'end' ? <Kbd>⌘K</Kbd> : <SearchIcon />;
  }
  /* spinner */
  return <Spinner />;
}

/** One plain-language outcome line — only call out non-default / distinctive settings. */
function playgroundOutcome({
  size,
  variant,
  roundness,
  sides,
  addon,
  control,
  state,
  buttonKind,
}: {
  size: InputGroupSize;
  variant: InputGroupVariant;
  roundness: InputGroupRoundness;
  sides: PlaygroundSides;
  addon: PlaygroundAddon;
  control: PlaygroundControl;
  state: PlaygroundState;
  buttonKind: PlaygroundButtonKind;
}): string {
  const isBlock = sides === 'block-start' || sides === 'block-end';

  const field =
    control === 'textarea'
      ? 'textarea'
      : addon === 'icon' && (sides === 'start' || sides === 'both')
        ? 'search field'
        : 'text field';

  const shape =
    !isBlock && roundness === 'round'
      ? 'pill-shaped '
      : size === 'mini'
        ? 'compact '
        : size === 'large'
          ? 'large '
          : size === 'small'
            ? 'small '
            : '';

  const surface = variant === 'ghost' ? 'ghost ' : '';

  let addonPhrase = '';
  if (isBlock) {
    addonPhrase =
      sides === 'block-start'
        ? 'with a header strip (label + action) above the value'
        : 'with a footer strip (label + action) below the value';
  } else {
    const piece =
      addon === 'icon'
        ? 'icon'
        : addon === 'text'
          ? sides === 'end'
            ? 'muted Append label'
            : 'muted Prepend label'
          : addon === 'button'
            ? buttonKind === 'icon'
              ? 'icon button'
              : 'action button'
            : addon === 'kbd'
              ? 'keyboard shortcut'
              : 'loading spinner';
    if (sides === 'both') {
      addonPhrase = `with matching ${piece}s on both sides`;
    } else if (sides === 'start') {
      addonPhrase = `with a leading ${piece}`;
    } else {
      addonPhrase = `with a trailing ${piece}`;
    }
  }

  let statePhrase = '';
  if (state === 'invalid') {
    statePhrase =
      ' — error shows a red border, a soft red focus ring, and red addon icons';
  } else if (state === 'disabled') {
    statePhrase = ' — disabled so it looks dimmed and ignores clicks';
  } else if (state === 'value') {
    statePhrase = ' — showing a sample value';
  }

  let extra = '';
  if (variant === 'ghost' && state !== 'invalid') {
    extra = ' The fill only appears when focused.';
  } else if (!isBlock && addon === 'button') {
    extra = ' The button hugs the field with an even 2px inset.';
  } else if (isBlock) {
    extra = ' Block strips stay roundrect even if Round is selected.';
  } else if (!isBlock && (addon === 'kbd' || addon === 'spinner')) {
    extra = ' This addon is still thin-pass and may not match Foundations yet.';
  } else if (state === 'empty' && control === 'input' && addon === 'icon') {
    extra =
      ' Focus and error styles wrap the whole group, not just the typed text.';
  }

  return `A ${shape}${surface}${field} ${addonPhrase}${statePhrase}.${extra}`;
}

function InputGroupPlayground() {
  const [size, setSize] = useState<InputGroupSize>('default');
  const [variant, setVariant] = useState<InputGroupVariant>('default');
  const [roundness, setRoundness] =
    useState<InputGroupRoundness>('default');
  const [sides, setSides] = useState<PlaygroundSides>('start');
  const [addon, setAddon] = useState<PlaygroundAddon>('icon');
  const [control, setControl] = useState<PlaygroundControl>('input');
  const [state, setState] = useState<PlaygroundState>('empty');
  const [buttonKind, setButtonKind] =
    useState<PlaygroundButtonKind>('label');

  const isBlock = sides === 'block-start' || sides === 'block-end';
  const showStart = sides === 'start' || sides === 'both' || isBlock;
  const showEnd = sides === 'end' || sides === 'both';
  const effectiveRoundness = isBlock ? 'default' : roundness;
  const outcome = playgroundOutcome({
    size,
    variant,
    roundness: effectiveRoundness,
    sides,
    addon,
    control,
    state,
    buttonKind,
  });
  const controlProps = {
    placeholder: control === 'textarea' ? 'Write a message…' : 'Search…',
    defaultValue:
      state === 'value' || state === 'invalid'
        ? control === 'textarea'
          ? 'Draft note'
          : 'fabely.app'
        : undefined,
    'aria-invalid': state === 'invalid' || undefined,
    disabled: state === 'disabled',
  } as const;

  return (
    <PlaygroundPanel
      preview={
        <div className="flex w-80 max-w-full flex-col gap-[var(--spacing-sm)]">
          <InputGroup
            size={size}
            variant={variant}
            roundness={effectiveRoundness}
            className="w-full"
          >
            {control === 'textarea' ? (
              <InputGroupTextarea {...controlProps} rows={3} />
            ) : (
              <InputGroupInput {...controlProps} />
            )}
            {showStart ? (
              <InputGroupAddon
                align={isBlock ? sides : 'inline-start'}
                className={
                  sides === 'block-start'
                    ? 'border-b border-[color:var(--border)]'
                    : sides === 'block-end'
                      ? 'border-t border-[color:var(--border)]'
                      : undefined
                }
              >
                {isBlock ? (
                  <>
                    <InputGroupText>Label</InputGroupText>
                    <InputGroupButton
                      className="ms-auto"
                      size="icon-xs"
                      aria-label="Copy"
                      variant="ghost"
                    >
                      <CopyIcon />
                    </InputGroupButton>
                  </>
                ) : (
                  playgroundAddonContent(addon, 'start', buttonKind)
                )}
              </InputGroupAddon>
            ) : null}
            {showEnd ? (
              <InputGroupAddon align="inline-end">
                {playgroundAddonContent(addon, 'end', buttonKind)}
              </InputGroupAddon>
            ) : null}
          </InputGroup>
          <p className="text-start font-[family-name:var(--font-family-body)] text-[length:var(--text-paragraph-mini-regular-font-size)] leading-[var(--text-paragraph-mini-regular-line-height)] text-[color:var(--muted-foreground)]">
            {outcome}
          </p>
        </div>
      }
      controls={
        <div className={PRIMITIVE_PLAYGROUND_CONTROL_GRID}>
          <InlineSegmentedControl
            label="Size"
            value={size}
            onChange={(v) => setSize(v as InputGroupSize)}
            options={[
              { value: 'mini', label: 'Mini' },
              { value: 'small', label: 'Small' },
              { value: 'default', label: 'Default' },
              { value: 'large', label: 'Large' },
            ]}
          />
          <InlineSegmentedControl
            label="Variant"
            value={variant}
            onChange={(v) => setVariant(v as InputGroupVariant)}
            options={[
              { value: 'default', label: 'Default' },
              { value: 'ghost', label: 'Ghost' },
            ]}
          />
          <InlineSegmentedControl
            label="Roundness"
            value={roundness}
            onChange={(v) => setRoundness(v as InputGroupRoundness)}
            options={[
              { value: 'default', label: 'Default' },
              { value: 'round', label: 'Round' },
            ]}
          />
          <InlineSegmentedControl
            label="Control"
            value={control}
            onChange={(v) => setControl(v as PlaygroundControl)}
            options={[
              { value: 'input', label: 'Input' },
              { value: 'textarea', label: 'Textarea' },
            ]}
          />
          <div className="col-span-2">
            <InlineSegmentedControl
              label="State"
              value={state}
              onChange={(v) => setState(v as PlaygroundState)}
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
              label="Sides"
              value={sides}
              onChange={(v) => setSides(v as PlaygroundSides)}
              options={[
                { value: 'start', label: 'Start' },
                { value: 'end', label: 'End' },
                { value: 'both', label: 'Both' },
                { value: 'block-start', label: 'Top' },
                { value: 'block-end', label: 'Bottom' },
              ]}
            />
          </div>
          <div className="col-span-2">
            <InlineSegmentedControl
              label="Addon"
              value={addon}
              onChange={(v) => setAddon(v as PlaygroundAddon)}
              options={[
                { value: 'icon', label: 'Icon' },
                { value: 'text', label: 'Text' },
                { value: 'button', label: 'Button' },
                { value: 'kbd', label: 'Kbd' },
                { value: 'spinner', label: 'Spinner' },
              ]}
            />
          </div>
          {addon === 'button' && !isBlock ? (
            <div className="col-span-2">
              <InlineSegmentedControl
                label="Button"
                value={buttonKind}
                onChange={(v) => setButtonKind(v as PlaygroundButtonKind)}
                options={[
                  { value: 'label', label: 'Label' },
                  { value: 'icon', label: 'Icon' },
                ]}
              />
            </div>
          ) : null}
        </div>
      }
    />
  );
}

export const Overview: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => (
    <PrimitivePage
      title="Input Group"
      description="Addons around Foundations Input. Shell matches Figma Input (16:1738) — size pad, Decorations gap (8px default), muted Prepend/Append."
      playground={<InputGroupPlayground />}
      variants={
        <div className="flex flex-wrap gap-[var(--spacing-md)]">
          <PrimitiveGalleryItem label="Search">
            <DemoSearch />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Text">
            <TextExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Button">
            <ButtonExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Dropdown">
            <DropdownExample />
          </PrimitiveGalleryItem>
        </div>
      }
      usageGuidance={
        <ul className="list-disc space-y-2 ps-5 text-sm text-muted-foreground">
          <li>
            Place <code>InputGroupAddon</code> <em>after</em> the control in the
            DOM; use <code>align</code> for visual position.
          </li>
          <li>
            Prefer <code>InputGroupInput</code> /{' '}
            <code>InputGroupTextarea</code> so focus chrome lives on the group.
          </li>
          <li>
            Icons and prepend/append text use Addon +{' '}
            <code>InputGroupText</code>; interactive chrome uses{' '}
            <code>InputGroupButton</code>.
          </li>
        </ul>
      }
      accessibility={
        <ul className="list-disc space-y-2 ps-5 text-sm text-muted-foreground">
          <li>
            Clicking a non-button addon focuses the control (
            <code>data-slot=&quot;input-group-control&quot;</code>).
          </li>
          <li>
            Icon-only <code>InputGroupButton</code> needs{' '}
            <code>aria-label</code>.
          </li>
        </ul>
      }
    />
  ),
};

export const Align: Story = {
  render: () => <AlignExample />,
};

export const Icon: Story = {
  render: () => <IconExample />,
};

export const Text: Story = {
  render: () => <TextExample />,
};

export const ButtonStory: Story = {
  name: 'Button',
  render: () => <ButtonExample />,
};

export const KbdStory: Story = {
  name: 'Kbd',
  render: () => <KbdExample />,
};

export const Dropdown: Story = {
  render: () => <DropdownExample />,
};

export const SpinnerStory: Story = {
  name: 'Spinner',
  render: () => <SpinnerExample />,
};

export const TextareaStory: Story = {
  name: 'Textarea',
  render: () => <TextareaExample />,
};

export const RTL: Story = {
  render: () => <RtlExample />,
};
