import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import { InlineSegmentedControl } from '../../../stories/InlineSegmentedControl';
import { PlaygroundPanel } from '../../../stories/PlaygroundPanel';
import {
  PRIMITIVE_PLAYGROUND_CONTROL_GRID,
  PrimitiveGalleryItem,
  PrimitivePage,
} from '../../../stories/PrimitivePage';
import { Button } from '../button';

import { Toaster, toast } from './toast';
import type { ToasterPosition } from './toast';

/**
 * Component Storybook IA (see docs/DESIGN.md "Component Story Structure"):
 * Overview first — Playground, Variants gallery, usage, a11y — then focused
 * example pages aligned with shadcn Base Toast docs.
 */

type ToastType = 'default' | 'success' | 'info' | 'warning' | 'error' | 'loading';

const meta = {
  title: 'Design System/Primitives/Toast',
  component: Toaster,
  tags: ['ai-generated'],
  parameters: { layout: 'centered' },
  decorators: [
    (Story, { parameters }) =>
      parameters.disableToaster ? (
        <Story />
      ) : (
        <Toaster>
          <Story />
        </Toaster>
      ),
  ],
} satisfies Meta;

export default meta;
type Story = StoryObj;

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function ToastPlayground({
  position,
  onPositionChange,
}: {
  position: ToasterPosition;
  onPositionChange: (position: ToasterPosition) => void;
}) {
  const [type, setType] = useState<ToastType>('default');
  const [withDescription, setWithDescription] = useState(true);
  const [withAction, setWithAction] = useState(false);

  function showToast() {
    const id = toast.add({
      title: type === 'default' ? 'Event created' : `${capitalize(type)} toast`,
      description: withDescription
        ? 'Sunday, December 3 at 9:00 AM'
        : undefined,
      type: type === 'default' ? undefined : type,
      actionProps: withAction
        ? {
            children: 'Undo',
            onClick() {
              toast.close(id);
            },
          }
        : undefined,
    });
  }

  return (
    <PlaygroundPanel
      preview={
        <div className="flex min-h-40 items-center justify-center">
          <Button variant="secondary" onClick={showToast}>
            Show toast
          </Button>
        </div>
      }
      controls={
        <div className={PRIMITIVE_PLAYGROUND_CONTROL_GRID}>
          <div className="col-span-2">
            <InlineSegmentedControl
              label="Position"
              value={position}
              onChange={(v) => onPositionChange(v as ToasterPosition)}
              options={[
                { value: 'bottom-right', label: 'Bottom right' },
                { value: 'bottom-center', label: 'Bottom center' },
                { value: 'bottom-left', label: 'Bottom left' },
              ]}
            />
          </div>
          <div className="col-span-2">
            <InlineSegmentedControl
              label="Type"
              value={type}
              onChange={(v) => setType(v as ToastType)}
              options={[
                { value: 'default', label: 'Default' },
                { value: 'success', label: 'Success' },
                { value: 'info', label: 'Info' },
                { value: 'warning', label: 'Warning' },
                { value: 'error', label: 'Error' },
                { value: 'loading', label: 'Loading' },
              ]}
            />
          </div>
          <InlineSegmentedControl
            label="Description"
            value={withDescription ? 'on' : 'off'}
            onChange={(v) => setWithDescription(v === 'on')}
            options={[
              { value: 'on', label: 'On' },
              { value: 'off', label: 'Off' },
            ]}
          />
          <InlineSegmentedControl
            label="Action"
            value={withAction ? 'on' : 'off'}
            onChange={(v) => setWithAction(v === 'on')}
            options={[
              { value: 'on', label: 'On' },
              { value: 'off', label: 'Off' },
            ]}
          />
        </div>
      }
    />
  );
}

function DefaultExample() {
  return (
    <Button
      variant="secondary"
      onClick={() =>
        toast.add({
          title: 'Event created',
          description: 'Sunday, December 3 at 9:00 AM',
        })
      }
    >
      Show toast
    </Button>
  );
}

