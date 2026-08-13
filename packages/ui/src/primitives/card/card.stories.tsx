import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import {
  BellIcon,
  CalendarIcon,
  ChevronRightIcon,
  FolderIcon,
  MapPinIcon,
  UsersIcon,
} from 'lucide-react';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  type CardSize,
  type CardVariant,
} from './card';
import { Button } from '../button';
import type { ButtonSize } from '../button';
import { AspectRatio } from '../aspect-ratio';
import { Badge } from '../badge';
import { Field, FieldGroup, FieldLabel } from '../field';
import { Input } from '../input';
import {
  ListItem,
  ListItemContent,
  ListItemDescription,
  ListItemMedia,
  ListItemTitle,
} from '../list-item';
import { InlineSegmentedControl } from '../../../stories/InlineSegmentedControl';
import { PlaygroundPanel } from '../../../stories/PlaygroundPanel';
import {
  PRIMITIVE_PLAYGROUND_CONTROL_GRID,
  PrimitiveGalleryItem,
  PrimitivePage,
} from '../../../stories/PrimitivePage';

const PLAYGROUND_ITEMS = [
  {
    icon: FolderIcon,
    title: 'Project brief',
    description: 'Shared notes and goals for the sprint',
  },
  {
    icon: CalendarIcon,
    title: 'Kickoff call',
    description: 'Thursday 10:00 · Design + eng sync',
  },
  {
    icon: UsersIcon,
    title: 'Reviewers',
    description: 'Alex, Sam, and Jordan assigned',
  },
  {
    icon: MapPinIcon,
    title: 'Studio visit',
    description: 'Building B · Floor 3 workshop',
  },
  {
    icon: BellIcon,
    title: 'Reminders',
    description: 'Digest on by default for this card',
  },
] as const;

/**
 * Component Storybook IA (see docs/DESIGN.md "Component Story Structure"):
 * Overview first — Playground, Variants gallery, usage, a11y — then focused
 * example pages. Figma Card Style Outline | Shadow; patterns also follow
 * shadcn Card docs.
 *
 * Deferred example partners (see README → Deferred / post-primitives docket):
 * - Playground list rows already use ListItem; keep in sync if its API moves
 */

