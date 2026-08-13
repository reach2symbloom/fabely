import type { Meta, StoryObj } from '@storybook/react-vite';
import { CircleCheckIcon, CircleHelpIcon, CircleIcon } from 'lucide-react';
import { useState, type ComponentPropsWithoutRef, type ReactNode } from 'react';

import { InlineSegmentedControl } from '../../../stories/InlineSegmentedControl';
import { PlaygroundPanel } from '../../../stories/PlaygroundPanel';
import {
  PRIMITIVE_PLAYGROUND_CONTROL_GRID,
  PrimitiveGalleryItem,
  PrimitivePage,
} from '../../../stories/PrimitivePage';
import { cn } from '@/lib/utils';

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from './navigation-menu';

/**
 * Component Storybook IA (see docs/DESIGN.md "Component Story Structure"):
 * Overview first — Figma Navigation Menu (Ghost triggers) + Menu (Slots) panel.
 * shadcn Navigation Menu guide (Base UI).
 */

const meta = {
  title: 'Design System/Primitives/Navigation Menu',
  component: NavigationMenu,
  tags: ['ai-generated'],
  parameters: { layout: 'centered' },
} satisfies Meta;

export default meta;
type Story = StoryObj;

function LinkTitle({ children }: { children: ReactNode }) {
  return (
    <span
      className={cn(
        'font-[family-name:var(--text-paragraph-small-bold-font-family)]',
        '[font-weight:var(--text-paragraph-small-bold-font-weight)]',
        'text-[length:var(--text-paragraph-small-bold-font-size)]',
        'leading-[var(--text-paragraph-small-bold-line-height)]',
        'text-[color:var(--foreground)]',
      )}
    >
      {children}
    </span>
  );
}

function LinkDescription({ children }: { children: ReactNode }) {
  return (
    <span
      className={cn(
        'font-[family-name:var(--text-paragraph-mini-regular-font-family)]',
        '[font-weight:var(--text-paragraph-mini-regular-font-weight)]',
        'text-[length:var(--text-paragraph-mini-regular-font-size)]',
        'leading-[var(--text-paragraph-mini-regular-line-height)]',
        'text-[color:var(--muted-foreground)]',
        'whitespace-normal',
      )}
    >
      {children}
    </span>
  );
}

const docsLinks = [
  {
    title: 'Documentation',
    href: '#',
    description: 'Learn how to use the library.',
  },
  {
    title: 'Components',
    href: '#',
    description: 'Browse the component gallery.',
  },
  {
    title: 'Tokens',
    href: '#',
    description: 'Colors, spacing, and type scales.',
  },
  {
    title: 'Changelog',
    href: '#',
    description: 'What shipped in recent releases.',
  },
] as const;

function ListItem({
  title,
  children,
  href,
  ...props
}: ComponentPropsWithoutRef<'a'> & { title: string }) {
  return (
    <li>
      <NavigationMenuLink href={href} {...props}>
        <LinkTitle>{title}</LinkTitle>
        <LinkDescription>{children}</LinkDescription>
      </NavigationMenuLink>
    </li>
  );
}

