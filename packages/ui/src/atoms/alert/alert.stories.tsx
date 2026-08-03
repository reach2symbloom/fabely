import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState, type ReactNode } from 'react';
import { InfoIcon, CheckCheck } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription, type AlertType } from './alert';
import { cn } from '@/lib/utils';
import { InlineSegmentedControl } from '../../../stories/InlineSegmentedControl';
import { PlaygroundPanel } from '../../../stories/PlaygroundPanel';

/**
 * Component Storybook IA (see docs/DESIGN.md "Component Story Structure"):
 * Overview is always the first page — description, a gallery composing the
 * canonical examples below (not duplicating them), usage guidance, a11y
 * notes, then an Args playground at the very bottom. Each example below
 * stays its own focused page. Mirrors Avatar's own story structure.
 *
 * `Type="Alert"` (Figma's own name for the amber/warning treatment) is
 * named "Warning" here in Storybook to avoid confusion with the Alert
 * component itself — the underlying prop value is still `type="alert"`,
 * matching Figma exactly; see alert.tsx's own comment and README.md.
 */

const meta = {
  title: 'Design System/Atoms/Alert',
  component: Alert,
  tags: ['ai-generated'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

/* ---------- Canonical examples ----------
 * Each is a plain component so the Overview gallery and the individual
 * story page render the exact same implementation — composed, not
 * duplicated. Line count/icon visibility are never props — see alert.tsx's
 * own comment — so these are just different children combinations per
 * `type`. */

function OneLineExample() {
  return (
    <div className="w-full max-w-xl">
      <Alert>
        <InfoIcon />
        <AlertTitle>Your changes have been saved.</AlertTitle>
      </Alert>
    </div>
  );
}

function TwoLinesExample() {
  return (
    <div className="w-full max-w-xl">
      <Alert>
        <InfoIcon />
        <AlertTitle>Your changes have been saved.</AlertTitle>
        <AlertDescription>You can undo this from the activity log.</AlertDescription>
      </Alert>
    </div>
  );
}

function WithoutIconExample() {
  return (
    <div className="grid w-full max-w-xl items-start gap-4">
      <Alert>
        <AlertTitle>Your changes have been saved.</AlertTitle>
      </Alert>
      <Alert>
        <AlertTitle>Your changes have been saved.</AlertTitle>
        <AlertDescription>You can undo this from the activity log.</AlertDescription>
      </Alert>
    </div>
  );
}

function ErrorExample() {
  return (
    <div className="grid w-full max-w-xl items-start gap-4">
      <Alert type="error">
        <InfoIcon />
        <AlertTitle>Your payment could not be processed.</AlertTitle>
      </Alert>
      <Alert type="error">
        <InfoIcon />
        <AlertTitle>Your payment could not be processed.</AlertTitle>
        <AlertDescription>Check your card details and try again.</AlertDescription>
      </Alert>
    </div>
  );
}

function WarningExample() {
  return (
    <div className="grid w-full max-w-xl items-start gap-4">
      <Alert type="alert">
        <InfoIcon />
        <AlertTitle>Your subscription is about to expire.</AlertTitle>
      </Alert>
      <Alert type="alert">
        <InfoIcon />
        <AlertTitle>Your subscription is about to expire.</AlertTitle>
        <AlertDescription>Renew within 7 days to avoid losing access.</AlertDescription>
      </Alert>
    </div>
  );
}

function SuccessExample() {
  return (
    <div className="grid w-full max-w-xl items-start gap-4">
      <Alert type="success">
        <CheckCheck />
        <AlertTitle>7 files added successfully</AlertTitle>
      </Alert>
      <Alert type="success">
        <CheckCheck />
        <AlertTitle>7 files added successfully</AlertTitle>
        <AlertDescription>Your files are now part of this book.</AlertDescription>
      </Alert>
    </div>
  );
}

const ALERT_TYPES: { value: AlertType; label: string }[] = [
  { value: 'neutral', label: 'Neutral' },
  { value: 'error', label: 'Error' },
  { value: 'alert', label: 'Warning' },
  { value: 'success', label: 'Success' },
];

/* ---------- Interactive playground ----------
 * Rendered inline at the top of the Overview page (not as a separate story
 * page) so visitors can experiment with all controls directly alongside
 * the live examples — same approach as Avatar's own playground. State is
 * plain component-local `useState`, not Storybook args/Controls — this
 * isn't an independent story, just interactive UI within the Overview
 * page itself. Four controls total: Type, Icon, line count, and free-text
 * copy. Icon on/off behaves identically for all 4 types, `success`
 * included — only its *identity* is swapped for a fixed `CheckCheck` in
 * alert.tsx, its presence/absence still follows this same control.
 * Ordered scales (Icon on/off, line count) use InlineSegmentedControl;
 * unordered Type uses a select. */

const playgroundLabelClass = 'font-sans text-xs text-muted-foreground';
const playgroundControlClass =
  'mt-1 w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm';

function PlaygroundField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className={playgroundLabelClass}>{label}</span>
      {children}
    </label>
  );
}

