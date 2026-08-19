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

import { ImageButton, type ImageButtonType } from './ImageButton';

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

const TYPE_LABEL: Record<ImageButtonType, string> = {
  'import-notes': 'Import notes',
  'import-manuscript': 'Import manuscript',
};

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

function FigmaVariantExample({
  type,
  forceHover,
}: {
  type: ImageButtonType;
  forceHover: boolean;
}) {
  return (
    <LibraryCanvas className="w-[292.5px]">
      <ImageButton type={type} forceHover={forceHover} href="#" />
    </LibraryCanvas>
  );
}

function ButtonPlayground() {
  const [type, setType] = useState<ImageButtonType>('import-notes');
  const [forceHover, setForceHover] = useState(false);

  return (
    <PlaygroundPanel
      previewAlign="stretch"
      preview={
        <div className="-m-8 dark bg-[color:var(--tw-raw-black)] p-8">
          <div className="mx-auto w-[292.5px] py-[length:var(--spacing-md)]">
            <ImageButton type={type} forceHover={forceHover} href="#" />
          </div>
        </div>
      }
      controls={
        <div className={PRIMITIVE_PLAYGROUND_CONTROL_GRID}>
          <InlineSegmentedControl
            label="Type"
            value={type}
            onChange={(value) => setType(value as ImageButtonType)}
            options={[
              { value: 'import-notes', label: TYPE_LABEL['import-notes'] },
              { value: 'import-manuscript', label: TYPE_LABEL['import-manuscript'] },
            ]}
            fullWidth
            className="col-span-2"
          />
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
          set (<code>16455:16979</code>) — Import notes × Rest/Hover. Import
          manuscript is an instance override of the same component, not a
          separate Figma variant, but modeled here as its own{' '}
          <code>type</code> since both recur as real Library entry points.
        </>
      }
      playground={<ButtonPlayground />}
      variants={
        <div className="flex flex-col gap-[length:var(--spacing-2xl)]">
          {(['import-notes', 'import-manuscript'] as const).map((type) => (
            <div
              key={type}
              className="flex flex-col gap-[length:var(--spacing-md)]"
            >
              <h3 className="font-sans text-sm font-medium text-foreground">
                {TYPE_LABEL[type]}
              </h3>
              <div className="flex flex-col gap-[length:var(--spacing-lg)]">
                <PrimitiveGalleryItem label="Rest">
                  <FigmaVariantExample type={type} forceHover={false} />
                </PrimitiveGalleryItem>
                <PrimitiveGalleryItem label="Hover">
                  <FigmaVariantExample type={type} forceHover />
                </PrimitiveGalleryItem>
              </div>
            </div>
          ))}
        </div>
      }
      usageGuidance={
        <ul className="list-disc space-y-2 ps-5 text-sm text-muted-foreground">
          <li>
            Pass <code>href</code> for a link, or handle <code>onClick</code>{' '}
            for a button — this component has no built-in file input.
          </li>
          <li>
            <code>type</code> defaults to{' '}
            <code>&quot;import-notes&quot;</code>; each value fills in its
            own title, subtitle, and thumbnail. Override any of them with
            the <code>title</code> / <code>subtitle</code> /{' '}
            <code>thumbnailSrc</code> props.
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

export const ImportNotesRest: Story = {
  name: 'Import notes / Rest',
  render: () => <FigmaVariantExample type="import-notes" forceHover={false} />,
};

export const ImportNotesHover: Story = {
  name: 'Import notes / Hover',
  render: () => <FigmaVariantExample type="import-notes" forceHover />,
};

export const ImportManuscriptRest: Story = {
  name: 'Import manuscript / Rest',
  render: () => (
    <FigmaVariantExample type="import-manuscript" forceHover={false} />
  ),
};

export const ImportManuscriptHover: Story = {
  name: 'Import manuscript / Hover',
  render: () => <FigmaVariantExample type="import-manuscript" forceHover />,
};
