import {
  ChartBarIcon,
  DotsThreeIcon,
  GearIcon,
  HouseIcon,
  KanbanIcon,
  PlusIcon,
} from '@phosphor-icons/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
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
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { TooltipProvider } from '@/components/ui/tooltip';

type SidebarStoryArgs = {
  /** Which edge the sidebar sits on. */
  side: 'left' | 'right';
  variant: 'sidebar' | 'floating' | 'inset';
  /** `offcanvas` slides away, `icon` shrinks to icons, `none` stays put. */
  collapsible: 'offcanvas' | 'icon' | 'none';
  /** Whether the sidebar starts open. */
  defaultOpen: boolean;
};

function SidebarExample({
  side,
  variant,
  collapsible,
  defaultOpen,
}: SidebarStoryArgs) {
  return (
    <TooltipProvider>
      <SidebarProvider defaultOpen={defaultOpen}>
        <Sidebar collapsible={collapsible} side={side} variant={variant}>
          <SidebarHeader>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton size="lg" tooltip="Beskar">
                  <KanbanIcon aria-hidden="true" />
                  <span className="font-medium">Beskar</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarHeader>
          <SidebarSeparator />
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Workspace</SidebarGroupLabel>
              <SidebarGroupAction aria-label="Add a board">
                <PlusIcon aria-hidden="true" />
              </SidebarGroupAction>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      isActive
                      render={<a aria-current="page" href="#home" />}
                      tooltip="Home"
                    >
                      <HouseIcon aria-hidden="true" />
                      <span>Home</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton tooltip="Boards">
                      <KanbanIcon aria-hidden="true" />
                      <span>Boards</span>
                    </SidebarMenuButton>
                    <SidebarMenuBadge>12</SidebarMenuBadge>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton href="#sprint-42" isActive>
                          <span>Sprint 42</span>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton href="#sprint-41">
                          <span>Sprint 41</span>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton tooltip="Reports">
                      <ChartBarIcon aria-hidden="true" />
                      <span>Reports</span>
                    </SidebarMenuButton>
                    <SidebarMenuAction aria-label="More for Reports">
                      <DotsThreeIcon aria-hidden="true" />
                    </SidebarMenuAction>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Settings">
                  <GearIcon aria-hidden="true" />
                  <span>Settings</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
          <SidebarRail />
        </Sidebar>
        <SidebarInset>
          <header className="flex h-12 items-center gap-2 border-b px-3">
            <SidebarTrigger />
            <h1 className="text-sm font-medium">Home</h1>
          </header>
          <p className="p-4 text-xs text-muted-foreground">
            Press Ctrl+B, or Cmd+B on a Mac, to toggle the sidebar.
          </p>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}

const meta = {
  title: 'Components/Sidebar',
  component: SidebarExample,
  parameters: { layout: 'fullscreen' },
  args: {
    side: 'left',
    variant: 'sidebar',
    collapsible: 'offcanvas',
    defaultOpen: true,
  },
  argTypes: {
    side: {
      control: 'inline-radio',
      options: ['left', 'right'],
      table: { defaultValue: { summary: 'left' } },
    },
    variant: {
      control: 'inline-radio',
      options: ['sidebar', 'floating', 'inset'],
      table: { defaultValue: { summary: 'sidebar' } },
    },
    collapsible: {
      control: 'inline-radio',
      options: ['offcanvas', 'icon', 'none'],
      table: { defaultValue: { summary: 'offcanvas' } },
    },
    defaultOpen: { control: 'boolean' },
  },
} satisfies Meta<typeof SidebarExample>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Below the `md` breakpoint the sidebar opens as a sheet. */
export const Default: Story = {};

/** `collapsible="icon"` keeps the icons. Menu buttons show their `tooltip` while collapsed. */
export const CollapsedToIcons: Story = {
  args: { collapsible: 'icon', defaultOpen: false },
};

export const Floating: Story = { args: { variant: 'floating' } };

export const Inset: Story = { args: { variant: 'inset' } };

export const RightSide: Story = { args: { side: 'right' } };

/** `SidebarMenuSkeleton` holds the place of menu items while they load. */
export const Loading: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <SidebarProvider>
      <Sidebar collapsible="none">
        <SidebarContent>
          <SidebarGroup>
            <SidebarMenu aria-busy="true" aria-label="Loading navigation">
              {['a', 'b', 'c', 'd'].map((key) => (
                <SidebarMenuItem key={key}>
                  <SidebarMenuSkeleton showIcon />
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  ),
};
