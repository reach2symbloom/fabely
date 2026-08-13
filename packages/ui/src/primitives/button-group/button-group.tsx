/**
 * Fabely Button Group — joins related actions into one segmented control.
 *
 * API ground truth: shadcn Button Group
 * (https://ui.shadcn.com/docs/components/base/button-group).
 *
 * Visual join follows Figma **Button Group** (`784:82792`) — Position via
 * sibling CSS. End-cap radius follows Button family roundness:
 * `default` → `--rounded-lg` (12), `round` → `--rounded-full`.
 *
 * Height parity: when a group tree mixes Text Button + Icon Button (or a
 * menu/popover trigger), icon boxes are forced to the Text `data-size` height.
 *
 * Vendor chrome lives in `src/components/ui/button-group.tsx` (untouched).
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
const OUTLINE_CHILD = `:is([data-variant=outline],[data-variant=primaryOutline],[data-variant=secondary],[data-variant=fiaOutline])`;

const buttonGroupVariants = cva(
  [
    'flex w-fit items-stretch',
    /* Nested groups / icon min-content must not grow the row past Text height. */
    '[&>*]:min-h-0',
    '*:focus-visible:relative *:focus-visible:z-10',
    /* Nested groups: gap between sibling ButtonGroups (spaced toolbar). */
    'has-[>[data-slot=button-group]]:gap-[length:var(--spacing-xs)]',
    /*
     * Height parity — lock icon segments (and menu/popover triggers) to the
     * Text Button size slot in this tree. Stretch alone fails when Icon `lg`
     * min-content (>40) sets the flex line while Text stays at `h-*`.
     * Covers nested spaced toolbars: parent `has` sees text in any column.
     */
    'has-[[data-slot=button][data-size=small]]:[&_[data-slot=icon-button]]:size-[length:var(--spacing-2xl)]!',
    'has-[[data-slot=button][data-size=default]]:[&_[data-slot=icon-button]]:size-[length:var(--spacing-3xl)]!',
    'has-[[data-slot=button][data-size=large]]:[&_[data-slot=icon-button]]:size-[length:var(--spacing-11)]!',
    'has-[[data-slot=button][data-size=small]]:[&_[data-slot=dropdown-menu-trigger]]:size-[length:var(--spacing-2xl)]!',
    'has-[[data-slot=button][data-size=default]]:[&_[data-slot=dropdown-menu-trigger]]:size-[length:var(--spacing-3xl)]!',
    'has-[[data-slot=button][data-size=large]]:[&_[data-slot=dropdown-menu-trigger]]:size-[length:var(--spacing-11)]!',
    'has-[[data-slot=button][data-size=small]]:[&_[data-slot=popover-trigger]]:size-[length:var(--spacing-2xl)]!',
    'has-[[data-slot=button][data-size=default]]:[&_[data-slot=popover-trigger]]:size-[length:var(--spacing-3xl)]!',
    'has-[[data-slot=button][data-size=large]]:[&_[data-slot=popover-trigger]]:size-[length:var(--spacing-11)]!',
    /*
     * Fused Input — Input Default is 40px; Icon default and SelectTrigger
     * default are 36. Stretch the short side in this group only.
     */
    'has-[>[data-slot=input]]:[&>[data-slot=icon-button]]:size-[length:var(--spacing-3xl)]!',
    'has-[>[data-slot=input]]:[&_[data-slot=select-trigger]]:h-[length:var(--spacing-3xl)]!',
    'has-[>[data-slot=input]]:[&_[data-slot=select-trigger]]:min-h-[length:var(--spacing-3xl)]!',
    /* Select / input coordination when an outline-like child is present. */
    `has-[>${OUTLINE_CHILD}]:*:data-[slot=input-group]:border-border`,
    `has-[>${OUTLINE_CHILD}]:*:data-[slot=select-trigger]:border-border`,
    `has-[>${OUTLINE_CHILD}]:[&>[data-slot=input-group]:has(:focus-visible)]:border-ring`,
    `has-[>${OUTLINE_CHILD}]:[&>[data-slot=select-trigger]:focus-visible]:border-ring`,
    `has-[>${OUTLINE_CHILD}]:[&>input]:border-border`,
    `has-[>${OUTLINE_CHILD}]:[&>input:focus-visible]:border-ring`,
    "[&>[data-slot=select-trigger]:not([class*='w-'])]:w-fit",
    '[&>input]:flex-1',
  ].join(' '),
  {
    variants: {
      orientation: {
        /**
         * Horizontal join — Left / Middle / Right from Figma Position:
         * first keeps start radii, last keeps end radii, intermediates square;
         * shared vertical edge collapses.
         */
        horizontal: [
          '*:data-slot:rounded-r-none',
          '[&>[data-slot]~[data-slot]]:rounded-l-none',
          '[&>[data-slot]~[data-slot]]:border-l-0',
        ].join(' '),
        vertical: [
          'flex-col',
          '*:data-slot:rounded-b-none',
          '[&>[data-slot]~[data-slot]]:rounded-t-none',
          '[&>[data-slot]~[data-slot]]:border-t-0',
        ].join(' '),
      },
      /**
       * End-cap shape — library (Button family), not a Figma Button Group axis.
       * `default` = roundrect (`--rounded-lg`); `round` = pill / circle caps.
       */
      roundness: {
        default: '',
        round: '',
      },
    },
    compoundVariants: [
      {
        orientation: 'horizontal',
        roundness: 'default',
        class: [
          '[&>[data-slot]:first-child]:rounded-l-[var(--rounded-lg)]!',
          '[&>[data-slot]:not(:has(~[data-slot]))]:rounded-r-[var(--rounded-lg)]!',
          'has-[select[aria-hidden=true]:last-child]:[&>[data-slot=select-trigger]:last-of-type]:rounded-r-[var(--rounded-lg)]',
        ].join(' '),
      },
      {
        orientation: 'horizontal',
        roundness: 'round',
        class: [
          '[&>[data-slot]:first-child]:rounded-l-[var(--rounded-full)]!',
          '[&>[data-slot]:not(:has(~[data-slot]))]:rounded-r-[var(--rounded-full)]!',
          'has-[select[aria-hidden=true]:last-child]:[&>[data-slot=select-trigger]:last-of-type]:rounded-r-[var(--rounded-full)]',
        ].join(' '),
      },
      {
        orientation: 'vertical',
        roundness: 'default',
        class: [
          '[&>[data-slot]:first-child]:rounded-t-[var(--rounded-lg)]!',
          '[&>[data-slot]:not(:has(~[data-slot]))]:rounded-b-[var(--rounded-lg)]!',
        ].join(' '),
      },
      {
        orientation: 'vertical',
        roundness: 'round',
        class: [
          '[&>[data-slot]:first-child]:rounded-t-[var(--rounded-full)]!',
          '[&>[data-slot]:not(:has(~[data-slot]))]:rounded-b-[var(--rounded-full)]!',
        ].join(' '),
      },
    ],
    defaultVariants: {
      orientation: 'horizontal',
      roundness: 'default',
    },
  }
);

type ButtonGroupProps = React.ComponentProps<'div'> &
  VariantProps<typeof buttonGroupVariants>;

function ButtonGroup({
  className,
  orientation,
  roundness,
  ...props
}: ButtonGroupProps) {
  return (
    <div
      role="group"
      data-slot="button-group"
      data-orientation={orientation}
      data-roundness={roundness}
      className={cn(
        buttonGroupVariants({ orientation, roundness }),
        className
      )}
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
            'flex items-center self-stretch',
            'gap-[length:var(--spacing-xs)]',
            'rounded-[inherit]',
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
