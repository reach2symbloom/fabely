/**
 * Control Label — uppercase caption sitting above a Controls piece
 * (Dropdown, Slider, Icon Button Group, Rich Divider).
 *
 * Figma: Controls (`16301:20374`) — "TYPOGRAPHY" / "LABEL" / "LINE WIDTH" /
 * "SECTION DIVIDER" captions. Same type ramp as `Select`'s `SelectLabel`.
 */

import * as React from 'react';

import { cn } from '@/lib/utils';

export type ControlLabelProps = React.ComponentProps<'label'>;

function ControlLabel({ className, ...props }: ControlLabelProps) {
  return (
    <label
      data-slot="control-label"
      className={cn(
        'font-[family-name:var(--font-family-sans)]',
        '[font-weight:var(--font-weight-sans-medium)]',
        'text-[length:var(--text-caption-mini-font-size)]',
        'leading-[var(--text-caption-mini-line-height)]',
        'tracking-[length:var(--text-caption-mini-letter-spacing)]',
        'text-[color:var(--muted-foreground)] uppercase',
        className,
      )}
      {...props}
    />
  );
}

export { ControlLabel };
