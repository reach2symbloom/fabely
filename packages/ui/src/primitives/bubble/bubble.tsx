/**
 * Fabely Bubble — conversational message surface.
 *
 * Figma source: **Chat bubbles** (`16340:807`) on page Chat elements in
 * Fabely Design System (`gV94L0qCmvwQkddNbEktry`). One authored example is
 * the user bubble; the same radius / spacing / fill apply to the other
 * speaker (mirrored corner).
 *
 * Speakers are `from="user" | "other"` — alignment, sharp near-speaker
 * corner, and default fill (other → theme-neutrals 100/700, user → secondary). Optional
 * `variant="destructive"` for error / failed-action surfaces.
 *
 * Composition:
 *   Bubble
 *   ├── BubbleContent          (message text; polymorphic via `render`)
 *   ├── BubbleFooter           (optional bottom slot — badge / chip)
 *   └── BubbleReactions        (optional edge-anchored reactions)
 *
 * Vendor chrome lives in `src/components/ui/bubble.tsx` (untouched). This
 * primitive is the public Foundations API.
 */
import * as React from 'react';
import { mergeProps } from '@base-ui/react/merge-props';
import { useRender } from '@base-ui/react/use-render';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

/** Who is speaking — drives alignment and the sharp near-speaker corner. */
export type BubbleFrom = 'user' | 'other';

/** Visual treatment — default chat surface, or destructive for errors. */
export type BubbleVariant = 'default' | 'destructive';

const bubbleVariants = cva(
  [
    'group/bubble relative flex w-fit max-w-[80%] min-w-0 flex-col',
    'gap-[var(--spacing-xs)]',
    'p-[var(--spacing-md)]',
    'font-[family-name:var(--font-family-body)]',
    '[font-weight:var(--font-weight-paragraph-regular)]',
    'text-[length:var(--text-paragraph-regular-regular-font-size)]',
    'leading-[var(--text-paragraph-regular-regular-line-height)]',
    'tracking-[var(--text-paragraph-regular-regular-letter-spacing)]',
    'wrap-break-word',
  ],
  {
    variants: {
      from: {
        /** Current user — end-aligned; sharp bottom-end (BR in LTR). */
        user: [
          'self-end data-[align=end]:self-end',
          'rounded-tl-[var(--rounded-xl)]',
          'rounded-tr-[var(--rounded-xl)]',
          'rounded-bl-[var(--rounded-xl)]',
          'rounded-br-none',
        ],
        /** Other speaker — start-aligned; sharp bottom-start (BL in LTR). */
        other: [
          'self-start data-[align=start]:self-start',
          'rounded-tl-[var(--rounded-xl)]',
          'rounded-tr-[var(--rounded-xl)]',
          'rounded-br-[var(--rounded-xl)]',
          'rounded-bl-none',
        ],
      },
      variant: {
        default: [],
        destructive: [
          'bg-[color-mix(in_srgb,var(--destructive)_10%,transparent)]',
          'text-[color:var(--destructive)]',
          'dark:bg-[color-mix(in_srgb,var(--destructive)_20%,transparent)]',
        ],
      },
    },
    compoundVariants: [
      {
        from: 'other',
        variant: 'default',
        class: [
          /* One step off user `--secondary`: light 100 vs 200; dark 700 vs 800. */
          'bg-[var(--theme-neutrals-100)]',
          'dark:bg-[var(--theme-neutrals-700)]',
          'text-[color:var(--text)]',
        ],
      },
      {
        from: 'user',
        variant: 'default',
        class: [
          'bg-[var(--secondary)]',
          'text-[color:var(--text)]',
        ],
      },
    ],
    defaultVariants: {
      from: 'other',
      variant: 'default',
    },
  }
);

function BubbleGroup({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="bubble-group"
      className={cn(
        'flex min-w-0 flex-col gap-[var(--spacing-xs)]',
        className
      )}
      {...props}
    />
  );
}

