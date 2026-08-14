/**
 * Chapter Menu List Item — Figma set 16371:635. Overview via PrimitivePage.
 */

import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import { InlineSegmentedControl } from '../../../../stories/InlineSegmentedControl';
import { PlaygroundPanel } from '../../../../stories/PlaygroundPanel';
import {
  PRIMITIVE_PLAYGROUND_CONTROL_GRID,
  PrimitiveGalleryItem,
  PrimitivePage,
} from '../../../../stories/PrimitivePage';
import { RadioGroup, RadioGroupItem } from '@/primitives/radio-group';

import {
  ChapterMenuListItem,
  type ChapterMenuListItemType,
} from './ChapterMenuListItem';

const meta = {
  title: 'Design System/Features/Chapter Menu List Item',
  component: ChapterMenuListItem,
  tags: ['ai-generated'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof ChapterMenuListItem>;

export default meta;
type Story = StoryObj<typeof meta>;

const DEMO_FRAME = 'w-[length:var(--tw-raw-spacing-80)]';

const SCENE_LABEL = 'The Wand that Would Not Fall';

/** Storybook placeholder — swap for a real manuscript section route in apps. */
const SECTION_HREF = '#';

const FIGMA_SET_URL =
  'https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=16371-635';

type FigmaVariant =
  | 'chapter'
  | 'chapter-untitled'
  | 'chapter-hover'
  | 'chapter-drag'
  | 'chapter-collapsed-scenes'
  | 'scene'
  | 'scene-hover'
  | 'subscene'
  | 'subscene-hover'
  | 'chapter-scenes'
  | 'chapter-subscenes';

type FigmaVariantOption = { value: FigmaVariant; label: string };

const FIGMA_VARIANT_GROUPS: {
  caption: string;
  options: FigmaVariantOption[];
}[] = [
  {
    caption: 'Chapter (no scenes)',
    options: [
      { value: 'chapter', label: 'Rest' },
      { value: 'chapter-untitled', label: 'Untitled' },
      { value: 'chapter-hover', label: 'Hover' },
      { value: 'chapter-drag', label: 'Drag' },
    ],
  },
  {
    caption: 'Scene',
    options: [
      { value: 'scene', label: 'Rest' },
      { value: 'scene-hover', label: 'Hover' },
    ],
  },
  {
    caption: 'Sub-scene',
    options: [
      { value: 'subscene', label: 'Rest' },
      { value: 'subscene-hover', label: 'Hover' },
    ],
  },
  {
    caption: 'Chapter scenes dropdown',
    options: [
      { value: 'chapter-collapsed-scenes', label: 'Collapsed + scenes' },
      { value: 'chapter-scenes', label: 'Expanded + scenes' },
      { value: 'chapter-subscenes', label: 'Expanded + sub-scenes' },
    ],
  },
];

function DemoScenes() {
  return (
    <>
      <ChapterMenuListItem
        type="scene"
        sceneNumber={1}
        label="The Eldergrove"
        href={SECTION_HREF}
      />
      <ChapterMenuListItem
        type="scene"
        sceneNumber={2}
        label={SCENE_LABEL}
        href={SECTION_HREF}
      />
      <ChapterMenuListItem
        type="scene"
        sceneNumber={3}
        label={SCENE_LABEL}
        href={SECTION_HREF}
      />
    </>
  );
}

function FigmaVariantExample({
  variant,
  className,
}: {
  variant: FigmaVariant;
  className?: string;
}) {
  const frame = className ?? DEMO_FRAME;

  switch (variant) {
    case 'chapter':
      return (
        <div className={frame}>
          <ChapterMenuListItem type="chapter" href={SECTION_HREF} />
        </div>
      );
    case 'chapter-untitled':
      return (
        <div className={frame}>
          <ChapterMenuListItem type="chapter" untitled href={SECTION_HREF} />
        </div>
      );
    case 'chapter-hover':
      return (
        <div className={frame}>
          <ChapterMenuListItem
            type="chapter"
            forceHover
            showActions
            href={SECTION_HREF}
          />
        </div>
      );
    case 'chapter-drag':
      return (
        <div className={frame}>
          <ChapterMenuListItem
            type="chapter"
            drag
            forceHover
            showActions
            href={SECTION_HREF}
          />
        </div>
      );
    case 'chapter-collapsed-scenes':
      return (
        <div className={frame}>
          <ChapterMenuListItem type="chapter" href={SECTION_HREF}>
            <DemoScenes />
          </ChapterMenuListItem>
        </div>
      );
    case 'scene':
      return (
        <div className={frame}>
          <ChapterMenuListItem
            type="scene"
            label={SCENE_LABEL}
            href={SECTION_HREF}
          />
        </div>
      );
    case 'scene-hover':
      return (
        <div className={frame}>
          <ChapterMenuListItem
            type="scene"
            label={SCENE_LABEL}
            forceHover
            href={SECTION_HREF}
          />
        </div>
      );
    case 'subscene':
      return (
        <div className={frame}>
          <ChapterMenuListItem
            type="subscene"
            label={SCENE_LABEL}
            href={SECTION_HREF}
          />
        </div>
      );
    case 'subscene-hover':
      return (
        <div className={frame}>
          <ChapterMenuListItem
            type="subscene"
            label={SCENE_LABEL}
            forceHover
            href={SECTION_HREF}
          />
        </div>
      );
    case 'chapter-scenes':
      return (
        <div className={frame}>
          <ChapterMenuListItem type="chapter" expanded href={SECTION_HREF}>
            <DemoScenes />
          </ChapterMenuListItem>
        </div>
      );
    case 'chapter-subscenes':
      return (
        <div className={frame}>
          <ChapterMenuListItem type="chapter" expanded href={SECTION_HREF}>
            <ChapterMenuListItem
              type="scene"
              sceneNumber={1}
              label="The Eldergrove"
              href={SECTION_HREF}
            >
              <ChapterMenuListItem
                type="subscene"
                label="Intro"
                href={SECTION_HREF}
              />
              <ChapterMenuListItem
                type="subscene"
                label="Breathing"
                href={SECTION_HREF}
              />
              <ChapterMenuListItem
                type="subscene"
                label="The reveal"
                href={SECTION_HREF}
              />
            </ChapterMenuListItem>
            <ChapterMenuListItem
              type="scene"
              sceneNumber={2}
              label={SCENE_LABEL}
              href={SECTION_HREF}
            />
            <ChapterMenuListItem
              type="scene"
              sceneNumber={3}
              label={SCENE_LABEL}
              href={SECTION_HREF}
            />
          </ChapterMenuListItem>
        </div>
      );
  }
}

function ListItemPlayground() {
  const [figmaVariant, setFigmaVariant] = useState<FigmaVariant>('chapter');
  const [type, setType] = useState<ChapterMenuListItemType>('chapter');
  const [expanded, setExpanded] = useState(false);
  const [untitled, setUntitled] = useState(false);
  const [forceHover, setForceHover] = useState(false);
  const [drag, setDrag] = useState(false);
  const [showActions, setShowActions] = useState(true);
  const [mode, setMode] = useState<'figma' | 'controls'>('figma');

  return (
    <PlaygroundPanel
      previewAlign="stretch"
      preview={
        <div className={`mx-auto min-h-40 py-[length:var(--spacing-md)] ${DEMO_FRAME}`}>
          {mode === 'figma' ? (
            <FigmaVariantExample key={figmaVariant} variant={figmaVariant} />
          ) : (
            <ChapterMenuListItem
              type={type}
              untitled={type === 'chapter' ? untitled : false}
              expanded={type === 'chapter' ? expanded : false}
              onExpandToggle={
                type === 'chapter'
                  ? () => setExpanded((value) => !value)
                  : undefined
              }
              forceHover={forceHover}
              drag={drag}
              showActions={showActions}
              href={SECTION_HREF}
              label={
                type === 'subscene'
                  ? 'Intro'
                  : type === 'scene'
                    ? SCENE_LABEL
                    : 'The Eldergrove'
              }
            >
              {type === 'chapter' ? <DemoScenes /> : null}
            </ChapterMenuListItem>
          )}
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
          />
          {mode === 'figma' ? (
            <div className="min-w-0">
              <div className="mb-1.5 font-sans text-xs text-muted-foreground">
                Figma variant
              </div>
              <RadioGroup
                value={figmaVariant}
                onValueChange={(value) =>
                  setFigmaVariant(value as FigmaVariant)
                }
                className="gap-[length:var(--spacing-md)]"
              >
                {FIGMA_VARIANT_GROUPS.map((group) => (
                  <div
                    key={group.caption}
                    className="flex flex-col gap-[length:var(--spacing-xs)]"
                  >
                    <div className="font-sans text-xs font-medium text-foreground">
                      {group.caption}
                    </div>
                    <div className="flex flex-col gap-[length:var(--spacing-xs)]">
                      {group.options.map((option) => {
                        const id = `chapter-menu-list-item-${option.value}`;
                        return (
                          <label
                            key={option.value}
                            htmlFor={id}
                            className="flex cursor-pointer items-center gap-[length:var(--spacing-xs)] font-sans text-sm text-foreground"
                          >
                            <RadioGroupItem value={option.value} id={id} />
                            {option.label}
                          </label>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </RadioGroup>
            </div>
          ) : (
            <>
              <InlineSegmentedControl
                label="Type"
                value={type}
                onChange={(value) =>
                  setType(value as ChapterMenuListItemType)
                }
                options={[
                  { value: 'chapter', label: 'Chapter' },
                  { value: 'scene', label: 'Scene' },
                  { value: 'subscene', label: 'Sub-scene' },
                ]}
                fullWidth
              />
              <InlineSegmentedControl
                label="Untitled"
                value={untitled ? 'on' : 'off'}
                onChange={(value) => setUntitled(value === 'on')}
                options={[
                  { value: 'off', label: 'Off' },
                  { value: 'on', label: 'On' },
                ]}
                fullWidth
              />
              <InlineSegmentedControl
                label="Expanded"
                value={expanded ? 'on' : 'off'}
                onChange={(value) => setExpanded(value === 'on')}
                options={[
                  { value: 'off', label: 'Off' },
                  { value: 'on', label: 'On' },
                ]}
                fullWidth
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
              <InlineSegmentedControl
                label="Drag"
                value={drag ? 'on' : 'off'}
                onChange={(value) => setDrag(value === 'on')}
                options={[
                  { value: 'off', label: 'Off' },
                  { value: 'on', label: 'On' },
                ]}
                fullWidth
              />
              <InlineSegmentedControl
                label="Actions"
                value={showActions ? 'on' : 'off'}
                onChange={(value) => setShowActions(value === 'on')}
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
      title="Chapter Menu List Item"
      description={
        <>
          Outline rows for chapters, scenes, and sub-scenes. Figma{' '}
          <a href={FIGMA_SET_URL} target="_blank" rel="noreferrer">
            Chapter menu list item
          </a>{' '}
          set (<code>16371:635</code>) — chapter / scene / sub-scene leaves, plus
          a chapter scenes dropdown (chevron only when the chapter has scene
          children). Pass <code>href</code> (Storybook uses <code>#</code>) so
          each row links to its manuscript section.
        </>
      }
      playground={<ListItemPlayground />}
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
                  <PrimitiveGalleryItem
                    key={option.value}
                    label={option.label}
                  >
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
            Pass <code>href</code> to the manuscript section (real route in
            apps; <code>#</code> is fine in Storybook). A stretched link sits
            behind the row; the name field, chevron, and actions stay above it.
          </li>
          <li>
            Chapter chevron is a scenes dropdown: it only renders when the
            chapter has scene <code>children</code>. Click toggles{' '}
            <code>expanded</code> (uncontrolled by default, or control with{' '}
            <code>expanded</code> + <code>onExpandToggle</code>). Chapters with
            no individual scenes have no chevron.
          </li>
          <li>
            Names are Input Quiet Mini. Chapter rows use Input Group with
            Prepend <code>Ch. N</code>; scene and sub-scene are bare Input.
            Hover / focus (and row hover) reveal the Quiet field chrome.
          </li>
          <li>
            Hover and drag paint <code>--tw-raw-secondary-200</code> on markers
            and labels. Titles use <code>--text</code> (Figma text-default), not
            full <code>--foreground</code>. Use <code>forceHover</code> in
            Storybook to lock that state without a pointer.
          </li>
          <li>
            Compose into Chapter Menu when that organism lands — do not treat
            this as a generic ListItem replacement.
          </li>
        </ul>
      }
      accessibility={
        <ul className="list-disc space-y-2 ps-5 text-sm text-muted-foreground">
          <li>
            When <code>href</code> is set, an{' '}
            <code>aria-label</code>d section link covers the row; rename /
            expand / actions keep focus and click above it.
          </li>
          <li>
            Chapter scenes chevron is a button with{' '}
            <code>aria-expanded</code> and Expand / Collapse scenes labels. It
            only mounts when the chapter has scene children.
          </li>
          <li>
            Trailing ellipsis is Icon Button ghost mini (
            <code>aria-label=&quot;Chapter actions&quot;</code>), visible on
            hover / focus / drag.
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

export const Chapter: Story = {
  name: 'Chapter / Rest',
  render: () => <FigmaVariantExample variant="chapter" />,
};

export const ChapterUntitled: Story = {
  name: 'Chapter / Untitled',
  render: () => <FigmaVariantExample variant="chapter-untitled" />,
};

export const ChapterHover: Story = {
  name: 'Chapter / Hover',
  render: () => <FigmaVariantExample variant="chapter-hover" />,
};

export const ChapterDrag: Story = {
  name: 'Chapter / Drag',
  render: () => <FigmaVariantExample variant="chapter-drag" />,
};

export const ChapterCollapsedScenes: Story = {
  name: 'Dropdown / Collapsed + scenes',
  render: () => <FigmaVariantExample variant="chapter-collapsed-scenes" />,
};

export const Scene: Story = {
  name: 'Scene / Rest',
  render: () => <FigmaVariantExample variant="scene" />,
};

export const SceneHover: Story = {
  name: 'Scene / Hover',
  render: () => <FigmaVariantExample variant="scene-hover" />,
};

export const Subscene: Story = {
  name: 'Sub-scene / Rest',
  render: () => <FigmaVariantExample variant="subscene" />,
};

export const SubsceneHover: Story = {
  name: 'Sub-scene / Hover',
  render: () => <FigmaVariantExample variant="subscene-hover" />,
};

export const ChapterWithScenes: Story = {
  name: 'Dropdown / Expanded + scenes',
  render: () => <FigmaVariantExample variant="chapter-scenes" />,
};

export const ChapterWithSubscenes: Story = {
  name: 'Dropdown / Expanded + sub-scenes',
  render: () => <FigmaVariantExample variant="chapter-subscenes" />,
};
