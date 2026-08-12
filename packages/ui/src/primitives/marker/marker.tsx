/**
 * Fabely Marker primitive — inline conversation status, bordered row, or
 * labeled separator with the
 * [shadcn Marker](https://ui.shadcn.com/docs/components/base/marker) API.
 *
 * No dedicated Figma conversation Marker set (Todo marker OC is unrelated).
 * Type / color / gaps map to Foundations. Vendor
 * (`src/components/ui/marker.tsx`) stays untouched.
 *
 * Icon is optional — omit `MarkerIcon` for text-only. `iconSize` scales the
 * icon plate when present (`auto` follows the text size axis).
 */

import * as React from 'react';
import { mergeProps } from '@base-ui/react/merge-props';
import { useRender } from '@base-ui/react/use-render';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

/**
 * Foundations text family — Paragraph, Caption (uppercase), or Heading
 * (Heading 4 at mini / Heading 3 at sm).
 */
export type MarkerTextStyle = 'paragraph' | 'caption' | 'heading';

/** Size within the text style — Mini or Sm. */
export type MarkerSize = 'mini' | 'sm';

/**
 * Icon plate size when `MarkerIcon` is present. `auto` follows text `size`
 * (mini → `--icon-xs`, sm → `--icon-sm`); otherwise an explicit Foundations
 * `--icon-*`.
 */
export type MarkerIconSize = 'auto' | 'xs' | 'sm' | 'md' | 'lg';

/*
 * Icon plate selectors — full static strings so Tailwind emits the utilities
 * (dynamic replaceAll class names are invisible to the scanner).
 */
const ICON_SLOT_XS = [
  '[&_[data-slot=marker-icon]]:size-[length:var(--icon-xs)]',
  '[&_[data-slot=marker-icon]_svg:not([class*=size-])]:size-[length:var(--icon-xs)]',
].join(' ');
const ICON_SLOT_SM = [
  '[&_[data-slot=marker-icon]]:size-[length:var(--icon-sm)]',
  '[&_[data-slot=marker-icon]_svg:not([class*=size-])]:size-[length:var(--icon-sm)]',
].join(' ');
const ICON_SLOT_MD = [
  '[&_[data-slot=marker-icon]]:size-[length:var(--icon-md)]',
  '[&_[data-slot=marker-icon]_svg:not([class*=size-])]:size-[length:var(--icon-md)]',
].join(' ');
const ICON_SLOT_LG = [
  '[&_[data-slot=marker-icon]]:size-[length:var(--icon-lg)]',
  '[&_[data-slot=marker-icon]_svg:not([class*=size-])]:size-[length:var(--icon-lg)]',
].join(' ');