function Bubble({
  from = 'other',
  variant = 'default',
  className,
  children,
  ...props
}: React.ComponentProps<'div'> &
  VariantProps<typeof bubbleVariants> & {
    from?: BubbleFrom;
    variant?: BubbleVariant;
  }) {
  const align = from === 'user' ? 'end' : 'start';
  const childArray = React.Children.toArray(children);
  const content: React.ReactNode[] = [];
  const footer: React.ReactNode[] = [];
  const reactions: React.ReactNode[] = [];
  const rest: React.ReactNode[] = [];

  for (const child of childArray) {
    if (!React.isValidElement(child)) {
      rest.push(child);
      continue;
    }
    if (child.type === BubbleContent) content.push(child);
    else if (child.type === BubbleFooter) footer.push(child);
    else if (child.type === BubbleReactions) reactions.push(child);
    else rest.push(child);
  }

  return (
    <div
      data-slot="bubble"
      data-from={from}
      data-variant={variant}
      data-align={align}
      className={cn(bubbleVariants({ from, variant }), className)}
      {...props}
    >
      {content.length > 0 ? content : rest}
      {footer}
      {content.length > 0 ? rest : null}
      {reactions}
    </div>
  );
}

function BubbleContent({
  className,
  render,
  ...props
}: useRender.ComponentProps<'div'>) {
  return useRender({
    defaultTagName: 'div',
    props: mergeProps<'div'>(
      {
        className: cn(
          'min-w-0 max-w-full wrap-break-word',
          'group-data-[align=end]/bubble:self-end',
          '[button]:text-left [button,a]:outline-none',
          '[button,a]:transition-[color,background-color,opacity,box-shadow]',
          '[button,a]:focus-visible:shadow-[var(--effect-focus-ring-secondary)]',
          className
        ),
      },
      props
    ),
    render,
    state: {
      slot: 'bubble-content',
    },
  });
}

/**
 * Bottom slot inside the bubble surface — Figma hosts a custom workflow
 * chip here. Pass Badge or any custom chip until that atom exists.
 */
function BubbleFooter({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="bubble-footer"
      className={cn(
        'flex min-w-0 flex-wrap items-center gap-[var(--spacing-2xs)]',
        className
      )}
      {...props}
    />
  );
}

const bubbleReactionsVariants = cva(
  [
    'absolute z-10 flex w-fit shrink-0 items-center justify-center',
    'gap-[var(--spacing-3xs)]',
    'rounded-full',
    'bg-[var(--muted)]',
    'px-[var(--spacing-1-5)] py-[var(--spacing-3xs)]',
    'text-[length:var(--text-paragraph-small-regular-font-size)]',
    'leading-[var(--text-paragraph-small-regular-line-height)]',
    /* Light: card ring separates from page. Dark: card ≈ muted ≈ bg — use border. */
    'ring-[length:var(--stroke-medium)] ring-[var(--card)] dark:ring-[var(--border)]',
    'has-[button]:p-0',
  ],
  {
    variants: {
      side: {
        top: 'top-0 -translate-y-3/4',
        bottom: 'bottom-0 translate-y-3/4',
      },
      align: {
        start: 'left-[var(--spacing-sm)]',
        end: 'right-[var(--spacing-sm)]',
      },
    },
    defaultVariants: {
      side: 'bottom',
      align: 'end',
    },
  }
);

function BubbleReactions({
  side = 'bottom',
  align = 'end',
  className,
  ...props
}: React.ComponentProps<'div'> & {
  align?: 'start' | 'end';
  side?: 'top' | 'bottom';
}) {
  return (
    <div
      data-slot="bubble-reactions"
      data-align={align}
      data-side={side}
      className={cn(bubbleReactionsVariants({ side, align }), className)}
      {...props}
    />
  );
}

export {
  BubbleGroup,
  Bubble,
  BubbleContent,
  BubbleFooter,
  BubbleReactions,
  bubbleVariants,
};
