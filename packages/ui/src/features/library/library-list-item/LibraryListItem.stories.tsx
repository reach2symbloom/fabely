/**
 * Library List Item — Figma set 16428:12557. Overview via PrimitivePage.
 */

import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import { InlineSegmentedControl } from '../../../../stories/InlineSegmentedControl';
import { PlaygroundPanel } from '../../../../stories/PlaygroundPanel';
import {
  PRIMITIVE_PLAYGROUND_CONTROL_GRID,
  PrimitiveGalleryItem,
  PrimitivePage,
} from '../../../../stories/PrimitivePage';
import { RadioGroup, RadioGroupItem } from '@/primitives/radio-group';

import { LibraryListItem, type LibraryListItemVariant } from './LibraryListItem';

const meta = {
  title: 'Design System/Features/Library/Library List Item',
  component: LibraryListItem,
  tags: ['ai-generated'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof LibraryListItem>;

export default meta;
type Story = StoryObj<typeof meta>;

const DEMO_FRAME = 'w-[325px]';

/** Storybook placeholder — swap for a real manuscript route in apps. */
const SECTION_HREF = '#';

const FIGMA_SET_URL =
  'https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=16428-12557';

type FigmaVariant =
  | 'existing-rest'
  | 'existing-hover'
  | 'existing-active'
  | 'new-rest'
  | 'new-hover'
  | 'new-active';

type FigmaVariantOption = { value: FigmaVariant; label: string };

const FIGMA_VARIANT_GROUPS: { caption: string; options: FigmaVariantOption[] }[] = [
  {
    caption: 'Existing book',
    options: [
      { value: 'existing-rest', label: 'Rest' },
      { value: 'existing-hover', label: 'Hover' },
      { value: 'existing-active', label: 'Active' },
    ],
  },
  {
    caption: 'New book',
    options: [
      { value: 'new-rest', label: 'Rest' },
      { value: 'new-hover', label: 'Hover' },
      { value: 'new-active', label: 'Active' },
    ],
  },
];

function FigmaVariantExample({ variant }: { variant: FigmaVariant }) {
  const bookVariant: LibraryListItemVariant = variant.startsWith('existing')
    ? 'existing-book'
    : 'new-book';
  const active = variant.endsWith('active');
  const forceHover = variant.endsWith('hover');

  return (
    <div className={DEMO_FRAME}>
      <LibraryListItem
        variant={bookVariant}
        active={active}
        forceHover={forceHover}
        showMenuButton
        href={SECTION_HREF}
      />
    </div>
  );
}

function ListItemPlayground() {
  const [figmaVariant, setFigmaVariant] = useState<FigmaVariant>('existing-rest');
  const [variant, setVariant] = useState<LibraryListItemVariant>('existing-book');
  const [active, setActive] = useState(false);
  const [forceHover, setForceHover] = useState(false);
  const [showMenuButton, setShowMenuButton] = useState(true);
  const [showLinkButton, setShowLinkButton] = useState(true);
  const [mode, setMode] = useState<'figma' | 'controls'>('figma');

  return (
    <PlaygroundPanel
      previewAlign="stretch"
      preview={
        <div className={`mx-auto py-[length:var(--spacing-md)] ${DEMO_FRAME}`}>
          {mode === 'figma' ? (
            <FigmaVariantExample key={figmaVariant} variant={figmaVariant} />
          ) : (
            <LibraryListItem
              variant={variant}
              active={active}
              forceHover={forceHover}
              showMenuButton={showMenuButton}
              showLinkButton={showLinkButton}
              href={SECTION_HREF}
            />
          )}
        </div>
      }
      controls={
        <div className={PRIMITIVE_PLAYGROUND_CONTROL_GRID}>
          <InlineSegmentedControl
            label="Playground"
            value={mode}
            onChange={(value) => setMode(value as 'figma' | 'controls')}
            options={[
              { value: 'figma', label: 'Figma variants' },
              { value: 'controls', label: 'Axes' },
            ]}
            fullWidth
          />
          {mode === 'figma' ? (
            <div className="min-w-0">
              <div className="mb-1.5 font-sans text-xs text-muted-foreground">
                Figma variant
              </div>
              <RadioGroup
                value={figmaVariant}
                onValueChange={(value) => setFigmaVariant(value as FigmaVariant)}
                className="gap-[length:var(--spacing-md)]"
              >
                {FIGMA_VARIANT_GROUPS.map((group) => (
                  <div key={group.caption} className="flex flex-col gap-[length:var(--spacing-xs)]">
                    <div className="font-sans text-xs font-medium text-foreground">
                      {group.caption}
                    </div>
                    <div className="flex flex-col gap-[length:var(--spacing-xs)]">
                      {group.options.map((option) => {
                        const id = `library-list-item-${option.value}`;
                        return (
                          <label
                            key={option.value}
                            htmlFor={id}
                            className="flex cursor-pointer items-center gap-[length:var(--spacing-xs)] font-sans text-sm text-foreground"
                          >
                            <RadioGroupItem value={option.value} id={id} />
                            {option.label}
                          </label>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </RadioGroup>
            </div>
          ) : (
            <>
              <InlineSegmentedControl
                label="Variant"
                value={variant}
                onChange={(value) => setVariant(value as LibraryListItemVariant)}
                options={[
                  { value: 'existing-book', label: 'Existing book' },
                  { value: 'new-book', label: 'New book' },
                ]}
                fullWidth
              />
              <InlineSegmentedControl
                label="Active"
                value={active ? 'on' : 'off'}
                onChange={(value) => setActive(value === 'on')}
                options={[
                  { value: 'off', label: 'Off' },
                  { value: 'on', label: 'On' },
                ]}
                fullWidth
              />
              <InlineSegmentedControl
                label="Hover"
                value={forceHover ? 'on' : 'off'}
                onChange={(value) => setForceHover(value === 'on')}
                options={[
                  { value: 'off', label: 'Off' },
                  { value: 'on', label: 'On' },
                ]}
                fullWidth
              />
              <InlineSegmentedControl
                label="Menu button"
                value={showMenuButton ? 'on' : 'off'}
                onChange={(value) => setShowMenuButton(value === 'on')}
                options={[
                  { value: 'off', label: 'Off' },
                  { value: 'on', label: 'On' },
                ]}
                fullWidth
              />
              <InlineSegmentedControl
                label="Link button"
                value={showLinkButton ? 'on' : 'off'}
                onChange={(value) => setShowLinkButton(value === 'on')}
                options={[
                  { value: 'off', label: 'Off' },
                  { value: 'on', label: 'On' },
                ]}
                fullWidth
              />
            </>
          )}
        </div>
      }
    />
  );
}

function OverviewPage() {
  return (
    <PrimitivePage
      title="Library List Item"
      description={
        <>
          Book row in the Library grid/list. Figma{' '}
          <a href={FIGMA_SET_URL} target="_blank" rel="noreferrer">
            Library list item
          </a>{' '}
          set (<code>16428:12557</code>) — Existing book / New book, each with
          Rest / Hover / Active. Hover and Active never combine in Figma, so
          this component suppresses its own <code>:hover</code> styling while{' '}
          <code>active</code>.
        </>
      }
      playground={<ListItemPlayground />}
      variants={
        <div className="flex flex-col gap-[length:var(--spacing-2xl)]">
          {FIGMA_VARIANT_GROUPS.map((group) => (
            <div key={group.caption} className="flex flex-col gap-[length:var(--spacing-md)]">
              <h3 className="font-sans text-sm font-medium text-foreground">
                {group.caption}
              </h3>
              <div className="flex flex-col gap-[length:var(--spacing-lg)]">
                {group.options.map((option) => (
                  <PrimitiveGalleryItem key={option.value} label={option.label}>
                    <FigmaVariantExample variant={option.value} />
                  </PrimitiveGalleryItem>
                ))}
              </div>
            </div>
          ))}
        </div>
      }
      usageGuidance={
        <ul className="list-disc space-y-2 ps-5 text-sm text-muted-foreground">
          <li>
            Pass <code>href</code> to the manuscript route (real route in
            apps; <code>#</code> is fine in Storybook). A stretched link sits
            behind the row; the menu button and link button stay above it.
          </li>
          <li>
            <code>active</code> marks the currently open manuscript — pins the
            gradient wash, keeps the menu button visible, and reveals the
            Continue/Start writing link. It also suppresses this row's own
            hover styling (Figma never combines Hover with Active).
          </li>
          <li>
            The chapter/note/word count row only renders for{' '}
            <code>variant=&quot;existing-book&quot;</code> — a new book has no
            stats yet.
          </li>
          <li>
            Use <code>forceHover</code> in Storybook to lock the hover state
            without a pointer.
          </li>
        </ul>
      }
      accessibility={
        <ul className="list-disc space-y-2 ps-5 text-sm text-muted-foreground">
          <li>
            When <code>href</code> is set, an <code>aria-label</code>d
            stretched link covers the row; the actions button and (decorative)
            link button keep focus/click above it.
          </li>
          <li>
            Trailing ellipsis is Icon Button ghost mini (
            <code>aria-label=&quot;Book actions&quot;</code>).
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

export const ExistingBookRest: Story = {
  name: 'Existing book / Rest',
  render: () => <FigmaVariantExample variant="existing-rest" />,
};

export const ExistingBookHover: Story = {
  name: 'Existing book / Hover',
  render: () => <FigmaVariantExample variant="existing-hover" />,
};

export const ExistingBookActive: Story = {
  name: 'Existing book / Active',
  render: () => <FigmaVariantExample variant="existing-active" />,
};

export const NewBookRest: Story = {
  name: 'New book / Rest',
  render: () => <FigmaVariantExample variant="new-rest" />,
};

export const NewBookHover: Story = {
  name: 'New book / Hover',
  render: () => <FigmaVariantExample variant="new-hover" />,
};

export const NewBookActive: Story = {
  name: 'New book / Active',
  render: () => <FigmaVariantExample variant="new-active" />,
};
