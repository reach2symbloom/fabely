/**
 * Add Section Inline Button — insert row between manuscript sections.
 *
 * Figma: Add section inline button (`16373:4624`) Chapter / Scene / Act
 * variants. Chapter / Scene: plus (Icon Button) left of a proximity-revealed
 * quiet divider whose glow follows the pointer. Chapter plus or divider opens a Dropdown Menu (Chapter /
 * Act). Scene plus or divider inserts directly.
 *
 * Placement: feature. Stays in `src/features/chapter-nav/`.
 *
 * Chapter / Scene: list gap is always `--spacing-sm` (12) — rest and hover.
 * The plus fades in without changing the divider or gap height.
 */

'use client';

import * as React from 'react';
import {
  EllipsisVerticalIcon,
  PencilIcon,
  PlusIcon,
  SeparatorHorizontalIcon,
  Trash2Icon,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { IconButton } from '@/primitives/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/primitives/dropdown-menu';
import { Input } from '@/primitives/input';
import { Separator } from '@/primitives/separator';
import type { ChapterNavInsertContext, ChapterNavMutationContext } from '../integration';

export type AddSectionInlineType =
  | 'chapter'
  | 'scene'
  | 'subscene'
  | 'actUntitled'
  | 'actNoOnly'
  | 'actTitled';

/**
 * How a Chapter / Act / Scene control fires. Prefer `onClick` for app
 * handlers. `href` still runs via the item click (callers who need a real
 * `<a>` should handle navigation in `onClick`). `formAction` / `formMethod`
 * apply when the control is a submit button (Scene plus).
 */
export type AddSectionAction = {
  href?: string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement | HTMLButtonElement>;
  target?: React.HTMLAttributeAnchorTarget;
  rel?: string;
  formAction?: string;
  formMethod?: string;
  form?: string;
  type?: 'button' | 'submit' | 'reset';
};

export type AddSectionInlineButtonProps = {
  manuscriptId?: string;
  parentId?: string;
  insertAfterId?: string;
  /** Present for an existing Act title/actions row. */
  actId?: string;
  /** Figma Type axis (insert + Act split-parse). */
  type?: AddSectionInlineType;
  /**
   * 1-based position in the act sequence. Drives the roman numeral for all
   * Act variants (I, II, III, …). Not editable — sequence-owned.
   */
  actIndex?: number;
  /** Act title field value when type is untitled / titled. */
  actTitle?: string;
  placeholder?: string;
  className?: string;
  /**
   * Chapter / Scene: hide plus + divider until the gap is hovered (or
   * focused / menu-open). Default `true` for those types; Act rows stay visible.
   */
  revealOnHover?: boolean;
  /** Storybook / demos — lock Chapter / Scene chrome visible. */
  forceHover?: boolean;
  /** Storybook / demos — lock the Chapter / Act menu open. */
  forceOpen?: boolean;
  /**
   * An outline drag is in flight elsewhere in the tree — hide this gap and
   * block pointer interaction with it. Inserting mid-drag would reshuffle
   * the very list the drag is tracking indices into.
   */
  disabled?: boolean;
  /** Wire the Chapter menu item (Chapter type row). */
  addChapter?: AddSectionAction;
  /** Wire the Act menu item (Chapter type row). */
  addAct?: AddSectionAction;
  /** Wire the Scene plus (Scene type row). */
  addScene?: AddSectionAction;
  /** Wire the Sub-scene plus (Sub-scene type row). */
  addSubscene?: AddSectionAction;
  /**
   * Shorthand click handlers — merged after `add*.onClick`. Prefer `addChapter`
   * / `addAct` / `addScene` when you also need `href` or form attributes.
   */
  onAddChapter?: (context: ChapterNavInsertContext) => void;
  onAddAct?: (context: ChapterNavInsertContext) => void;
  onAddScene?: (context: ChapterNavInsertContext) => void;
  onAddSubscene?: (context: ChapterNavInsertContext) => void;
  onActTitleChange?: (value: string, context: ChapterNavMutationContext) => void;
  onActTitleCommit?: (value: string, context: ChapterNavMutationContext) => void;
  onDeleteAct?: (context: ChapterNavMutationContext) => void;
  onRenameAct?: (context: ChapterNavMutationContext) => void;
};

const actSerifType = [
  'font-[family-name:var(--text-paragraph-serif-regular-font-family)]',
  '[font-weight:var(--text-paragraph-serif-regular-font-weight)]',
  'text-[length:var(--text-paragraph-serif-regular-font-size)]',
  'leading-[var(--text-paragraph-serif-regular-line-height)]',
  'tracking-[var(--text-paragraph-serif-regular-letter-spacing)]',
].join(' ');

const insertChromeReveal = [
  'opacity-0',
  'pointer-events-none',
  'transition-opacity duration-fast ease-emphasized',
  'group-hover/add-section-insert:opacity-100',
  'group-hover/add-section-insert:pointer-events-auto',
  'group-focus-within/add-section-insert:opacity-100',
  'group-focus-within/add-section-insert:pointer-events-auto',
  'group-data-[force-hover=true]/add-section-insert:opacity-100',
  'group-data-[force-hover=true]/add-section-insert:pointer-events-auto',
  'group-data-[insert-suppressed=true]/add-section-insert:opacity-0',
  'group-data-[insert-suppressed=true]/add-section-insert:pointer-events-none',
  'group-data-[disabled=true]/add-section-insert:!opacity-0',
  'group-data-[disabled=true]/add-section-insert:!pointer-events-none',
].join(' ');

/**
 * Secondary-200 fade rail from the original Figma insert divider. Kept as a
 * shared visual primitive for drag insertion feedback after the Add Section
 * interaction itself moved to the quieter plus + separator treatment.
 */
const SECONDARY_GLOW_LINE =
  'linear-gradient(90deg, color-mix(in srgb, var(--tw-raw-secondary-200) 0%, transparent) 0%, var(--tw-raw-secondary-200) 18.931%, var(--tw-raw-secondary-200) 85%, color-mix(in srgb, var(--tw-raw-secondary-200) 0%, transparent) 100%)';

function SecondaryGlowRail({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        'relative flex min-h-0 min-w-0 flex-1 flex-col justify-center self-stretch py-[var(--spacing-xs)]',
        className,
      )}
    >
      <span
        className="pointer-events-none absolute inset-x-0 top-1/2 h-[length:var(--stroke-regular)] -translate-y-1/2 blur-[length:var(--spacing-3xs)]"
        style={{ background: SECONDARY_GLOW_LINE }}
      />
      <span
        className="h-[length:var(--stroke-thin)] w-full"
        style={{ background: SECONDARY_GLOW_LINE }}
      />
    </div>
  );
}