const meta = {
  title: 'Design System/Primitives/Card',
  component: Card,
  tags: ['ai-generated'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

const SPACING_OPTIONS = [
  { value: 'var(--spacing-sm)', label: '12' },
  { value: 'var(--spacing-md)', label: '16' },
  { value: 'var(--spacing-lg)', label: '20' },
  { value: 'var(--spacing-xl)', label: '24' },
] as const;

const RTL_COPY = {
  title: 'تسجيل الدخول إلى حسابك',
  description: 'أدخل بريدك الإلكتروني أدناه لتسجيل الدخول إلى حسابك',
  signUp: 'إنشاء حساب',
  email: 'البريد الإلكتروني',
  emailPlaceholder: 'm@example.com',
  password: 'كلمة المرور',
  forgotPassword: 'نسيت كلمة المرور؟',
  login: 'تسجيل الدخول',
  loginWithGoogle: 'تسجيل الدخول باستخدام Google',
} as const;

/* ---------- Canonical examples ---------- */

function BasicExample({
  size = 'default',
  variant = 'outline',
  bordered = false,
}: {
  size?: CardSize;
  variant?: CardVariant;
  bordered?: boolean;
} = {}) {
  return (
    <Card size={size} variant={variant} bordered={bordered} className="w-96">
      <CardHeader>
        <CardTitle>Login to your account</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
        <CardAction>
          <Button variant="ghost" size="small">
            Sign Up
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="card-email">Email</FieldLabel>
            <Input id="card-email" type="email" placeholder="m@example.com" />
          </Field>
          <Field>
            <div className="flex items-center justify-between gap-[var(--spacing-sm)]">
              <FieldLabel htmlFor="card-password">Password</FieldLabel>
              <Button variant="ghost" size="mini" className="h-auto px-0">
                Forgot your password?
              </Button>
            </div>
            <Input id="card-password" type="password" />
          </Field>
        </FieldGroup>
      </CardContent>
      <CardFooter className="flex flex-col gap-[length:var(--spacing-xs)]">
        <Button className="w-full">Login</Button>
        <Button variant="outline" className="w-full">
          Login with Google
        </Button>
      </CardFooter>
    </Card>
  );
}

function SmallExample() {
  return (
    <Card size="sm" className="w-96">
      <CardHeader>
        <CardTitle>Scheduled reports</CardTitle>
        <CardDescription>
          Weekly snapshots. No more manual exports.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="flex list-disc flex-col gap-[length:var(--spacing-xs)] pl-5 text-[color:var(--muted-foreground)]">
          <li>Choose a schedule (daily, or weekly).</li>
          <li>Send to channels or specific teammates.</li>
          <li>Include charts, tables, and key metrics.</li>
        </ul>
      </CardContent>
      <CardFooter className="gap-[length:var(--spacing-xs)]">
        <Button size="small">Set up scheduled reports</Button>
        <Button variant="ghost" size="small" data-icon="inline-end">
          See what&apos;s new
          <ChevronRightIcon data-icon="inline-end" />
        </Button>
      </CardFooter>
    </Card>
  );
}

function SpacingExample({
  spacing = 'var(--spacing-md)',
}: {
  spacing?: string;
} = {}) {
  return (
    <Card
      className="w-96"
      style={{ ['--card-spacing' as string]: spacing }}
    >
      <CardHeader>
        <CardTitle>Login to your account</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
        <CardAction>
          <Button variant="ghost" size="small">
            Sign Up
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="spacing-email">Email</FieldLabel>
            <Input id="spacing-email" type="email" placeholder="m@example.com" />
          </Field>
          <Field>
            <FieldLabel htmlFor="spacing-password">Password</FieldLabel>
            <Input id="spacing-password" type="password" />
          </Field>
        </FieldGroup>
      </CardContent>
      <CardFooter className="flex flex-col gap-[length:var(--spacing-xs)]">
        <Button className="w-full">Login</Button>
        <Button variant="outline" className="w-full">
          Login with Google
        </Button>
      </CardFooter>
    </Card>
  );
}

function EdgeToEdgeExample() {
  return (
    <Card bordered className="w-96">
      <CardHeader>
        <CardTitle>Terms of Service</CardTitle>
        <CardDescription>
          Review the terms before accepting the agreement.
        </CardDescription>
      </CardHeader>
      <CardContent className="bg-[var(--muted)]">
        <div className="flex max-h-40 flex-col gap-[length:var(--spacing-sm)] overflow-y-auto text-[color:var(--muted-foreground)]">
          <p>
            These terms govern your use of the workspace, including access to
            shared documents, project files, and collaboration tools.
          </p>
          <p>
            You are responsible for the content you upload and for ensuring that
            your team has the appropriate permissions to view or edit it.
          </p>
          <p>
            We may update features or limits as the service evolves. When those
            changes materially affect your workflow, we will notify your
            workspace administrators.
          </p>
        </div>
      </CardContent>
      <CardFooter className="justify-end gap-[length:var(--spacing-xs)]">
        <Button variant="ghost" size="small">
          Decline
        </Button>
        <Button size="small">Accept</Button>
      </CardFooter>
    </Card>
  );
}

/** Cover URL — Aspect Ratio locks 16:9; crop can bend if the photo needs it. */
const EVENT_COVER =
  'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=640&h=360&fit=crop';

function ImageExample() {
  return (
    <Card className="w-80 pt-0">
      <AspectRatio
        ratio={16 / 9}
        className="rounded-none rounded-t-[length:var(--rounded-xl)]"
      >
        <img
          src={EVENT_COVER}
          alt="Event cover"
          className="brightness-60 grayscale dark:brightness-40"
        />
        <div className="z-[1] bg-[var(--overlay)]" />
      </AspectRatio>
      <CardHeader>
        <CardAction>
          <Badge variant="secondary">Featured</Badge>
        </CardAction>
        <CardTitle>Design systems meetup</CardTitle>
        <CardDescription>
          A practical talk on component APIs, accessibility, and shipping
          faster.
        </CardDescription>
      </CardHeader>
      <CardFooter>
        <Button className="w-full" size="small">
          View Event
        </Button>
      </CardFooter>
    </Card>
  );
}

function RtlExample() {
  const t = RTL_COPY;

  return (
    <Card className="w-full max-w-sm" dir="rtl">
      <CardHeader>
        <CardTitle>{t.title}</CardTitle>
        <CardDescription>{t.description}</CardDescription>
        <CardAction>
          <Button variant="ghost" size="small">
            {t.signUp}
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <form>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="email-rtl">{t.email}</FieldLabel>
              <Input
                id="email-rtl"
                type="email"
                placeholder={t.emailPlaceholder}
                required
              />
            </Field>
            <Field>
              <div className="flex items-center gap-[var(--spacing-sm)]">
                <FieldLabel htmlFor="password-rtl">{t.password}</FieldLabel>
                <a
                  href="#"
                  className="ms-auto inline-block text-[length:var(--text-paragraph-small-regular-font-size)] underline-offset-4 hover:underline"
                >
                  {t.forgotPassword}
                </a>
              </div>
              <Input id="password-rtl" type="password" required />
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-[length:var(--spacing-xs)]">
        <Button type="submit" className="w-full">
          {t.login}
        </Button>
        <Button variant="outline" className="w-full">
          {t.loginWithGoogle}
        </Button>
      </CardFooter>
    </Card>
  );
}

/* ---------- Playground ---------- */

function CardPlayground() {
  const [size, setSize] = useState<CardSize>('default');
  const [variant, setVariant] = useState<CardVariant>('outline');
  const [bordered, setBordered] = useState(true);
  const [spacing, setSpacing] = useState<string>('var(--spacing-md)');
  const [buttonSize, setButtonSize] = useState<ButtonSize>('small');
  const [showHeader, setShowHeader] = useState(true);
  const [showFooter, setShowFooter] = useState(true);
  const [showAction, setShowAction] = useState(true);

  return (
    <PlaygroundPanel
      preview={
        <Card
          size={size}
          variant={variant}
          bordered={bordered}
          className="w-96"
          style={
            size === 'default'
              ? { ['--card-spacing' as string]: spacing }
              : undefined
          }
        >
          {showHeader ? (
            <CardHeader>
              <CardTitle>Card title</CardTitle>
              <CardDescription>
                Description sits under the title and wraps as needed.
              </CardDescription>
              {showAction ? (
                <CardAction>
                  <Button variant="ghost" size={buttonSize}>
                    Action
                  </Button>
                </CardAction>
              ) : null}
            </CardHeader>
          ) : null}
          <CardContent className="px-0">
            <ul className="flex flex-col">
              {PLAYGROUND_ITEMS.map(({ icon: Icon, title, description }) => (
                <li key={title}>
                  <ListItem className="rounded-none px-[length:var(--card-spacing)]">
                    <ListItemMedia>
                      <Icon />
                    </ListItemMedia>
                    <ListItemContent>
                      <ListItemTitle>{title}</ListItemTitle>
                      <ListItemDescription>{description}</ListItemDescription>
                    </ListItemContent>
                  </ListItem>
                </li>
              ))}
            </ul>
          </CardContent>
          {showFooter ? (
            <CardFooter className="justify-end gap-[length:var(--spacing-xs)]">
              <Button variant="ghost" size={buttonSize}>
                Cancel
              </Button>
              <Button size={buttonSize}>Save</Button>
            </CardFooter>
          ) : null}
        </Card>
      }
      controls={
        <div className={PRIMITIVE_PLAYGROUND_CONTROL_GRID}>
          <InlineSegmentedControl
            label="Card size"
            value={size}
            options={[
              { value: 'default', label: 'Default' },
              { value: 'sm', label: 'Small' },
            ]}
            onChange={(v) => setSize(v as CardSize)}
            fullWidth
          />
          <InlineSegmentedControl
            label="Style"
            value={variant}
            options={[
              { value: 'outline', label: 'Outline' },
              { value: 'shadow', label: 'Shadow' },
            ]}
            onChange={(v) => setVariant(v as CardVariant)}
            fullWidth
          />
          <InlineSegmentedControl
            label="Dividers"
            value={bordered ? 'on' : 'off'}
            options={[
              { value: 'off', label: 'Off' },
              { value: 'on', label: 'On' },
            ]}
            onChange={(v) => setBordered(v === 'on')}
            fullWidth
          />
          <InlineSegmentedControl
            label="Header"
            value={showHeader ? 'on' : 'off'}
            options={[
              { value: 'off', label: 'Off' },
              { value: 'on', label: 'On' },
            ]}
            onChange={(v) => setShowHeader(v === 'on')}
            fullWidth
          />
          <InlineSegmentedControl
            label="Footer"
            value={showFooter ? 'on' : 'off'}
            options={[
              { value: 'off', label: 'Off' },
              { value: 'on', label: 'On' },
            ]}
            onChange={(v) => setShowFooter(v === 'on')}
            fullWidth
          />
          <InlineSegmentedControl
            label="Header action"
            value={showAction ? 'on' : 'off'}
            options={[
              { value: 'off', label: 'Off' },
              { value: 'on', label: 'On' },
            ]}
            onChange={(v) => setShowAction(v === 'on')}
            fullWidth
          />
          <div className="col-span-2">
            <InlineSegmentedControl
              label="Button size"
              value={buttonSize}
              options={[
                { value: 'mini', label: 'Mini' },
                { value: 'small', label: 'Small' },
                { value: 'default', label: 'Default' },
                { value: 'large', label: 'Large' },
                { value: 'extraLarge', label: 'XL' },
              ]}
              onChange={(v) => setButtonSize(v as ButtonSize)}
              fullWidth
            />
          </div>
          <div className="col-span-2">
            <InlineSegmentedControl
              label="Spacing (default card size)"
              value={spacing}
              options={SPACING_OPTIONS.map(({ value, label }) => ({
                value,
                label,
              }))}
              onChange={setSpacing}
              fullWidth
            />
          </div>
        </div>
      }
    />
  );
}

/* ---------- Stories ---------- */

export const Overview: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => (
    <PrimitivePage
      title="Card"
      description={
        <>
          Grouped surface with header, content, and footer. Figma Style{' '}
          <code>outline</code> / <code>shadow</code>; optional{' '}
          <code>bordered</code> section dividers under the header and above the
          footer. Spacing via <code>--card-spacing</code> (default 16). API
          follows{' '}
          <a
            href="https://ui.shadcn.com/docs/components/base/card"
            className="underline underline-offset-2"
          >
            shadcn Card
          </a>
          .
        </>
      }
      playground={<CardPlayground />}
      variants={
        <div className="flex flex-wrap gap-4">
          <PrimitiveGalleryItem label="Outline">
            <BasicExample variant="outline" />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Shadow">
            <BasicExample variant="shadow" />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Dividers">
            <BasicExample bordered />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Small">
            <SmallExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Custom spacing">
            <SpacingExample spacing="var(--spacing-xl)" />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Edge to edge">
            <EdgeToEdgeExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Image">
            <ImageExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="RTL">
            <RtlExample />
          </PrimitiveGalleryItem>
        </div>
      }
      usageGuidance={
        <ul className="list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
          <li>
            Prefer the composition slots — do not invent parallel header/body
            markup.
          </li>
          <li>
            Use <code>variant=&quot;outline&quot;</code> (default) or{' '}
            <code>variant=&quot;shadow&quot;</code> (2xl elevation). Both keep
            the outer stroke.
          </li>
          <li>
            Set <code>bordered</code> for full-width dividers below{' '}
            <code>CardHeader</code> and above <code>CardFooter</code> when those
            slots are present.
          </li>
          <li>
            Tune inset with <code>size=&quot;sm&quot;</code> or{' '}
            <code>[--card-spacing:var(--spacing-*)]</code> (Foundations only).
          </li>
          <li>
            Edge-to-edge muted bands: prefer <code>bordered</code> plus{' '}
            <code>bg-muted</code> on <code>CardContent</code> (avoids{' '}
            <code>-mx</code> fighting <code>overflow-hidden</code>).
          </li>
          <li>
            Place actions in <code>CardAction</code> (header) or{' '}
            <code>CardFooter</code>.
          </li>
        </ul>
      }
      accessibility={
        <ul className="list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
          <li>
            Card is a generic container — add headings via{' '}
            <code>CardTitle</code> for structure when the card is a landmark.
          </li>
          <li>
            Decorative images need empty <code>alt=&quot;&quot;</code>; content
            images need meaningful <code>alt</code>.
          </li>
          <li>
            Interactive children (Button, links) keep their own focus rings.
          </li>
          <li>
            Set <code>dir=&quot;rtl&quot;</code> on the Card (or an ancestor)
            for right-to-left layouts — grid action placement follows writing
            direction.
          </li>
        </ul>
      }
    />
  ),
};

export const Default: Story = {
  name: 'Basic',
  render: () => <BasicExample />,
};

export const Shadow: Story = {
  render: () => <BasicExample variant="shadow" />,
};

export const Dividers: Story = {
  render: () => <BasicExample bordered />,
};

export const Small: Story = {
  render: () => <SmallExample />,
};

export const Spacing: Story = {
  render: () => <SpacingExample />,
};

export const EdgeToEdge: Story = {
  name: 'Edge to Edge',
  render: () => <EdgeToEdgeExample />,
};

export const Image: Story = {
  render: () => <ImageExample />,
};

export const RTL: Story = {
  render: () => <RtlExample />,
};
