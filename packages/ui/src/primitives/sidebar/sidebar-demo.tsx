'use client';

/**
 * Adapted from shadcn Base Sidebar demo (collapses to icons).
 * https://ui.shadcn.com/docs/components/base/sidebar
 */

import * as React from 'react';
import {
  AudioWaveformIcon,
  BadgeCheckIcon,
  BellIcon,
  BookOpenIcon,
  BotIcon,
  ChevronRightIcon,
  ChevronsUpDownIcon,
  CommandIcon,
  CreditCardIcon,
  FolderIcon,
  ForwardIcon,
  FrameIcon,
  GalleryVerticalEndIcon,
  LogOutIcon,
  MapIcon,
  MoreHorizontalIcon,
  PieChartIcon,
  PlusIcon,
  Settings2Icon,
  SparklesIcon,
  SquareTerminalIcon,
  Trash2Icon,
} from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '../avatar';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '../collapsible';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '../dropdown-menu';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from './sidebar';

const data = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: 'https://github.com/shadcn.png',
  },
  teams: [
    { name: 'Acme Inc', logo: GalleryVerticalEndIcon, plan: 'Enterprise' },
    { name: 'Acme Corp.', logo: AudioWaveformIcon, plan: 'Startup' },
    { name: 'Evil Corp.', logo: CommandIcon, plan: 'Free' },
  ],
  navMain: [
    {
      title: 'Playground',
      url: '#',
      icon: SquareTerminalIcon,
      isActive: true,
      items: [
        { title: 'History', url: '#' },
        { title: 'Starred', url: '#' },
        { title: 'Settings', url: '#' },
      ],
    },
    {
      title: 'Models',
      url: '#',
      icon: BotIcon,
      items: [
        { title: 'Genesis', url: '#' },
        { title: 'Explorer', url: '#' },
        { title: 'Quantum', url: '#' },
      ],
    },
    {
      title: 'Documentation',
      url: '#',
      icon: BookOpenIcon,
      items: [
        { title: 'Introduction', url: '#' },
        { title: 'Get Started', url: '#' },
        { title: 'Tutorials', url: '#' },
        { title: 'Changelog', url: '#' },
      ],
    },
    {
      title: 'Settings',
      url: '#',
      icon: Settings2Icon,
      items: [
        { title: 'General', url: '#' },
        { title: 'Team', url: '#' },
        { title: 'Billing', url: '#' },
        { title: 'Limits', url: '#' },
      ],
    },
  ],
  projects: [
    { name: 'Design Engineering', url: '#', icon: FrameIcon },
    { name: 'Sales & Marketing', url: '#', icon: PieChartIcon },
    { name: 'Travel', url: '#', icon: MapIcon },
  ],
};

function TeamSwitcher({
  teams,
}: {
  teams: { name: string; logo: React.ElementType; plan: string }[];
}) {
  const { isMobile } = useSidebar();
  const [activeTeam, setActiveTeam] = React.useState(teams[0]);

  if (!activeTeam) return null;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                size="lg"
                className="data-open:bg-sidebar-accent data-open:text-sidebar-accent-foreground"
              />
            }
          >
            <div className="flex aspect-square size-[length:var(--spacing-2xl)] items-center justify-center rounded-[length:var(--rounded-md)] bg-sidebar-primary text-sidebar-primary-foreground">
              <activeTeam.logo />
            </div>
            <div className="grid flex-1 text-start text-[length:var(--text-paragraph-small-regular-font-size)] leading-tight">
              <span className="truncate font-medium">{activeTeam.name}</span>
              <span className="truncate text-[length:var(--text-paragraph-mini-regular-font-size)]">
                {activeTeam.plan}
              </span>
            </div>
            <ChevronsUpDownIcon className="ms-auto" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--anchor-width) min-w-56 rounded-[length:var(--rounded-md)]"
            align="start"
            side={isMobile ? 'bottom' : 'right'}
            sideOffset={4}
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="text-[length:var(--text-paragraph-mini-regular-font-size)] text-muted-foreground">
                Teams
              </DropdownMenuLabel>
              {teams.map((team, index) => (
                <DropdownMenuItem
                  key={team.name}
                  onClick={() => setActiveTeam(team)}
                  className="gap-[var(--spacing-xs)] p-[var(--spacing-xs)]"
                >
                  <div className="flex size-[length:var(--spacing-xl)] items-center justify-center rounded-[length:var(--rounded-sm)] border">
                    <team.logo />
                  </div>
                  {team.name}
                  <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem className="gap-[var(--spacing-xs)] p-[var(--spacing-xs)]">
                <div className="flex size-[length:var(--spacing-xl)] items-center justify-center rounded-[length:var(--rounded-sm)] border bg-transparent">
                  <PlusIcon />
                </div>
                <div className="font-medium text-muted-foreground">Add team</div>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: React.ElementType;
    isActive?: boolean;
    items?: { title: string; url: string }[];
  }[];
}) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible
            key={item.title}
            defaultOpen={item.isActive}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger
                render={<SidebarMenuButton tooltip={item.title} />}
              >
                {item.icon ? <item.icon /> : null}
                <span>{item.title}</span>
                <ChevronRightIcon className="ms-auto transition-transform duration-[var(--duration-fast)] group-data-panel-open/menu-button:rotate-90" />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {item.items?.map((subItem) => (
                    <SidebarMenuSubItem key={subItem.title}>
                      <SidebarMenuSubButton render={<a href={subItem.url} />}>
                        <span>{subItem.title}</span>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}

function NavProjects({
  projects,
}: {
  projects: { name: string; url: string; icon: React.ElementType }[];
}) {
  const { isMobile } = useSidebar();

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Projects</SidebarGroupLabel>
      <SidebarMenu>
        {projects.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton render={<a href={item.url} />}>
              <item.icon />
              <span>{item.name}</span>
            </SidebarMenuButton>
            <DropdownMenu>
              <DropdownMenuTrigger render={<SidebarMenuAction showOnHover />}>
                <MoreHorizontalIcon />
                <span className="sr-only">More</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-48 rounded-[length:var(--rounded-md)]"
                side={isMobile ? 'bottom' : 'right'}
                align={isMobile ? 'end' : 'start'}
              >
                <DropdownMenuItem>
                  <FolderIcon className="text-muted-foreground" />
                  <span>View Project</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <ForwardIcon className="text-muted-foreground" />
                  <span>Share Project</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Trash2Icon className="text-muted-foreground" />
                  <span>Delete Project</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        ))}
        <SidebarMenuItem>
          <SidebarMenuButton className="text-sidebar-foreground/70">
            <MoreHorizontalIcon className="text-sidebar-foreground/70" />
            <span>More</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
}

