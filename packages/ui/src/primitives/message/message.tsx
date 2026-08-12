/**
 * Fabely Message primitive — conversation row layout around Bubble / Avatar.
 *
 * Public API matches [shadcn Message](https://ui.shadcn.com/docs/components/base/message).
 * No dedicated Figma Message set — spacing and type use Foundations. The
 * visible surface is [Bubble](../bubble); avatars use [Avatar](../avatar).
 * Vendor (`src/components/ui/message.tsx`) stays untouched.
 */

import * as React from 'react';

import { cn } from '@/lib/utils';

function MessageGroup({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="message-group"
      className={cn(
        'flex min-w-0 flex-col gap-[var(--spacing-xs)]',
        className,
      )}
      {...props}
    />
  );
}

function Message({
  className,
  align = 'start',
  ...props
}: React.ComponentProps<'div'> & { align?: 'start' | 'end' }) {
  return (
    <div
      data-slot="message"
      data-align={align}
      className={cn(
        'group/message relative flex w-full min-w-0 gap-[var(--spacing-xs)]',
        'font-[family-name:var(--text-paragraph-small-regular-font-family)]',
        '[font-weight:var(--text-paragraph-small-regular-font-weight)]',
        'text-[length:var(--text-paragraph-small-regular-font-size)]',
        'leading-[var(--text-paragraph-small-regular-line-height)]',
        'tracking-[var(--text-paragraph-small-regular-letter-spacing)]',
        'data-[align=end]:flex-row-reverse',
        className,
      )}
      {...props}
    />
  );
}

function MessageAvatar({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="message-avatar"
      className={cn(
        'flex w-fit min-w-[var(--spacing-2xl)] shrink-0 items-center justify-center self-end overflow-hidden',
        'rounded-[length:var(--rounded-full)]',
        'bg-[color:var(--muted)]',
        /* Lift above footer so avatar sits on the Bubble, not the footer. */
        'group-has-data-[slot=message-footer]/message:-translate-y-[length:var(--spacing-2xl)]',
        className,
      )}
      {...props}
    />
  );
}

function MessageContent({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="message-content"
      className={cn(
        'flex w-full min-w-0 flex-col gap-[var(--spacing-2-5)] wrap-break-word',
        'group-data-[align=end]/message:*:data-slot:self-end',
        className,
      )}
      {...props}
    />
  );
}

const META_TYPE = [
  'font-[family-name:var(--text-paragraph-mini-medium-font-family)]',
  '[font-weight:var(--text-paragraph-mini-medium-font-weight)]',
  'text-[length:var(--text-paragraph-mini-medium-font-size)]',
  'leading-[var(--text-paragraph-mini-medium-line-height)]',
  'tracking-[var(--text-paragraph-mini-medium-letter-spacing)]',
  'text-[color:var(--muted-foreground)]',
].join(' ');

function MessageHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="message-header"
      className={cn(
        'flex max-w-full min-w-0 items-center px-[var(--spacing-3-5)]',
        META_TYPE,
        /* Vendor ghost Bubble — keep if a transparent surface is composed. */
        'group-has-data-[variant=ghost]/message:px-0',
        className,
      )}
      {...props}
    />
  );
}

function MessageFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="message-footer"
      className={cn(
        'flex max-w-full min-w-0 items-center px-[var(--spacing-3-5)]',
        META_TYPE,
        'group-has-data-[variant=ghost]/message:px-0',
        'group-data-[align=end]/message:justify-end',
        className,
      )}
      {...props}
    />
  );
}

export {
  MessageGroup,
  Message,
  MessageAvatar,
  MessageContent,
  MessageFooter,
  MessageHeader,
};
