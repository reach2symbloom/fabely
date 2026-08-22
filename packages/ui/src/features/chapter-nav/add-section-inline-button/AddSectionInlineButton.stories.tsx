/**
 * Add Section Inline Button — insert rows. Overview via PrimitivePage.
 */

import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState, type MouseEvent } from 'react';

import { InlineSegmentedControl } from '../../../../stories/InlineSegmentedControl';
import { PlaygroundPanel } from '../../../../stories/PlaygroundPanel';
import {
  PRIMITIVE_PLAYGROUND_CONTROL_GRID,
  PrimitiveGalleryItem,
  PrimitivePage,
} from '../../../../stories/PrimitivePage';
import { ChapterMenuListItem } from '../chapter-menu-list-item';

import {
  AddSectionInlineButton,
  type AddSectionInlineType,
} from './AddSectionInlineButton';

const meta = {
  title: 'Design System/Features/Chapter Nav Organism/Add Section Inline Button',
  component: AddSectionInlineButton,
  tags: ['ai-generated'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof AddSectionInlineButton>;

export default meta;
type Story = StoryObj<typeof meta>;

const DEMO_FRAME = 'w-[length:var(--tw-raw-spacing-80)]';

const TYPE_OPTIONS: Array<{ value: AddSectionInlineType; label: string }> = [
  { value: 'chapter', label: 'Chapter' },
  { value: 'scene', label: 'Scene' },
  { value: 'actUntitled', label: 'Act untitled' },
  { value: 'actNoOnly', label: 'Act no. only' },
  { value: 'actTitled', label: 'Act titled' },
];

const DEMO_ACTIONS = {
  addChapter: {
    href: '#add-chapter',
    onClick: (event: MouseEvent) => {
      event.preventDefault();
      // eslint-disable-next-line no-console -- Storybook action demo
      console.info('add chapter');
    },
  },
  addAct: {
    href: '#add-act',
    onClick: (event: MouseEvent) => {
      event.preventDefault();
      // eslint-disable-next-line no-console -- Storybook action demo
      console.info('add act');
    },
  },
  addScene: {
    href: '#add-scene',
    onClick: (event: MouseEvent) => {
      event.preventDefault();
      // eslint-disable-next-line no-console -- Storybook action demo
      console.info('add scene');
    },
  },
} as const;

function InsertBetweenChapters({
  forceHover = false,
  forceOpen = false,
}: {
  forceHover?: boolean;
  forceOpen?: boolean;
}) {
  return (
    <div className={`flex flex-col ${DEMO_FRAME}`}>
      <ChapterMenuListItem
        type="chapter"
        chapterNumber={2}
        label="The Wand that Would Not Fall"
        showActions={false}
      />
      <AddSectionInlineButton
        type="chapter"
        forceHover={forceHover}
        forceOpen={forceOpen}
        addChapter={DEMO_ACTIONS.addChapter}
        addAct={DEMO_ACTIONS.addAct}
      />
      <ChapterMenuListItem
        type="chapter"
        chapterNumber={3}
        label="Shadows in the mist"
        showActions={false}
      />
    </div>
  );
}

function ChapterExample() {
  return (
    <div className={DEMO_FRAME}>
      <AddSectionInlineButton
        type="chapter"
        forceHover
        addChapter={DEMO_ACTIONS.addChapter}
        addAct={DEMO_ACTIONS.addAct}
      />
    </div>
  );
}

function SceneExample() {
  return (
    <div className={DEMO_FRAME}>
      <AddSectionInlineButton
        type="scene"
        forceHover
        addScene={DEMO_ACTIONS.addScene}
      />
    </div>
  );
}

function ActUntitledExample() {
  return (
    <div className={DEMO_FRAME}>
      <AddSectionInlineButton type="actUntitled" />
    </div>
  );
}

function ActNoOnlyExample() {
  return (
    <div className={DEMO_FRAME}>
      <AddSectionInlineButton type="actNoOnly" />
    </div>
  );
}

function ActTitledExample() {
  return (
    <div className={DEMO_FRAME}>
      <AddSectionInlineButton type="actTitled" actTitle="Titled" />
    </div>
  );
}

function AddSectionPlayground() {
  const [type, setType] = useState<AddSectionInlineType>('chapter');
  const [actIndex, setActIndex] = useState(1);
  const [insertState, setInsertState] = useState<'rest' | 'hover' | 'open'>(
    'hover',
  );
  const isAct =
    type === 'actUntitled' || type === 'actNoOnly' || type === 'actTitled';

  return (
    <PlaygroundPanel
      previewAlign="stretch"
      preview={
        <div className={`flex min-h-40 w-full items-center ${DEMO_FRAME}`}>
          {isAct ? (
            <AddSectionInlineButton
              type={type}
              actIndex={actIndex}
              actTitle={type === 'actTitled' ? 'Titled' : undefined}
            />
          ) : type === 'scene' ? (
            <AddSectionInlineButton
              type="scene"
              forceHover={insertState !== 'rest'}
              addScene={DEMO_ACTIONS.addScene}
            />
          ) : (
            <InsertBetweenChapters
              forceHover={insertState !== 'rest'}
              forceOpen={insertState === 'open'}
            />
          )}
        </div>
      }
      controls={
        <div className={PRIMITIVE_PLAYGROUND_CONTROL_GRID}>
          <InlineSegmentedControl
            label="Type"
            value={type}
            onChange={(value) => {
              const next = value as AddSectionInlineType;
              setType(next);
              if (
                next !== 'chapter' &&
                insertState === 'open'
              ) {
                setInsertState('hover');
              }
            }}
            options={TYPE_OPTIONS}
            fullWidth
            className="col-span-2"
          />
          {isAct ? (
            <InlineSegmentedControl
              label="Act index"
              value={String(actIndex)}
              onChange={(value) => setActIndex(Number(value))}
              options={[
                { value: '1', label: '1 → I' },
                { value: '2', label: '2 → II' },
                { value: '3', label: '3 → III' },
                { value: '4', label: '4 → IV' },
              ]}
              fullWidth
              className="col-span-2"
            />
          ) : (
            <InlineSegmentedControl
              label="Insert"
              value={insertState}
              onChange={(value) =>
                setInsertState(value as 'rest' | 'hover' | 'open')
              }
              options={[
                { value: 'rest', label: 'Rest' },
                { value: 'hover', label: 'Hover' },
                ...(type === 'chapter'
                  ? [{ value: 'open', label: 'Menu open' }]
                  : []),
              ]}
              fullWidth
              className="col-span-2"
            />
          )}
        </div>
      }
    />
  );
}

export const Overview: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => (
    <PrimitivePage
      title="Add Section Inline Button"
      description="Insert between manuscript sections. Chapter / Scene: plus left of a hover-only 1px divider. Plus or the line opens Chapter / Act (Scene inserts directly). Figma Add section inline button Chapter / Scene / Act (16373:4624)."
      playground={<AddSectionPlayground />}
      variants={
        <div className="flex w-full flex-col gap-[var(--spacing-md)]">
          <div className="grid w-full grid-cols-2 gap-[var(--spacing-md)]">
            <PrimitiveGalleryItem label="Rest" fill>
              <InsertBetweenChapters />
            </PrimitiveGalleryItem>
            <PrimitiveGalleryItem label="Hover — plus + divider" fill>
              <InsertBetweenChapters forceHover />
            </PrimitiveGalleryItem>
            <PrimitiveGalleryItem label="Menu open — Chapter / Act" fill>
              <InsertBetweenChapters forceHover forceOpen />
            </PrimitiveGalleryItem>
            <PrimitiveGalleryItem label="Scene hover" fill>
              <SceneExample />
            </PrimitiveGalleryItem>
          </div>
          <PrimitiveGalleryItem label="Chapter" fill>
            <ChapterExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Act untitled" fill>
            <ActUntitledExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Act no. only" fill>
            <ActNoOnlyExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Act titled" fill>
            <ActTitledExample />
          </PrimitiveGalleryItem>
        </div>
      }
      usageGuidance={
        <ul className="list-disc space-y-2 ps-5 text-sm text-muted-foreground">
          <li>
            Chapter / Scene chrome is an <code>IconButton</code> plus (ghost,
            mini, round) to the left of a 1px <code>Separator</code> (
            <code>--stroke-thin</code>). Both appear only on gap hover —
            opacity, no layout shift. Hovering the line lightens it; clicking
            the plus or the line opens the menu (Scene inserts immediately).
          </li>
          <li>
            Chapter plus or the divider opens <code>DropdownMenu</code> with
            Chapter and Act. Scene plus or divider fires{' '}
            <code>addScene</code> / <code>onAddScene</code> directly.
          </li>
          <li>
            Wire inserts with <code>addChapter</code> / <code>addAct</code> /{' '}
            <code>addScene</code> (<code>onClick</code>, optional{' '}
            <code>href</code>). Shorthand <code>onAddChapter</code> /{' '}
            <code>onAddAct</code> / <code>onAddScene</code> still work.
          </li>
          <li>
            The gap is a fixed <code>--spacing-sm</code> (12) hit-zone. Use{' '}
            <code>forceHover</code> / <code>forceOpen</code> in Storybook.
            Act rows stay always visible.
          </li>
          <li>
            Pass <code>actIndex</code> (1-based) from the act sequence — the
            roman numeral is derived, never typed. Act no. only is display
            text, not an input.
          </li>
        </ul>
      }
      accessibility={
        <ul className="list-disc space-y-2 ps-5 text-sm text-muted-foreground">
          <li>
            Plus exposes <code>aria-label</code> (“Add chapter or act” /
            “Add scene”). Menu items are “Chapter” and “Act”. Act no. only
            uses <code>aria-label=&quot;Act I&quot;</code> (from sequence).
            Title fields use <code>aria-label=&quot;Act title&quot;</code>.
          </li>
        </ul>
      }
    />
  ),
};

export const Rest: Story = {
  render: () => <InsertBetweenChapters />,
};

export const Hover: Story = {
  render: () => <InsertBetweenChapters forceHover />,
};

export const MenuOpen: Story = {
  name: 'Menu open',
  render: () => <InsertBetweenChapters forceHover forceOpen />,
};

export const Chapter: Story = {
  render: () => <ChapterExample />,
};

export const Scene: Story = {
  render: () => <SceneExample />,
};

export const ActUntitled: Story = {
  render: () => <ActUntitledExample />,
};

export const ActNoOnly: Story = {
  render: () => <ActNoOnlyExample />,
};

export const ActTitled: Story = {
  render: () => <ActTitledExample />,
};
