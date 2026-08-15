/**
 * Chapter Menu — Figma set 16373:12458. Overview via PrimitivePage.
 */

import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useRef, useState, type ReactNode, Fragment } from 'react';

import {
  DndContext,
  DragOverlay,
  type DragStartEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { InlineSegmentedControl } from '../../../../stories/InlineSegmentedControl';
import { PlaygroundPanel } from '../../../../stories/PlaygroundPanel';
import {
  PRIMITIVE_PLAYGROUND_CONTROL_GRID,
  PrimitiveGalleryItem,
  PrimitivePage,
} from '../../../../stories/PrimitivePage';
import { cn } from '@/lib/utils';
import { RadioGroup, RadioGroupItem } from '@/primitives/radio-group';

import {
  AddSectionInlineButton,
  AddSectionInlineGap,
} from '../add-section-inline-button';
import { ChapterMenuHeader } from '../chapter-menu-header';
import { ChapterMenuListItem } from '../chapter-menu-list-item';
import { ChapterMenu } from './ChapterMenu';
import {
  ROOT_CONTAINER,
  childrenOf,
  computeOutlineNumbers,
  type OutlineItem,
  type OutlineItemKind,
} from './outline-dnd';
import { useOutlineDragAndDrop } from './use-outline-dnd-kit';

const FIGMA_SET_URL =
  'https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=16373-12458';

const SECTION_HREF = '#';

const BOOK_TITLE = 'The Lumithra Prophecy and the Aurora Sorceress';

type ActsVariant = 'false' | 'subscenes' | 'empty';

const ACTS_OPTIONS: { value: ActsVariant; label: string }[] = [
  { value: 'false', label: 'Acts=False' },
  { value: 'subscenes', label: 'Acts=Subscenes' },
  { value: 'empty', label: 'Acts=Empty' },
];

function DemoHeader({
  variant = 'alt',
  outlineValue = 'scenes',
  onOutlineValueChange,
}: {
  variant?: 'main' | 'alt';
  outlineValue?: string;
  /** Present → outline value is controlled (cycle switch drives real state). */
  onOutlineValueChange?: (value: string) => void;
}) {
  return (
    <ChapterMenuHeader
      variant={variant}
      bookTitle={BOOK_TITLE}
      authorName="Christian Davis"
      authorInitials="CD"
      logoSrc={variant === 'main' ? '/logo-dark.png' : '/logo-mark.png'}
      coverSrc="/cover-demo.png"
      coverAlt="The Lumithra Prophecy cover"
      {...(onOutlineValueChange
        ? { outlineValue, onOutlineValueChange }
        : { defaultOutlineValue: outlineValue })}
    />
  );
}

const meta = {
  title: 'Design System/Features/Chapter Menu',
  component: ChapterMenu,
  tags: ['ai-generated'],
  parameters: { layout: 'centered' },
  args: {
    header: <DemoHeader />,
  },
} satisfies Meta<typeof ChapterMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

const DEMO_CHAPTER_TITLES = [
  'The Eldergrove',
  'Journey to the far mountain to the Warlocks',
  'The assessment in the chamber',
  'Breakfast at the castle',
  'Eavesdropping on fate, and the grand deception from whom was most trusted',
  'The dream with Sibilus',
  'The annual witch-wizard dinner',
  'Dragon! In the distance',
  'The revival, the escape',
  'The whispering tree and the stolen crown',
  'Twin powers',
  'Sparky the dragon dog',
  'The locked chest in the cave',
  "Sibilus' friend",
  'Greblum unlocks the chest',
];

type OutlineScene = {
  id: string;
  label: string;
  subscenes?: { id: string; label: string }[];
};

/** 1-based chapter number → its scene dropdown. Matches the Figma reference. */
const CHAPTER_SCENES: Record<number, OutlineScene[]> = {
  8: [
    {
      id: 'seed-scene-8-1',
      label: 'Eyes wide open',
      subscenes: [
        { id: 'seed-subscene-8-1-1', label: 'Intro' },
        { id: 'seed-subscene-8-1-2', label: 'The reveal' },
      ],
    },
    { id: 'seed-scene-8-2', label: 'The ruthless kill' },
    { id: 'seed-scene-8-3', label: 'The aftershock' },
  ],
  12: [
    { id: 'seed-scene-12-1', label: 'Scene one' },
    { id: 'seed-scene-12-2', label: 'Scene two' },
  ],
};

/** Ch. 8 starts open, Ch. 12 starts closed — matches the Figma reference. */
const CHAPTER_DEFAULT_EXPANDED: Record<number, boolean> = {
  8: true,
  12: false,
};

function ChapterRows({
  from,
  to,
}: {
  from: number;
  to: number;
}) {
  const titles = DEMO_CHAPTER_TITLES;

  const numbers = Array.from({ length: to - from + 1 }, (_, index) => from + index);

  return (
    <>
      {numbers.map((n, index) => {
        const label = titles[n - 1] ?? `Chapter ${n}`;
        const isLast = index >= numbers.length - 1;
        const scenes = CHAPTER_SCENES[n];

        const chapter = (
          <ChapterMenuListItem
            type="chapter"
            chapterNumber={n}
            label={label}
            expanded={scenes ? (CHAPTER_DEFAULT_EXPANDED[n] ?? true) : undefined}
            href={SECTION_HREF}
          >
            {scenes?.map((scene, sceneIndex) => (
              <ChapterMenuListItem
                key={scene.id}
                type="scene"
                sceneNumber={sceneIndex + 1}
                label={scene.label}
                href={SECTION_HREF}
              />
            ))}
          </ChapterMenuListItem>
        );

        return (
          <Fragment key={n}>
            {chapter}
            {isLast ? null : (
              <AddSectionInlineGap
                type="chapter"
                addChapter={{ href: '#' }}
                addAct={{ href: '#' }}
              />
            )}
          </Fragment>
        );
      })}
    </>
  );
}

function OutlineList({ children }: { children: ReactNode }) {
  return (
    <div
      className={[
        'flex w-full flex-col ps-[length:var(--spacing-xs)]',
        /* 12px between adjacent rows that do not already have an insert gap. */
        '[&>:not([data-slot=add-section-inline-gap])+>:not([data-slot=add-section-inline-gap])]:mt-[length:var(--spacing-sm)]',
      ].join(' ')}
    >
      {children}
    </div>
  );
}

type OutlineMode = 'chapters' | 'scenes' | 'full';

let nextOutlineRowId = 0;
function makeOutlineRowId() {
  nextOutlineRowId += 1;
  return `row-${nextOutlineRowId}`;
}

/** Same seed content as before, flattened: chapters/scenes/subscenes are
 * all siblings in one array now, related only by `parentId`. */
function makeInteractiveSeed(): OutlineItem[] {
  const items: OutlineItem[] = [];
  DEMO_CHAPTER_TITLES.forEach((label, index) => {
    const n = index + 1;
    const chapterId = makeOutlineRowId();
    const scenes = CHAPTER_SCENES[n];
    items.push({
      id: chapterId,
      kind: 'chapter',
      label,
      parentId: ROOT_CONTAINER,
      isCollapsed: scenes ? !(CHAPTER_DEFAULT_EXPANDED[n] ?? true) : undefined,
    });
    for (const scene of scenes ?? []) {
      const sceneId = makeOutlineRowId();
      items.push({ id: sceneId, kind: 'scene', label: scene.label, parentId: chapterId });
      for (const subscene of scene.subscenes ?? []) {
        items.push({
          id: makeOutlineRowId(),
          kind: 'subscene',
          label: subscene.label,
          parentId: sceneId,
        });
      }
    }
  });
  return items;
}

function countTopLevel(items: OutlineItem[]): number {
  return items.filter((item) => item.parentId === ROOT_CONTAINER).length;
}

/** Absolute array index of the Nth top-level item, or the array end if `position` is past the last one. */
function topLevelInsertIndex(items: OutlineItem[], position: number): number {
  let seen = 0;
  for (let i = 0; i < items.length; i += 1) {
    if (items[i].parentId === ROOT_CONTAINER) {
      if (seen === position) return i;
      seen += 1;
    }
  }
  return items.length;
}

/**
 * Full interactive outline demo — owns the one flat outline array, the
 * header's outline-mode cycle switch, and drag-and-drop together, since
 * switching modes has to reach into every chapter's `isCollapsed` from
 * outside, and a drop can rename/renumber/recollapse the same array insert
 * does. This is the single source of truth for the outline; there is no
 * separate nested-tree model anymore (see `.migration/chapter-menu-
 * handoff.md` for why) — see `outline-dnd.ts` for the `OutlineItem` shape.
 *
 * - Gap popover Chapter / Act items splice an untitled item in at that
 *   top-level position and focus its title input so typing starts
 *   immediately. Chapter / act / scene numbers are derived from position on
 *   every render (`computeOutlineNumbers`, not stored), so inserting or
 *   dragging anywhere renumbers everything after it for free.
 * - The cycle switch is an action, not a derived display: clicking it sets
 *   `isCollapsed` on every chapter that currently has scenes (Scenes / Full
 *   outline open them, Chapters only closes them), then per-chapter
 *   chevrons work normally again — toggling that one chapter's own
 *   `isCollapsed` — until the next click. Full outline additionally reveals
 *   subscenes; Scenes stops at the scene level. The mode itself is a global
 *   view preference, not outline data, so it stays component state rather
 *   than living on any item.
 * - Drag reuses the exact same reducer as the standalone "Drag to reorder"
 *   demo below (`useOutlineDragAndDrop` / `reorderOutline`). The nested
 *   chapter → scene → subscene branch rendering (chevron, rail) is
 *   reconstructed from the flat array via `childrenOf` at render time —
 *   dnd-kit reads rendered DOM rects for collision detection, not tree
 *   structure, so that visual nesting and the drag mechanics don't conflict.
 */
function InteractiveChapterMenu({
  headerVariant = 'alt',
  showClose = true,
}: {
  headerVariant?: 'main' | 'alt';
  showClose?: boolean;
}) {
  const [mode, setMode] = useState<OutlineMode>('full');
  const [items, setItems] = useState<OutlineItem[]>(makeInteractiveSeed);
  const [focusRowId, setFocusRowId] = useState<string | null>(null);
  const rowNodes = useRef(new Map<string, HTMLDivElement>());
  const [rejectedReason, setRejectedReason] = useState<string | null>(null);

  const {
    sensors,
    collisionDetection,
    activeId,
    rejectedId,
    onDragStart,
    onDragEnd,
    onDragCancel,
  } = useOutlineDragAndDrop({
    items,
    onItemsChange: (next) => {
      setItems(next);
      setRejectedReason(null);
    },
    onRejected: (_activeId, reason) => setRejectedReason(reason),
  });

  function handleDragStart(event: DragStartEvent) {
    setRejectedReason(null);
    onDragStart(event);
  }

  function handleModeChange(next: OutlineMode) {
    setMode(next);
    setItems((current) =>
      current.map((item) =>
        item.kind === 'chapter' && childrenOf(current, item.id).length > 0
          ? { ...item, isCollapsed: next === 'chapters' }
          : item,
      ),
    );
  }

  function toggleChapterCollapsed(id: string) {
    setItems((current) =>
      current.map((item) =>
        item.id === id ? { ...item, isCollapsed: !item.isCollapsed } : item,
      ),
    );
  }

  function insertRow(
    topLevelPosition: number,
    kind: Extract<OutlineItemKind, 'chapter' | 'act'>,
  ) {
    const id = makeOutlineRowId();
    const newItem: OutlineItem = { id, kind, label: '', parentId: ROOT_CONTAINER };
    setItems((current) => {
      const at = topLevelInsertIndex(current, topLevelPosition);
      return [...current.slice(0, at), newItem, ...current.slice(at)];
    });
    setFocusRowId(id);
  }

  function updateLabel(id: string, label: string) {
    setItems((current) =>
      current.map((item) => (item.id === id ? { ...item, label } : item)),
    );
  }

  useEffect(() => {
    if (!focusRowId) return;
    const input = rowNodes.current
      .get(focusRowId)
      ?.querySelector<HTMLInputElement | HTMLTextAreaElement>(
        'input, textarea',
      );
    input?.focus();
    input?.select();
    setFocusRowId(null);
  }, [focusRowId]);

  function insertGap(position: number) {
    return (
      <AddSectionInlineGap
        type="chapter"
        onAddChapter={() => insertRow(position, 'chapter')}
        onAddAct={() => insertRow(position, 'act')}
      />
    );
  }

  function trackNode(id: string) {
    return (node: HTMLDivElement | null) => {
      if (node) rowNodes.current.set(id, node);
      else rowNodes.current.delete(id);
    };
  }

  const numbers = computeOutlineNumbers(items);
  const topLevel = items.filter((item) => item.parentId === ROOT_CONTAINER);
  const activeItem = items.find((item) => item.id === activeId);

  return (
    <ChapterMenu
      showClose={showClose}
      header={
        <DemoHeader
          variant={headerVariant}
          outlineValue={mode}
          onOutlineValueChange={(value) => handleModeChange(value as OutlineMode)}
        />
      }
      onAddChapter={() => insertRow(countTopLevel(items), 'chapter')}
      onAddAct={() => insertRow(countTopLevel(items), 'act')}
    >
      <div className="flex w-full flex-col gap-[length:var(--spacing-sm)]">
        <style>{SHAKE_KEYFRAMES}</style>
        <DndContext
          sensors={sensors}
          collisionDetection={collisionDetection}
          onDragStart={handleDragStart}
          onDragEnd={onDragEnd}
          onDragCancel={onDragCancel}
        >
          <SortableContext
            items={items.map((item) => item.id)}
            strategy={verticalListSortingStrategy}
          >
            <OutlineList>
              {insertGap(0)}
              {topLevel.map((item, position) => (
                <Fragment key={item.id}>
                  {item.kind === 'act' ? (
                    <DraggableOutlineRow id={item.id} rejected={rejectedId === item.id}>
                      <div ref={trackNode(item.id)}>
                        <AddSectionInlineButton
                          type="actUntitled"
                          actIndex={numbers.get(item.id) ?? 1}
                          actTitle={item.label}
                          onActTitleChange={(label) => updateLabel(item.id, label)}
                        />
                      </div>
                    </DraggableOutlineRow>
                  ) : (
                    <DraggableOutlineRow id={item.id} rejected={rejectedId === item.id}>
                      <div ref={trackNode(item.id)}>
                        <ChapterMenuListItem
                          type="chapter"
                          chapterNumber={numbers.get(item.id) ?? 1}
                          label={item.label}
                          untitled={item.label.trim() === ''}
                          href={SECTION_HREF}
                          onLabelChange={(label) => updateLabel(item.id, label)}
                          expanded={
                            childrenOf(items, item.id).length > 0 && !item.isCollapsed
                          }
                          onExpandToggle={() => toggleChapterCollapsed(item.id)}
                        >
                          {childrenOf(items, item.id).map((scene, sceneIndex) => {
                            const subscenes = childrenOf(items, scene.id);
                            return (
                              <DraggableOutlineRow
                                key={scene.id}
                                id={scene.id}
                                rejected={rejectedId === scene.id}
                              >
                                <ChapterMenuListItem
                                  type="scene"
                                  sceneNumber={sceneIndex + 1}
                                  label={scene.label}
                                  href={SECTION_HREF}
                                  onLabelChange={(label) => updateLabel(scene.id, label)}
                                >
                                  {mode === 'full' && subscenes.length > 0
                                    ? subscenes.map((subscene) => (
                                        <DraggableOutlineRow
                                          key={subscene.id}
                                          id={subscene.id}
                                          rejected={rejectedId === subscene.id}
                                        >
                                          <ChapterMenuListItem
                                            type="subscene"
                                            label={subscene.label}
                                            href={SECTION_HREF}
                                            onLabelChange={(label) =>
                                              updateLabel(subscene.id, label)
                                            }
                                          />
                                        </DraggableOutlineRow>
                                      ))
                                    : null}
                                </ChapterMenuListItem>
                              </DraggableOutlineRow>
                            );
                          })}
                        </ChapterMenuListItem>
                      </div>
                    </DraggableOutlineRow>
                  )}
                  {insertGap(position + 1)}
                </Fragment>
              ))}
            </OutlineList>
          </SortableContext>
          <DragOverlay>
            {activeItem ? (
              <div
                className={cn(
                  'rounded-[length:var(--rounded-md)] bg-[var(--card)]',
                  'shadow-[var(--shadow-lg-black)] dark:shadow-[var(--shadow-lg-white)]',
                  'opacity-95',
                )}
              >
                {renderOutlineItem(activeItem, numbers, () => {})}
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
        <p
          role="alert"
          className={cn(
            'px-[length:var(--spacing-xs)] min-h-[1lh]',
            'text-[length:var(--text-paragraph-mini-regular-font-size)]',
            'leading-[var(--text-paragraph-mini-regular-line-height)]',
            'text-[color:var(--destructive)]',
          )}
        >
          {rejectedReason}
        </p>
      </div>
    </ChapterMenu>
  );
}

function ActsFalseBody() {
  return (
    <OutlineList>
      <ChapterRows from={1} to={15} />
    </OutlineList>
  );
}

function ActsSubscenesBody() {
  return (
    <OutlineList>
      <ChapterMenuListItem
        type="chapter"
        chapterNumber={1}
        label="The Eldergrove"
        expanded
        href={SECTION_HREF}
      >
        <ChapterMenuListItem
          type="scene"
          sceneNumber={1}
          label="The Eldergrove"
          href={SECTION_HREF}
        >
          <ChapterMenuListItem type="subscene" label="Intro" href={SECTION_HREF} />
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
          label="The Wand that Would Not Fall"
          href={SECTION_HREF}
        />
        <ChapterMenuListItem
          type="scene"
          sceneNumber={3}
          label="The Wand that Would Not Fall"
          href={SECTION_HREF}
        />
      </ChapterMenuListItem>
      <AddSectionInlineGap
        type="chapter"
        addChapter={{ href: '#' }}
        addAct={{ href: '#' }}
      />
      <ChapterMenuListItem
        type="chapter"
        chapterNumber={2}
        label="Shadows in the mist"
        href={SECTION_HREF}
      />
      <AddSectionInlineGap
        type="chapter"
        addChapter={{ href: '#' }}
        addAct={{ href: '#' }}
      />
      <ChapterMenuListItem
        type="chapter"
        chapterNumber={3}
        label="A quiet bargain"
        href={SECTION_HREF}
      />
    </OutlineList>
  );
}

function ActsEmptyBody() {
  return (
    <OutlineList>
      <ChapterMenuListItem type="chapter" untitled href={SECTION_HREF} />
    </OutlineList>
  );
}

function ActsBody({ variant }: { variant: ActsVariant }) {
  switch (variant) {
    case 'subscenes':
      return <ActsSubscenesBody />;
    case 'empty':
      return <ActsEmptyBody />;
    default:
      return <ActsFalseBody />;
  }
}

function MenuExample({
  acts = 'false',
  headerVariant = 'alt',
}: {
  acts?: ActsVariant;
  headerVariant?: 'main' | 'alt';
}) {
  return (
    <ChapterMenu
      header={
        <DemoHeader
          variant={headerVariant}
          outlineValue={acts === 'empty' ? 'chapters' : 'scenes'}
        />
      }
    >
      <ActsBody variant={acts} />
    </ChapterMenu>
  );
}

function ChapterMenuPlayground() {
  const [acts, setActs] = useState<ActsVariant>('false');
  const [headerVariant, setHeaderVariant] = useState<'main' | 'alt'>('alt');
  const [showClose, setShowClose] = useState(true);

  return (
    <PlaygroundPanel
      previewAlign="center"
      preview={
        acts === 'false' ? (
          <InteractiveChapterMenu
            headerVariant={headerVariant}
            showClose={showClose}
          />
        ) : (
          <ChapterMenu
            showClose={showClose}
            header={
              <DemoHeader
                variant={headerVariant}
                outlineValue={acts === 'empty' ? 'chapters' : 'scenes'}
              />
            }
          >
            <ActsBody variant={acts} />
          </ChapterMenu>
        )
      }
      controls={
        <div className={PRIMITIVE_PLAYGROUND_CONTROL_GRID}>
          <div className="min-w-0 col-span-2">
            <div className="mb-1.5 font-sans text-xs text-muted-foreground">
              Acts (body)
            </div>
            <RadioGroup
              value={acts}
              onValueChange={(value) => setActs(value as ActsVariant)}
              className="gap-[length:var(--spacing-xs)]"
            >
              {ACTS_OPTIONS.map((option) => {
                const id = `chapter-menu-acts-${option.value}`;
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
            </RadioGroup>
          </div>
          <InlineSegmentedControl
            label="Header"
            value={headerVariant}
            onChange={(value) => setHeaderVariant(value as 'main' | 'alt')}
            options={[
              { value: 'alt', label: 'Alt' },
              { value: 'main', label: 'Main' },
            ]}
            fullWidth
          />
          <InlineSegmentedControl
            label="Close"
            value={showClose ? 'on' : 'off'}
            onChange={(value) => setShowClose(value === 'on')}
            options={[
              { value: 'on', label: 'On' },
              { value: 'off', label: 'Off' },
            ]}
            fullWidth
          />
        </div>
      }
    />
  );
}

function OverviewPage() {
  return (
    <PrimitivePage
      title="Chapter Menu"
      description={
        <>
          Manuscript outline panel from Figma{' '}
          <a href={FIGMA_SET_URL} target="_blank" rel="noreferrer">
            Chapter menu
          </a>{' '}
          (<code>16373:12458</code>). Shell is Card shadow + bordered; Acts
          variants compose header, list items, and add-section rows into the
          body slot. Style 1–3 act layouts are deferred.
        </>
      }
      playground={<ChapterMenuPlayground />}
      variants={
        <div className="flex flex-col gap-[length:var(--spacing-2xl)]">
          {ACTS_OPTIONS.map((option) => (
            <PrimitiveGalleryItem key={option.value} label={option.label} fill>
              <MenuExample acts={option.value} />
            </PrimitiveGalleryItem>
          ))}
        </div>
      }
      usageGuidance={
        <ul className="list-disc space-y-2 ps-5 text-sm text-muted-foreground">
          <li>
            Pass <code>ChapterMenuHeader</code> into <code>header</code> and
            outline rows / inserts as <code>children</code>.
          </li>
          <li>
            Default footer is Add chapter (primary outline) + Add act (ghost).
            Pass a custom <code>footer</code> or <code>null</code> to omit.
          </li>
          <li>
            Chapter-to-chapter gap is <code>--spacing-sm</code> (12px).
            Hovering between rows expands that slot so the divider fits.
          </li>
          <li>
            Acts=False is the authoritative shell demo. Style 1–3 need product
            designation before landing as separate compositions.
          </li>
        </ul>
      }
      accessibility={
        <ul className="list-disc space-y-2 ps-5 text-sm text-muted-foreground">
          <li>
            Close control is Icon Button with{' '}
            <code>aria-label=&quot;Close chapter menu&quot;</code>. In the
            Chapter Nav Button dropdown it dismisses the overlay.
          </li>
          <li>
            Outline rows own their rename / expand / section-link semantics —
            see Chapter Menu List Item.
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

export const ActsFalse: Story = {
  name: 'Acts / False',
  render: () => <MenuExample acts="false" />,
};

export const ActsSubscenes: Story = {
  name: 'Acts / Subscenes',
  render: () => <MenuExample acts="subscenes" />,
};

export const ActsEmpty: Story = {
  name: 'Acts / Empty',
  render: () => <MenuExample acts="empty" headerVariant="main" />,
};

export const Interactive: Story = {
  name: 'Interactive / Insert chapter or act',
  render: () => <InteractiveChapterMenu />,
};

/**
 * Drag-and-drop demo — flat outline (no chevron/expand-collapse; every row
 * always visible so drag targets are always reachable). The whole row is
 * the drag source; see `use-outline-dnd-kit.ts` for the dnd-kit wiring and
 * `outline-dnd.ts` for the pure reorder + type-coercion logic it calls.
 */
const SHAKE_KEYFRAMES = `
@keyframes outline-row-shake {
  10%, 90% { transform: translateX(-1px); }
  20%, 80% { transform: translateX(2px); }
  30%, 50%, 70% { transform: translateX(-4px); }
  40%, 60% { transform: translateX(4px); }
}
`;

function makeDragDropSeed(): OutlineItem[] {
  return [
    {
      id: 'dd-ch1',
      kind: 'chapter',
      label: 'The Eldergrove',
      parentId: ROOT_CONTAINER,
    },
    { id: 'dd-sc1', kind: 'scene', label: 'Eyes wide open', parentId: 'dd-ch1' },
    { id: 'dd-sub1', kind: 'subscene', label: 'Intro', parentId: 'dd-sc1' },
    {
      id: 'dd-sub2',
      kind: 'subscene',
      label: 'The reveal',
      parentId: 'dd-sc1',
    },
    {
      id: 'dd-sc2',
      kind: 'scene',
      label: 'The ruthless kill',
      parentId: 'dd-ch1',
    },
    {
      id: 'dd-act1',
      kind: 'act',
      label: 'The Gathering',
      parentId: ROOT_CONTAINER,
    },
    {
      id: 'dd-ch2',
      kind: 'chapter',
      label: 'Dragon! In the distance',
      parentId: ROOT_CONTAINER,
    },
    { id: 'dd-sc3', kind: 'scene', label: 'Scene one', parentId: 'dd-ch2' },
    {
      id: 'dd-ch3',
      kind: 'chapter',
      label: 'Sparky the dragon dog — no scenes',
      parentId: ROOT_CONTAINER,
    },
  ];
}

function renderOutlineItem(
  item: OutlineItem,
  numbers: Map<string, number>,
  onLabelChange: (id: string, label: string) => void,
) {
  switch (item.kind) {
    case 'chapter':
      return (
        <ChapterMenuListItem
          type="chapter"
          chapterNumber={numbers.get(item.id) ?? 1}
          label={item.label}
          href={SECTION_HREF}
          onLabelChange={(label) => onLabelChange(item.id, label)}
        />
      );
    case 'scene':
      return (
        <ChapterMenuListItem
          type="scene"
          sceneNumber={numbers.get(item.id) ?? 1}
          label={item.label}
          href={SECTION_HREF}
          onLabelChange={(label) => onLabelChange(item.id, label)}
        />
      );
    case 'subscene':
      return (
        <ChapterMenuListItem
          type="subscene"
          label={item.label}
          href={SECTION_HREF}
          onLabelChange={(label) => onLabelChange(item.id, label)}
        />
      );
    case 'act':
      return (
        <AddSectionInlineButton
          type="actUntitled"
          actIndex={numbers.get(item.id) ?? 1}
          actTitle={item.label}
          onActTitleChange={(label) => onLabelChange(item.id, label)}
        />
      );
    default:
      return null;
  }
}

/** Whole-row drag source — no handle icon; pointer or keyboard (Space/arrows). */
function DraggableOutlineRow({
  id,
  rejected,
  children,
}: {
  id: string;
  rejected: boolean;
  children: ReactNode;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id });

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        animation: rejected ? 'outline-row-shake 0.4s ease-in-out' : undefined,
      }}
      data-slot="outline-dnd-row"
      className={cn(
        'touch-none outline-none',
        'cursor-grab active:cursor-grabbing',
        'rounded-[length:var(--rounded-md)]',
        'focus-visible:shadow-[var(--effect-focus-ring-secondary)]',
      )}
    >
      {children}
    </div>
  );
}

function DragAndDropOutline() {
  const [items, setItems] = useState<OutlineItem[]>(makeDragDropSeed);
  const [rejectedReason, setRejectedReason] = useState<string | null>(null);

  const {
    sensors,
    collisionDetection,
    activeId,
    rejectedId,
    onDragStart,
    onDragEnd,
    onDragCancel,
  } = useOutlineDragAndDrop({
    items,
    onItemsChange: (next) => {
      setItems(next);
      setRejectedReason(null);
    },
    onRejected: (_activeId, reason) => setRejectedReason(reason),
  });

  function updateLabel(id: string, label: string) {
    setItems((current) =>
      current.map((item) => (item.id === id ? { ...item, label } : item)),
    );
  }

  function handleDragStart(event: DragStartEvent) {
    setRejectedReason(null);
    onDragStart(event);
  }

  const numbers = computeOutlineNumbers(items);
  const activeItem = items.find((item) => item.id === activeId);

  return (
    <div className="flex w-full flex-col gap-[length:var(--spacing-sm)]">
      <style>{SHAKE_KEYFRAMES}</style>
      <DndContext
        sensors={sensors}
        collisionDetection={collisionDetection}
        onDragStart={handleDragStart}
        onDragEnd={onDragEnd}
        onDragCancel={onDragCancel}
      >
        <SortableContext
          items={items.map((item) => item.id)}
          strategy={verticalListSortingStrategy}
        >
          <OutlineList>
            {items.map((item) => (
              <DraggableOutlineRow
                key={item.id}
                id={item.id}
                rejected={rejectedId === item.id}
              >
                {renderOutlineItem(item, numbers, updateLabel)}
              </DraggableOutlineRow>
            ))}
          </OutlineList>
        </SortableContext>
        <DragOverlay>
          {activeItem ? (
            <div
              className={cn(
                'rounded-[length:var(--rounded-md)] bg-[var(--card)]',
                'shadow-[var(--shadow-lg-black)] dark:shadow-[var(--shadow-lg-white)]',
                'opacity-95',
              )}
            >
              {renderOutlineItem(activeItem, numbers, () => {})}
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
      <p
        role="alert"
        className={cn(
          'px-[length:var(--spacing-xs)] min-h-[1lh]',
          'text-[length:var(--text-paragraph-mini-regular-font-size)]',
          'leading-[var(--text-paragraph-mini-regular-line-height)]',
          'text-[color:var(--destructive)]',
        )}
      >
        {rejectedReason}
      </p>
    </div>
  );
}

export const DragAndDrop: Story = {
  name: 'Interactive / Drag to reorder',
  render: () => (
    <ChapterMenu header={<DemoHeader />}>
      <DragAndDropOutline />
    </ChapterMenu>
  ),
};
