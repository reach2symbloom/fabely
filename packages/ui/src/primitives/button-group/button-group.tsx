/**
 * Fabely Button Group — joins related actions into one segmented control.
 *
 * API ground truth: shadcn Button Group
 * (https://ui.shadcn.com/docs/components/base/button-group).
 *
 * Visual join (shared edge, corner radius) follows Figma **Button Group**
 * (`784:82792`) — end caps use `--rounded-lg` (12); middle segments are
 * square. Child size / variant come from Text Button / Icon Button (Figma
 * Size + Variant axes); Position is CSS sibling math, not a prop.
 *
 * Vendor chrome lives in `src/components/ui/button-group.tsx` (untouched).
 * This primitive is the public Foundations API.
 */
import * as React from 'react';
import { mergeProps } from '@base-ui/react/merge-props';
import { useRender } from '@base-ui/react/use-render';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';
import { Separator } from '../separator';

/**
 * Bordered Fabely button variants that keep a visible stroke when joined.
 * Matches Figma Variant=Outline; Ghost / filled children skip shared-border
 * collapse (no double stroke to fix).
 */
const OUTLINE_CHILD = `:is([data-variant=primaryOutline],[data-variant=secondary],[data-variant=fiaOutline],[data-variant=outline])`;

const buttonGroupVariants = cva(
  [
    'flex w-fit items-stretch',
    '*:focus-visible:relative *:focus-visible:z-10',
    /* Nested groups: Figma-adjacent gap between sibling ButtonGroups. */
    'has-[>[data-slot=button-group]]:gap-[length:var(--spacing-xs)]',
    /* Select / input coordination when an outline-like child is present. */
    `has-[>${OUTLINE_CHILD}]:*:data-[slot=input-group]:border-border`,
    `has-[>${OUTLINE_CHILD}]:*:data-[slot=select-trigger]:border-border`,
    `has-[>${OUTLINE_CHILD}]:[&>[data-slot=input-group]:has(:focus-visible)]:border-ring`,
    `has-[>${OUTLINE_CHILD}]:[&>[data-slot=select-trigger]:focus-visible]:border-ring`,
    `has-[>${OUTLINE_CHILD}]:[&>input]:border-border`,
    `has-[>${OUTLINE_CHILD}]:[&>input:focus-visible]:border-ring`,
    "has-[select[aria-hidden=true]:last-child]:[&>[data-slot=select-trigger]:last-of-type]:rounded-r-[var(--rounded-lg)]",
    "[&>[data-slot=select-trigger]:not([class*='w-'])]:w-fit",
    '[&>input]:flex-1',
  ].join(' '),
  {
    variants: {
      orientation: {
        /**
         * Horizontal join — Left / Middle / Right from Figma Position axis:
         * first keeps start radii, last keeps end radii (`--rounded-lg`),
         * intermediates square; shared vertical edge collapses.
         */
        horizontal: [
          '*:data-slot:rounded-r-none',
          '[&>[data-slot]:not(:has(~[data-slot]))]:rounded-r-[var(--rounded-lg)]!',
          '[&>[data-slot]~[data-slot]]:rounded-l-none',
          '[&>[data-slot]~[data-slot]]:border-l-0',
        ].join(' '),
        vertical: [
          'flex-col',
          '*:data-slot:rounded-b-none',
          '[&>[data-slot]:not(:has(~[data-slot]))]:rounded-b-[var(--rounded-lg)]!',
          '[&>[data-slot]~[data-slot]]:rounded-t-none',
          '[&>[data-slot]~[data-slot]]:border-t-0',
        ].join(' '),
      },
    },
    defaultVariants: {
      orientation: 'horizontal',
    },
  }
);

type ButtonGroupProps = React.ComponentProps<'div'> &
  VariantProps<typeof buttonGroupVariants>;

function ButtonGroup({
  className,
  orientation,
  ...props
}: ButtonGroupProps) {
  return (
    <div
      role="group"
      data-slot="button-group"
      data-orientation={orientation}
      className={cn(buttonGroupVariants({ orientation }), className)}
      {...props}
    />
  );
}

function ButtonGroupText({
  className,
  render,
  ...props
}: useRender.ComponentProps<'div'>) {
  return useRender({
    defaultTagName: 'div',
    props: mergeProps<'div'>(
      {
        className: cn(
          [
            'flex items-center',
            'gap-[length:var(--spacing-xs)]',
            'rounded-[var(--rounded-lg)]',
            'border border-[color:var(--border)]',
            'bg-[var(--muted)]',
            'px-[length:var(--spacing-2-5)]',
            'font-[family-name:var(--font-family-body)]',
            '[font-weight:var(--font-weight-paragraph-medium)]',
            'text-[length:var(--text-paragraph-small-medium-font-size)]',
            'leading-[var(--text-paragraph-small-medium-line-height)]',
            'tracking-[var(--text-paragraph-small-medium-letter-spacing)]',
            "[&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-[length:var(--icon-sm)]",
          ].join(' '),
          className
        ),
      },
      props
    ),
    render,
    state: {
      slot: 'button-group-text',
    },
  });
}

function ButtonGroupSeparator({
  className,
  orientation = 'vertical',
  ...props
}: React.ComponentProps<typeof Separator>) {
  return (
    <Separator
      data-slot="button-group-separator"
      orientation={orientation}
      className={cn(
        [
          'relative self-stretch',
          'bg-[var(--input)]',
          /* 1px inset so the divider sits inside joined chrome. */
          'data-horizontal:mx-[length:var(--stroke-thin)] data-horizontal:w-auto',
          'data-vertical:my-[length:var(--stroke-thin)] data-vertical:h-auto',
        ].join(' '),
        className
      )}
      {...props}
    />
  );
}

export {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
  buttonGroupVariants,
  type ButtonGroupProps,
};
