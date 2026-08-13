/**
 * Fabely Card primitive — wraps the upstream shadcn Card
 * (`src/components/ui/card.tsx`) with Foundations tokens from the Figma Card
 * set (Style Outline | Shadow). Vendor file stays untouched.
 *
 * Public spacing hook remains `--card-spacing`. Parts override via
 * `className` (and `size` / `variant` / `bordered` on root).
 */
import * as React from 'react';
import {
  Card as CardPrimitive,
  CardHeader as CardHeaderPrimitive,
  CardTitle as CardTitlePrimitive,
  CardDescription as CardDescriptionPrimitive,
  CardAction as CardActionPrimitive,
  CardContent as CardContentPrimitive,
  CardFooter as CardFooterPrimitive,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';

export type CardSize = 'default' | 'sm';

/** Figma Style: Outline = outer stroke; Shadow = outer stroke + 2xl elevation. */
export type CardVariant = 'outline' | 'shadow';

type CardProps = React.ComponentProps<typeof CardPrimitive> & {
  size?: CardSize;
  variant?: CardVariant;
  /**
   * Section dividers — full-width rule below `CardHeader` (when present) and
   * above `CardFooter` (when present). Matches composed Figma cards.
   */
  bordered?: boolean;
};

/**
 * Root — Foundations `rounded-xl` (20), spacing via `--card-spacing` (md /
 * 16 default), Style Outline | Shadow. Size `sm` tightens spacing.
 * `bordered` switches to per-section vertical padding + header/footer rules.
 */
function Card({
  className,
  size = 'default',
  variant = 'outline',
  bordered = false,
  ...props
}: CardProps) {
  const isShadow = variant === 'shadow';

  return (
    <CardPrimitive
      size={size}
      data-variant={variant}
      data-bordered={bordered ? 'true' : undefined}
      className={cn(
        'rounded-[var(--rounded-xl)]',
        'bg-[var(--card)] text-[color:var(--card-foreground)]',
        'border-[length:var(--stroke-thin)] border-[color:var(--border)]',
        /* Kill vendor ring + 4xl radii + default shadow; spacing via tokens. */
        'ring-0 shadow-none',
        '[--card-spacing:var(--spacing-md)]',
        'data-[size=sm]:[--card-spacing:var(--spacing-sm)]',
        'gap-[length:var(--card-spacing)] py-[length:var(--card-spacing)]',
        /* Dividers own vertical rhythm — no root gap/py between sections. */
        'data-[bordered=true]:gap-0 data-[bordered=true]:py-0',
        'font-[family-name:var(--font-family-body)]',
        'text-[length:var(--text-paragraph-small-regular-font-size)]',
        'leading-[var(--text-paragraph-small-regular-line-height)]',
        'tracking-[var(--text-paragraph-small-regular-letter-spacing)]',
        '*:[img:first-child]:rounded-t-[var(--rounded-xl)]',
        '*:[img:last-child]:rounded-b-[var(--rounded-xl)]',
        isShadow &&
          'shadow-[var(--shadow-2xl-black)] dark:shadow-[var(--shadow-2xl-white)]',
        className
      )}
      {...props}
    />
  );
}

function CardHeader({
  className,
  ...props
}: React.ComponentProps<typeof CardHeaderPrimitive>) {
  return (
    <CardHeaderPrimitive
      className={cn(
        'gap-[length:var(--spacing-xs)]',
        'rounded-t-[var(--rounded-xl)]',
        'px-[length:var(--card-spacing)]',
        'group-data-[bordered=true]/card:border-b-[length:var(--stroke-thin)]',
        'group-data-[bordered=true]/card:border-[color:var(--border)]',
        'group-data-[bordered=true]/card:py-[length:var(--card-spacing)]',
        className
      )}
      {...props}
    />
  );
}

function CardTitle({
  className,
  ...props
}: React.ComponentProps<typeof CardTitlePrimitive>) {
  return (
    <CardTitlePrimitive
      className={cn(
        'font-[family-name:var(--font-family-body)]',
        'text-[length:var(--text-paragraph-regular-medium-font-size)]',
        'leading-[var(--text-paragraph-regular-medium-line-height)]',
        'tracking-[var(--text-paragraph-regular-medium-letter-spacing)]',
        '[font-weight:var(--font-weight-paragraph-medium)]',
        'text-[color:var(--card-foreground)]',
        className
      )}
      {...props}
    />
  );
}

function CardDescription({
  className,
  ...props
}: React.ComponentProps<typeof CardDescriptionPrimitive>) {
  return (
    <CardDescriptionPrimitive
      className={cn(
        'font-[family-name:var(--font-family-body)]',
        'text-[length:var(--text-paragraph-small-regular-font-size)]',
        'leading-[var(--text-paragraph-small-regular-line-height)]',
        'tracking-[var(--text-paragraph-small-regular-letter-spacing)]',
        '[font-weight:var(--font-weight-paragraph-regular)]',
        'text-[color:var(--muted-foreground)]',
        className
      )}
      {...props}
    />
  );
}

function CardAction({
  className,
  ...props
}: React.ComponentProps<typeof CardActionPrimitive>) {
  return <CardActionPrimitive className={cn(className)} {...props} />;
}

function CardContent({
  className,
  ...props
}: React.ComponentProps<typeof CardContentPrimitive>) {
  return (
    <CardContentPrimitive
      className={cn(
        'px-[length:var(--card-spacing)]',
        'group-data-[bordered=true]/card:py-[length:var(--card-spacing)]',
        className
      )}
      {...props}
    />
  );
}

function CardFooter({
  className,
  ...props
}: React.ComponentProps<typeof CardFooterPrimitive>) {
  return (
    <CardFooterPrimitive
      className={cn(
        'rounded-b-[var(--rounded-xl)]',
        'px-[length:var(--card-spacing)]',
        'group-data-[bordered=true]/card:border-t-[length:var(--stroke-thin)]',
        'group-data-[bordered=true]/card:border-[color:var(--border)]',
        'group-data-[bordered=true]/card:py-[length:var(--card-spacing)]',
        className
      )}
      {...props}
    />
  );
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
};
export type { CardProps };