function ActDiamondRail() {
  return (
    <div
      aria-hidden
      className="flex min-w-0 flex-1 items-center self-stretch text-[color:var(--theme-alpha-black-switch-5)]"
    >
      <span className="size-[length:var(--spacing-1-5)] shrink-0 rotate-45 bg-current" />
      <span className="h-[length:var(--stroke-thin)] min-w-0 flex-1 bg-current" />
      <span className="size-[length:var(--spacing-1-5)] shrink-0 rotate-45 bg-current" />
    </div>
  );
}

function InsertLine({
  onClick,
}: {
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}) {
  return (
    <div
      role="presentation"
      data-slot="add-section-insert-line"
      className={cn(
        'group/insert-line relative flex min-h-[length:var(--icon-md)] min-w-0 flex-1 cursor-pointer items-center',
      )}
      onClick={onClick}
    >
      <Separator
        aria-hidden
        data-slot="insert-divider-rule"
        orientation="horizontal"
        size="thin"
        spacing="none"
        className={cn(
          'min-w-0 w-auto flex-1',
          'h-[length:var(--stroke-thin)]',
          'bg-[color:var(--theme-alpha-black-switch-10)]',
          'origin-[var(--insert-hover-x)_center] scale-x-0 opacity-0',
          'transition-[opacity,scale] duration-[240ms] ease-in-out',
          'group-data-[insert-hovered=true]/add-section-insert:scale-x-100 group-data-[insert-hovered=true]/add-section-insert:opacity-100',
          'group-focus-within/add-section-insert:scale-x-100 group-focus-within/add-section-insert:opacity-100',
          'group-data-[force-hover=true]/add-section-insert:scale-x-100 group-data-[force-hover=true]/add-section-insert:opacity-100',
          'motion-reduce:transition-none',
          '[-webkit-mask-image:linear-gradient(to_right,transparent_0,black_var(--spacing-lg),black_calc(100%_-_var(--spacing-lg)),transparent_100%)]',
          '[mask-image:linear-gradient(to_right,transparent_0,black_var(--spacing-lg),black_calc(100%_-_var(--spacing-lg)),transparent_100%)]',
        )}
      />
      <span
        aria-hidden
        data-slot="insert-glow-ambient"
        className={cn(
          'pointer-events-none absolute inset-x-0 top-1/2 h-[length:var(--spacing-sm)] -translate-y-1/2 opacity-0',
          '[-webkit-mask-image:linear-gradient(to_right,transparent_0,black_var(--spacing-xl),black_calc(100%_-_var(--spacing-xl)),transparent_100%)]',
          '[mask-image:linear-gradient(to_right,transparent_0,black_var(--spacing-xl),black_calc(100%_-_var(--spacing-xl)),transparent_100%)]',
          'origin-[var(--insert-hover-x)_center] scale-x-0',
          'transition-[opacity,scale] duration-[240ms] ease-in-out',
          'group-data-[insert-hovered=true]/add-section-insert:opacity-60',
          'group-data-[insert-hovered=true]/add-section-insert:scale-x-100',
        )}
        style={{
          background:
            'radial-gradient(ellipse var(--spacing-7xl) var(--spacing-2xs) at calc(var(--insert-hover-x) + var(--insert-cloud-offset, 0px)) 50%, color-mix(in srgb, var(--tw-raw-white) 18%, transparent) 0%, color-mix(in srgb, color-mix(in srgb, var(--tw-raw-white) 90%, var(--tw-raw-primary-gradient-1)) 12%, transparent) 32%, color-mix(in srgb, var(--tw-raw-white) 4%, transparent) 66%, transparent 100%)',
        }}
      />
      <span
        aria-hidden
        data-slot="insert-glow-core"
        className={cn(
          'pointer-events-none absolute inset-x-0 top-1/2 h-[length:var(--spacing-2xs)] -translate-y-1/2 opacity-0',
          '[-webkit-mask-image:linear-gradient(to_right,transparent_0,black_var(--spacing-xl),black_calc(100%_-_var(--spacing-xl)),transparent_100%)]',
          '[mask-image:linear-gradient(to_right,transparent_0,black_var(--spacing-xl),black_calc(100%_-_var(--spacing-xl)),transparent_100%)]',
          'origin-[var(--insert-hover-x)_center] scale-x-0',
          'transition-[opacity,scale] duration-[240ms] ease-in-out',
          'group-data-[insert-hovered=true]/add-section-insert:opacity-70',
          'group-data-[insert-hovered=true]/add-section-insert:scale-x-100',
        )}
        style={{
          background:
            'radial-gradient(ellipse var(--spacing-6xl) var(--spacing-3xs) at calc(var(--insert-hover-x) + var(--insert-cloud-offset, 0px)) 50%, color-mix(in srgb, var(--tw-raw-white) 92%, var(--tw-raw-primary-gradient-1)) 0%, color-mix(in srgb, color-mix(in srgb, var(--tw-raw-white) 88%, var(--tw-raw-primary-gradient-1)) 28%, transparent) 38%, color-mix(in srgb, var(--tw-raw-white) 7%, transparent) 72%, transparent 100%)',
        }}
      />
    </div>
  );
}

