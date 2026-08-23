/**
 * StatusBadge — Figma "Promptbar status badges" (16199:2312), a 17-way
 * Mode × Type × Subtype matrix reproduced here as Storybook configurations
 * of one composable atom, not as 17 separate component variants. See the
 * atom's own doc comment / README for why.
 */

import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactNode } from 'react';
import { useState } from 'react';
import {
  BookOpen,
  Feather,
  GitBranch,
  GitCompare,
  Globe,
  Highlighter,
  Link2Off,
  ScrollText,
  Share2,
  Waypoints,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { Separator } from '@/primitives/separator';
import { InlineSegmentedControl } from '../../../stories/InlineSegmentedControl';
import { PlaygroundPanel } from '../../../stories/PlaygroundPanel';
import {
  PRIMITIVE_PLAYGROUND_CONTROL_GRID,
  PrimitiveGalleryItem,
  PrimitivePage,
} from '../../../stories/PrimitivePage';

import { StatusBadge, type StatusBadgeSize, type StatusBadgeTone } from './status-badge';
import {
  formatChapterScene,
  formatParagraphReference,
  genreBadgeLabel,
  genreBadgeTone,
  truncateText,
  type ChapterSceneReference,
  type GenreBadgeInput,
  type HighlightPreviewInput,
  type NotePreviewInput,
  type ParagraphPreviewInput,
  type ParagraphSelectionReference,
  type SceneConnectionInput,
} from './status-badge-content';
import { Status } from '../status';

const meta = {
  title: 'Design System/Atoms/Status Badge',
  component: StatusBadge,
  tags: ['ai-generated'],
  parameters: { layout: 'centered' },
  args: { children: 'Status Badge' },
} satisfies Meta<typeof StatusBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

const TONE_OPTIONS: { value: StatusBadgeTone; label: string }[] = [
  { value: 'neutral', label: 'Neutral' },
  { value: 'secondary', label: 'Secondary' },
  { value: 'fia', label: 'Fia' },
];

const SIZE_OPTIONS: { value: StatusBadgeSize; label: string }[] = [
  { value: 'compact', label: 'Compact' },
  { value: 'default', label: 'Default' },
];

function StatusBadgePlayground() {
  const [tone, setTone] = useState<StatusBadgeTone>('neutral');
  const [size, setSize] = useState<StatusBadgeSize>('compact');
  const [withLeadingIcon, setWithLeadingIcon] = useState(true);
  const [withSecondary, setWithSecondary] = useState(true);
  const [withDismiss, setWithDismiss] = useState(false);

  return (
    <PlaygroundPanel
      preview={
        <div className="flex min-h-16 items-center justify-center">
          <StatusBadge
            tone={tone}
            size={size}
            leadingIcon={withLeadingIcon ? <BookOpen /> : undefined}
            middleIcon={withSecondary ? <GitBranch /> : undefined}
            secondaryText={withSecondary ? 'The Eldergrove' : undefined}
            onDismiss={withDismiss ? () => {} : undefined}
          >
            Scene desk
          </StatusBadge>
        </div>
      }
      controls={
        <div className={PRIMITIVE_PLAYGROUND_CONTROL_GRID}>
          <InlineSegmentedControl
            label="Tone"
            value={tone}
            onChange={(v) => setTone(v as StatusBadgeTone)}
            options={TONE_OPTIONS}
            fullWidth
            className="col-span-2"
          />
          <InlineSegmentedControl
            label="Size"
            value={size}
            onChange={(v) => setSize(v as StatusBadgeSize)}
            options={SIZE_OPTIONS}
            fullWidth
            className="col-span-2"
          />
          <InlineSegmentedControl
            label="Leading icon"
            value={withLeadingIcon ? 'on' : 'off'}
            onChange={(v) => setWithLeadingIcon(v === 'on')}
            options={[
              { value: 'off', label: 'Off' },
              { value: 'on', label: 'On' },
            ]}
            fullWidth
            className="col-span-2"
          />
          <InlineSegmentedControl
            label="Middle icon + secondary text"
            value={withSecondary ? 'on' : 'off'}
            onChange={(v) => setWithSecondary(v === 'on')}
            options={[
              { value: 'off', label: 'Off' },
              { value: 'on', label: 'On' },
            ]}
            fullWidth
            className="col-span-2"
          />
          <InlineSegmentedControl
            label="Dismiss"
            value={withDismiss ? 'on' : 'off'}
            onChange={(v) => setWithDismiss(v === 'on')}
            options={[
              { value: 'off', label: 'Off' },
              { value: 'on', label: 'On' },
            ]}
            fullWidth
            className="col-span-2"
          />
        </div>
      }
    />
  );
}

function SizesExample() {
  return (
    <div className="flex flex-wrap items-center gap-[var(--spacing-md)]">
      <StatusBadge size="compact" leadingIcon={<BookOpen />}>
        Compact
      </StatusBadge>
      <StatusBadge size="default" leadingIcon={<BookOpen />}>
        Default
      </StatusBadge>
    </div>
  );
}

function TonesExample() {
  return (
    <div className="flex flex-wrap items-center gap-[var(--spacing-md)]">
      <StatusBadge tone="neutral">Neutral</StatusBadge>
      <StatusBadge tone="secondary">Secondary</StatusBadge>
      <StatusBadge tone="fia">Fia</StatusBadge>
    </div>
  );
}

function IconSlotsExample() {
  return (
    <div className="flex flex-wrap items-center gap-[var(--spacing-md)]">
      <StatusBadge>Plain text</StatusBadge>
      <StatusBadge leadingIcon={<Globe />}>Leading icon</StatusBadge>
      <StatusBadge leadingIcon={<Globe />} middleIcon={<GitBranch />} secondaryText="Secondary">
        Leading + middle + secondary
      </StatusBadge>
      <StatusBadge middleIcon="·" secondaryText="Secondary">
        Dot-separated
      </StatusBadge>
    </div>
  );
}

function TruncationExample() {
  return (
    <div className="flex flex-wrap items-center gap-[var(--spacing-md)]">
      <StatusBadge leadingIcon={<BookOpen />} middleIcon={<GitBranch />} secondaryText="The Eldergrove">
        Scene desk
      </StatusBadge>
      <StatusBadge
        leadingIcon={<BookOpen />}
        middleIcon="·"
        secondaryText="A much longer excerpt that should truncate at Figma's own 100px width"
      >
        Ch. 1, Sc. 1
      </StatusBadge>
    </div>
  );
}

function DismissibleExample() {
  const [items, setItems] = useState(['Highlight', 'Note', 'Workflow: Related themes']);
  return (
    <div className="flex flex-wrap items-center gap-[var(--spacing-md)]">
      {items.map((item) => (
        <StatusBadge
          key={item}
          size="default"
          tone={item.startsWith('Workflow') ? 'fia' : 'neutral'}
          onDismiss={() => setItems((prev) => prev.filter((i) => i !== item))}
          dismissLabel={`Remove ${item}`}
        >
          {item}
        </StatusBadge>
      ))}
      {items.length === 0 ? (
        <span className="text-sm text-muted-foreground">All dismissed — reload to reset.</span>
      ) : null}
    </div>
  );
}

function StatusGlyphIntegrationExample() {
  return (
    <div className="flex flex-wrap items-center gap-[var(--spacing-md)]">
      <StatusBadge
        leadingIcon={<BookOpen />}
        middleIcon={<GitBranch />}
        secondaryText="The Eldergrove"
        trailing={<Status variant="glyph" />}
      >
        Scene desk
      </StatusBadge>
      <StatusBadge
        leadingIcon={<Globe />}
        middleIcon={<GitBranch />}
        secondaryText="The Eldergrove"
        trailing={<Status variant="glyph" />}
      >
        All notes
      </StatusBadge>
    </div>
  );
}

/**
 * Storybook-only documentation helper — not exported from the package.
 * Renders one table row: the badge in its own cell, a muted name label in
 * the next, so each Figma example is identifiable at a glance without the
 * label running into the badge itself. Purely for story organization;
 * StatusBadge itself never renders a label like this. Must be used as a
 * direct child of a `<tbody>` (see `FigmaReferenceVariants` below).
 */
function VariantExample({ label, children }: { label: string; children: ReactNode }) {
  return (
    <tr className="border-b border-[color:var(--theme-alpha-black-switch-5)] last:border-b-0">
      <td className="py-[length:var(--spacing-2xs)] pe-[length:var(--spacing-lg)]">{children}</td>
      <td className="py-[length:var(--spacing-2xs)] text-sm text-muted-foreground">{label}</td>
    </tr>
  );
}

/**
 * Section header for one Figma "Mode" cluster within the reference table —
 * Figma's own Mode × Type × Subtype axis (Genre / Context / Connection /
 * Workflow), not an anatomy this atom renders. Purely groups the rows below
 * it; spans both columns.
 */
function ModeHeaderRow({ label, first }: { label: string; first?: boolean }) {
  return (
    <tr>
      <td
        colSpan={2}
        className={cn(
          'pb-[length:var(--spacing-3xs)] text-xs font-semibold tracking-wide text-muted-foreground uppercase',
          first ? 'pt-0' : 'pt-[length:var(--spacing-xl)]'
        )}
      >
        {label}
      </td>
    </tr>
  );
}

/**
 * Storybook-only demonstrations of the *derivation* logic behind each
 * Figma example, exercised against mocked future-Promptbar inputs. None of
 * this is app-state wiring — the pure functions themselves live in
 * `./status-badge-content` (exported from the atom's `index.ts`) so a real
 * Promptbar feature can import and reuse them later instead of
 * re-deriving these rules from scratch. `StatusBadge` itself stays a pure
 * slot atom per its own doc comment.
 */

/** Genre and Series both come from how the user configured the book at
 * creation time, not from anything the badge itself knows — genre picks
 * the tone (Figma gives Fiction its own secondary color), Series adds the
 * branch icon + "Series" secondary text only when the book has one. */
function GenreBadgeExample({ genre, isSeries }: GenreBadgeInput) {
  return (
    <StatusBadge
      tone={genreBadgeTone(genre)}
      middleIcon={isSeries ? <GitBranch /> : undefined}
      secondaryText={isSeries ? 'Series' : undefined}
    >
      {genreBadgeLabel(genre)}
    </StatusBadge>
  );
}

/**
 * One row per Figma example from the supplied matrix, grouped by Figma's
 * own "Mode" axis (Genre / Context / Connection / Workflow). Icon choices
 * favor exact Lucide/Fabely matches traced from each asset's own SVG;
 * "threads" (Workflow: Topic map's icon) has no Lucide equivalent —
 * substituted with `Share2` (closest available network/connection glyph),
 * noted inline.
 */
function FigmaReferenceVariants() {
  // Mocked future-Promptbar inputs — the shapes a real consumer would
  // eventually source from actual manuscript/editor state.
  const chapterScene: ChapterSceneReference = { chapter: 1, scene: 1 };
  const paragraphPreview: ParagraphPreviewInput = {
    excerpt: "She's a Lumithra, capable of wielding the old magic.",
  };
  const highlightPreview: HighlightPreviewInput = {
    highlightedText: 'capable of wielding the ancient magic without fear',
  };
  const sceneConnection: SceneConnectionInput = { sceneTitle: 'The Eldergrove' };
  const notePreview: NotePreviewInput = { noteTitle: 'Wand Selection' };
  const paragraphSelection: ParagraphSelectionReference = { paragraphNumbers: [1, 2], isPartial: true };
  const paragraphRange: ParagraphSelectionReference = { paragraphNumbers: [1, 2, 3], isPartial: false };

  const paragraphExcerpt = truncateText(paragraphPreview.excerpt);
  const highlightedText = truncateText(highlightPreview.highlightedText);
  const currentSceneName = truncateText(sceneConnection.sceneTitle);
  const noteTitle = truncateText(notePreview.noteTitle);
  return (
    <table className="border-collapse">
      <tbody>
      <ModeHeaderRow label="Genre" first />
      <VariantExample label="Non-fiction · Series">
        <GenreBadgeExample genre="non-fiction" isSeries />
      </VariantExample>
      <VariantExample label="Non-fiction · Single">
        <GenreBadgeExample genre="non-fiction" isSeries={false} />
      </VariantExample>
      <VariantExample label="Fiction · Series">
        <GenreBadgeExample genre="fiction" isSeries />
      </VariantExample>
      <VariantExample label="Fiction · Single">
        <GenreBadgeExample genre="fiction" isSeries={false} />
      </VariantExample>

      <ModeHeaderRow label="Context" />
      <VariantExample label="Paragraph manuscript">
        <StatusBadge
          size="default"
          leadingIcon={<BookOpen />}
          middleIcon="·"
          secondaryText={`“${paragraphExcerpt}”`}
          onDismiss={() => {}}
          dismissLabel={`Remove ${formatChapterScene(chapterScene, 'comma')} reference`}
        >
          {formatChapterScene(chapterScene, 'comma')}
        </StatusBadge>
      </VariantExample>
      <VariantExample label="Highlight">
        <StatusBadge
          size="default"
          leadingIcon={<Highlighter strokeWidth={1.5} />}
          middleIcon="·"
          secondaryText={`“${highlightedText}”`}
          onDismiss={() => {}}
          dismissLabel="Remove Highlight"
        >
          Highlight
        </StatusBadge>
      </VariantExample>
      <VariantExample label="Note">
        <StatusBadge
          size="default"
          leadingIcon={<ScrollText />}
          middleIcon="·"
          secondaryText={noteTitle}
          onDismiss={() => {}}
          dismissLabel="Remove Note"
        >
          Note
        </StatusBadge>
      </VariantExample>
      <VariantExample label="Plus">
        <StatusBadge size="default">+ 2</StatusBadge>
      </VariantExample>
      <VariantExample label="Context · Paragraph selection">
        <StatusBadge
          size="default"
          leadingIcon={<BookOpen />}
          onDismiss={() => {}}
          dismissLabel="Remove chapter reference"
        >
          {formatChapterScene(chapterScene, 'dot')} · {formatParagraphReference(paragraphSelection)}
        </StatusBadge>
      </VariantExample>
      <VariantExample label="Context · Paragraph range">
        <StatusBadge
          size="default"
          leadingIcon={<BookOpen />}
          middleIcon={<Separator orientation="vertical" className="h-full" />}
          secondaryText={formatParagraphReference(paragraphRange)}
          onDismiss={() => {}}
          dismissLabel="Remove chapter reference"
        >
          {formatChapterScene(chapterScene, 'dot')}
        </StatusBadge>
      </VariantExample>

      <ModeHeaderRow label="Connection" />
      <VariantExample label="Scene Desk · Connected">
        <StatusBadge
          leadingIcon={<BookOpen />}
          middleIcon={<GitBranch />}
          secondaryText={currentSceneName}
          trailing={<Status variant="glyph" />}
        >
          Scene desk
        </StatusBadge>
      </VariantExample>
      <VariantExample label="All Notes · Connected">
        <StatusBadge
          leadingIcon={<Globe />}
          middleIcon={<GitBranch />}
          secondaryText={currentSceneName}
          trailing={<Status variant="glyph" />}
        >
          All notes
        </StatusBadge>
      </VariantExample>
      <VariantExample label="All Notes · Not connected">
        <StatusBadge leadingIcon={<Globe />} middleIcon={<Link2Off />} secondaryText="Not connected to scene">
          All notes
        </StatusBadge>
      </VariantExample>

      <ModeHeaderRow label="Workflow" />
      <VariantExample label="Workflow select">
        <StatusBadge size="default" leadingIcon={<Feather className="-rotate-90" />}>
          3 workflows
        </StatusBadge>
      </VariantExample>
      <VariantExample label="Workflow · Topic map">
        <StatusBadge
          size="default"
          tone="fia"
          leadingIcon={<Share2 className="-rotate-90" />}
          onDismiss={() => {}}
          dismissLabel="Remove Workflow: Topic map"
        >
          Workflow: Topic map
        </StatusBadge>
      </VariantExample>
      <VariantExample label="Workflow · Related themes">
        <StatusBadge
          size="default"
          tone="fia"
          leadingIcon={<GitCompare />}
          onDismiss={() => {}}
          dismissLabel="Remove Workflow: Related themes"
        >
          Workflow: Related themes
        </StatusBadge>
      </VariantExample>
      <VariantExample label="Workflow · Develop scene">
        <StatusBadge
          size="default"
          tone="fia"
          leadingIcon={<Waypoints />}
          onDismiss={() => {}}
          dismissLabel="Remove Workflow: Develop scene"
        >
          Workflow: Develop scene
        </StatusBadge>
      </VariantExample>
      </tbody>
    </table>
  );
}

export const Overview: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => (
    <PrimitivePage
      title="Status Badge"
      description="Composable icon/text/status pill built on the Badge primitive. Expresses anatomical slots (leading icon, primary text, middle icon/divider, secondary text, trailing status/dismiss), not Promptbar business cases — every Figma Mode/Type/Subtype example is a configuration of this one atom. Figma Promptbar status badges (16199:2312)."
      playground={<StatusBadgePlayground />}
      variants={
        <div className="flex flex-col gap-[var(--spacing-lg)]">
          <div>
            <p className="mb-2 text-sm font-medium">Sizes</p>
            <SizesExample />
          </div>
          <div>
            <p className="mb-2 text-sm font-medium">Tones</p>
            <TonesExample />
          </div>
          <div>
            <p className="mb-2 text-sm font-medium">Icon slot combinations</p>
            <IconSlotsExample />
          </div>
          <div>
            <p className="mb-2 text-sm font-medium">Secondary content / truncation</p>
            <TruncationExample />
          </div>
          <div>
            <p className="mb-2 text-sm font-medium">Dismissible</p>
            <DismissibleExample />
          </div>
          <div>
            <p className="mb-2 text-sm font-medium">Status glyph integration</p>
            <StatusGlyphIntegrationExample />
          </div>
          <div>
            <p className="mb-2 text-sm font-medium">Figma Reference Variants</p>
            <FigmaReferenceVariants />
          </div>
        </div>
      }
      usageGuidance={
        <ul className="list-disc space-y-2 ps-5 text-sm text-muted-foreground">
          <li>
            <code>tone</code> is a narrowed alias over Badge&apos;s own{' '}
            <code>variant</code> (<code>neutral→default</code>,{' '}
            <code>secondary</code>, <code>fia</code>) — not a separate color
            system. Reach for Badge directly for variants outside this set
            (<code>destructive</code>, <code>outline</code>,{' '}
            <code>ghost</code>, <code>alert</code>, <code>success</code>).
          </li>
          <li>
            <code>trailing</code> is a generic slot (a{' '}
            <code>Status</code> in its glyph variant, another icon, or nothing) and is
            ignored whenever <code>onDismiss</code> is set — Figma never
            shows a status glyph and a dismiss control on the same badge.
          </li>
          <li>
            <code>middleIcon</code> accepts anything — a bare{' '}
            <code>&quot;·&quot;</code> string, the <code>Separator</code>{' '}
            primitive, or a real icon — matching however Figma joins primary
            and secondary text in a given case.
          </li>
        </ul>
      }
      accessibility={
        <ul className="list-disc space-y-2 ps-5 text-sm text-muted-foreground">
          <li>
            The dismiss control is a real <code>IconButton</code> with an
            explicit <code>aria-label</code> (defaults to{' '}
            <code>&quot;Remove&quot;</code>; pass <code>dismissLabel</code>{' '}
            with the item&apos;s name once several similar badges could
            coexist) — never a decorative SVG with a bare{' '}
            <code>onClick</code>.
          </li>
          <li>
            Badge itself stays non-interactive unless a consumer gives it
            interactive behavior (e.g. via <code>onDismiss</code>) — no
            built-in click/hover semantics on the badge body.
          </li>
        </ul>
      }
    />
  ),
};

export const Sizes: Story = { render: () => <SizesExample /> };
export const Tones: Story = { render: () => <TonesExample /> };
export const IconSlots: Story = { render: () => <IconSlotsExample /> };
export const Truncation: Story = { render: () => <TruncationExample /> };
export const Dismissible: Story = { render: () => <DismissibleExample /> };
export const StatusGlyphIntegration: Story = {
  render: () => <StatusGlyphIntegrationExample />,
};
export const FigmaReference: Story = { render: () => <FigmaReferenceVariants /> };
