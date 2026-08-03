/**
 * Fabely Button primitive — phase 1: full shadcn Button API surface.
 *
 * Radius is Foundations-sourced: Roundrect uses `--rounded-lg`
 * (`--tw-raw-radius-12` / 12px) across every size — a flat Figma value, not
 * size-proportional. Round is composition via `rounded-full` /
 * `--rounded-full`. Other styling remains the vendor's until a Figma restyle.
 *
 * Public API matches the shadcn docs (`variant`, `size`, `buttonVariants`);
 * import from this primitive, not the vendor path.
 */
import * as React from 'react';
import {
  Button as ButtonPrimitive,
  buttonVariants as vendorButtonVariants,
} from '@/components/ui/button';
import { cn } from '@/lib/utils';

/** shadcn Button `variant` prop — see docs API Reference. */
export type ButtonVariant =
  | 'default'
  | 'outline'
  | 'ghost'
  | 'destructive'
  | 'secondary'
  | 'link';

/** shadcn Button `size` prop — see docs API Reference. */
export type ButtonSize =
  | 'default'
  | 'xs'
  | 'sm'
  | 'lg'
  | 'icon'
  | 'icon-xs'
  | 'icon-sm'
  | 'icon-lg';

/**
 * Roundrect radius — Foundations semantic `--rounded-lg` → `--tw-raw-radius-12`
 * (12px). Applied across all sizes; overrides the vendor's `rounded-4xl`
 * (Tailwind `--radius-4xl` / 32px).
 */
const ROUNDRECT_RADIUS = 'rounded-[var(--rounded-lg)]';

type VendorButtonVariantsOptions = NonNullable<Parameters<typeof vendorButtonVariants>[0]>;

function buttonVariants(options?: VendorButtonVariantsOptions) {
  const { className, ...rest } = options ?? {};
  return cn(vendorButtonVariants(rest), ROUNDRECT_RADIUS, className);
}

type ButtonProps = React.ComponentProps<typeof ButtonPrimitive>;

function Button({ className, ...props }: ButtonProps) {
  return <ButtonPrimitive className={cn(ROUNDRECT_RADIUS, className)} {...props} />;
}

export { Button, buttonVariants };
export type { ButtonProps };