/** 1-based act sequence → uppercase roman (I … MMMCMXCIX). */
function toRomanNumeral(index: number): string {
  const n = Math.floor(index);
  if (!Number.isFinite(n) || n < 1) return 'I';
  const table: Array<[number, string]> = [
    [1000, 'M'],
    [900, 'CM'],
    [500, 'D'],
    [400, 'CD'],
    [100, 'C'],
    [90, 'XC'],
    [50, 'L'],
    [40, 'XL'],
    [10, 'X'],
    [9, 'IX'],
    [5, 'V'],
    [4, 'IV'],
    [1, 'I'],
  ];
  let remaining = Math.min(n, 3999);
  let out = '';
  for (const [value, glyph] of table) {
    while (remaining >= value) {
      out += glyph;
      remaining -= value;
    }
  }
  return out;
}

function fireAction(
  event: React.MouseEvent<HTMLElement>,
  action?: AddSectionAction,
  onAdd?: (context: ChapterNavInsertContext) => void,
  context?: ChapterNavInsertContext,
) {
  action?.onClick?.(
    event as React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>,
  );
  if (!event.defaultPrevented && context) onAdd?.(context);
}

function InsertPlusButton({
  ariaLabel,
  onClick,
  formAction,
  formMethod,
  form,
  type = 'button',
}: {
  ariaLabel: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  formAction?: string;
  formMethod?: string;
  form?: string;
  type?: 'button' | 'submit' | 'reset';
}) {
  return (
    <IconButton
      variant="subtleFilled"
      size="mini"
      roundness="round"
      aria-label={ariaLabel}
      type={type}
      onClick={onClick}
      formAction={formAction}
      formMethod={formMethod}
      form={form}
    >
      <PlusIcon />
    </IconButton>
  );
}

