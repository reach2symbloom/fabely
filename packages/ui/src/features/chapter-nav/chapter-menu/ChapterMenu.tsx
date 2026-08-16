/**
 * Chapter Menu — manuscript outline panel opened from Chapter Nav Button.
 *
 * Figma set: Chapter menu (`16373:12458`). Authoritative first variant
 * Acts=False (`16373:10965`). Acts axis (False / Subscenes / Style 1–3 /
 * Empty) is body composition — this shell is shared.
 *
 * Placement: NO — chapter-nav panel. Stays in
 * `src/features/chapter-nav/chapter-menu/`.
 *
 * Overlap: Card (shadow + bordered) for chrome; ChapterMenuHeader /
 * ChapterMenuListItem / Add Section Inline Button / Button / IconButton
 * composed into slots — do not duplicate.
 */

'use client';

import * as React from 'react';
import { PanelLeftCloseIcon, PlusIcon, SeparatorHorizontalIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button, IconButton } from '@/primitives/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/primitives/card';
import { ScrollArea } from '@/primitives/scroll-area';
import type { ChapterNavInsertContext } from '../integration';

export type ChapterMenuProps = {
  manuscriptId?: string;
  /** Header slot — typically `ChapterMenuHeader`. */
  header: React.ReactNode;
  /** Outline body — list items, add-section inserts, act groups. */
  children?: React.ReactNode;
  /**
   * The first outline item is an Act, which already owns 12px top padding.
   * Removes the body's top inset so Act-first trees use the Act's own tighter
   * spacing instead of stacking modal and section padding.
   */
  bodyStartsWithAct?: boolean;
  /**
   * Footer slot. Default: Add chapter (outline) + Add act (ghost).
   * Pass `null` to omit the footer.
   */
  footer?: React.ReactNode | null;
  /** Close control (Figma panel-left-close Icon Button). Default on. */
  showClose?: boolean;
  onClose?: () => void;
  addChapterLabel?: string;
  addActLabel?: string;
  onAddChapter?: (context: ChapterNavInsertContext) => void;
  onAddAct?: (context: ChapterNavInsertContext) => void;
  className?: string;
};

function DefaultFooter({
  addChapterLabel,
  addActLabel,
  onAddChapter,
  onAddAct,
  manuscriptId,
}: {
  addChapterLabel: string;
  addActLabel: string;
  onAddChapter?: (context: ChapterNavInsertContext) => void;
  onAddAct?: (context: ChapterNavInsertContext) => void;
  manuscriptId?: string;
}) {
  return (
    <div
      data-slot="chapter-menu-footer-actions"
      className="flex w-full items-start gap-[length:var(--spacing-md)]"
    >
      <Button
        type="button"
        variant="primaryOutline"
        size="default"
        className="h-[length:var(--spacing-9)] min-w-0 flex-[1_1_auto]"
        data-action="add-chapter"
        onClick={() => onAddChapter?.({ manuscriptId, kind: 'chapter' })}
      >
        <PlusIcon data-icon="inline-start" />
        {addChapterLabel}
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="default"
        className="h-[length:var(--spacing-9)] shrink-0"
        data-action="add-act"
        onClick={() => onAddAct?.({ manuscriptId, kind: 'act' })}
      >
        <SeparatorHorizontalIcon data-icon="inline-start" />
        {addActLabel}
      </Button>
    </div>
  );
}

