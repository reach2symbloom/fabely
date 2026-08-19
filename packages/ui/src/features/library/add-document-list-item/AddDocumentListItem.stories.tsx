/**
 * Add Document List Item — Figma set 16509:31009. Overview via PrimitivePage.
 */

import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactNode } from 'react';
import { useState } from 'react';

import { cn } from '@/lib/utils';
import { InlineSegmentedControl } from '../../../../stories/InlineSegmentedControl';
import { PlaygroundPanel } from '../../../../stories/PlaygroundPanel';
import {
  PRIMITIVE_PLAYGROUND_CONTROL_GRID,
  PrimitiveGalleryItem,
  PrimitivePage,
} from '../../../../stories/PrimitivePage';

import {
  AddDocumentListItem,
  type AddDocumentFileType,
} from './AddDocumentListItem';

const meta = {
  title: 'Design System/Features/Library/Add Document List Item',
  component: AddDocumentListItem,
  tags: ['ai-generated'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof AddDocumentListItem>;

export default meta;
type Story = StoryObj<typeof meta>;

const FIGMA_SET_URL =
  'https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=16509-31009';

const FILE_TYPE_LABEL: Record<AddDocumentFileType, string> = {
  pdf: 'PDF',
  doc: 'Doc',
  docx: 'Docx',
};

function LibraryCanvas({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'dark w-[361px] bg-[color:var(--tw-raw-black)] p-[length:var(--spacing-md)]',
        className,
      )}
    >
      {children}
    </div>
  );
}

function FigmaVariantExample({ added }: { added: boolean }) {
  return (
    <LibraryCanvas>
      <AddDocumentListItem added={added} />
    </LibraryCanvas>
  );
}

function ItemPlayground() {
  const [added, setAdded] = useState(false);
  const [fileType, setFileType] = useState<AddDocumentFileType>('pdf');

  return (
    <PlaygroundPanel
      previewAlign="stretch"
      preview={
        <div className="-m-8 dark bg-[color:var(--tw-raw-black)] p-8">
          <div className="mx-auto w-[361px] py-[length:var(--spacing-md)]">
            <AddDocumentListItem
              added={added}
              fileType={fileType}
              onAdd={() => setAdded(true)}
              onRemove={() => setAdded(false)}
            />
          </div>
        </div>
      }
      controls={
        <div className={PRIMITIVE_PLAYGROUND_CONTROL_GRID}>
          <InlineSegmentedControl
            label="Added"
            value={added ? 'true' : 'false'}
            onChange={(value) => setAdded(value === 'true')}
            options={[
              { value: 'false', label: 'False' },
              { value: 'true', label: 'True' },
            ]}
            fullWidth
            className="col-span-2"
          />
          <InlineSegmentedControl
            label="File type"
            value={fileType}
            onChange={(value) => setFileType(value as AddDocumentFileType)}
            options={[
              { value: 'pdf', label: FILE_TYPE_LABEL.pdf },
              { value: 'docx', label: FILE_TYPE_LABEL.docx },
              { value: 'doc', label: FILE_TYPE_LABEL.doc },
            ]}
            fullWidth
            className="col-span-2"
          />
        </div>
      }
    />
  );
}

function OverviewPage() {
  return (
    <PrimitivePage
      title="Add Document List Item"
      description={
        <>
          File row with a Doc-types glyph, title, and an Add or Remove
          trailing control. Figma{' '}
          <a href={FIGMA_SET_URL} target="_blank" rel="noreferrer">
            Add document list item
          </a>{' '}
          set (<code>16509:31009</code>) — Property 1 Frame 162 / 163 mapped
          to <code>added</code>.
        </>
      }
      playground={<ItemPlayground />}
      variants={
        <div className="flex flex-col gap-[length:var(--spacing-lg)]">
          <PrimitiveGalleryItem label="Add (Frame 162)">
            <FigmaVariantExample added={false} />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Added (Frame 163)">
            <FigmaVariantExample added />
          </PrimitiveGalleryItem>
        </div>
      }
      usageGuidance={
        <ul className="list-disc space-y-2 ps-5 text-sm text-muted-foreground">
          <li>
            <code>added</code> swaps the trailing control: Button{' '}
            <code>tertiary</code> <code>small</code> &quot;Add&quot; vs
            Icon Button <code>ghost</code> <code>sm</code> with Lucide{' '}
            <code>X</code>.
          </li>
          <li>
            <code>fileType</code> is the nested Doc types instance (
            <code>pdf</code> / <code>docx</code> / <code>doc</code>). Figma
            only shows PDF; the other two are on the Doc types set.
          </li>
          <li>
            Wire <code>onAdd</code> / <code>onRemove</code>. The row itself
            is not a hit target.
          </li>
        </ul>
      }
      accessibility={
        <ul className="list-disc space-y-2 ps-5 text-sm text-muted-foreground">
          <li>
            Two independent controls — never nested inside a row{' '}
            <code>&lt;button&gt;</code>. Add uses the visible label; Remove
            uses <code>removeLabel</code> as <code>aria-label</code>.
          </li>
          <li>
            The file-type glyph is decorative (<code>alt=&quot;&quot;</code>
            ).
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

export const Add: Story = {
  name: 'Add',
  render: () => <FigmaVariantExample added={false} />,
};

export const Added: Story = {
  name: 'Added',
  render: () => <FigmaVariantExample added />,
};