function TypesExample() {
  const types: Exclude<ToastType, 'default'>[] = [
    'success',
    'info',
    'warning',
    'error',
    'loading',
  ];

  return (
    <div className="flex flex-wrap items-center justify-center gap-[var(--spacing-sm)]">
      <Button
        variant="secondary"
        onClick={() =>
          toast.add({
            title: 'Event created',
            description: 'Sunday, December 3 at 9:00 AM',
          })
        }
      >
        Default
      </Button>
      {types.map((type) => (
        <Button
          key={type}
          variant="secondary"
          onClick={() =>
            toast.add({
              title: `${capitalize(type)}`,
              description: 'Toast with a status icon.',
              type,
            })
          }
        >
          {capitalize(type)}
        </Button>
      ))}
    </div>
  );
}

function ActionExample() {
  function showToast() {
    const id = toast.add({
      title: 'Event created',
      description: 'You can undo this action.',
      actionProps: {
        children: 'Undo',
        onClick() {
          toast.close(id);
          toast.add({
            description: 'Event creation undone.',
          });
        },
      },
    });
  }

  return (
    <Button variant="secondary" onClick={showToast}>
      Show toast
    </Button>
  );
}

function AsyncPromiseExample() {
  function showToast() {
    toast.promise(
      new Promise<{ name: string }>((resolve) => {
        window.setTimeout(() => resolve({ name: 'Event' }), 2000);
      }),
      {
        loading: 'Creating event…',
        success: (data) => `${data.name} created.`,
        error: 'Could not create event.',
      },
    );
  }

  return (
    <Button variant="secondary" onClick={showToast}>
      Create event
    </Button>
  );
}

function ToastOverview() {
  const [position, setPosition] =
    useState<ToasterPosition>('bottom-right');

  return (
    <Toaster position={position}>
      <PrimitivePage
        title="Toast"
        description="Succinct temporary feedback via Base UI Toast. Foundations popover surface — no dedicated Figma Toast set."
        playground={
          <ToastPlayground
            position={position}
            onPositionChange={setPosition}
          />
        }
        variants={
          <div className="flex flex-wrap gap-[var(--spacing-md)]">
            <PrimitiveGalleryItem label="Default">
              <DefaultExample />
            </PrimitiveGalleryItem>
            <PrimitiveGalleryItem label="Types">
              <TypesExample />
            </PrimitiveGalleryItem>
            <PrimitiveGalleryItem label="Action">
              <ActionExample />
            </PrimitiveGalleryItem>
            <PrimitiveGalleryItem label="Promise">
              <AsyncPromiseExample />
            </PrimitiveGalleryItem>
          </div>
        }
        usageGuidance={
          <ul className="list-disc space-y-2 ps-5 text-sm text-muted-foreground">
            <li>
              Mount <code>Toaster</code> once near the app root, then call{' '}
              <code>toast.add</code> / <code>toast.promise</code> from
              anywhere.
            </li>
            <li>
              Default <code>position</code> is <code>bottom-right</code>. Also{' '}
              <code>bottom-center</code> and <code>bottom-left</code>.
            </li>
            <li>
              Set <code>type</code> to <code>success</code>, <code>info</code>,{' '}
              <code>warning</code>, <code>error</code>, or{' '}
              <code>loading</code> for a status icon.
            </li>
            <li>
              Pass <code>actionProps</code> for an undo-style button; use the
              returned id with <code>toast.close</code>.
            </li>
          </ul>
        }
        accessibility={
          <ul className="list-disc space-y-2 ps-5 text-sm text-muted-foreground">
            <li>
              Toasts are transient — do not rely on them as the only channel
              for critical errors or required next steps.
            </li>
            <li>
              Close control is labeled <code>Close toast</code>. Status icons
              are decorative (<code>aria-hidden</code>); put meaning in the
              title / description.
            </li>
            <li>
              Stacking, swipe dismissal, and focus behavior come from Base UI
              Toast — see the{' '}
              <a href="https://base-ui.com/react/components/toast">
                Base UI docs
              </a>
              .
            </li>
          </ul>
        }
      />
    </Toaster>
  );
}

export const Overview: Story = {
  parameters: { layout: 'fullscreen', disableToaster: true },
  render: () => <ToastOverview />,
};

export const Default: Story = {
  render: () => <DefaultExample />,
};

export const Types: Story = {
  render: () => <TypesExample />,
};

export const Action: Story = {
  render: () => <ActionExample />,
};

export const AsyncPromise: Story = {
  name: 'Promise',
  render: () => <AsyncPromiseExample />,
};