function AlertPlayground() {
  const [type, setType] = useState<AlertType>('neutral');
  const [showIcon, setShowIcon] = useState(true);
  const [showLine2, setShowLine2] = useState(false);
  const [title, setTitle] = useState('Your changes have been saved.');
  const [description, setDescription] = useState('You can undo this from the activity log.');

  return (
    <PlaygroundPanel
      previewAlign="stretch"
      preview={
        <div className="w-full max-w-xl">
          <Alert type={type}>
            {showIcon ? <InfoIcon /> : null}
            <AlertTitle>{title}</AlertTitle>
            {showLine2 ? <AlertDescription>{description}</AlertDescription> : null}
          </Alert>
        </div>
      }
      controls={
        <div className="flex flex-col gap-4">
          <PlaygroundField label="Type">
            <select
              value={type}
              onChange={(e) => setType(e.target.value as AlertType)}
              className={playgroundControlClass}
            >
              {ALERT_TYPES.map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </PlaygroundField>

          <div className="grid w-full max-w-sm grid-cols-2 gap-4">
            <PlaygroundField label="Line 1">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={playgroundControlClass}
              />
            </PlaygroundField>

            <PlaygroundField label="Line 2">
              <input
                type="text"
                value={description}
                disabled={!showLine2}
                onChange={(e) => setDescription(e.target.value)}
                className={cn(playgroundControlClass, !showLine2 && 'opacity-50')}
              />
            </PlaygroundField>

            <InlineSegmentedControl
              label="Icon"
              value={showIcon ? 'on' : 'off'}
              options={[
                { value: 'off', label: 'Off' },
                { value: 'on', label: 'On' },
              ]}
              onChange={(v) => setShowIcon(v === 'on')}
              fullWidth
            />

            <InlineSegmentedControl
              label="Lines"
              value={showLine2 ? 'two' : 'one'}
              options={[
                { value: 'one', label: 'One' },
                { value: 'two', label: 'Two' },
              ]}
              onChange={(v) => setShowLine2(v === 'two')}
              fullWidth
            />
          </div>
        </div>
      }
    />
  );
}

/* ---------- Overview page chrome ---------- */

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-8 first:mt-0">
      <h3 className="font-sans text-sm font-medium text-foreground mb-3">{title}</h3>
      {children}
    </section>
  );
}

function GalleryItem({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-lg border border-border p-6">
      {children}
      <span className="font-sans text-xs text-muted-foreground">{label}</span>
    </div>
  );
}

/* ---------- Overview ---------- */

