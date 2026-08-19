/**
 * Image Button — Figma set 16455:16979. Overview via PrimitivePage.
 */

import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactNode } from 'react';
import { useState } from 'react';

import { cn } from '@/lib/utils';
import { InlineSegmentedControl } from '../../../../stories/InlineSegmentedControl';
import { PlaygroundPanel } from '../../../../stories/PlaygroundPanel';
import {
  PRIMITIVE_PLAYGROUND_CONTROL_GRID,
  PrimitiveGalleryItem,
  PrimitivePage,
} from '../../../../stories/PrimitivePage';

import { ImageButton } from './ImageButton';

const meta = {
  title: 'Design System/Features/Library/Image Button',
  component: ImageButton,
  tags: ['ai-generated'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof ImageButton>;

export default meta;
type Story = StoryObj<typeof meta>;

const FIGMA_SET_URL =
  'https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=16455-16979';

/** Library canvas — Foundations tw-raw/black (#080B0C); dark so switch alphas resolve for Library. */
function LibraryCanvas({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'dark bg-[color:var(--tw-raw-black)] p-[length:var(--spacing-md)]',
        className,
      )}
    >
      {children}
    </div>
  );
}

function FigmaVariantExample({ forceHover }: { forceHover: boolean }) {
  return (
    <LibraryCanvas className="w-[292.5px]">
      <ImageButton forceHover={forceHover} href="#" />
    </LibraryCanvas>
  );
}

function ButtonPlayground() {
  const [forceHover, setForceHover] = useState(false);

  return (
    <PlaygroundPanel
      previewAlign="stretch"
      preview={
        <div className="-m-8 dark bg-[color:var(--tw-raw-black)] p-8">
          <div className="mx-auto w-[292.5px] py-[length:var(--spacing-md)]">
            <ImageButton forceHover={forceHover} href="#" />
          </div>
        </div>
      }
      controls={
        <div className={PRIMITIVE_PLAYGROUND_CONTROL_GRID}>
          <InlineSegmentedControl
            label="Hover"
            value={forceHover ? 'on' : 'off'}
            onChange={(value) => setForceHover(value === 'on')}
            options={[
              { value: 'off', label: 'Off' },
              { value: 'on', label: 'On' },
            ]}
            fullWidth
            className="col-span-2"
          />
        </div>
      }
    />
  );
}

function OverviewPage() {
  return (
    <PrimitivePage
      title="Image Button"
      description={
        <>
          Thumbnail + copy + trailing icon action card. Figma{' '}
          <a href={FIGMA_SET_URL} target="_blank" rel="noreferrer">
            Image buttons
          </a>{' '}
          set (<code>16455:16979</code>) — Import notes, Rest / Hover.
        </>
      }
      playground={<ButtonPlayground />}
      variants={
        <div className="flex flex-col gap-[length:var(--spacing-lg)]">
          <PrimitiveGalleryItem label="Rest">
            <FigmaVariantExample forceHover={false} />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Hover">
            <FigmaVariantExample forceHover />
          </PrimitiveGalleryItem>
        </div>
      }
      usageGuidance={
        <ul className="list-disc space-y-2 ps-5 text-sm text-muted-foreground">
          <li>
            Pass <code>href</code> for a link, or handle <code>onClick</code>{' '}
            for a button — this component has no built-in file input.
          </li>
          <li>
            <code>type</code> defaults to (and today only supports){' '}
            <code>&quot;import-notes&quot;</code>.
          </li>
          <li>
            Use <code>forceHover</code> in Storybook to lock the hover state
            without a pointer.
          </li>
        </ul>
      }
      accessibility={
        <ul className="list-disc space-y-2 ps-5 text-sm text-muted-foreground">
          <li>
            One interactive control: an <code>&lt;a&gt;</code> when{' '}
            <code>href</code> is set, otherwise a <code>&lt;button&gt;</code>.
          </li>
          <li>
            The thumbnail is decorative (<code>alt=&quot;&quot;</code>); the
            card's <code>aria-label</code> is the title.
          </li>
        </ul>
      }
    />
  );
}

export const Overview: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => <OverviewPage />,
};

export const Rest: Story = {
  render: () => <FigmaVariantExample forceHover={false} />,
};

export const Hover: Story = {
  render: () => <FigmaVariantExample forceHover />,
};