function InsertMenuItem({
  action,
  onAdd,
  onActionTaken,
  context,
  children,
}: {
  action?: AddSectionAction;
  onAdd?: (context: ChapterNavInsertContext) => void;
  onActionTaken?: () => void;
  context: ChapterNavInsertContext;
  children: React.ReactNode;
}) {
  return (
    <DropdownMenuItem
      onClick={(event) => {
        onActionTaken?.();
        fireAction(event, action, onAdd, context);
      }}
    >
      {children}
    </DropdownMenuItem>
  );
}

function InsertChrome({
  type,
  reveal,
  menuOpen,
  onMenuOpenChange,
  addChapter,
  addAct,
  addScene,
  addSubscene,
  onAddChapter,
  onAddAct,
  onAddScene,
  onAddSubscene,
  onActionTaken,
  insertionContext,
}: {
  type: 'chapter' | 'scene' | 'subscene';
  reveal: boolean;
  menuOpen?: boolean;
  onMenuOpenChange?: (open: boolean) => void;
  addChapter?: AddSectionAction;
  addAct?: AddSectionAction;
  addScene?: AddSectionAction;
  addSubscene?: AddSectionAction;
  onAddChapter?: (context: ChapterNavInsertContext) => void;
  onAddAct?: (context: ChapterNavInsertContext) => void;
  onAddScene?: (context: ChapterNavInsertContext) => void;
  onAddSubscene?: (context: ChapterNavInsertContext) => void;
  onActionTaken?: () => void;
  insertionContext: Omit<ChapterNavInsertContext, 'kind'>;
}) {
  const [menuAnchor, setMenuAnchor] = React.useState<
    React.ComponentProps<typeof DropdownMenuContent>['anchor']
  >();

  function anchorMenuToPointer(event: React.PointerEvent<HTMLDivElement>) {
    const { clientX, clientY } = event;
    setMenuAnchor({
      getBoundingClientRect: () => new DOMRect(clientX, clientY, 0, 0),
    });
  }

  const plusAndLine = (
    plus: React.ReactNode,
    onLineClick?: React.MouseEventHandler<HTMLDivElement>,
    onPointerDown?: React.PointerEventHandler<HTMLDivElement>,
  ) => (
    <div
      className="flex w-full max-w-full items-center gap-[length:var(--spacing-2xs)]"
      onPointerDown={onPointerDown}
    >
      <div
        className={cn(
          'shrink-0',
          reveal && insertChromeReveal,
          /*
           * Same column as chapter chevron: list item uses
           * `left: -lg + 2xs` on a `--icon-xs` box. Mini Icon Button is
           * `--spacing-xl`; pull an extra `--spacing-1-5` so the plus
           * glyph shares that plane (half the 24 vs 12 size delta).
           */
          type === 'scene'
            ? 'ms-[length:var(--spacing-xs)]'
            : type === 'subscene'
              ? 'ms-[calc(var(--spacing-xl)+var(--spacing-3xs))]'
            : 'ms-[calc(-1*var(--spacing-lg)+var(--spacing-2xs)-var(--spacing-1-5))]',
        )}
      >
        {plus}
      </div>
      <InsertLine onClick={onLineClick} />
    </div>
  );

  if (type === 'scene' || type === 'subscene') {
    const action = type === 'scene' ? addScene : addSubscene;
    const onAdd = type === 'scene' ? onAddScene : onAddSubscene;
    const addNestedNow: React.MouseEventHandler<HTMLElement> = (event) => {
      onActionTaken?.();
      fireAction(event, action, onAdd, { ...insertionContext, kind: type });
    };

    return plusAndLine(
      <InsertPlusButton
        ariaLabel={type === 'scene' ? 'Add scene' : 'Add sub-scene'}
        type={action?.type ?? 'button'}
        formAction={action?.formAction}
        formMethod={action?.formMethod}
        form={action?.form}
        onClick={addNestedNow}
      />,
      addNestedNow,
    );
  }

  return (
    <DropdownMenu open={menuOpen} onOpenChange={onMenuOpenChange}>
      {plusAndLine(
        <DropdownMenuTrigger
          render={
            <IconButton
              variant="subtleFilled"
              size="mini"
              roundness="round"
              aria-label="Add chapter or act"
              onKeyDown={() => setMenuAnchor(undefined)}
            />
          }
        >
          <PlusIcon />
        </DropdownMenuTrigger>,
        () => onMenuOpenChange?.(true),
        anchorMenuToPointer,
      )}
      <DropdownMenuContent
        align="center"
        side="bottom"
        anchor={menuAnchor}
        className="w-fit min-w-0"
      >
        <DropdownMenuGroup>
          <InsertMenuItem action={addChapter} onAdd={onAddChapter} onActionTaken={onActionTaken} context={{ ...insertionContext, kind: 'chapter' }}>
            <PlusIcon />
            Chapter
          </InsertMenuItem>
          <InsertMenuItem action={addAct} onAdd={onAddAct} onActionTaken={onActionTaken} context={{ ...insertionContext, kind: 'act' }}>
            <SeparatorHorizontalIcon />
            Act
          </InsertMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function AddSectionInlineButton({
  manuscriptId,
  parentId,
  insertAfterId,
  actId,
  type = 'chapter',
  actIndex = 1,
  actTitle,
  placeholder = 'Untitled',
  className,
  revealOnHover,
  forceHover = false,
  forceOpen = false,
  disabled = false,
  addChapter,
  addAct,
  addScene,
  addSubscene,
  onAddChapter,
  onAddAct,
  onAddScene,
  onAddSubscene,
  onActTitleChange,
  onActTitleCommit,
  onDeleteAct,
  onRenameAct,
}: AddSectionInlineButtonProps) {
  const [title, setTitle] = React.useState(actTitle ?? '');
  const [menuOpen, setMenuOpen] = React.useState(forceOpen);
  const [actActionsOpen, setActActionsOpen] = React.useState(false);
  const [insertHovered, setInsertHovered] = React.useState(false);
  const [insertSuppressed, setInsertSuppressed] = React.useState(false);
  const actTitleRef = React.useRef<HTMLInputElement>(null);
  const actContext: ChapterNavMutationContext = { manuscriptId, entityId: actId, parentId, kind: 'act' };
  const insertionContext = { manuscriptId, parentId, insertAfterId };

  React.useEffect(() => {
    if (actTitle !== undefined) setTitle(actTitle);
  }, [actTitle]);

  React.useEffect(() => {
    if (forceOpen) setMenuOpen(true);
  }, [forceOpen]);

  const isAct =
    type === 'actUntitled' || type === 'actNoOnly' || type === 'actTitled';
  const hideUntilGapHover = revealOnHover ?? !isAct;
  const chromeVisible = forceHover || menuOpen;

  function commitTitle(next: string) {
    setTitle(next);
    onActTitleChange?.(next, actContext);
  }

  function updateInsertHoverPosition(event: React.PointerEvent<HTMLDivElement>) {
    const line = event.currentTarget.querySelector<HTMLElement>(
      '[data-slot="add-section-insert-line"]',
    );
    if (!line) return;
    const bounds = line.getBoundingClientRect();
    event.currentTarget.style.setProperty(
      '--insert-hover-x',
      `${event.clientX - bounds.left}px`,
    );
  }

  const actActions = (
    <DropdownMenu open={actActionsOpen} onOpenChange={setActActionsOpen}>
      <DropdownMenuTrigger
        render={
          <IconButton
            type="button"
            variant="ghost"
            size="mini"
            aria-label="Act actions"
            className={cn(
              'absolute end-[calc(-1*var(--spacing-xs))] top-1/2 z-10 -translate-y-1/2',
              !actActionsOpen && 'opacity-0',
              'group-hover/act-row:opacity-100 focus-visible:opacity-100',
            )}
          />
        }
      >
        <EllipsisVerticalIcon className="size-[length:var(--icon-sm)]" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" side="bottom" className="w-auto min-w-48">
        <DropdownMenuGroup>
          <DropdownMenuItem variant="destructive" onClick={() => onDeleteAct?.(actContext)}>
            <Trash2Icon />
            Delete act
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              onRenameAct?.(actContext);
              requestAnimationFrame(() => {
                actTitleRef.current?.focus();
                actTitleRef.current?.select();
              });
            }}
          >
            <PencilIcon />
            Rename
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  if (isAct) {
    const roman = toRomanNumeral(actIndex);

    if (type === 'actNoOnly') {
      return (
        <div
          data-slot="add-section-inline-button"
          data-type={type}
          className={cn(
            'group/act-row relative flex w-full max-w-full items-center gap-[var(--spacing-sm)]',
            'pt-[var(--spacing-sm)] pb-[var(--spacing-xs)]',
            className,
          )}
        >
          <ActDiamondRail />
          {actActions}
          <span
            aria-label={`Act ${roman}`}
            className={cn(
              actSerifType,
              'shrink-0 px-[var(--spacing-1-5)]',
              'text-[color:var(--neutrals-new-500)] whitespace-nowrap',
            )}
          >
            {roman}
          </span>
          <ActDiamondRail />
        </div>
      );
    }

    return (
      <div
        data-slot="add-section-inline-button"
        data-type={type}
        style={{ '--insert-hover-x': '50%' } as React.CSSProperties}
        onPointerEnter={updateInsertHoverPosition}
        onPointerMove={updateInsertHoverPosition}
        className={cn(
          'group/act-row relative flex w-full max-w-full items-center gap-[var(--spacing-sm)]',
          'pt-[var(--spacing-sm)] pb-[var(--spacing-xs)]',
          className,
        )}
      >
        <ActDiamondRail />
        <div className="flex shrink-0 items-center gap-[var(--spacing-2xs)]">
          <span
            className={cn(
              actSerifType,
              'text-[color:var(--neutrals-new-500)] whitespace-nowrap',
            )}
          >
            {`${roman}.`}
          </span>
          <Input
            ref={actTitleRef}
            variant="quiet"
            size="mini"
            aria-label="Act title"
            value={title}
            placeholder={type === 'actUntitled' ? placeholder : undefined}
            onChange={(event) => commitTitle(event.currentTarget.value)}
            onBlur={(event) => onActTitleCommit?.(event.currentTarget.value.trim(), actContext)}
            onKeyDown={(event) => {
              /* The Act row is also a keyboard drag activator. Keep typing
               * keys — especially Space — inside the native title input so
               * dnd-kit does not interpret them as lift/drop commands. */
              event.stopPropagation();
              if (event.key === 'Enter') {
                event.preventDefault();
                event.currentTarget.blur();
              }
            }}
            className={cn(
              actSerifType,
              'h-[length:var(--spacing-2xl)] w-auto field-sizing-content',
              'rounded-[length:var(--rounded-md)]',
              'px-[var(--spacing-1-5)]',
              'text-[color:var(--neutrals-new-500)]',
              'placeholder:text-[color:var(--theme-alpha-black-switch-25)]',
            )}
          />
        </div>
        <ActDiamondRail />
        {actActions}
      </div>
    );
  }

  const chrome = (
    <InsertChrome
      type={type}
      reveal={hideUntilGapHover}
      menuOpen={type === 'chapter' ? (forceOpen || menuOpen) : undefined}
      onMenuOpenChange={
        type === 'chapter'
          ? (next) => {
              if (!forceOpen) setMenuOpen(next);
            }
          : undefined
      }
      addChapter={addChapter}
      addAct={addAct}
      addScene={addScene}
      addSubscene={addSubscene}
      onAddChapter={onAddChapter}
      onAddAct={onAddAct}
      onAddScene={onAddScene}
      onAddSubscene={onAddSubscene}
      onActionTaken={() => {
        setInsertHovered(false);
        setInsertSuppressed(true);
      }}
      insertionContext={insertionContext}
    />
  );

  if (!hideUntilGapHover) {
    return (
      <div
        data-slot="add-section-inline-button"
        data-type={type}
        className={cn(
          'w-full max-w-full py-[length:var(--spacing-2xs)]',
          className,
        )}
      >
        {chrome}
      </div>
    );
  }

  /*
   * Hit-zone is `--spacing-sm` (12) at rest and on hover. Plus is Icon Button
   * mini (24) and overlays; overflow visible so it is not clipped.
   * Opacity only — no height change.
   */
  return (
    <div
      data-slot="add-section-inline-button"
      data-type={type}
      data-force-hover={chromeVisible || undefined}
      data-insert-hovered={insertHovered || undefined}
      data-insert-suppressed={insertSuppressed || undefined}
      data-disabled={disabled || undefined}
      style={{ '--insert-hover-x': '50%' } as React.CSSProperties}
      onPointerEnter={(event) => {
        if (disabled) return;
        updateInsertHoverPosition(event);
        if (!insertSuppressed) setInsertHovered(true);
      }}
      onPointerMove={disabled ? undefined : updateInsertHoverPosition}
      onPointerLeave={() => {
        setInsertHovered(false);
        setInsertSuppressed(false);
      }}
      className={cn(
        'group/add-section-insert relative z-10 isolate overflow-visible',
        'w-full max-w-full shrink-0',
        /* Nested rails paint a 20px-tall line target. Match that painted area
           with a real hit zone so the expanding parent gap cannot move the
           divider out from under the pointer—especially after the last scene. */
        type === 'chapter'
          ? 'h-[length:var(--spacing-sm)]'
          : 'h-[length:var(--icon-md)]',
        disabled && 'pointer-events-none',
        className,
      )}
    >
      <div className="absolute inset-x-0 top-1/2 z-20 -translate-y-1/2">
        {chrome}
      </div>
    </div>
  );
}

/** Resting outline rhythm that smoothly opens to reveal a nested insert target. */
function AddSectionInlineGap({
  className,
  ...props
}: AddSectionInlineButtonProps) {
  const isNestedSceneGap = props.type === 'scene' || props.type === 'subscene';

  return (
    <div
      data-slot="add-section-inline-gap"
      className={cn(
        'w-full shrink-0',
        isNestedSceneGap &&
          'relative transition-[height] duration-normal ease-emphasized hover:h-[length:var(--spacing-sm)] focus-within:h-[length:var(--spacing-sm)] [&>[data-slot=add-section-inline-button]]:absolute [&>[data-slot=add-section-inline-button]]:inset-x-0 [&>[data-slot=add-section-inline-button]]:top-1/2 [&>[data-slot=add-section-inline-button]]:-translate-y-1/2',
        props.type === 'scene' && 'h-[length:var(--spacing-3xs)]',
        props.type === 'subscene' && 'h-[length:var(--spacing-1-5)]',
        className,
      )}
    >
      <AddSectionInlineButton {...props} />
    </div>
  );
}

export { AddSectionInlineButton, AddSectionInlineGap, SecondaryGlowRail };