const markerVariants = cva(
  [
    'group/marker relative flex w-full items-center text-left',
    'gap-[var(--spacing-xs)]',
    'text-[color:var(--muted-foreground)]',
    '[&_svg]:pointer-events-none [&_svg]:shrink-0',
    /* Nested / render-as links */
    '[a]:underline [a]:underline-offset-4 [a]:hover:text-[color:var(--foreground)]',
  ].join(' '),
  {
    variants: {
      variant: {
        default: '',
        separator: [
          'before:me-[var(--spacing-2xs)] before:h-px before:min-w-0 before:flex-1',
          'before:bg-[color:var(--border)]',
          'after:ms-[var(--spacing-2xs)] after:h-px after:min-w-0 after:flex-1',
          'after:bg-[color:var(--border)]',
        ].join(' '),
        border: [
          'border-b border-[color:var(--border)]',
          'pb-[var(--spacing-xs)]',
        ].join(' '),
      },
      textStyle: {
        paragraph: '',
        /* Caption family is always uppercase (menu label recipe). */
        caption: 'uppercase',
        /* Heading — size maps to Heading 4 (mini) / Heading 3 (sm). */
        heading: '',
      },
      size: {
        mini: 'min-h-[length:var(--icon-xs)]',
        sm: 'min-h-[length:var(--icon-sm)]',
      },
      iconSize: {
        auto: '',
        xs: ['min-h-[length:var(--icon-xs)]', ICON_SLOT_XS].join(' '),
        sm: ['min-h-[length:var(--icon-sm)]', ICON_SLOT_SM].join(' '),
        md: ['min-h-[length:var(--icon-md)]', ICON_SLOT_MD].join(' '),
        lg: ['min-h-[length:var(--icon-lg)]', ICON_SLOT_LG].join(' '),
      },
    },
    compoundVariants: [
      {
        textStyle: 'paragraph',
        size: 'sm',
        class: [
          'font-[family-name:var(--text-paragraph-small-regular-font-family)]',
          '[font-weight:var(--text-paragraph-small-regular-font-weight)]',
          'text-[length:var(--text-paragraph-small-regular-font-size)]',
          'leading-[var(--text-paragraph-small-regular-line-height)]',
          'tracking-[var(--text-paragraph-small-regular-letter-spacing)]',
        ].join(' '),
      },
      {
        textStyle: 'paragraph',
        size: 'mini',
        class: [
          'font-[family-name:var(--text-paragraph-mini-regular-font-family)]',
          '[font-weight:var(--text-paragraph-mini-regular-font-weight)]',
          'text-[length:var(--text-paragraph-mini-regular-font-size)]',
          'leading-[var(--text-paragraph-mini-regular-line-height)]',
          'tracking-[var(--text-paragraph-mini-regular-letter-spacing)]',
        ].join(' '),
      },
      {
        textStyle: 'caption',
        size: 'sm',
        class: [
          'font-[family-name:var(--text-caption-sm-font-family)]',
          '[font-weight:var(--text-caption-sm-font-weight)]',
          'text-[length:var(--text-caption-sm-font-size)]',
          'leading-[var(--text-caption-sm-line-height)]',
          'tracking-[length:var(--text-caption-sm-letter-spacing)]',
        ].join(' '),
      },
      {
        textStyle: 'caption',
        size: 'mini',
        class: [
          'font-[family-name:var(--text-caption-mini-font-family)]',
          '[font-weight:var(--text-caption-mini-font-weight)]',
          'text-[length:var(--text-caption-mini-font-size)]',
          'leading-[var(--text-caption-mini-line-height)]',
          'tracking-[length:var(--text-caption-mini-letter-spacing)]',
        ].join(' '),
      },
      {
        textStyle: 'heading',
        size: 'sm',
        class: [
          'font-[family-name:var(--text-heading-3-font-family)]',
          '[font-weight:var(--text-heading-3-font-weight)]',
          'text-[length:var(--text-heading-3-font-size)]',
          'leading-[var(--text-heading-3-line-height)]',
          'tracking-[var(--text-heading-3-letter-spacing)]',
        ].join(' '),
      },
      {
        textStyle: 'heading',
        size: 'mini',
        class: [
          'font-[family-name:var(--text-heading-4-font-family)]',
          '[font-weight:var(--text-heading-4-font-weight)]',
          'text-[length:var(--text-heading-4-font-size)]',
          'leading-[var(--text-heading-4-line-height)]',
          'tracking-[var(--text-heading-4-letter-spacing)]',
        ].join(' '),
      },
      /* auto icon follows text size */
      {
        iconSize: 'auto',
        size: 'sm',
        textStyle: 'paragraph',
        class: ICON_SLOT_SM,
      },
      {
        iconSize: 'auto',
        size: 'mini',
        textStyle: 'paragraph',
        class: ICON_SLOT_XS,
      },
      {
        iconSize: 'auto',
        size: 'sm',
        textStyle: 'caption',
        class: ICON_SLOT_SM,
      },
      {
        iconSize: 'auto',
        size: 'mini',
        textStyle: 'caption',
        class: ICON_SLOT_XS,
      },
      {
        iconSize: 'auto',
        size: 'sm',
        textStyle: 'heading',
        class: ICON_SLOT_SM,
      },
      {
        iconSize: 'auto',
        size: 'mini',
        textStyle: 'heading',
        class: ICON_SLOT_XS,
      },
    ],
    defaultVariants: {
      variant: 'default',
      textStyle: 'paragraph',
      size: 'sm',
      iconSize: 'auto',
    },
  },
);

function Marker({
  className,
  variant = 'default',
  textStyle = 'paragraph',
  size = 'sm',
  iconSize = 'auto',
  render,
  ...props
}: useRender.ComponentProps<'div'> & VariantProps<typeof markerVariants>) {
  return useRender({
    defaultTagName: 'div',
    props: mergeProps<'div'>(
      {
        className: cn(
          markerVariants({ variant, textStyle, size, iconSize }),
          className,
        ),
      },
      props,
    ),
    render,
    state: {
      slot: 'marker',
      variant,
      textStyle,
      size,
      iconSize,
    },
  });
}

function MarkerIcon({ className, ...props }: React.ComponentProps<'span'>) {
  return (
    <span
      data-slot="marker-icon"
      aria-hidden="true"
      className={cn('shrink-0', className)}
      {...props}
    />
  );
}

function MarkerContent({ className, ...props }: React.ComponentProps<'span'>) {
  return (
    <span
      data-slot="marker-content"
      className={cn(
        'min-w-0 wrap-break-word',
        'group-data-[variant=separator]/marker:flex-none',
        'group-data-[variant=separator]/marker:text-center',
        '*:[a]:underline *:[a]:underline-offset-4 *:[a]:hover:text-[color:var(--foreground)]',
        className,
      )}
      {...props}
    />
  );
}

export { Marker, MarkerIcon, MarkerContent, markerVariants };
