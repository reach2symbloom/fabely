import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState, type ComponentType } from 'react';
import {
  CheckIcon,
  ClockIcon,
  CopyIcon,
  FileCodeIcon,
  FileSearchIcon,
  FileTextIcon,
  FileWarningIcon,
  RefreshCwIcon,
  TableIcon,
  XIcon,
} from 'lucide-react';
import {
  Attachment,
  AttachmentRightIcon,
  AttachmentRightIcons,
  AttachmentContent,
  AttachmentDescription,
  AttachmentGroup,
  AttachmentMedia,
  AttachmentTitle,
  AttachmentTrigger,
} from './attachment';
import { Spinner } from '../spinner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../dialog';
import { InlineSegmentedControl } from '../../../stories/InlineSegmentedControl';
import { PlaygroundPanel } from '../../../stories/PlaygroundPanel';
import {
  PRIMITIVE_PLAYGROUND_CONTROL_GRID,
  PrimitiveGalleryItem,
  PrimitivePage,
} from '../../../stories/PrimitivePage';

/**
 * Component Storybook IA (see docs/DESIGN.md "Component Story Structure"):
 * Overview first — Playground, Variants gallery, usage, a11y — then focused
 * example pages. No Figma source; patterns follow shadcn Attachment docs.
 */

const meta = {
  title: 'Design System/Primitives/Attachment',
  component: Attachment,
  tags: ['ai-generated'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Attachment>;

export default meta;
type Story = StoryObj<typeof meta>;

type AttachmentState = 'idle' | 'uploading' | 'processing' | 'error' | 'done';
type AttachmentSize = 'default' | 'sm' | 'xs';
type AttachmentOrientation = 'horizontal' | 'vertical';
type MediaVariant = 'icon' | 'image';

const IMAGE = {
  name: 'workspace.png',
  meta: 'PNG · 820 KB',
  src: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=900&auto=format&fit=crop&q=80',
  alt: 'Workspace',
};

/* ---------- Canonical examples ---------- */

function BasicExample() {
  return (
    <Attachment>
      <AttachmentMedia>
        <FileTextIcon />
      </AttachmentMedia>
      <AttachmentContent>
        <AttachmentTitle>sales-dashboard.pdf</AttachmentTitle>
        <AttachmentDescription>PDF · 2.4 MB</AttachmentDescription>
      </AttachmentContent>
      <AttachmentRightIcons>
        <AttachmentRightIcon aria-label="Remove sales-dashboard.pdf">
          <XIcon />
        </AttachmentRightIcon>
      </AttachmentRightIcons>
    </Attachment>
  );
}

function ImageExample() {
  const images = [
    IMAGE,
    {
      name: 'desk-reference.jpg',
      meta: 'JPG · 1.1 MB',
      src: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=900&auto=format&fit=crop&q=80',
      alt: 'Desk',
    },
    {
      name: 'office-reference.jpg',
      meta: 'JPG · 940 KB',
      src: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=900&auto=format&fit=crop&q=80',
      alt: 'Office',
    },
  ];

  return (
    <AttachmentGroup className="max-w-sm">
      {images.map((image) => (
        <Attachment key={image.name} orientation="vertical">
          <AttachmentMedia variant="image">
            <img src={image.src} alt={image.alt} />
          </AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>{image.name}</AttachmentTitle>
            <AttachmentDescription>{image.meta}</AttachmentDescription>
          </AttachmentContent>
          <AttachmentRightIcons>
            <AttachmentRightIcon aria-label={`Remove ${image.name}`}>
              <XIcon />
            </AttachmentRightIcon>
          </AttachmentRightIcons>
          <AttachmentTrigger
            render={
              <a
                href={image.src}
                target="_blank"
                rel="noreferrer"
                aria-label={`Open ${image.name}`}
              />
            }
          />
        </Attachment>
      ))}
    </AttachmentGroup>
  );
}

function StatesExample() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-2">
      <Attachment state="idle" className="w-full">
        <AttachmentMedia>
          <ClockIcon />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>selected-file.pdf</AttachmentTitle>
          <AttachmentDescription>Ready to upload</AttachmentDescription>
        </AttachmentContent>
        <AttachmentRightIcons>
          <AttachmentRightIcon aria-label="Remove selected-file.pdf">
            <XIcon />
          </AttachmentRightIcon>
        </AttachmentRightIcons>
      </Attachment>
      <Attachment state="uploading" className="w-full">
        <AttachmentMedia>
          <Spinner />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>design-system.zip</AttachmentTitle>
          <AttachmentDescription>Uploading · 64%</AttachmentDescription>
        </AttachmentContent>
        <AttachmentRightIcons>
          <AttachmentRightIcon aria-label="Cancel upload">
            <XIcon />
          </AttachmentRightIcon>
        </AttachmentRightIcons>
      </Attachment>
      <Attachment state="processing" className="w-full">
        <AttachmentMedia>
          <FileTextIcon />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>market-research.pdf</AttachmentTitle>
          <AttachmentDescription>Processing document</AttachmentDescription>
        </AttachmentContent>
        <AttachmentRightIcons>
          <AttachmentRightIcon aria-label="Remove market-research.pdf">
            <XIcon />
          </AttachmentRightIcon>
        </AttachmentRightIcons>
      </Attachment>
      <Attachment state="error" className="w-full">
        <AttachmentMedia>
          <FileWarningIcon />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>financial-model.xlsx</AttachmentTitle>
          <AttachmentDescription>Upload failed. Try again.</AttachmentDescription>
        </AttachmentContent>
        <AttachmentRightIcons>
          <AttachmentRightIcon aria-label="Retry upload">
            <RefreshCwIcon />
          </AttachmentRightIcon>
          <AttachmentRightIcon aria-label="Remove financial-model.xlsx">
            <XIcon />
          </AttachmentRightIcon>
        </AttachmentRightIcons>
      </Attachment>
      <Attachment state="done" className="w-full">
        <AttachmentMedia>
          <CheckIcon />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>uploaded-report.pdf</AttachmentTitle>
          <AttachmentDescription>Uploaded · 1.8 MB</AttachmentDescription>
        </AttachmentContent>
        <AttachmentRightIcons>
          <AttachmentRightIcon aria-label="Remove uploaded-report.pdf">
            <XIcon />
          </AttachmentRightIcon>
        </AttachmentRightIcons>
      </Attachment>
    </div>
  );
}

