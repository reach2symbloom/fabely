/**
 * Fabely Resizable — panel groups with Foundations-token handles.
 *
 * Figma: Resizable (`222:27733`) Orientation × Vertical / Horizontal handle.
 * Built on [react-resizable-panels](https://github.com/bvaughn/react-resizable-panels)
 * v4 (`Group` / `Panel` / `Separator`). Public API matches
 * [shadcn Resizable](https://ui.shadcn.com/docs/components/base/resizable).
 * Import from this primitive, not `src/components/ui/resizable`.
 */

'use client';

import { GripVerticalIcon } from 'lucide-react';
import * as ResizablePrimitive from 'react-resizable-panels';

import { cn } from '@/lib/utils';

function ResizablePanelGroup({
  className,
  ...props
}: ResizablePrimitive.GroupProps) {
  return (
    <ResizablePrimitive.Group
      data-slot="resizable-panel-group"
      className={cn(
        'flex h-full w-full',
        'aria-[orientation=vertical]:flex-col',
        className,
      )}
      {...props}
    />
  );
}

function ResizablePanel({ ...props }: ResizablePrimitive.PanelProps) {
  return <ResizablePrimitive.Panel data-slot="resizable-panel" {...props} />;
}

function ResizableHandle({
  withHandle,
  className,
  ...props
}: ResizablePrimitive.SeparatorProps & {
  /** Show the Figma 6-dot grip (Lucide GripVertical). */
  withHandle?: boolean;
}) {
  return (
    <ResizablePrimitive.Separator
      data-slot="resizable-handle"
      className={cn(
        'relative flex items-center justify-center',
        /* Vertical bar (default) — horizontal panel group. */
        'w-px',
        'bg-[color:var(--border)]',
        /* Expanded hit target — Figma handle track ~11px. */
        "after:absolute after:inset-y-0 after:left-1/2 after:w-[length:var(--spacing-sm)] after:-translate-x-1/2 after:content-['']",
        /* Horizontal bar — vertical panel group (`aria-orientation=horizontal`). */
        'aria-[orientation=horizontal]:h-px',
        'aria-[orientation=horizontal]:w-full',
        'aria-[orientation=horizontal]:after:left-0',
        'aria-[orientation=horizontal]:after:h-[length:var(--spacing-sm)]',
        'aria-[orientation=horizontal]:after:w-full',
        'aria-[orientation=horizontal]:after:translate-x-0',
        'aria-[orientation=horizontal]:after:-translate-y-1/2',
        'outline-none',
        'focus-visible:shadow-[var(--effect-focus-ring-secondary)]',
        'aria-[orientation=horizontal]:[&>[data-slot=resizable-handle-grip]]:rotate-90',
        className,
      )}
      {...props}
    >
      {withHandle ? (
        <div
          data-slot="resizable-handle-grip"
          className={cn(
            'z-10 flex shrink-0 items-center justify-center',
            'rounded-[length:var(--rounded-sm)]',
            'bg-[color:var(--muted)]',
            'p-[var(--spacing-3xs)]',
            'shadow-[var(--shadow-xs-black)]',
            '[&_svg]:pointer-events-none [&_svg]:shrink-0',
            '[&_svg]:size-[length:var(--icon-sm)]',
            '[&_svg]:text-[color:var(--muted-foreground)]',
          )}
        >
          <GripVerticalIcon aria-hidden="true" />
        </div>
      ) : null}
    </ResizablePrimitive.Separator>
  );
}

export { ResizableHandle, ResizablePanel, ResizablePanelGroup };
