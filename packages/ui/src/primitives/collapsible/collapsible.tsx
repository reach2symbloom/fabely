/**
 * Fabely Collapsible — Base UI collapsible restyled with Foundations tokens.
 *
 * No dedicated Figma page; shadcn / Base UI docs are the composition source
 * (same milestone approach as Accordion). Public API matches
 * [shadcn Collapsible](https://ui.shadcn.com/docs/components/base/collapsible):
 * `Collapsible` / `CollapsibleTrigger` / `CollapsibleContent` (`open` /
 * `onOpenChange`). Import from this primitive, not `src/components/ui/collapsible`.
 */

'use client';

import * as React from 'react';
import {
  Collapsible as CollapsiblePrimitive,
  CollapsibleTrigger as CollapsibleTriggerPrimitive,
  CollapsibleContent as CollapsibleContentPrimitive,
} from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';

function Collapsible({
  className,
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive>) {
  return (
    <CollapsiblePrimitive
      className={cn(className)}
      {...props}
    />
  );
}

/**
 * Trigger stays chrome-light so call sites compose Button / IconButton via
 * `render`. Bare triggers get Foundations secondary focus ring.
 */
function CollapsibleTrigger({
  className,
  ...props
}: React.ComponentProps<typeof CollapsibleTriggerPrimitive>) {
  return (
    <CollapsibleTriggerPrimitive
      className={cn(
        'outline-none focus-visible:shadow-[var(--effect-focus-ring-secondary)]',
        className,
      )}
      {...props}
    />
  );
}

/**
 * Panel height uses Base UI `--collapsible-panel-height` with
 * starting/ending styles (same enter/exit model as Accordion’s panel).
 */
function CollapsibleContent({
  className,
  ...props
}: React.ComponentProps<typeof CollapsibleContentPrimitive>) {
  return (
    <CollapsibleContentPrimitive
      className={cn(
        'overflow-hidden',
        'h-[var(--collapsible-panel-height)]',
        'transition-[height] duration-200',
        'data-starting-style:h-0 data-ending-style:h-0',
        'text-[length:var(--text-paragraph-small-regular-font-size)]',
        'leading-[var(--text-paragraph-small-regular-line-height)]',
        'tracking-[var(--text-paragraph-small-regular-letter-spacing)]',
        'font-[family-name:var(--font-family-body)]',
        '[font-weight:var(--font-weight-paragraph-regular)]',
        className,
      )}
      {...props}
    />
  );
}

export { Collapsible, CollapsibleTrigger, CollapsibleContent };