function SizesExample() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      <Attachment size="default" className="w-full">
        <AttachmentMedia>
          <FileTextIcon />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>Default attachment</AttachmentTitle>
          <AttachmentDescription>PDF · 2.4 MB</AttachmentDescription>
        </AttachmentContent>
      </Attachment>
      <Attachment size="sm" className="w-full">
        <AttachmentMedia>
          <FileTextIcon />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>Small attachment</AttachmentTitle>
          <AttachmentDescription>PDF · 2.4 MB</AttachmentDescription>
        </AttachmentContent>
      </Attachment>
      <Attachment size="xs" className="w-full">
        <AttachmentMedia>
          <FileTextIcon />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>Extra small attachment</AttachmentTitle>
        </AttachmentContent>
      </Attachment>
    </div>
  );
}

function GroupExample() {
  const items: {
    name: string;
    meta: string;
    icon?: ComponentType;
    src?: string;
  }[] = [
    { name: 'briefing-notes.pdf', meta: 'PDF · 1.4 MB', icon: FileTextIcon },
    {
      name: 'workspace.png',
      meta: 'PNG · 820 KB',
      src: IMAGE.src,
    },
    { name: 'customers.csv', meta: 'CSV · 18 KB', icon: TableIcon },
    { name: 'renderer.tsx', meta: 'TSX · 12 KB', icon: FileCodeIcon },
  ];

  return (
    <AttachmentGroup className="max-w-sm">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <Attachment key={item.name} className="w-64">
            {item.src ? (
              <AttachmentMedia variant="image">
                <img src={item.src} alt={item.name} />
              </AttachmentMedia>
            ) : Icon ? (
              <AttachmentMedia>
                <Icon />
              </AttachmentMedia>
            ) : null}
            <AttachmentContent>
              <AttachmentTitle>{item.name}</AttachmentTitle>
              <AttachmentDescription>{item.meta}</AttachmentDescription>
            </AttachmentContent>
            <AttachmentRightIcons>
              <AttachmentRightIcon aria-label={`Remove ${item.name}`}>
                <XIcon />
              </AttachmentRightIcon>
            </AttachmentRightIcons>
          </Attachment>
        );
      })}
    </AttachmentGroup>
  );
}

