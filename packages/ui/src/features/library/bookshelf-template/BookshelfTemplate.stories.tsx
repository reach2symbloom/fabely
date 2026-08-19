/**
 * Bookshelf Template — Figma set 16431:14662. Overview via PrimitivePage.
 */

import type { Meta, StoryObj } from '@storybook/react-vite';

import { PrimitivePage } from '../../../../stories/PrimitivePage';

import { BookshelfTemplate } from './BookshelfTemplate';
import type { LibraryNavBook } from '../library-nav';

const FIGMA_SET_URL =
  'https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=16431-14662';

/** Main Figma wordmark — same asset as Chapter Menu Header. */
const LOGO_WORDMARK = '/logo-dark.png';

const DEMO_BOOKS: LibraryNavBook[] = [
  {
    id: 'lumithra',
    variant: 'new-book',
    title: 'The Lumithra Prophecy: The Order of the Warlocks',
    category: 'Fiction',
    categoryVariant: 'secondary',
    seriesLabel: 'Series',
    timestampLabel: 'Created just now',
    href: '#lumithra',
  },
  {
    id: 'semantic-continuum',
    variant: 'existing-book',
    title: 'The Semantic Continuum Theory: The Folding of Unity (t) into Meaning',
    category: 'Non-fiction',
    categoryVariant: 'default',
    seriesLabel: 'Series',
    timestampLabel: 'Last opened 2w ago',
    chapterCount: 31,
    noteCount: 4030,
    wordCount: '100.5k',
    href: '#semantic-continuum',
  },
  {
    id: 'eleuthero',
    variant: 'existing-book',
    title: 'Eleuthero',
    category: 'Fiction',
    categoryVariant: 'secondary',
    seriesLabel: false,
    timestampLabel: 'Last opened 2m ago',
    chapterCount: 2,
    noteCount: 412,
    wordCount: '3k',
    href: '#eleuthero',
  },
  {
    id: 'intelligent-design',
    variant: 'existing-book',
    title: 'Intelligent Design: The future of product design in the age of artificial intelligence',
    category: 'Non-fiction',
    categoryVariant: 'default',
    seriesLabel: false,
    timestampLabel: 'Last opened 5d ago',
    chapterCount: 24,
    noteCount: 890,
    wordCount: '52k',
    href: '#intelligent-design',
  },
];

const meta = {
  title: 'Design System/Features/Library/Bookshelf Template',
  component: BookshelfTemplate,
  tags: ['ai-generated'],
  parameters: { layout: 'centered' },
  /*
   * Library is dark-only chrome — force the toolbar's real `.dark` toggle
   * (`.storybook/preview.tsx` puts it on `document.documentElement`) rather
   * than a local wrapper div. Several switch-token aliases this component
   * depends on (`--muted-foreground`, etc.) are declared once at `:root`
   * and only re-declared for the *raw* tokens under `.dark` — they resolve
   * correctly only when `.dark` sits on the document root, not on some
   * descendant wrapper. See BookshelfTemplate.tsx's root className comment.
   */
  globals: { theme: 'dark' },
  args: {
    books: DEMO_BOOKS,
    logoSrc: LOGO_WORDMARK,
    newManuscriptHref: '#new',
    userName: 'Christian Davis',
    userInitials: 'CD',
    userProfileHref: '#profile',
    upgradeHref: '#upgrade',
    notificationCount: 3,
    notificationsHref: '#notifications',
  },
} satisfies Meta<typeof BookshelfTemplate>;

export default meta;
type Story = StoryObj<typeof meta>;

function FrameExample() {
  return (
    <div className="h-[1037px] w-[357px]">
      <BookshelfTemplate
        books={DEMO_BOOKS}
        logoSrc={LOGO_WORDMARK}
        newManuscriptHref="#new"
        userName="Christian Davis"
        userInitials="CD"
        userProfileHref="#profile"
        upgradeHref="#upgrade"
        notificationCount={3}
        notificationsHref="#notifications"
      />
    </div>
  );
}

