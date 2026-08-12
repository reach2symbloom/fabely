import type { Meta, StoryObj } from '@storybook/react-vite';
import { SearchIcon } from 'lucide-react';
import { useState } from 'react';

import { InlineSegmentedControl } from '../../../stories/InlineSegmentedControl';
import { PlaygroundPanel } from '../../../stories/PlaygroundPanel';
import {
  PRIMITIVE_PLAYGROUND_CONTROL_GRID,
  PrimitiveGalleryItem,
  PrimitivePage,
} from '../../../stories/PrimitivePage';
import { Button } from '../button';
import { ButtonGroup } from '../button-group';
import { DirectionProvider } from '../direction';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '../input-group';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../tooltip';

import { Kbd, KbdGroup, KBD_GLOW_SURFACE } from './kbd';
import type { KbdVariant } from './kbd';

/**
 * Component Storybook IA (see docs/DESIGN.md "Component Story Structure"):
 * Overview first — Playground, Variants gallery, usage, a11y — then focused
 * example pages. Figma Kbd + shadcn Kbd guide.
 */

const meta = {
  title: 'Design System/Primitives/Kbd',
  component: Kbd,
  tags: ['ai-generated'],
  parameters: { layout: 'centered' },
} satisfies Meta;

export default meta;
type Story = StoryObj;

function playgroundOutcome(variant: KbdVariant): string {
  return variant === 'glow'
    ? 'Glow — white @25% fill for dark surfaces (Figma Mode=Glow).'
    : 'Default — black-switch @5% fill and @50% label.';
}

