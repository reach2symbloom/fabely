import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactNode } from 'react';
import { useArgs } from 'storybook/preview-api';
import { Avatar, AvatarImage, AvatarFallback } from './avatar';

/**
 * Component Storybook IA (see docs/DESIGN.md "Component Story Structure"):
 * Overview is always the first page — description, a gallery composing the
 * canonical examples below (not duplicating them), usage guidance, a11y
 * notes, then an Args playground at the very bottom. Each example below
 * stays its own focused page. This is the reference implementation for the
 * pattern every future atom/molecule/organism should follow.
 */

const meta = {
  title: 'Design System/Atoms/Avatar',
  component: Avatar,
  tags: ['ai-generated'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

/* ---------- Canonical examples ----------
 * Each is a plain component so the Overview gallery and the individual
 * story page render the exact same implementation — composed, not
 * duplicated. */

/** Canonical usage: Avatar always paired with a fallback so it renders
 * something even before an image is provided or if one is never set. A
 * bare `<Avatar />` with no children is a valid but degenerate primitive
 * state (nothing to display, so nothing renders) — not what consumers
 * should copy as the recommended pattern. */
function DefaultExample() {
  return (
    <Avatar>
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  );
}

/** The common case: an image that loads successfully. */
function WithImageExample() {
  return (
    <Avatar>
      <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  );
}

/** AvatarImage with a src that fails to load — Radix falls back to
 * AvatarFallback's children automatically. */
function FallbackExample() {
  return (
    <Avatar>
      <AvatarImage src="https://broken-image-url.invalid/nope.png" alt="" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  );
}

/** Several fallback initials side by side, demonstrating the fallback
 * pattern isn't tied to any one set of initials. */
function SeveralFallbackInitialsExample() {
  return (
    <div className="flex gap-3">
      <Avatar>
        <AvatarFallback>CD</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>JS</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>AB</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>XY</AvatarFallback>
      </Avatar>
    </div>
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

type PlaygroundArgs = { imageSrc: string; fallbackText: string };

function AvatarPlayground({ imageSrc, fallbackText }: PlaygroundArgs) {
  return (
    <Avatar>
      {imageSrc ? <AvatarImage src={imageSrc} alt={fallbackText} /> : null}
      <AvatarFallback>{fallbackText}</AvatarFallback>
    </Avatar>
  );
}

/* ---------- Overview ---------- */

export const Overview: StoryObj<Meta<PlaygroundArgs>> = {
  argTypes: {
    imageSrc: { control: 'text' },
    fallbackText: { control: 'text' },
  },
  args: {
    imageSrc: 'https://github.com/shadcn.png',
    fallbackText: 'CN',
  },
  render: () => {
    const [args, updateArgs] = useArgs<PlaygroundArgs>();

    return (
      <div className="w-[640px] max-w-full font-sans">
        <p className="text-sm leading-relaxed text-muted-foreground">
          <strong className="text-foreground">Avatar</strong> represents a user or entity with an
          image, falling back to initials (or any short content) when no image is set or the
          image fails to load. This atom is a thin wrapper around the upstream shadcn/Radix
          Avatar primitive — see the atom's <code>README.md</code> for what's intentionally not
          yet included (sizes, badges, grouping, presence).
        </p>

        <Section title="Examples">
          <div className="flex flex-wrap gap-4">
            <GalleryItem label="Default">
              <DefaultExample />
            </GalleryItem>
            <GalleryItem label="With Image">
              <WithImageExample />
            </GalleryItem>
            <GalleryItem label="Fallback">
              <FallbackExample />
            </GalleryItem>
            <GalleryItem label="Several Fallback Initials">
              <SeveralFallbackInitialsExample />
            </GalleryItem>
          </div>
        </Section>

        <Section title="Usage guidance">
          <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1.5">
            <li>Always pair Avatar with AvatarFallback, so there's something to render even before an image loads or if it never resolves.</li>
            <li>Provide a real src and meaningful alt text on AvatarImage — don't rely on the fallback as the default state.</li>
            <li>Keep call sites to composing Avatar/AvatarImage/AvatarFallback as-is; this atom doesn't yet expose sizes, badges, or grouping — propose extending the atom itself rather than reimplementing those at the call site.</li>
          </ul>
        </Section>

        <Section title="Accessibility">
          <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1.5">
            <li>AvatarImage's <code>alt</code> should identify who or what the avatar represents — screen readers announce it when the image is present.</li>
            <li>Radix automatically swaps to AvatarFallback when the image fails or has no src, so users are never left with a broken image icon.</li>
            <li>Initials alone (e.g. "CN") aren't a substitute for an accessible name where one is needed elsewhere in the surrounding UI (e.g. next to the user's full name).</li>
          </ul>
        </Section>

        <Section title="Playground">
          <div className="flex flex-col items-center gap-6 rounded-lg border border-border p-8">
            <AvatarPlayground imageSrc={args.imageSrc ?? ''} fallbackText={args.fallbackText ?? ''} />
            <div className="w-full max-w-sm space-y-3">
              <label className="block">
                <span className="font-sans text-xs text-muted-foreground">Image src (clear it, or break it, to see the fallback)</span>
                <input
                  type="text"
                  value={args.imageSrc ?? ''}
                  onChange={(e) => updateArgs({ imageSrc: e.target.value })}
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm"
                />
              </label>
              <label className="block">
                <span className="font-sans text-xs text-muted-foreground">Fallback text</span>
                <input
                  type="text"
                  value={args.fallbackText ?? ''}
                  onChange={(e) => updateArgs({ fallbackText: e.target.value })}
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm"
                />
              </label>
            </div>
          </div>
        </Section>
      </div>
    );
  },
};

/* ---------- Individual example pages ---------- */

export const Default: Story = {
  render: () => <DefaultExample />,
};

export const WithImage: Story = {
  render: () => <WithImageExample />,
};

export const Fallback: Story = {
  render: () => <FallbackExample />,
};

export const SeveralFallbackInitials: Story = {
  render: () => <SeveralFallbackInitialsExample />,
};