function NavUser({
  user,
}: {
  user: { name: string; email: string; avatar: string };
}) {
  const { isMobile } = useSidebar();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                size="lg"
                className="data-open:bg-sidebar-accent data-open:text-sidebar-accent-foreground"
              />
            }
          >
            <Avatar size="small" shape="roundrect">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-start text-[length:var(--text-paragraph-small-regular-font-size)] leading-tight">
              <span className="truncate font-medium">{user.name}</span>
              <span className="truncate text-[length:var(--text-paragraph-mini-regular-font-size)]">
                {user.email}
              </span>
            </div>
            <ChevronsUpDownIcon className="ms-auto" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--anchor-width) min-w-56 rounded-[length:var(--rounded-md)]"
            side={isMobile ? 'bottom' : 'right'}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-[var(--spacing-xs)] px-[var(--spacing-2xs)] py-[var(--spacing-xs)] text-start text-[length:var(--text-paragraph-small-regular-font-size)]">
                  <Avatar size="small" shape="roundrect">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-start leading-tight">
                    <span className="truncate font-medium">{user.name}</span>
                    <span className="truncate text-[length:var(--text-paragraph-mini-regular-font-size)]">
                      {user.email}
                    </span>
                  </div>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <SparklesIcon />
                Upgrade to Pro
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <BadgeCheckIcon />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CreditCardIcon />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem>
                <BellIcon />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <LogOutIcon />
                Log out
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

/** Frame that keeps `fixed` sidebar chrome inside Storybook demos. */
export const SIDEBAR_STORY_FRAME = [
  'relative isolate flex h-[min(40rem,70vh)] min-h-0! w-full overflow-hidden border border-border bg-background',
  '[&_[data-slot=sidebar-container]]:absolute!',
  '[&_[data-slot=sidebar-container]]:inset-y-0!',
  '[&_[data-slot=sidebar-container]]:h-full!',
].join(' ');

export function SidebarDemo({
  side = 'left',
  collapsible = 'icon',
  className,
  dir,
}: {
  side?: 'left' | 'right';
  collapsible?: 'offcanvas' | 'icon' | 'none';
  className?: string;
  dir?: 'ltr' | 'rtl';
}) {
  return (
    <SidebarProvider className={className ?? SIDEBAR_STORY_FRAME} dir={dir}>
      <Sidebar side={side} collapsible={collapsible} dir={dir}>
        <SidebarHeader>
          <TeamSwitcher teams={data.teams} />
        </SidebarHeader>
        <SidebarContent>
          <NavMain items={data.navMain} />
          <NavProjects projects={data.projects} />
        </SidebarContent>
        <SidebarFooter>
          <NavUser user={data.user} />
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <header className="flex h-[length:var(--spacing-4xl)] shrink-0 items-center gap-[var(--spacing-xs)] border-b border-border px-[var(--spacing-md)] transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-[length:var(--spacing-3xl)]">
          <SidebarTrigger className="-ms-[var(--spacing-2xs)]" />
          <span className="text-[length:var(--text-paragraph-small-regular-font-size)] text-muted-foreground">
            A sidebar that collapses to icons
          </span>
        </header>
      </SidebarInset>
    </SidebarProvider>
  );
}