function ChapterMenu({
  manuscriptId,
  header,
  children,
  bodyStartsWithAct = false,
  footer,
  showClose = true,
  onClose,
  addChapterLabel = 'Add chapter',
  addActLabel = 'Add act',
  onAddChapter,
  onAddAct,
  className,
}: ChapterMenuProps) {
  const resolvedFooter =
    footer === null
      ? null
      : (footer ?? (
          <DefaultFooter
            addChapterLabel={addChapterLabel}
            addActLabel={addActLabel}
            onAddChapter={onAddChapter}
            onAddAct={onAddAct}
            manuscriptId={manuscriptId}
          />
        ));

  return (
    <Card
      data-slot="chapter-menu"
      variant="shadow"
      bordered
      className={cn(
        'relative flex w-[542px] min-w-[542px] shrink-0 flex-col',
        'bg-[#1d1d20]! shadow-[0_25px_25px_rgba(7,19,23,0.55)]!',
        'border-[length:var(--stroke-hairline)]!',
        'h-[calc(100dvh-var(--spacing-2xl))]',
        'min-h-[length:var(--tw-raw-spacing-80)]',
        'max-h-[calc(100dvh-var(--spacing-2xl))]',
        /* Close control straddles the card edge — vendor Card uses overflow-hidden. */
        'overflow-visible!',
        /* Figma Header / Body pad xl; Footer pad md. */
        '[--card-spacing:var(--spacing-xl)]',
        /* Inline creation targets compete with title editing. Hide and disable
           them while any outline input is active; normal hover discovery
           resumes as soon as the edit leaves the field. */
        'has-[input:focus]:[&_[data-slot=add-section-inline-button]]:invisible',
        'has-[textarea:focus]:[&_[data-slot=add-section-inline-button]]:invisible',
        className,
      )}
    >
      <div data-slot="chapter-menu-header-region" className="relative shrink-0">
        <CardHeader
          data-slot="chapter-menu-header-slot"
          className="min-w-0 border-b-[length:var(--stroke-hairline)]! pt-[length:var(--spacing-lg)]! pb-[length:var(--spacing-lg)]!"
        >
          {header}
        </CardHeader>
        {showClose ? (
          <IconButton
            type="button"
            variant="outline"
            size="sm"
            roundness="round"
            aria-label="Close chapter menu"
            data-slot="chapter-menu-close"
            className={cn(
              /* Center on header/body divider (header bottom rule) and card edge. */
              'absolute end-0 bottom-0 z-20 cursor-pointer',
              'translate-x-1/2 translate-y-1/2',
              'transition-[transform,background-color] duration-[240ms] ease-[var(--ease-emphasized)]',
              'hover:scale-[1.18] active:scale-[1.04]',
              'motion-reduce:transition-none',
              'bg-[color:var(--background)]',
              'hover:bg-[color-mix(in_srgb,var(--foreground)_5%,var(--background))]',
              'active:bg-[color-mix(in_srgb,var(--foreground)_10%,var(--background))]',
              'data-[pressed]:bg-[color-mix(in_srgb,var(--foreground)_10%,var(--background))]',
            )}
            onClick={onClose}
          >
            <PanelLeftCloseIcon />
          </IconButton>
        ) : null}
      </div>

      <ScrollArea className="h-0 min-h-0 flex-1 [&_[data-slot=scroll-area-viewport]]:absolute [&_[data-slot=scroll-area-viewport]]:inset-0 [&_[data-slot=scroll-area-viewport]]:size-auto">
        <CardContent
          data-slot="chapter-menu-body"
          className={cn(
            'flex min-h-full flex-col gap-[length:var(--spacing-sm)]',
            /* Optical alignment: shift the complete outline 2px toward the
               inline end while preserving its available width. */
            'ps-[calc(var(--card-spacing)+var(--tw-raw-spacing-0-5))]!',
            'pe-[calc(var(--card-spacing)-var(--tw-raw-spacing-0-5))]!',
            bodyStartsWithAct
              ? 'pt-0!'
              : 'pt-[length:var(--spacing-lg)]!',
          )}
        >
          {children}
        </CardContent>
      </ScrollArea>

      {resolvedFooter != null ? (
        <CardFooter
          data-slot="chapter-menu-footer"
          className="shrink-0 border-t-[length:var(--stroke-hairline)]! py-[length:var(--spacing-md)] [--card-spacing:var(--spacing-md)]"
        >
          {resolvedFooter}
        </CardFooter>
      ) : null}
    </Card>
  );
}

export { ChapterMenu };
