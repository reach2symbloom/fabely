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
  /** Show the visible grip pill (shadcn `withHandle` / Figma handle). */
  withHandle?: boolean;
}) {
  return (
    <ResizablePrimitive.Separator
      data-slot="resizable-handle"
      className={cn(
        'relative flex items-center justify-center',
        /* Vertical bar — horizontal panel group (separator aria-orientation=vertical). */
        'w-px',
        'bg-[color:var(--border)]',
        /* Expanded hit target only — never paints, so it cannot look like growth. */
        "after:absolute after:inset-y-0 after:left-1/2 after:w-[length:var(--spacing-xs)] after:-translate-x-1/2 after:content-['']",
        /* Horizontal bar — vertical panel group (separator aria-orientation=horizontal). */
        'aria-[orientation=horizontal]:h-px',
        'aria-[orientation=horizontal]:w-full',
        'aria-[orientation=horizontal]:after:left-0',
        'aria-[orientation=horizontal]:after:h-[length:var(--spacing-xs)]',
        'aria-[orientation=horizontal]:after:w-full',
        'aria-[orientation=horizontal]:after:translate-x-0',
        'aria-[orientation=horizontal]:after:-translate-y-1/2',
        /* Focus / drag: slightly lighter than `--border`, never `--foreground`. */
        'outline-none',
        'data-[separator=focus]:bg-[color:var(--muted-foreground)]',
        'data-[separator=active]:bg-[color:var(--muted-foreground)]',
        'data-[separator=focus]:[&>[data-slot=resizable-handle-grip]]:bg-[color:var(--muted-foreground)]',
        'data-[separator=active]:[&>[data-slot=resizable-handle-grip]]:bg-[color:var(--muted-foreground)]',
        /* Rotate grip pill when the rail is horizontal. */
        'aria-[orientation=horizontal]:[&>[data-slot=resizable-handle-grip]]:rotate-90',
        className,
      )}
      {...props}
    >
      {withHandle ? (
        <div
          data-slot="resizable-handle-grip"
          className={cn(
            'pointer-events-none z-10 flex shrink-0',
            /* shadcn: h-6 w-1 rounded-lg bg-border — fixed size, no scale on drag. */
            'h-[length:var(--spacing-xl)]',
            'w-[length:var(--spacing-2xs)]',
            'rounded-[length:var(--rounded-lg)]',
            'bg-[color:var(--border)]',
          )}
        />
      ) : null}
    </ResizablePrimitive.Separator>
  );
}

export { ResizableHandle, ResizablePanel, ResizablePanelGroup };
