/**
 * Fabely Bookmark Button — icon toggle that fills the bookmark glyph when
 * pressed.
 *
 * Composes the [Toggle](../../primitives/toggle/README.md) primitive.
 * Visual source: Figma **Bookmark Icon Button**
 * ([Bookmark Icon Button](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=16066-5970)
 * `16066:5970`).
 */
'use client';

import { Toggle as TogglePrimitive } from '@base-ui/react/toggle';
import type { VariantProps } from 'class-variance-authority';
import { BookmarkIcon } from 'lucide-react';
import { useState } from 'react';

import { cn } from '@/lib/utils';
import {
  Toggle,
  type ToggleRoundness,
} from '@/primitives/toggle';
import { toggleVariants } from '@/primitives/toggle/toggle-variants';

type ToggleSize = NonNullable<VariantProps<typeof toggleVariants>['size']>;
type ToggleVariant = NonNullable<VariantProps<typeof toggleVariants>['variant']>;

const ICON_SIZE: Record<ToggleSize, string> = {
  sm: 'size-[length:var(--icon-sm)]',
  default: 'size-[length:var(--icon-md)]',
  lg: 'size-[length:var(--icon-md)]',
};

type BookmarkButtonProps = Omit<TogglePrimitive.Props, 'children'> & {
  /** Toggle Skin — Ghost or Outline. */
  variant?: ToggleVariant;
  /** Toggle Size — maps hit target; glyph uses `--icon-*`. */
  size?: ToggleSize;
  /** Figma Bookmark Icon Button is full-round by default. */
  roundness?: ToggleRoundness;
};

function BookmarkButton({
  className,
  variant = 'ghost',
  size = 'default',
  roundness = 'round',
  pressed: pressedProp,
  defaultPressed = false,
  onPressedChange,
  'aria-label': ariaLabelProp,
  ...props
}: BookmarkButtonProps) {
  const isControlled = pressedProp !== undefined;
  const [uncontrolledPressed, setUncontrolledPressed] = useState(defaultPressed);
  const pressed = isControlled ? Boolean(pressedProp) : uncontrolledPressed;

  const handlePressedChange: NonNullable<TogglePrimitive.Props['onPressedChange']> = (
    next,
    eventDetails
  ) => {
    if (!isControlled) {
      setUncontrolledPressed(next);
    }
    onPressedChange?.(next, eventDetails);
  };

  const ariaLabel =
    ariaLabelProp ?? (pressed ? 'Remove bookmark' : 'Bookmark');

  return (
    <Toggle
      data-slot="bookmark-button"
      {...props}
      variant={variant}
      size={size}
      roundness={roundness}
      pressed={isControlled ? pressedProp : undefined}
      defaultPressed={isControlled ? undefined : defaultPressed}
      onPressedChange={handlePressedChange}
      aria-label={ariaLabel}
      className={cn(
        /* Figma 16066:5970 — off outline = foreground; on fill = primary. */
        'text-[color:var(--foreground)]',
        'data-pressed:text-[color:var(--primary)]',
        'aria-pressed:text-[color:var(--primary)]',
        '[&_svg]:fill-[currentColor] [&_svg]:[fill-opacity:0]',
        'data-pressed:[&_svg]:[fill-opacity:1]',
        'aria-pressed:[&_svg]:[fill-opacity:1]',
        '[&_svg]:transition-[color,fill-opacity]',
        '[&_svg]:duration-[var(--duration-fast)]',
        '[&_svg]:ease-[var(--ease-emphasized)]',
        className
      )}
    >
      <BookmarkIcon aria-hidden className={ICON_SIZE[size ?? 'default']} />
    </Toggle>
  );
}

export { BookmarkButton, type BookmarkButtonProps };
