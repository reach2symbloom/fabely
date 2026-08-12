import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  ChevronDownIcon,
  FrameIcon,
  LifeBuoyIcon,
  MapIcon,
  PanelLeftCloseIcon,
  PanelLeftOpenIcon,
  PieChartIcon,
  PlusIcon,
  User2Icon,
} from 'lucide-react';
import { useState } from 'react';

import { Button } from '../button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '../collapsible';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../dropdown-menu';
import { InlineSegmentedControl } from '../../../stories/InlineSegmentedControl';
import { PlaygroundPanel } from '../../../stories/PlaygroundPanel';
import {
  PRIMITIVE_PLAYGROUND_CONTROL_GRID,
  PrimitiveGalleryItem,
  PrimitivePage,
} from '../../../stories/PrimitivePage';

import { SIDEBAR_STORY_FRAME, SidebarDemo } from './sidebar-demo';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from './sidebar';

/**
 * Component Storybook IA (see docs/DESIGN.md "Component Story Structure"):
 * Overview first — Playground + shadcn Sidebar docs (Demo collapses to icons,
 * Header / Footer / Group / Menu / Controlled / RTL).
 *
 * Docs: https://ui.shadcn.com/docs/components/base/sidebar
 * Figma: https://www.figma.com/design/gV94L0qCmvwQkddNbEktry?node-id=842-51929
 */

const meta = {
  title: 'Design System/Primitives/Sidebar',
  component: Sidebar,
  tags: ['ai-generated'],
  parameters: { layout: 'fullscreen' },
} satisfies Meta;

export default meta;
type Story = StoryObj;

const projects = [
  { name: 'Design Engineering', url: '#', icon: FrameIcon },
  { name: 'Sales & Marketing', url: '#', icon: PieChartIcon },
  { name: 'Travel', url: '#', icon: MapIcon },
] as const;

function InsetToggle({ label }: { label: string }) {
  const { open, toggleSidebar } = useSidebar();
  return (
    <div className="flex flex-wrap items-center gap-[var(--spacing-xs)] border-b border-border p-[var(--spacing-md)]">
      <SidebarTrigger />
      <Button variant="outline" size="small" onClick={toggleSidebar}>
        {open ? <PanelLeftCloseIcon /> : <PanelLeftOpenIcon />}
        <span>{open ? 'Close' : 'Open'} sidebar</span>
      </Button>
      <span className="text-[length:var(--text-paragraph-small-regular-font-size)] text-muted-foreground">
        {label}
      </span>
    </div>
  );
}

