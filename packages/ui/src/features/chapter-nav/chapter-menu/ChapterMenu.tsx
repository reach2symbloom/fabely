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

export type ChapterMenuProps = {
  /** Header slot — typically `ChapterMenuHeader`. */
  header: React.ReactNode;
  /** Outline body — list items, add-section inserts, act groups. */
  children?: React.ReactNode;
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
  onAddChapter?: () => void;
  onAddAct?: () => void;
  className?: string;
};

function DefaultFooter({
  addChapterLabel,
  addActLabel,
  onAddChapter,
  onAddAct,
}: {
  addChapterLabel: string;
  addActLabel: string;
  onAddChapter?: () => void;
  onAddAct?: () => void;
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
        onClick={onAddChapter}
      >
        <PlusIcon data-icon="inline-start" />
        {addChapterLabel}
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="default"
        className="h-[length:var(--spacing-9)] shrink-0"
        onClick={onAddAct}
      >
        <SeparatorHorizontalIcon data-icon="inline-start" />
        {addActLabel}
      </Button>
    </div>
  );
}

function ChapterMenu({
  header,
  children,
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
          />
        ));

  return (
    <Card
      data-slot="chapter-menu"
      variant="shadow"
      bordered
      className={cn(
        'relative flex w-full max-w-[542px] flex-col',
        'min-h-[length:var(--tw-raw-spacing-80)]',
        /* Cap the whole panel to the viewport (96px inset, matching Drawer's
         * own `100dvh - 6rem` — --spacing-7xl is that same 96px as a token)
         * so it scrolls internally instead of growing past the screen. */
        'max-h-[calc(100dvh-var(--spacing-7xl))]',
        /* Close control straddles the card edge — vendor Card uses overflow-hidden. */
        'overflow-visible!',
        /* Figma Header / Body pad xl; Footer pad md. */
        '[--card-spacing:var(--spacing-xl)]',
        className,
      )}
    >
      <div data-slot="chapter-menu-header-region" className="relative shrink-0">
        <CardHeader
          data-slot="chapter-menu-header-slot"
          className="pt-[length:var(--spacing-lg)]! pb-[length:var(--spacing-lg)]!"
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
              'absolute end-0 bottom-0 z-20',
              'translate-x-1/2 translate-y-1/2',
              'bg-[color:var(--background)]',
            )}
            onClick={onClose}
          >
            <PanelLeftCloseIcon />
          </IconButton>
        ) : null}
      </div>

      <CardContent
        data-slot="chapter-menu-body"
        className={cn(
          'flex min-h-0 flex-1 flex-col gap-[length:var(--spacing-sm)]',
          'overflow-y-auto scroll-fade-y',
          'pt-[length:var(--spacing-lg)]!',
        )}
      >
        {children}
      </CardContent>

      {resolvedFooter != null ? (
        <CardFooter
          data-slot="chapter-menu-footer"
          className="shrink-0 py-[length:var(--spacing-md)] [--card-spacing:var(--spacing-md)]"
        >
          {resolvedFooter}
        </CardFooter>
      ) : null}
    </Card>
  );
}

export { ChapterMenu };