function DemoExample() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Getting started</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul
              className={cn(
                'grid w-[min(100vw-2rem,30rem)] gap-[var(--spacing-xs)]',
                'sm:grid-cols-2',
              )}
            >
              {docsLinks.map((item) => (
                <ListItem key={item.title} title={item.title} href={item.href}>
                  {item.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Components</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[min(100vw-2rem,18rem)] gap-[var(--spacing-2xs)]">
              <ListItem title="Alert Dialog" href="#">
                Modal confirmation patterns.
              </ListItem>
              <ListItem title="Hover Card" href="#">
                Preview content on hover.
              </ListItem>
              <ListItem title="Progress" href="#">
                Determinate and indeterminate bars.
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="#" className={navigationMenuTriggerStyle()}>
            Docs
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

function WithIconExample() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>With Icon</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[min(100vw-2rem,16rem)] gap-[var(--spacing-2xs)]">
              <li>
                <NavigationMenuLink
                  href="#"
                  className="flex-row items-center gap-[var(--spacing-xs)]"
                >
                  <CircleHelpIcon />
                  Backlog
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink
                  href="#"
                  className="flex-row items-center gap-[var(--spacing-xs)]"
                >
                  <CircleIcon />
                  To Do
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink
                  href="#"
                  className="flex-row items-center gap-[var(--spacing-xs)]"
                >
                  <CircleCheckIcon />
                  Done
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

function LinkRenderExample() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink
            render={<a href="#documentation" />}
            className={navigationMenuTriggerStyle()}
          >
            Documentation
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>More</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[min(100vw-2rem,14rem)] gap-[var(--spacing-2xs)]">
              <li>
                <NavigationMenuLink render={<a href="#api" />}>
                  API Reference
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink render={<a href="#examples" />}>
                  Examples
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

function RtlExample() {
  return (
    <div dir="rtl">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>البدء</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul
                className={cn(
                  'grid w-[min(100vw-2rem,28rem)] gap-[var(--spacing-xs)]',
                  'sm:grid-cols-2',
                )}
              >
                <ListItem title="الوثائق" href="#">
                  تعلّم كيفية استخدام المكتبة.
                </ListItem>
                <ListItem title="المكونات" href="#">
                  تصفح معرض المكونات.
                </ListItem>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink
              href="#"
              className={navigationMenuTriggerStyle()}
            >
              الوثائق
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}

function NavigationMenuPlayground() {
  const [variant, setVariant] = useState<'demo' | 'icons' | 'link'>('demo');

  return (
    <PlaygroundPanel
      preview={
        variant === 'demo' ? (
          <DemoExample />
        ) : variant === 'icons' ? (
          <WithIconExample />
        ) : (
          <LinkRenderExample />
        )
      }
      controls={
        <div className={PRIMITIVE_PLAYGROUND_CONTROL_GRID}>
          <InlineSegmentedControl
            label="Example"
            value={variant}
            options={[
              { value: 'demo', label: 'Demo' },
              { value: 'icons', label: 'Icons' },
              { value: 'link', label: 'Link' },
            ]}
            onChange={(v) => setVariant(v as 'demo' | 'icons' | 'link')}
            fullWidth
            className="col-span-2"
          />
        </div>
      }
    />
  );
}

export const Overview: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => (
    <PrimitivePage
      title="Navigation Menu"
      description="Site and section navigation with Ghost Button triggers and Menu (Slots) panels. Prefer Menubar for desktop command sets."
      playground={<NavigationMenuPlayground />}
      variants={
        <div className="flex flex-wrap gap-6">
          <PrimitiveGalleryItem label="Demo">
            <DemoExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="With Icon">
            <WithIconExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Link render">
            <LinkRenderExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="RTL">
            <RtlExample />
          </PrimitiveGalleryItem>
        </div>
      }
      usageGuidance={
        <ul className="list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
          <li>
            Use for marketing / app section nav with richer panels; use{' '}
            <code>Menubar</code> for File / Edit-style command menus.
          </li>
          <li>
            Compose title + description inside <code>NavigationMenuLink</code>{' '}
            (see Demo); use <code>render</code> for framework routers.
          </li>
          <li>
            Top-level links without a panel use{' '}
            <code>navigationMenuTriggerStyle()</code>.
          </li>
        </ul>
      }
      accessibility={
        <ul className="list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
          <li>
            Base UI handles keyboard focus between triggers and panel content.
          </li>
          <li>
            Chevron on triggers is decorative (<code>aria-hidden</code>).
          </li>
          <li>
            Prefer real destinations on links; avoid empty <code>href=&quot;#&quot;</code>{' '}
            in production.
          </li>
        </ul>
      }
    />
  ),
};

export const Demo: Story = {
  render: () => <DemoExample />,
};

export const WithIcon: Story = {
  name: 'With Icon',
  render: () => <WithIconExample />,
};

export const Link: Story = {
  render: () => <LinkRenderExample />,
};

export const Rtl: Story = {
  name: 'RTL',
  render: () => <RtlExample />,
};
