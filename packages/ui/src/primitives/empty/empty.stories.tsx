import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  BellIcon,
  CloudIcon,
  FolderCodeIcon,
  PlusIcon,
  RefreshCcwIcon,
  SearchIcon,
} from 'lucide-react';
import { useState } from 'react';

import { InlineSegmentedControl } from '../../../stories/InlineSegmentedControl';
import { PlaygroundPanel } from '../../../stories/PlaygroundPanel';
import {
  PRIMITIVE_PLAYGROUND_CONTROL_GRID,
  PrimitiveGalleryItem,
  PrimitivePage,
} from '../../../stories/PrimitivePage';
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarImage,
} from '../avatar';
import { Button, ButtonLink } from '../button';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '../input-group';

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from './empty';

/**
 * Component Storybook IA (see docs/DESIGN.md "Component Story Structure"):
 * Overview first — Playground, Variants gallery, usage, a11y — then focused
 * example pages. Figma Empty + shadcn Empty guide.
 */

type EmptyVariant = 'default' | 'outline' | 'background' | 'outline-dashed';

const meta = {
  title: 'Design System/Primitives/Empty',
  component: Empty,
  tags: ['ai-generated'],
  parameters: { layout: 'centered' },
} satisfies Meta;

export default meta;
type Story = StoryObj;

function ProjectsDemo({
  variant = 'default',
}: {
  variant?: EmptyVariant;
}) {
  return (
    <Empty variant={variant} className="min-h-72 max-w-md">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <FolderCodeIcon />
        </EmptyMedia>
        <EmptyTitle>No Projects Yet</EmptyTitle>
        <EmptyDescription>
          You haven&apos;t created any projects yet. Get started by creating
          your first project.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <div className="flex flex-wrap items-center justify-center gap-[var(--spacing-xs)]">
          <Button>Create Project</Button>
          <Button variant="outline">Import Project</Button>
        </div>
        <ButtonLink variant="tertiary">Learn More</ButtonLink>
      </EmptyContent>
    </Empty>
  );
}

function OutlineDemo() {
  return (
    <Empty variant="outline" className="min-h-72 max-w-md">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <CloudIcon />
        </EmptyMedia>
        <EmptyTitle>Cloud Storage Empty</EmptyTitle>
        <EmptyDescription>
          Upload files to your cloud storage to access them anywhere.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button>Upload Files</Button>
      </EmptyContent>
    </Empty>
  );
}

function BackgroundDemo() {
  return (
    <Empty variant="background" className="min-h-72 max-w-md">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <BellIcon />
        </EmptyMedia>
        <EmptyTitle>No Notifications</EmptyTitle>
        <EmptyDescription>
          You&apos;re all caught up. New notifications will appear here.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button variant="outline" data-icon="inline-start">
          <RefreshCcwIcon data-icon="inline-start" />
          Refresh
        </Button>
      </EmptyContent>
    </Empty>
  );
}

function OutlineDashedDemo() {
  return (
    <Empty variant="outline-dashed" className="min-h-72 max-w-md">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <FolderCodeIcon />
        </EmptyMedia>
        <EmptyTitle>Drop zone</EmptyTitle>
        <EmptyDescription>
          Dashed outline variant from Figma Empty.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button>Browse files</Button>
      </EmptyContent>
    </Empty>
  );
}

function ImageDemo() {
  return (
    <Empty className="min-h-72 max-w-md">
      <EmptyHeader>
        <EmptyMedia variant="image">
          <img
            src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=480&h=360&fit=crop"
            alt=""
          />
        </EmptyMedia>
        <EmptyTitle>No illustrations yet</EmptyTitle>
        <EmptyDescription>
          Drop in a cover image or product shot via{' '}
          <code>EmptyMedia variant=&quot;image&quot;</code>.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button>Upload image</Button>
      </EmptyContent>
    </Empty>
  );
}

function AvatarDemo() {
  return (
    <Empty className="min-h-72 max-w-md">
      <EmptyHeader>
        <EmptyMedia>
          <Avatar size="large">
            <AvatarImage src="https://github.com/shadcn.png" alt="LR" />
            <AvatarFallback>LR</AvatarFallback>
          </Avatar>
        </EmptyMedia>
        <EmptyTitle>User Offline</EmptyTitle>
        <EmptyDescription>
          This user is currently offline. You can leave a message to notify
          them or try again later.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button>Leave Message</Button>
      </EmptyContent>
    </Empty>
  );
}

function AvatarGroupDemo() {
  return (
    <Empty className="min-h-72 max-w-md">
      <EmptyHeader>
        <EmptyMedia>
          <AvatarGroup size="large">
            <Avatar>
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarFallback>LR</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarFallback>ER</AvatarFallback>
            </Avatar>
          </AvatarGroup>
        </EmptyMedia>
        <EmptyTitle>No Team Members</EmptyTitle>
        <EmptyDescription>
          Invite your team to collaborate on this project.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button data-icon="inline-start">
          <PlusIcon data-icon="inline-start" />
          Invite Members
        </Button>
      </EmptyContent>
    </Empty>
  );
}

function InputGroupDemo() {
  return (
    <Empty className="min-h-72 max-w-md">
      <EmptyHeader>
        <EmptyTitle>404 - Not Found</EmptyTitle>
        <EmptyDescription>
          The page you&apos;re looking for doesn&apos;t exist. Try searching for
          what you need below.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <InputGroup>
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
          <InputGroupInput placeholder="Search…" />
        </InputGroup>
        <EmptyDescription>
          Need help?{' '}
          <a href="#support">Contact support</a>
        </EmptyDescription>
      </EmptyContent>
    </Empty>
  );
}

