/**
 * Line Dot Right Horizontal — Fabely Icons glyph (a horizontal line ending
 * in a solid circle at its right end). No Lucide equivalent — Lucide's
 * closest shape (`GitCommitHorizontal`) centers the circle on the line
 * instead of placing it at one end.
 *
 * Source: Figma "Icon / line-dot-right-horizontal", traced from the
 * component's own exported SVG (fill path, not a stroke icon like Lucide's
 * set — same filled-glyph approach as `FiaSilcrow`). Used by
 * `PromptbarShelf` (`16199:2558`): the Default type's connected-scene
 * badge divider, and the "Connected to current scene" menu item's leading
 * icon.
 *
 * Uses `currentColor` — callers set ink via a `text-*` class, same as
 * `FiaSilcrow`.
 */

import * as React from 'react';

import { cn } from '@/lib/utils';

export type LineDotRightHorizontalProps = React.SVGProps<SVGSVGElement> & {
  title?: string;
};

/**
 * Natural aspect ratio is 2.5:1 (wide, short) — not a square glyph.
 * Deliberately carries no default `size-*` class so ambient icon-sizing
 * rules (e.g. `ListItemMedia`'s `[&_svg:not([class*='size-'])]`) apply
 * like they do for plain Lucide icons; the SVG's own `viewBox` keeps the
 * glyph correctly proportioned (centered, not stretched) whatever square
 * frame it lands in.
 */
function LineDotRightHorizontal({ className, title, ...props }: LineDotRightHorizontalProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16.6667 6.66667"
      fill="none"
      aria-hidden={title ? undefined : true}
      role={title ? 'img' : undefined}
      data-slot="line-dot-right-horizontal"
      data-fabely-icon="line-dot-right-horizontal"
      className={cn('shrink-0', className)}
      {...props}
    >
      {title ? <title>{title}</title> : null}
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        fill="currentColor"
        d="M13.3333 0C15.1743 0 16.6667 1.49238 16.6667 3.33333C16.6667 5.17428 15.1743 6.66667 13.3333 6.66667C11.7801 6.66667 10.475 5.60436 10.105 4.16667H0.833333C0.373096 4.16667 0 3.79357 0 3.33333C0 2.8731 0.373096 2.5 0.833333 2.5H10.105C10.475 1.06231 11.7801 0 13.3333 0ZM13.3333 1.66667C12.4129 1.66667 11.6667 2.41286 11.6667 3.33333C11.6667 4.25381 12.4129 5 13.3333 5C14.2538 5 15 4.25381 15 3.33333C15 2.41286 14.2538 1.66667 13.3333 1.66667Z"
      />
    </svg>
  );
}

export { LineDotRightHorizontal };
