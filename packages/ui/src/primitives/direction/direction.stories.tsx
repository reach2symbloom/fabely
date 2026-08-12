import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import { Button } from '../button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../card';
import { Field, FieldLabel } from '../field';
import { Input } from '../input';
import { InlineSegmentedControl } from '../../../stories/InlineSegmentedControl';
import { PlaygroundPanel } from '../../../stories/PlaygroundPanel';
import {
  PRIMITIVE_PLAYGROUND_CONTROL_GRID,
  PrimitiveGalleryItem,
  PrimitivePage,
} from '../../../stories/PrimitivePage';

import { DirectionProvider, useDirection } from './direction';

/**
 * Provider utility — no Figma visual. Stories show DirectionProvider +
 * useDirection with a small RTL/LTR surface (shadcn Direction guide).
 */

const meta = {
  title: 'Design System/Primitives/Direction',
  component: DirectionProvider,
  tags: ['ai-generated'],
  parameters: { layout: 'centered' },
} satisfies Meta;

export default meta;
type Story = StoryObj;

function DirectionBadge() {
  const direction = useDirection();
  return (
    <p className="text-sm text-muted-foreground">
      Current direction: <code>{direction}</code>
    </p>
  );
}

function LoginCard({ dir }: { dir: 'ltr' | 'rtl' }) {
  const copy =
    dir === 'rtl'
      ? {
          title: 'تسجيل الدخول إلى حسابك',
          description: 'أدخل بريدك الإلكتروني أدناه لتسجيل الدخول إلى حسابك',
          email: 'البريد الإلكتروني',
          password: 'كلمة المرور',
          submit: 'تسجيل الدخول',
          create: 'إنشاء حساب',
        }
      : {
          title: 'Login to your account',
          description: 'Enter your email below to login to your account',
          email: 'Email',
          password: 'Password',
          submit: 'Login',
          create: 'Sign up',
        };

  return (
    <Card className="w-full max-w-sm" dir={dir}>
      <CardHeader>
        <CardTitle>{copy.title}</CardTitle>
        <CardDescription>{copy.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-[var(--spacing-md)]">
        <Field>
          <FieldLabel htmlFor={`direction-email-${dir}`}>
            {copy.email}
          </FieldLabel>
          <Input id={`direction-email-${dir}`} type="email" />
        </Field>
        <Field>
          <FieldLabel htmlFor={`direction-password-${dir}`}>
            {copy.password}
          </FieldLabel>
          <Input id={`direction-password-${dir}`} type="password" />
        </Field>
      </CardContent>
      <CardFooter className="flex flex-col gap-[var(--spacing-xs)]">
        <Button className="w-full">{copy.submit}</Button>
        <Button variant="outline" className="w-full">
          {copy.create}
        </Button>
      </CardFooter>
    </Card>
  );
}

function DirectionPlayground() {
  const [direction, setDirection] = useState<'ltr' | 'rtl'>('rtl');

  return (
    <PlaygroundPanel
      preview={
        <DirectionProvider direction={direction}>
          <div
            dir={direction}
            className="flex w-full max-w-sm flex-col gap-[var(--spacing-md)]"
          >
            <DirectionBadge />
            <LoginCard dir={direction} />
          </div>
        </DirectionProvider>
      }
      controls={
        <div className={PRIMITIVE_PLAYGROUND_CONTROL_GRID}>
          <InlineSegmentedControl
            label="Direction"
            value={direction}
            onChange={(v) => setDirection(v as 'ltr' | 'rtl')}
            options={[
              { value: 'ltr', label: 'LTR' },
              { value: 'rtl', label: 'RTL' },
            ]}
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
      title="Direction"
      description="Base UI DirectionProvider — sets ltr/rtl context for the app. No Figma visual; pair with dir on html or a subtree."
      playground={<DirectionPlayground />}
      variants={
        <div className="flex flex-wrap gap-[var(--spacing-xl)]">
          <PrimitiveGalleryItem label="LTR">
            <DirectionProvider direction="ltr">
              <div dir="ltr" className="flex flex-col gap-[var(--spacing-xs)]">
                <DirectionBadge />
                <LoginCard dir="ltr" />
              </div>
            </DirectionProvider>
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="RTL">
            <DirectionProvider direction="rtl">
              <div dir="rtl" className="flex flex-col gap-[var(--spacing-xs)]">
                <DirectionBadge />
                <LoginCard dir="rtl" />
              </div>
            </DirectionProvider>
          </PrimitiveGalleryItem>
        </div>
      }
      usageGuidance={
        <ul className="list-disc space-y-2 ps-5 text-sm text-muted-foreground">
          <li>
            Wrap the app (or a locale subtree) in{' '}
            <code>DirectionProvider</code> and set matching{' '}
            <code>dir</code> on <code>&lt;html&gt;</code> or the subtree.
          </li>
          <li>
            Read the active direction with <code>useDirection()</code> inside
            the provider.
          </li>
          <li>
            Component RTL Storybook pages can still use local{' '}
            <code>dir=&quot;rtl&quot;</code> wrappers for isolated demos.
          </li>
        </ul>
      }
      accessibility={
        <ul className="list-disc space-y-2 ps-5 text-sm text-muted-foreground">
          <li>
            Keep the document <code>dir</code> attribute in sync with the
            provider so assistive tech and CSS logical properties agree.
          </li>
          <li>
            Prefer logical CSS (<code>ps</code>/<code>pe</code>,{' '}
            <code>start</code>/<code>end</code>) over physical left/right in
            product UI.
          </li>
        </ul>
      }
    />
  ),
};

export const Demo: Story = {
  render: () => (
    <DirectionProvider direction="rtl">
      <div dir="rtl" className="flex flex-col gap-[var(--spacing-md)]">
        <DirectionBadge />
        <LoginCard dir="rtl" />
      </div>
    </DirectionProvider>
  ),
};

export const UseDirection: Story = {
  name: 'useDirection',
  render: () => (
    <DirectionProvider direction="ltr">
      <DirectionBadge />
    </DirectionProvider>
  ),
};
