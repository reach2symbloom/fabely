/**
 * Resume Writing Button — Figma set 16454:16821. Overview via PrimitivePage.
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

import {
  ResumeWritingButton,
  type ResumeWritingButtonVariant,
} from './ResumeWritingButton';

const meta = {
  title: 'Design System/Features/Library/Resume Writing Button',
  component: ResumeWritingButton,
  tags: ['ai-generated'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof ResumeWritingButton>;

export default meta;
type Story = StoryObj<typeof meta>;

const FIGMA_SET_URL =
  'https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=16454-16821';

const SECTION_HREF = '#';

/** Library canvas — Foundations tw-raw/black (#080B0C); dark so switch alphas resolve for Library. */
const LIBRARY_PLAYGROUND_SURFACE =
  'dark bg-[color:var(--tw-raw-black)]';

function LibraryCanvas({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('dark bg-[color:var(--tw-raw-black)] p-[length:var(--spacing-md)]', className)}>
      {children}
    </div>
  );
}

type FigmaVariant = 'jump-rest' | 'jump-hover' | 'start-rest' | 'start-hover';

const FIGMA_VARIANT_GROUPS: {
  caption: string;
  options: { value: FigmaVariant; label: string }[];
}[] = [
  {
    caption: 'Jump back in',
    options: [
      { value: 'jump-rest', label: 'Rest' },
      { value: 'jump-hover', label: 'Hover' },
    ],
  },
  {
    caption: 'Start writing',
    options: [
      { value: 'start-rest', label: 'Rest' },
      { value: 'start-hover', label: 'Hover' },
    ],
  },
];

function parseFigmaVariant(value: FigmaVariant): {
  variant: ResumeWritingButtonVariant;
  forceHover: boolean;
} {
  return {
    variant: value.startsWith('start') ? 'start-writing' : 'jump-back-in',
    forceHover: value.endsWith('hover'),
  };
}

function FigmaVariantExample({ variant }: { variant: FigmaVariant }) {
  const parsed = parseFigmaVariant(variant);
  return (
    <LibraryCanvas className="w-[633px]">
      <ResumeWritingButton
        variant={parsed.variant}
        forceHover={parsed.forceHover}
        href={SECTION_HREF}
      />
    </LibraryCanvas>
  );
}

function ButtonPlayground() {
  const [figmaVariant, setFigmaVariant] = useState<FigmaVariant>('jump-rest');
  const [variant, setVariant] =
    useState<ResumeWritingButtonVariant>('jump-back-in');
  const [forceHover, setForceHover] = useState(false);
  const [mode, setMode] = useState<'figma' | 'controls'>('figma');

  return (
    <PlaygroundPanel
      previewAlign="stretch"
      preview={
        <div className={cn('-m-8 p-8', LIBRARY_PLAYGROUND_SURFACE)}>
          <div className="mx-auto w-[633px] py-[length:var(--spacing-md)]">
            {mode === 'figma' ? (
              <FigmaVariantExample key={figmaVariant} variant={figmaVariant} />
            ) : (
              <ResumeWritingButton
                variant={variant}
                forceHover={forceHover}
                href={SECTION_HREF}
              />
            )}
          </div>
        </div>
      }
      controls={
        <div className={PRIMITIVE_PLAYGROUND_CONTROL_GRID}>
          <InlineSegmentedControl
            label="Playground"
            value={mode}
            onChange={(value) => setMode(value as 'figma' | 'controls')}
            options={[
              { value: 'figma', label: 'Figma variants' },
              { value: 'controls', label: 'Axes' },
            ]}
            fullWidth
            className="col-span-2"
          />
          {mode === 'figma' ? (
            <InlineSegmentedControl
              label="Figma variant"
              value={figmaVariant}
              onChange={(value) => setFigmaVariant(value as FigmaVariant)}
              options={FIGMA_VARIANT_GROUPS.flatMap((group) =>
                group.options.map((option) => ({
                  value: option.value,
                  label: `${group.caption} / ${option.label}`,
                })),
              )}
              fullWidth
              className="col-span-2"
            />
          ) : (
            <>
              <InlineSegmentedControl
                label="Type"
                value={variant}
                onChange={(value) =>
                  setVariant(value as ResumeWritingButtonVariant)
                }
                options={[
                  { value: 'jump-back-in', label: 'Jump back in' },
                  { value: 'start-writing', label: 'Start writing' },
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
              />
            </>
          )}
        </div>
      }
    />
  );
}

function OverviewPage() {
  return (
    <PrimitivePage
      title="Resume Writing Button"
      description={
        <>
          Library continue/start CTA. Figma{' '}
          <a href={FIGMA_SET_URL} target="_blank" rel="noreferrer">
            Resume writing button
          </a>{' '}
          set (<code>16454:16821</code>) — Jump back in / Start writing, each
          with Rest / Hover.
        </>
      }
      playground={<ButtonPlayground />}
      variants={
        <div className="flex flex-col gap-[length:var(--spacing-2xl)]">
          {FIGMA_VARIANT_GROUPS.map((group) => (
            <div
              key={group.caption}
              className="flex flex-col gap-[length:var(--spacing-md)]"
            >
              <h3 className="font-sans text-sm font-medium text-foreground">
                {group.caption}
              </h3>
              <div className="flex flex-col gap-[length:var(--spacing-lg)]">
                {group.options.map((option) => (
                  <PrimitiveGalleryItem key={option.value} label={option.label}>
                    <FigmaVariantExample variant={option.value} />
                  </PrimitiveGalleryItem>
                ))}
              </div>
            </div>
          ))}
        </div>
      }
      usageGuidance={
        <ul className="list-disc space-y-2 ps-5 text-sm text-muted-foreground">
          <li>
            Pass <code>href</code> to the manuscript route. The card itself is
            the link; inner Resume/Start chrome and the go-button are
            decorative.
          </li>
          <li>
            <code>variant=&quot;jump-back-in&quot;</code> shows the last-opened
            line. <code>start-writing</code> hides it.
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
            Bookmark ribbon, link chrome, and go-button are{' '}
            <code>aria-hidden</code> so the card name is the visible title
            plus action.
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

export const JumpBackInRest: Story = {
  name: 'Jump back in / Rest',
  render: () => <FigmaVariantExample variant="jump-rest" />,
};

export const JumpBackInHover: Story = {
  name: 'Jump back in / Hover',
  render: () => <FigmaVariantExample variant="jump-hover" />,
};

export const StartWritingRest: Story = {
  name: 'Start writing / Rest',
  render: () => <FigmaVariantExample variant="start-rest" />,
};

export const StartWritingHover: Story = {
  name: 'Start writing / Hover',
  render: () => <FigmaVariantExample variant="start-hover" />,
};
