/**
 * Library Nav — Figma set 16431:13709. Overview via PrimitivePage.
 */

import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import { PlaygroundPanel } from '../../../../stories/PlaygroundPanel';
import { PrimitiveGalleryItem, PrimitivePage } from '../../../../stories/PrimitivePage';

import { LibraryNav, type LibraryNavBook } from './LibraryNav';

const FIGMA_SET_URL =
  'https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=16431-13709';

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
];

const meta = {
  title: 'Design System/Features/Library/Library Nav',
  component: LibraryNav,
  tags: ['ai-generated'],
  parameters: { layout: 'centered' },
  args: { books: DEMO_BOOKS },
} satisfies Meta<typeof LibraryNav>;

export default meta;
type Story = StoryObj<typeof meta>;

function FigmaVariantExample({ activeId }: { activeId: string }) {
  return <LibraryNav books={DEMO_BOOKS} defaultActiveId={activeId} />;
}

function NavPlayground() {
  const [activeId, setActiveId] = useState(DEMO_BOOKS[0].id);

  return (
    <PlaygroundPanel
      previewAlign="stretch"
      preview={
        <div className="mx-auto w-[350px] py-[length:var(--spacing-md)]">
          <LibraryNav
            books={DEMO_BOOKS}
            activeId={activeId}
            onActiveChange={setActiveId}
          />
        </div>
      }
      controls={
        <p className="text-sm text-muted-foreground">
          Click a book to select and open it — each row is a real link
          (<code>href</code>), so selecting and opening are the same click.
          Active: <code>{activeId}</code>
        </p>
      }
    />
  );
}

function OverviewPage() {
  return (
    <PrimitivePage
      title="Library Nav"
      description={
        <>
          Vertical list of books — the active row is the open manuscript.
          Figma{' '}
          <a href={FIGMA_SET_URL} target="_blank" rel="noreferrer">
            Library nav organism
          </a>{' '}
          set (<code>16431:13709</code>). Composes{' '}
          <a href="../?path=/docs/design-system-features-library-library-list-item--overview">
            Library List Item
          </a>{' '}
          as rows, stacked flush (no gap), plus a left-edge rail: a
          full-height track and a gradient accent on whichever row is
          active.
        </>
      }
      playground={<NavPlayground />}
      variants={
        <div className="flex flex-col gap-[length:var(--spacing-lg)]">
          {DEMO_BOOKS.map((book) => (
            <PrimitiveGalleryItem key={book.id} label={`Active: ${book.title}`}>
              <FigmaVariantExample activeId={book.id} />
            </PrimitiveGalleryItem>
          ))}
        </div>
      }
      usageGuidance={
        <ul className="list-disc space-y-2 ps-5 text-sm text-muted-foreground">
          <li>
            <code>books</code> is ordered top-to-bottom. Each needs a stable{' '}
            <code>id</code>.
          </li>
          <li>
            Controlled (<code>activeId</code> + <code>onActiveChange</code>)
            or uncontrolled (<code>defaultActiveId</code>, defaults to the
            first book).
          </li>
          <li>
            Pass <code>href</code> per book for real navigation — the row
            becomes a link, so clicking it (active or not) navigates.
            Without <code>href</code>, clicking only updates{' '}
            <code>activeId</code>.
          </li>
          <li>
            Active row's link label always reads &quot;Resume writing&quot;
            by default (this Figma set's own text) — override with{' '}
            <code>linkLabel</code>.
          </li>
        </ul>
      }
      accessibility={
        <ul className="list-disc space-y-2 ps-5 text-sm text-muted-foreground">
          <li>
            Wrapped in <code>&lt;nav aria-label=&quot;Library&quot;&gt;</code>.
          </li>
          <li>
            No roving tabindex or arrow-key row navigation — Tab order
            follows whatever's natively focusable inside each row (the
            link/button), same as any other list of links.
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

export const FirstBookActive: Story = {
  name: 'Active: first book',
  render: () => <FigmaVariantExample activeId={DEMO_BOOKS[0].id} />,
};

export const SecondBookActive: Story = {
  name: 'Active: second book',
  render: () => <FigmaVariantExample activeId={DEMO_BOOKS[1].id} />,
};

export const ThirdBookActive: Story = {
  name: 'Active: third book',
  render: () => <FigmaVariantExample activeId={DEMO_BOOKS[2].id} />,
};
