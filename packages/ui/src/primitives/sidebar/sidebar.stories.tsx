import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  ChevronDownIcon,
  FrameIcon,
  LifeBuoyIcon,
  MapIcon,
  PanelLeftCloseIcon,
  PanelLeftOpenIcon,
  PieChartIcon,
  SendIcon,
} from 'lucide-react';
import { useState } from 'react';

import { Button } from '../button';
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

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from './sidebar';

/**
 * Component Storybook IA (see docs/DESIGN.md "Component Story Structure"):
 * Overview first — Playground + shadcn Sidebar docs demos (Menu / Header /
 * Controlled / RTL).
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
  { name: 'Support', url: '#', icon: LifeBuoyIcon },
  { name: 'Feedback', url: '#', icon: SendIcon },
] as const;

function ProjectsMenu() {
  return (
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Projects</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {projects.map((project) => (
              <SidebarMenuItem key={project.name}>
                <SidebarMenuButton render={<a href={project.url} />}>
                  <project.icon />
                  <span>{project.name}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  );
}

/** shadcn sidebar-menu */
function MenuExample() {
  return (
    <SidebarProvider className="min-h-[320px] w-full max-w-3xl border border-border">
      <Sidebar>
        <ProjectsMenu />
      </Sidebar>
      <SidebarInset>
        <div className="flex items-center gap-[var(--spacing-xs)] p-[var(--spacing-md)]">
          <SidebarTrigger />
          <span className="text-[length:var(--text-paragraph-small-regular-font-size)] text-muted-foreground">
            Menu
          </span>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

/** shadcn sidebar-header */
function HeaderExample() {
  return (
    <SidebarProvider className="min-h-[240px] w-full max-w-3xl border border-border">
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
        <ProjectsMenu />
      </Sidebar>
      <SidebarInset>
        <header className="flex h-[length:var(--spacing-3xl)] items-center px-[var(--spacing-md)]">
          <SidebarTrigger />
        </header>
      </SidebarInset>
    </SidebarProvider>
  );
}

/** shadcn sidebar-footer */
function FooterExample() {
  return (
    <SidebarProvider className="min-h-[320px] w-full max-w-3xl border border-border">
      <Sidebar>
        <ProjectsMenu />
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <LifeBuoyIcon />
                <span>Support</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <div className="flex items-center gap-[var(--spacing-xs)] p-[var(--spacing-md)]">
          <SidebarTrigger />
          <span className="text-[length:var(--text-paragraph-small-regular-font-size)] text-muted-foreground">
            Footer
          </span>
        </div>
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

/** shadcn sidebar-controlled */
function ControlledExample() {
  const [open, setOpen] = useState(true);
  return (
    <SidebarProvider
      open={open}
      onOpenChange={setOpen}
      className="min-h-[320px] w-full max-w-3xl border border-border"
    >
      <Sidebar>
        <ProjectsMenu />
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <div className="flex items-center gap-[var(--spacing-xs)] p-[var(--spacing-md)]">
          <ControlledToggle />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

/** shadcn sidebar-rtl (Arabic labels) */
function RtlExample() {
  return (
    <div dir="rtl">
      <SidebarProvider className="min-h-[320px] w-full max-w-3xl border border-border">
        <Sidebar side="right">
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>المشاريع</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {projects.slice(0, 3).map((project) => (
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
          <div className="flex items-center gap-[var(--spacing-xs)] p-[var(--spacing-md)]">
            <SidebarTrigger />
            <span className="text-[length:var(--text-paragraph-small-regular-font-size)] text-muted-foreground">
              العربية
            </span>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
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
        <SidebarProvider className="min-h-[320px] w-full max-w-3xl border border-border">
          <Sidebar side={side} collapsible={collapsible}>
            <ProjectsMenu />
            <SidebarRail />
          </Sidebar>
          <SidebarInset>
            <div className="flex items-center gap-[var(--spacing-xs)] p-[var(--spacing-md)]">
              <SidebarTrigger />
              <span className="text-[length:var(--text-paragraph-small-regular-font-size)] text-muted-foreground">
                Playground
              </span>
            </div>
          </SidebarInset>
        </SidebarProvider>
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
      description="Composable application sidebar — Foundations chrome from Figma Sidebar (items, group labels, shell); shadcn Sidebar provider API."
      playground={<SidebarPlayground />}
      variants={
        <div className="flex flex-col gap-[var(--spacing-md)]">
          <PrimitiveGalleryItem label="Menu">
            <MenuExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Header">
            <HeaderExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Controlled">
            <ControlledExample />
          </PrimitiveGalleryItem>
        </div>
      }
      usageGuidance={
        <ul className="list-disc space-y-2 ps-5 text-sm text-muted-foreground">
          <li>
            Wrap the layout in <code>SidebarProvider</code>; compose Header /
            Content / Footer with Groups and Menu buttons.
          </li>
          <li>
            Use <code>collapsible=&quot;icon&quot;</code> for the Figma collapsed
            rail; tooltips appear on menu buttons when collapsed.
          </li>
          <li>
            Mobile uses the Foundations-matched Sheet (edge panel) automatically.
          </li>
        </ul>
      }
      accessibility={
        <ul className="list-disc space-y-2 ps-5 text-sm text-muted-foreground">
          <li>
            <code>SidebarTrigger</code> is an Icon Button with{' '}
            <code>aria-label=&quot;Toggle Sidebar&quot;</code>.
          </li>
          <li>
            Keyboard shortcut <kbd>⌘/Ctrl+B</kbd> toggles the sidebar.
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

export const Menu: Story = {
  render: () => <MenuExample />,
};

export const Header: Story = {
  render: () => <HeaderExample />,
};

export const Footer: Story = {
  render: () => <FooterExample />,
};

export const Controlled: Story = {
  render: () => <ControlledExample />,
};

export const RTL: Story = {
  render: () => <RtlExample />,
};
