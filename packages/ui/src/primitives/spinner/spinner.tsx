/**
 * Fabely Spinner primitive — loading indicator from Figma Spinner
 * (`757:154511`) with the shadcn Spinner API.
 *
 * Vendor file (`src/components/ui/spinner.tsx`) stays untouched.
 *
 * Figma axes → props:
 * - Type Default | Mirrored → `mirrored` (CSS `animation-direction: reverse`)
 *
 * Size is `--icon-sm` (16) by default — Figma frame. Override with
 * `className="size-[length:var(--icon-*)]"` (shadcn Size demos).
 *
 * Page-load “Spinner large” / Loader Atoms stay deferred (frame animation).
 */

import { Loader2Icon } from 'lucide-react';
import type * as React from 'react';

import { cn } from '@/lib/utils';

type SpinnerProps = React.ComponentProps<'svg'> & {
  /** Figma Type=Mirrored — spin the other way. */
  mirrored?: boolean;
};

function Spinner({ className, mirrored = false, ...props }: SpinnerProps) {
  return (
    <Loader2Icon
      data-slot="spinner"
      data-mirrored={mirrored ? 'true' : undefined}
      role="status"
      aria-label="Loading"
      className={cn(
        'size-[length:var(--icon-sm)] shrink-0 animate-spin',
        'text-[color:var(--foreground)]',
        mirrored && '[animation-direction:reverse]',
        className,
      )}
      {...props}
    />
  );
}

export { Spinner };
export type { SpinnerProps };