function KbdPlayground() {
  const [variant, setVariant] = useState<KbdVariant>('default');
  const isGlow = variant === 'glow';

  return (
    <PlaygroundPanel
      preview={
        /* Same pad box always — charcoal surface only for Glow (not Default). */
        <div
          className={[
            'flex flex-col items-center gap-[var(--spacing-sm)]',
            'rounded-[length:var(--rounded-lg)]',
            'px-[var(--spacing-xl)] py-[var(--spacing-lg)]',
            isGlow ? KBD_GLOW_SURFACE : '',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          <KbdGroup>
            <Kbd variant={variant}>⌘</Kbd>
            <Kbd variant={variant}>⇧</Kbd>
            <Kbd variant={variant}>⌥</Kbd>
            <Kbd variant={variant}>⌃</Kbd>
          </KbdGroup>
          <div className="flex items-center gap-[var(--spacing-2xs)]">
            <Kbd variant={variant}>Ctrl</Kbd>
            <span
              className={
                isGlow
                  ? 'text-[length:var(--text-paragraph-mini-regular-font-size)] text-[color:var(--theme-alpha-white-no-switch-60)]'
                  : 'text-[length:var(--text-paragraph-mini-regular-font-size)] text-[color:var(--theme-alpha-black-switch-50)]'
              }
            >
              +
            </span>
            <Kbd variant={variant}>B</Kbd>
          </div>
          <p
            className={
              isGlow
                ? 'max-w-xs text-center text-[length:var(--text-paragraph-mini-regular-font-size)] leading-[var(--text-paragraph-mini-regular-line-height)] text-[color:var(--theme-alpha-white-no-switch-60)]'
                : 'max-w-xs text-center text-[length:var(--text-paragraph-mini-regular-font-size)] leading-[var(--text-paragraph-mini-regular-line-height)] text-[color:var(--theme-alpha-black-switch-50)]'
            }
          >
            {playgroundOutcome(variant)}
          </p>
        </div>
      }
      controls={
        <div className={PRIMITIVE_PLAYGROUND_CONTROL_GRID}>
          <InlineSegmentedControl
            label="Mode"
            value={variant}
            onChange={(v) => setVariant(v as KbdVariant)}
            options={[
              { value: 'default', label: 'Default' },
              { value: 'glow', label: 'Glow' },
            ]}
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
      title="Kbd"
      description="Keyboard key labels — Foundations chrome from Figma Kbd (Default / Glow); shadcn Kbd + KbdGroup API."
      playground={<KbdPlayground />}
      variants={
        <div className="flex flex-wrap gap-[var(--spacing-md)]">
          <PrimitiveGalleryItem label="Demo">
            <div className="flex items-center gap-[var(--spacing-2xs)]">
              <Kbd>⌘</Kbd>
              <Kbd>⇧</Kbd>
              <Kbd>⌥</Kbd>
              <Kbd>⌃</Kbd>
              <span className="text-[length:var(--text-paragraph-mini-regular-font-size)] text-[color:var(--muted-foreground)]">
                Ctrl
              </span>
              <span className="text-[length:var(--text-paragraph-mini-regular-font-size)] text-[color:var(--foreground)]">
                +
              </span>
              <Kbd>B</Kbd>
            </div>
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Group">
            <p className="text-[length:var(--text-paragraph-small-regular-font-size)] text-[color:var(--muted-foreground)]">
              Use{' '}
              <KbdGroup>
                <Kbd>Ctrl</Kbd>
                <Kbd>B</Kbd>
              </KbdGroup>{' '}
              to open the command palette
            </p>
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Glow">
            <div
              className={`rounded-[length:var(--rounded-lg)] ${KBD_GLOW_SURFACE} px-[var(--spacing-md)] py-[var(--spacing-sm)]`}
            >
              <Kbd variant="glow">⌘K</Kbd>
            </div>
          </PrimitiveGalleryItem>
        </div>
      }
      usageGuidance={
        <ul className="list-disc space-y-2 ps-5 text-sm text-muted-foreground">
          <li>
            Use <code>Kbd</code> for a single key; wrap related keys in{' '}
            <code>KbdGroup</code> (Figma “kbd combo” gap).
          </li>
          <li>
            Figma <code>Mode=Glow</code> maps to <code>variant=&quot;glow&quot;</code>{' '}
            for dark specimen surfaces. Inside Foundations Tooltip, prefer
            Default (switch alphas).
          </li>
          <li>
            Compose into Button, Tooltip, or Input Group addons; do not invent
            sizes — hug content with Foundations mini type + pad.
          </li>
        </ul>
      }
      accessibility={
        <ul className="list-disc space-y-2 ps-5 text-sm text-muted-foreground">
          <li>
            Renders a native <code>&lt;kbd&gt;</code>. Keep labels short and
            literal (e.g. <code>Ctrl</code>, <code>⌘</code>).
          </li>
          <li>
            <code>pointer-events-none</code> — decorative chrome; put real
            interaction on the host control (button, input, etc.).
          </li>
        </ul>
      }
    />
  ),
};

export const Group: Story = {
  render: () => (
    <p className="text-[length:var(--text-paragraph-small-regular-font-size)] text-[color:var(--foreground)]">
      Use{' '}
      <KbdGroup>
        <Kbd>Ctrl</Kbd>
        <Kbd>B</Kbd>
      </KbdGroup>{' '}
      /{' '}
      <KbdGroup>
        <Kbd>Ctrl</Kbd>
        <Kbd>K</Kbd>
      </KbdGroup>{' '}
      to open the command palette
    </p>
  ),
};

export const ButtonStory: Story = {
  name: 'Button',
  render: () => (
    <Button variant="outline" size="small">
      Accept
      <Kbd>⏎</Kbd>
    </Button>
  ),
};

export const TooltipStory: Story = {
  name: 'Tooltip',
  render: () => (
    <TooltipProvider>
      <ButtonGroup>
        <Tooltip>
          <TooltipTrigger render={<Button variant="outline" size="small" />}>
            Save
          </TooltipTrigger>
          <TooltipContent className="flex items-center gap-[var(--spacing-2xs)]">
            Save
            <KbdGroup>
              <Kbd>⌘</Kbd>
              <Kbd>S</Kbd>
            </KbdGroup>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger render={<Button variant="outline" size="small" />}>
            Print
          </TooltipTrigger>
          <TooltipContent className="flex items-center gap-[var(--spacing-2xs)]">
            Print
            <KbdGroup>
              <Kbd>⌘</Kbd>
              <Kbd>P</Kbd>
            </KbdGroup>
          </TooltipContent>
        </Tooltip>
      </ButtonGroup>
    </TooltipProvider>
  ),
};

export const InputGroupStory: Story = {
  name: 'Input Group',
  render: () => (
    <InputGroup className="max-w-sm">
      <InputGroupAddon>
        <SearchIcon />
      </InputGroupAddon>
      <InputGroupInput placeholder="Search…" />
      <InputGroupAddon align="inline-end">
        <Kbd>⌘K</Kbd>
      </InputGroupAddon>
    </InputGroup>
  ),
};

export const Glow: Story = {
  render: () => (
    <div
      className={`rounded-[length:var(--rounded-lg)] ${KBD_GLOW_SURFACE} px-[var(--spacing-xl)] py-[var(--spacing-lg)]`}
    >
      <KbdGroup>
        <Kbd variant="glow">⌘</Kbd>
        <Kbd variant="glow">K</Kbd>
      </KbdGroup>
    </div>
  ),
};

export const RTL: Story = {
  name: 'RTL',
  render: () => (
    <DirectionProvider direction="rtl">
      <div dir="rtl" className="flex flex-col items-start gap-[var(--spacing-sm)]">
        <KbdGroup>
          <Kbd>⌘</Kbd>
          <Kbd>⇧</Kbd>
          <Kbd>⌥</Kbd>
          <Kbd>⌃</Kbd>
        </KbdGroup>
        <div className="flex items-center gap-[var(--spacing-2xs)]">
          <Kbd>Ctrl</Kbd>
          <span className="text-[length:var(--text-paragraph-mini-regular-font-size)] text-[color:var(--foreground)]">
            +
          </span>
          <Kbd>B</Kbd>
        </div>
      </div>
    </DirectionProvider>
  ),
};