function PopoverDisabledExample() {
  return (
    <div className="h-[1037px] w-[357px]">
      <BookshelfTemplate
        books={DEMO_BOOKS}
        logoSrc={LOGO_WORDMARK}
        newManuscriptHref="#new"
        userName="Christian Davis"
        userInitials="CD"
        userProfileHref="#profile"
        upgradeHref="#upgrade"
        notificationCount={3}
        notificationsHref="#notifications"
        avatarPopoverDisabled
      />
    </div>
  );
}

function OverviewPage() {
  return (
    <PrimitivePage
      title="Bookshelf Template"
      description={
        <>
          Library page shell. Figma{' '}
          <a href={FIGMA_SET_URL} target="_blank" rel="noreferrer">
            Bookshelf template
          </a>{' '}
          (<code>16431:14662</code>). Composes{' '}
          <a href="../?path=/docs/design-system-features-library-library-nav--overview">
            Library Nav
          </a>{' '}
          between a wordmark + "New manuscript" header and a user identity +
          notifications footer — no new visual primitives.
        </>
      }
      playground={<FrameExample />}
      variants={
        <div className="flex flex-col gap-[length:var(--spacing-lg)]">
          <p className="text-sm text-muted-foreground">
            Default — footer avatar opens an account-menu popover:
          </p>
          <FrameExample />
          <p className="text-sm text-muted-foreground">
            <code>avatarPopoverDisabled</code> — falls back to a plain{' '}
            <code>userProfileHref</code> link (pre-popover behavior):
          </p>
          <PopoverDisabledExample />
        </div>
      }
      usageGuidance={
        <ul className="list-disc space-y-2 ps-5 text-sm text-muted-foreground">
          <li>
            <code>books</code>, <code>activeId</code> /{' '}
            <code>defaultActiveId</code> / <code>onActiveChange</code>, and{' '}
            <code>linkLabel</code> pass straight through to Library Nav.
          </li>
          <li>
            Pass <code>logo</code> (a node) or <code>logoSrc</code> (an
            image URL) for the header wordmark; <code>homeHref={'{false}'}</code>{' '}
            drops the wrapping link.
          </li>
          <li>
            Pass <code>newManuscriptHref</code> to render the CTA as a real
            link; omit it and use <code>onNewManuscriptClick</code> for a
            plain button.
          </li>
          <li>
            Pass <code>user</code> (a full identity record) or the
            individual <code>userName</code> / <code>userInitials</code> /
            <code>userAvatarSrc</code> / <code>userProfileHref</code> props.
          </li>
          <li>
            The footer avatar's primary behavior is an account-menu popover
            (name header, Account settings via <code>userProfileHref</code>,
            Sign out via <code>onSignOutClick</code>). "Upgrade plan"
            (<code>upgradeHref</code>, defaults <code>/pricing</code>) lives
            inside that same trigger — it's a real link with its own
            independent hover regardless, since clicking it stops the click
            from also toggling the menu, and its hover styling is its own{' '}
            <code>hover:underline</code>, not something that depends on
            sitting outside the trigger's hit area. Set{' '}
            <code>avatarPopoverDisabled</code>{' '}
            to fall back to a plain <code>userProfileHref</code> link on the
            avatar itself instead (or a static row when that's unset too).
          </li>
          <li>
            <code>notificationCount</code> hides the badge at <code>0</code>{' '}
            or when unset. Pass <code>notificationsHref</code> for a real
            link (destination TBD — the prop exists for whenever that route
            lands).
          </li>
        </ul>
      }
      accessibility={
        <ul className="list-disc space-y-2 ps-5 text-sm text-muted-foreground">
          <li>
            Header wordmark and "Upgrade plan" are each their own focusable
            link when a route is supplied. The account-menu trigger is a
            labeled button (<code>accountMenuLabel</code>, default "Account
            menu") — Base UI Menu handles its own keyboard nav (arrow
            keys, Escape to close) inside the popup.
          </li>
          <li>
            Library section inherits Library Nav's own{' '}
            <code>&lt;nav aria-label=&quot;Library&quot;&gt;</code> landmark.
          </li>
        </ul>
      }
    />
  );
}

export const Overview: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => <OverviewPage />,
};

export const Default: Story = {
  render: () => <FrameExample />,
};

export const AvatarPopoverDisabled: Story = {
  name: 'avatarPopoverDisabled',
  render: () => <PopoverDisabledExample />,
};