export const Overview: Story = {
  render: () => {
    return (
      <div className="w-[720px] max-w-full font-sans">
        <h2 className="text-lg font-semibold text-foreground mb-2">Alert</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Displays a callout for user attention. This atom wraps the upstream shadcn Alert
          primitive (<code>Alert</code>, <code>AlertTitle</code>, <code>AlertDescription</code>)
          to match this design system's own Figma Alert component (node <code>58:5416</code>,
          "Fabely Design System" file) — all 4 of its types, at one or two lines, with an optional
          leading icon. See the atom's <code>README.md</code> for the full token mapping,
          including a few values Figma hardcodes that don't have Foundation tokens yet.
        </p>

        <Section title="Playground">
          <AlertPlayground />
        </Section>

        <Section title="Types">
          <div className="grid grid-cols-2 gap-4">
            <GalleryItem label="Neutral">
              <div className="w-full max-w-sm">
                <TwoLinesExample />
              </div>
            </GalleryItem>
            <GalleryItem label="Error">
              <div className="w-full max-w-sm">
                <Alert type="error">
                  <InfoIcon />
                  <AlertTitle>Your payment could not be processed.</AlertTitle>
                  <AlertDescription>Check your card details and try again.</AlertDescription>
                </Alert>
              </div>
            </GalleryItem>
            <GalleryItem label="Warning (Figma: Type=Alert)">
              <div className="w-full max-w-sm">
                <Alert type="alert">
                  <InfoIcon />
                  <AlertTitle>Your subscription is about to expire.</AlertTitle>
                  <AlertDescription>Renew within 7 days to avoid losing access.</AlertDescription>
                </Alert>
              </div>
            </GalleryItem>
            <GalleryItem label="Success">
              <div className="w-full max-w-sm">
                <Alert type="success">
                  <CheckCheck />
                  <AlertTitle>7 files added successfully</AlertTitle>
                  <AlertDescription>Your files are now part of this book.</AlertDescription>
                </Alert>
              </div>
            </GalleryItem>
          </div>
        </Section>

        <Section title="Lines and icon">
          <div className="flex flex-col gap-4">
            <GalleryItem label="One line">
              <OneLineExample />
            </GalleryItem>
            <GalleryItem label="Without icon">
              <WithoutIconExample />
            </GalleryItem>
          </div>
        </Section>

        <Section title="Usage guidance">
          <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1.5">
            <li>
              Compose <code>Alert</code> from an optional icon (any direct SVG child, e.g. a
              lucide-react icon), <code>AlertTitle</code>, and an optional{' '}
              <code>AlertDescription</code> — see Composition below.
            </li>
            <li>
              <code>type</code> is the only real prop (<code>"neutral"</code> default,{' '}
              <code>"error"</code>, <code>"alert"</code>, <code>"success"</code>) — everything
              else is derived from which children are present. Pass <code>AlertDescription</code>{' '}
              for a two-line alert, omit it for one line; pass an icon element, or don't.
            </li>
            <li>
              <code>type="success"</code> follows the same icon show/hide rule as the other 3
              types (pass an icon child, or don't) — but always renders its own checkmark
              regardless of which icon element was passed. It doesn't accept a caller-chosen
              icon, only a caller-chosen presence.
            </li>
            <li>
              <code>AlertTitle</code> is always single-line (vendor's own <code>line-clamp-1</code>
              ) — keep titles short.
            </li>
          </ul>
        </Section>

        <Section title="Composition">
          <pre className="rounded-md border border-border bg-muted p-4 font-mono text-xs text-foreground overflow-x-auto">
{`Alert type="neutral" | "error" | "alert" | "success"
├── Icon (optional — ignored/replaced for type="success")
├── AlertTitle
└── AlertDescription (optional)`}
          </pre>
        </Section>

        <Section title="Accessibility">
          <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1.5">
            <li>
              <code>Alert</code> renders with <code>role="alert"</code> (from the vendor
              primitive), so assistive technology announces its content when it appears in the DOM
              — reserve it for content that genuinely needs that interruption, not routine or
              decorative callouts.
            </li>
            <li>
              The icon is decorative by default (no accessible name is added to it) — the alert's
              meaning should come from <code>AlertTitle</code>/<code>AlertDescription</code> text,
              not the icon alone.
            </li>
            <li>
              <code>error</code>/<code>alert</code> title text uses a raw, theme-invariant Figma
              color rather than a switching semantic token — see the README's "Known limitations"
              for the light-mode contrast caveat this carries over from the source design.
            </li>
          </ul>
        </Section>
      </div>
    );
  },
};

/* ---------- Individual example pages ---------- */

export const OneLine: Story = {
  render: () => <OneLineExample />,
};

export const TwoLines: Story = {
  render: () => <TwoLinesExample />,
};

export const WithoutIcon: Story = {
  render: () => <WithoutIconExample />,
};

// Named `ErrorType`, not `Error`, to avoid shadowing the global `Error`
// constructor — the sidebar label is still plain "Error" via `name`.
export const ErrorType: Story = {
  name: 'Error',
  render: () => <ErrorExample />,
};

export const Warning: Story = {
  render: () => <WarningExample />,
};

export const Success: Story = {
  render: () => <SuccessExample />,
};