function RtlDemo() {
  return (
    <div dir="rtl">
      <Empty className="min-h-72 max-w-md">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <FolderCodeIcon />
          </EmptyMedia>
          <EmptyTitle>لا توجد مشاريع بعد</EmptyTitle>
          <EmptyDescription>
            لم تقم بإنشاء أي مشاريع بعد. ابدأ بإنشاء مشروعك الأول.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <div className="flex flex-wrap items-center justify-center gap-[var(--spacing-xs)]">
            <Button>إنشاء مشروع</Button>
            <Button variant="outline">استيراد مشروع</Button>
          </div>
          <ButtonLink variant="tertiary">تعرف على المزيد</ButtonLink>
        </EmptyContent>
      </Empty>
    </div>
  );
}

function EmptyPlayground() {
  const [variant, setVariant] = useState<EmptyVariant>('default');
  const [media, setMedia] = useState<'icon' | 'image' | 'avatar' | 'none'>(
    'icon',
  );

  return (
    <PlaygroundPanel
      preview={
        <Empty variant={variant} className="min-h-72 max-w-md">
          <EmptyHeader>
            {media === 'icon' ? (
              <EmptyMedia variant="icon">
                <FolderCodeIcon />
              </EmptyMedia>
            ) : null}
            {media === 'image' ? (
              <EmptyMedia variant="image">
                <img
                  src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=480&h=360&fit=crop"
                  alt=""
                />
              </EmptyMedia>
            ) : null}
            {media === 'avatar' ? (
              <EmptyMedia>
                <Avatar size="large">
                  <AvatarFallback>FB</AvatarFallback>
                </Avatar>
              </EmptyMedia>
            ) : null}
            <EmptyTitle>No Projects Yet</EmptyTitle>
            <EmptyDescription>
              You haven&apos;t created any projects yet. Get started by creating
              your first project.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <div className="flex flex-wrap items-center justify-center gap-[var(--spacing-xs)]">
              <Button>Create Project</Button>
              <Button variant="outline">Import Project</Button>
            </div>
            <ButtonLink variant="tertiary">Learn More</ButtonLink>
          </EmptyContent>
        </Empty>
      }
      controls={
        <div className={PRIMITIVE_PLAYGROUND_CONTROL_GRID}>
          <InlineSegmentedControl
            label="Variant"
            value={variant}
            onChange={(v) => setVariant(v as EmptyVariant)}
            options={[
              { value: 'default', label: 'Default' },
              { value: 'outline', label: 'Outline' },
              { value: 'background', label: 'Background' },
              { value: 'outline-dashed', label: 'Dashed' },
            ]}
          />
          <InlineSegmentedControl
            label="Media"
            value={media}
            onChange={(v) =>
              setMedia(v as 'icon' | 'image' | 'avatar' | 'none')
            }
            options={[
              { value: 'icon', label: 'Icon' },
              { value: 'image', label: 'Image' },
              { value: 'avatar', label: 'Avatar' },
              { value: 'none', label: 'None' },
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
      title="Empty"
      description="Empty-state layout — Foundations chrome from Figma Empty (Default / Outline / Background / Outline dashed); shadcn composition API."
      playground={<EmptyPlayground />}
      variants={
        <div className="flex flex-wrap gap-[var(--spacing-md)]">
          <PrimitiveGalleryItem label="Demo">
            <ProjectsDemo />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Outline">
            <OutlineDemo />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Background">
            <BackgroundDemo />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Outline dashed">
            <OutlineDashedDemo />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Image">
            <ImageDemo />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Avatar">
            <AvatarDemo />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Avatar group">
            <AvatarGroupDemo />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Input group">
            <InputGroupDemo />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="RTL">
            <RtlDemo />
          </PrimitiveGalleryItem>
        </div>
      }
      usageGuidance={
        <ul className="list-disc space-y-2 ps-5 text-sm text-muted-foreground">
          <li>
            Compose <code>EmptyHeader</code> (media + title + description) and{' '}
            <code>EmptyContent</code> (actions, inputs, links).
          </li>
          <li>
            Surface chrome via <code>variant</code>: <code>default</code>,{' '}
            <code>outline</code>, <code>background</code>,{' '}
            <code>outline-dashed</code> (Figma Empty).
          </li>
          <li>
            Use <code>EmptyMedia variant=&quot;icon&quot;</code> for a muted
            icon well, <code>image</code> for a cover illustration, or default
            media for Avatar / AvatarGroup.
          </li>
          <li>
            Prefer Fabely <code>Button</code> / <code>ButtonLink</code> in{' '}
            <code>EmptyContent</code>.
          </li>
        </ul>
      }
      accessibility={
        <ul className="list-disc space-y-2 ps-5 text-sm text-muted-foreground">
          <li>
            Title and description are visible text — keep them meaningful;
            decorative icons should be presentational.
          </li>
          <li>
            Actions in <code>EmptyContent</code> must be real controls (
            buttons / links), not static text.
          </li>
        </ul>
      }
    />
  ),
};

export const Demo: Story = {
  render: () => <ProjectsDemo />,
};

export const Outline: Story = {
  render: () => <OutlineDemo />,
};

export const Background: Story = {
  render: () => <BackgroundDemo />,
};

export const OutlineDashed: Story = {
  name: 'Outline Dashed',
  render: () => <OutlineDashedDemo />,
};

export const Image: Story = {
  render: () => <ImageDemo />,
};

export const AvatarStory: Story = {
  name: 'Avatar',
  render: () => <AvatarDemo />,
};

export const AvatarGroupStory: Story = {
  name: 'Avatar Group',
  render: () => <AvatarGroupDemo />,
};

export const InputGroupStory: Story = {
  name: 'Input Group',
  render: () => <InputGroupDemo />,
};

export const RTL: Story = {
  render: () => <RtlDemo />,
};