function TriggerExample() {
  return (
    <Dialog>
      <Attachment className="w-full max-w-sm">
        <AttachmentMedia>
          <FileSearchIcon />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>research-summary.pdf</AttachmentTitle>
          <AttachmentDescription>Open preview dialog</AttachmentDescription>
        </AttachmentContent>
        <AttachmentRightIcons>
          <AttachmentRightIcon aria-label="Copy link">
            <CopyIcon />
          </AttachmentRightIcon>
          <AttachmentRightIcon aria-label="Remove research-summary.pdf">
            <XIcon />
          </AttachmentRightIcon>
        </AttachmentRightIcons>
        <DialogTrigger
          render={
            <AttachmentTrigger aria-label="Preview research-summary.pdf" />
          }
        />
      </Attachment>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>research-summary.pdf</DialogTitle>
          <DialogDescription>
            The attachment trigger fills the card and opens the dialog, while
            the actions stay independently clickable above it.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

/* ---------- Playground ---------- */

function AttachmentPlayground() {
  const [state, setState] = useState<AttachmentState>('done');
  const [size, setSize] = useState<AttachmentSize>('default');
  const [orientation, setOrientation] =
    useState<AttachmentOrientation>('horizontal');
  const [media, setMedia] = useState<MediaVariant>('icon');
  const [showRightIcon, setShowRightIcon] = useState(true);

  const title =
    state === 'error'
      ? 'financial-model.xlsx'
      : media === 'image'
        ? IMAGE.name
        : 'sales-dashboard.pdf';
  const description =
    state === 'idle'
      ? 'Ready to upload'
      : state === 'uploading'
        ? 'Uploading · 64%'
        : state === 'processing'
          ? 'Processing document'
          : state === 'error'
            ? 'Upload failed. Try again.'
            : media === 'image'
              ? IMAGE.meta
              : 'PDF · 2.4 MB';

  return (
    <PlaygroundPanel
      preview={
        <Attachment
          state={state}
          size={size}
          orientation={orientation}
          className={orientation === 'horizontal' ? 'max-w-sm' : undefined}
        >
          <AttachmentMedia variant={media}>
            {media === 'image' ? (
              <img src={IMAGE.src} alt={IMAGE.alt} />
            ) : state === 'uploading' ? (
              <Spinner />
            ) : state === 'error' ? (
              <FileWarningIcon />
            ) : (
              <FileTextIcon />
            )}
          </AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>{title}</AttachmentTitle>
            {size !== 'xs' ? (
              <AttachmentDescription>{description}</AttachmentDescription>
            ) : null}
          </AttachmentContent>
          {showRightIcon ? (
            <AttachmentRightIcons>
              <AttachmentRightIcon aria-label={`Remove ${title}`}>
                <XIcon />
              </AttachmentRightIcon>
            </AttachmentRightIcons>
          ) : null}
        </Attachment>
      }
      controls={
        <div className={PRIMITIVE_PLAYGROUND_CONTROL_GRID}>
          <div className="col-span-2">
            <InlineSegmentedControl
              label="State"
              value={state}
              options={[
                { value: 'idle', label: 'Idle' },
                { value: 'uploading', label: 'Uploading' },
                { value: 'processing', label: 'Processing' },
                { value: 'error', label: 'Error' },
                { value: 'done', label: 'Done' },
              ]}
              onChange={setState}
              fullWidth
            />
          </div>

          <InlineSegmentedControl
            label="Size"
            value={size}
            options={[
              { value: 'default', label: 'Default' },
              { value: 'sm', label: 'SM' },
              { value: 'xs', label: 'XS' },
            ]}
            onChange={setSize}
            fullWidth
          />

          <InlineSegmentedControl
            label="Orientation"
            value={orientation}
            options={[
              { value: 'horizontal', label: 'Horizontal' },
              { value: 'vertical', label: 'Vertical' },
            ]}
            onChange={setOrientation}
            fullWidth
          />

          <InlineSegmentedControl
            label="Media"
            value={media}
            options={[
              { value: 'icon', label: 'Icon' },
              { value: 'image', label: 'Image' },
            ]}
            onChange={setMedia}
            fullWidth
          />

          <InlineSegmentedControl
            label="Right icon"
            value={showRightIcon ? 'on' : 'off'}
            options={[
              { value: 'off', label: 'Off' },
              { value: 'on', label: 'On' },
            ]}
            onChange={(v) => setShowRightIcon(v === 'on')}
            fullWidth
          />
        </div>
      }
    />
  );
}

/* ---------- Overview ---------- */

export const Overview: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => (
    <PrimitivePage
      title="Attachment"
      description={
        <>
          File / image attachment with media, metadata, upload state, and
          actions. No Figma source — shadcn docs are the API ground truth.
          Foundations substitutions for color, radius, focus ring, and icon
          size; spacing and type stay on vendor defaults (see README).
        </>
      }
      playground={<AttachmentPlayground />}
      variants={
        <div className="flex flex-wrap gap-4">
          <PrimitiveGalleryItem label="Basic">
            <BasicExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Image">
            <ImageExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="States">
            <StatesExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Sizes">
            <SizesExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Group">
            <GroupExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Trigger">
            <TriggerExample />
          </PrimitiveGalleryItem>
        </div>
      }
      usageGuidance={
        <ul className="list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
          <li>
            Compose Media + Content (Title / Description) + optional RightIcons /
            Trigger. Use <code>AttachmentGroup</code> for a snapping row.
          </li>
          <li>
            <code>state</code> drives shimmer (<code>uploading</code> /{' '}
            <code>processing</code>) and destructive treatment (
            <code>error</code>). Keep failure copy in Description — not color
            alone.
          </li>
          <li>
            <code>AttachmentRightIcon</code> uses our Button (<code>ghost</code> /{' '}
            <code>mini</code> by default — Fabely stand-in for shadcn{' '}
            <code>icon-xs</code>). Always pass <code>aria-label</code> on
            icon-only actions.
          </li>
          <li>
            <code>AttachmentTrigger</code> fills the card behind actions; label
            it with <code>aria-label</code> (or use <code>render</code> for a
            link).
          </li>
        </ul>
      }
      accessibility={
        <ul className="list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
          <li>
            Icon-only <code>AttachmentRightIcon</code>s need{' '}
            <code>aria-label</code> naming the action and target file.
          </li>
          <li>
            Label <code>AttachmentTrigger</code> for what activation does; it
            sits under actions in stacking order so both stay operable.
          </li>
          <li>
            For a presentational <code>AttachmentGroup</code>, add{' '}
            <code>tabIndex=&#123;0&#125;</code>, <code>role=&quot;group&quot;</code>, and
            an <code>aria-label</code> so keyboard users can scroll the row.
          </li>
          <li>
            Error state uses destructive color — always pair with descriptive
            text in <code>AttachmentDescription</code>.
          </li>
        </ul>
      }
    />
  ),
};

/* ---------- Individual example pages ---------- */

export const Basic: Story = {
  render: () => <BasicExample />,
};

export const Image: Story = {
  render: () => <ImageExample />,
};

export const States: Story = {
  render: () => <StatesExample />,
};

export const Sizes: Story = {
  render: () => <SizesExample />,
};

export const Group: Story = {
  render: () => <GroupExample />,
};

export const Trigger: Story = {
  render: () => <TriggerExample />,
};