/** shadcn SidebarHeader */
function HeaderExample() {
  return (
    <SidebarProvider className={SIDEBAR_STORY_FRAME}>
      <Sidebar>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <SidebarMenuButton className="data-open:bg-sidebar-accent data-open:text-sidebar-accent-foreground" />
                  }
                >
                  Select Workspace
                  <ChevronDownIcon className="ms-auto" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-(--anchor-width)">
                  <DropdownMenuItem>
                    <span>Acme Inc</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <span>Acme Corp.</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Application</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {projects.map((project) => (
                  <SidebarMenuItem key={project.name}>
                    <SidebarMenuButton>
                      <project.icon />
                      <span>{project.name}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <InsetToggle label="Header" />
      </SidebarInset>
    </SidebarProvider>
  );
}

/** shadcn SidebarFooter */
function FooterExample() {
  return (
    <SidebarProvider className={SIDEBAR_STORY_FRAME}>
      <Sidebar>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Application</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {projects.map((project) => (
                  <SidebarMenuItem key={project.name}>
                    <SidebarMenuButton>
                      <project.icon />
                      <span>{project.name}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <User2Icon />
                Username
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <InsetToggle label="Footer" />
      </SidebarInset>
    </SidebarProvider>
  );
}

/** shadcn SidebarGroup (+ action + collapsible) */
function GroupExample() {
  return (
    <SidebarProvider className={SIDEBAR_STORY_FRAME}>
      <Sidebar>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Application</SidebarGroupLabel>
            <SidebarGroupAction>
              <PlusIcon />
              <span className="sr-only">Add Project</span>
            </SidebarGroupAction>
            <SidebarGroupContent>
              <SidebarMenu>
                {projects.map((project) => (
                  <SidebarMenuItem key={project.name}>
                    <SidebarMenuButton>
                      <project.icon />
                      <span>{project.name}</span>
                    </SidebarMenuButton>
                    <SidebarMenuBadge>24</SidebarMenuBadge>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <Collapsible defaultOpen className="group/collapsible">
            <SidebarGroup>
              <SidebarGroupLabel render={<CollapsibleTrigger />}>
                Help
                <ChevronDownIcon className="ms-auto transition-transform group-data-panel-open/button:rotate-180" />
              </SidebarGroupLabel>
              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton>
                        <LifeBuoyIcon />
                        <span>Support</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </SidebarGroup>
          </Collapsible>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <InsetToggle label="Group" />
      </SidebarInset>
    </SidebarProvider>
  );
}

/** shadcn SidebarMenu */
function MenuExample() {
  return (
    <SidebarProvider className={SIDEBAR_STORY_FRAME}>
      <Sidebar>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Projects</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {projects.map((project) => (
                  <SidebarMenuItem key={project.name}>
                    <SidebarMenuButton
                      render={<a href={project.url} />}
                      isActive={project.name === 'Travel'}
                    >
                      <project.icon />
                      <span>{project.name}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <InsetToggle label="Menu" />
      </SidebarInset>
    </SidebarProvider>
  );
}

function ControlledToggle() {
  const { open, toggleSidebar } = useSidebar();
  return (
    <Button variant="outline" onClick={toggleSidebar}>
      {open ? <PanelLeftCloseIcon /> : <PanelLeftOpenIcon />}
      <span>{open ? 'Close' : 'Open'} Sidebar</span>
    </Button>
  );
}

/** shadcn Controlled Sidebar */
function ControlledExample() {
  const [open, setOpen] = useState(true);
  return (
    <SidebarProvider
      open={open}
      onOpenChange={setOpen}
      className={SIDEBAR_STORY_FRAME}
    >
      <Sidebar>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Projects</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {projects.map((project) => (
                  <SidebarMenuItem key={project.name}>
                    <SidebarMenuButton>
                      <project.icon />
                      <span>{project.name}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <div className="flex items-center gap-[var(--spacing-xs)] border-b border-border p-[var(--spacing-md)]">
          <ControlledToggle />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

function SidebarPlayground() {
  const [side, setSide] = useState<'left' | 'right'>('left');
  const [collapsible, setCollapsible] = useState<'offcanvas' | 'icon' | 'none'>(
    'icon',
  );

  return (
    <PlaygroundPanel
      preview={
        <SidebarDemo side={side} collapsible={collapsible} />
      }
      controls={
        <div className={PRIMITIVE_PLAYGROUND_CONTROL_GRID}>
          <InlineSegmentedControl
            label="Side"
            value={side}
            options={[
              { value: 'left', label: 'Left' },
              { value: 'right', label: 'Right' },
            ]}
            onChange={(v) => setSide(v as 'left' | 'right')}
            fullWidth
          />
          <InlineSegmentedControl
            label="Collapsible"
            value={collapsible}
            options={[
              { value: 'offcanvas', label: 'Offcanvas' },
              { value: 'icon', label: 'Icon' },
              { value: 'none', label: 'None' },
            ]}
            onChange={(v) =>
              setCollapsible(v as 'offcanvas' | 'icon' | 'none')
            }
            fullWidth
          />
        </div>
      }
    />
  );
}

export const Overview: Story = {
  render: () => (
    <PrimitivePage
      title="Sidebar"
      description="A composable, themeable sidebar — Foundations chrome from Figma Sidebar; shadcn Sidebar provider API. Demo collapses to icons."
      playground={<SidebarPlayground />}
      variants={
        <div className="flex flex-col gap-[var(--spacing-md)]">
          <PrimitiveGalleryItem label="Demo">
            <SidebarDemo />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Menu">
            <MenuExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Controlled">
            <ControlledExample />
          </PrimitiveGalleryItem>
        </div>
      }
      usageGuidance={
        <ul className="list-disc space-y-2 ps-5 text-sm text-muted-foreground">
          <li>
            Always wrap with <code>SidebarProvider</code>; compose Header /
            Content / Footer with Groups and Menu.
          </li>
          <li>
            <code>collapsible=&quot;icon&quot;</code> matches the docs demo
            (rail of icons); use <code>offcanvas</code> to slide fully away.
          </li>
          <li>
            Toggle via <code>SidebarTrigger</code>, <code>SidebarRail</code>,
            or <kbd>⌘/Ctrl+B</kbd>.
          </li>
        </ul>
      }
      accessibility={
        <ul className="list-disc space-y-2 ps-5 text-sm text-muted-foreground">
          <li>
            <code>SidebarTrigger</code> is an Icon Button with a toggle label;
            icon flips in RTL.
          </li>
          <li>
            Prefer real labels on menu buttons; collapsed icon mode relies on
            tooltips.
          </li>
        </ul>
      }
    />
  ),
};

/** https://ui.shadcn.com/docs/components/base/sidebar — sidebar-demo */
export const Demo: Story = {
  name: 'Demo',
  render: () => <SidebarDemo />,
};

export const Header: Story = {
  render: () => <HeaderExample />,
};

export const Footer: Story = {
  render: () => <FooterExample />,
};

export const Group: Story = {
  render: () => <GroupExample />,
};

export const Menu: Story = {
  render: () => <MenuExample />,
};

export const Controlled: Story = {
  render: () => <ControlledExample />,
};

/** https://ui.shadcn.com/docs/components/base/sidebar — RTL */
export const RTL: Story = {
  render: () => (
    <div dir="rtl">
      <SidebarDemo side="right" dir="rtl" />
    </div>
  ),
};
