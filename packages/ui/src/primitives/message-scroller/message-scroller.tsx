/**
 * Fabely Message Scroller — chat transcript scroll viewport.
 *
 * Public API matches [shadcn Message Scroller]
 * (https://ui.shadcn.com/docs/components/base/message-scroller). Behavior comes
 * from `@shadcn/react/message-scroller`; this primitive owns Foundations chrome
 * (gaps, fade, jump control). Product language: **Chat UI** transcript scroller
 * — keep the MessageScroller export name for shadcn parity.
 *
 * Vendor (`src/components/ui/message-scroller.tsx`) stays untouched.
 */

'use client';

import * as React from 'react';
import {
  MessageScroller as MessageScrollerPrimitive,
  useMessageScroller,
  useMessageScrollerScrollable,
  useMessageScrollerVisibility,
} from '@shadcn/react/message-scroller';
import { ArrowDownIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { IconButton } from '../button';
import type { IconButtonProps } from '../button';

function MessageScrollerProvider(
  props: React.ComponentProps<typeof MessageScrollerPrimitive.Provider>
) {
  return <MessageScrollerPrimitive.Provider {...props} />;
}

function MessageScroller({
  className,
  ...props
}: React.ComponentProps<typeof MessageScrollerPrimitive.Root>) {
  return (
    <MessageScrollerPrimitive.Root
      data-slot="message-scroller"
      className={cn(
        'group/message-scroller relative flex size-full min-h-0 flex-col overflow-hidden',
        className
      )}
      {...props}
    />
  );
}

function MessageScrollerViewport({
  className,
  ...props
}: React.ComponentProps<typeof MessageScrollerPrimitive.Viewport>) {
  return (
    <MessageScrollerPrimitive.Viewport
      data-slot="message-scroller-viewport"
      className={cn(
        'size-full min-h-0 min-w-0 overflow-y-auto overscroll-contain contain-content',
        'scroll-fade-y',
        'scrollbar-thin scrollbar-gutter-stable',
        'data-autoscrolling:scrollbar-thumb-transparent',
        'data-autoscrolling:scrollbar-track-transparent',
        className
      )}
      {...props}
    />
  );
}

function MessageScrollerContent({
  className,
  ...props
}: React.ComponentProps<typeof MessageScrollerPrimitive.Content>) {
  return (
    <MessageScrollerPrimitive.Content
      data-slot="message-scroller-content"
      className={cn(
        'flex h-max min-h-full flex-col gap-[var(--spacing-2xl)]',
        'px-[var(--spacing-md)] py-[var(--spacing-md)]',
        className
      )}
      {...props}
    />
  );
}

function MessageScrollerItem({
  className,
  scrollAnchor = false,
  ...props
}: React.ComponentProps<typeof MessageScrollerPrimitive.Item>) {
  return (
    <MessageScrollerPrimitive.Item
      data-slot="message-scroller-item"
      scrollAnchor={scrollAnchor}
      className={cn(
        'min-w-0 shrink-0',
        '[contain-intrinsic-size:auto_10rem] [content-visibility:auto]',
        className
      )}
      {...props}
    />
  );
}

function MessageScrollerButton({
  direction = 'end',
  className,
  children,
  render,
  variant = 'secondary',
  size = 'sm',
  roundness = 'round',
  ...props
}: React.ComponentProps<typeof MessageScrollerPrimitive.Button> &
  Pick<IconButtonProps, 'variant' | 'size' | 'roundness'>) {
  return (
    <MessageScrollerPrimitive.Button
      data-slot="message-scroller-button"
      data-direction={direction}
      data-variant={variant}
      data-size={size}
      direction={direction}
      className={cn(
        'absolute inset-s-1/2 -translate-x-1/2 rtl:translate-x-1/2',
        'border-[color:var(--border)]',
        'bg-[color:var(--background)] text-[color:var(--foreground)]',
        'transition-[translate,scale,opacity]',
        'duration-[var(--duration-fast)] ease-[var(--ease-emphasized)]',
        'hover:bg-[color:var(--muted)] hover:text-[color:var(--foreground)]',
        'data-[active=false]:pointer-events-none',
        'data-[active=false]:scale-95 data-[active=false]:opacity-0',
        'data-[active=false]:duration-[var(--duration-drawer)]',
        'data-[active=false]:ease-[var(--ease-emphasized-in)]',
        'data-[active=true]:translate-y-0 data-[active=true]:scale-100',
        'data-[active=true]:opacity-100',
        'data-[active=true]:ease-[var(--ease-emphasized)]',
        'data-[direction=end]:bottom-[var(--spacing-md)]',
        'data-[direction=end]:data-[active=false]:translate-y-full',
        'data-[direction=start]:top-[var(--spacing-md)]',
        'data-[direction=start]:data-[active=false]:-translate-y-full',
        'data-[direction=start]:[&_svg]:rotate-180',
        className
      )}
      render={
        render ?? (
          <IconButton
            variant={variant}
            size={size}
            roundness={roundness}
            aria-label={
              direction === 'end' ? 'Scroll to end' : 'Scroll to start'
            }
          />
        )
      }
      {...props}
    >
      {children ?? <ArrowDownIcon />}
    </MessageScrollerPrimitive.Button>
  );
}

export {
  MessageScrollerProvider,
  MessageScroller,
  MessageScrollerViewport,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerButton,
  useMessageScroller,
  useMessageScrollerScrollable,
  useMessageScrollerVisibility,
};
