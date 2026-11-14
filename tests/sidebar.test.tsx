import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
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
  useSidebar,
} from '@/components/ui/sidebar';
import { TooltipProvider } from '@/components/ui/tooltip';

/** jsdom has no `matchMedia`, which `useIsMobile` needs. */
function setViewport(width: number) {
  vi.stubGlobal('innerWidth', width);
  vi.stubGlobal(
    'matchMedia',
    vi.fn(() => ({
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })),
  );
}

function clearSidebarCookie() {
  // biome-ignore lint/suspicious/noDocumentCookie: jsdom has no Cookie Store API.
  document.cookie = 'sidebar_state=; path=/; max-age=0';
}

function Example(props: {
  provider?: React.ComponentProps<typeof SidebarProvider>;
  sidebar?: React.ComponentProps<typeof Sidebar>;
}) {
  return (
    <TooltipProvider>
      <SidebarProvider {...props.provider}>
        <Sidebar {...props.sidebar}>
          <SidebarHeader>
            <SidebarInput aria-label="Search" />
          </SidebarHeader>
          <SidebarSeparator />
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Workspace</SidebarGroupLabel>
              <SidebarGroupAction aria-label="Add" />
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive tooltip="Home">
                      Home
                    </SidebarMenuButton>
                    <SidebarMenuAction aria-label="More" showOnHover />
                    <SidebarMenuBadge>3</SidebarMenuBadge>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton href="#a" isActive size="sm">
                          Sprint 42
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      size="lg"
                      tooltip={{ children: 'All boards' }}
                      variant="outline"
                    >
                      Boards
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton render={<a href="#reports" />}>
                      Reports
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuSkeleton showIcon />
                    <SidebarMenuSkeleton />
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>Footer</SidebarFooter>
          <SidebarRail />
        </Sidebar>
        <SidebarInset>
          <SidebarTrigger />
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}

// The rail shares the trigger's accessible name, so find the trigger by slot.
const trigger = () =>
  document.querySelector('[data-slot="sidebar-trigger"]') as HTMLElement;

const sidebarRoot = (container: HTMLElement) =>
  container.querySelector('[data-slot="sidebar"]');

beforeEach(() => {
  setViewport(1280);
  clearSidebarCookie();
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('Sidebar on desktop', () => {
  it('renders every part with its slot', () => {
    const { container } = render(<Example />);

    for (const slot of [
      'sidebar-wrapper',
      'sidebar',
      'sidebar-gap',
      'sidebar-container',
      'sidebar-inner',
      'sidebar-header',
      'sidebar-input',
      'sidebar-separator',
      'sidebar-content',
      'sidebar-group',
      'sidebar-group-label',
      'sidebar-group-action',
      'sidebar-group-content',
      'sidebar-menu',
      'sidebar-menu-item',
      'sidebar-menu-button',
      'sidebar-menu-action',
      'sidebar-menu-badge',
      'sidebar-menu-sub',
      'sidebar-menu-sub-item',
      'sidebar-menu-sub-button',
      'sidebar-menu-skeleton',
      'sidebar-footer',
      'sidebar-rail',
      'sidebar-inset',
      'sidebar-trigger',
    ]) {
      expect(
        container.querySelector(`[data-slot="${slot}"]`),
        slot,
      ).toBeInTheDocument();
    }

    expect(screen.getByRole('main')).toHaveAttribute(
      'data-slot',
      'sidebar-inset',
    );
    expect(screen.getByRole('button', { name: 'Home' })).toHaveAttribute(
      'data-active',
    );
    expect(screen.getByRole('link', { name: 'Reports' })).toHaveAttribute(
      'data-slot',
      'sidebar-menu-button',
    );
    expect(screen.getByRole('link', { name: 'Sprint 42' })).toHaveAttribute(
      'data-size',
      'sm',
    );
  });

  it('starts expanded and collapses from the trigger', async () => {
    const user = userEvent.setup();
    const { container } = render(<Example />);

    expect(sidebarRoot(container)).toHaveAttribute('data-state', 'expanded');
    expect(sidebarRoot(container)).toHaveAttribute('data-collapsible', '');

    await user.click(trigger());
    expect(sidebarRoot(container)).toHaveAttribute('data-state', 'collapsed');
    expect(sidebarRoot(container)).toHaveAttribute(
      'data-collapsible',
      'offcanvas',
    );
    expect(document.cookie).toContain('sidebar_state=false');
  });

  it('toggles from the rail and with Ctrl+B', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <Example sidebar={{ collapsible: 'icon', side: 'right' }} />,
    );

    const rail = container.querySelector('[data-slot="sidebar-rail"]');
    await user.click(rail as HTMLElement);
    expect(sidebarRoot(container)).toHaveAttribute('data-collapsible', 'icon');
    expect(sidebarRoot(container)).toHaveAttribute('data-side', 'right');

    await user.keyboard('{Control>}b{/Control}');
    expect(sidebarRoot(container)).toHaveAttribute('data-state', 'expanded');

    // A plain "b" is not the shortcut.
    await user.keyboard('b');
    expect(sidebarRoot(container)).toHaveAttribute('data-state', 'expanded');
  });

  it('supports controlled open state', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    const { container } = render(
      <Example provider={{ open: false, onOpenChange }} />,
    );

    expect(sidebarRoot(container)).toHaveAttribute('data-state', 'collapsed');
    await user.click(trigger());
    expect(onOpenChange).toHaveBeenCalledWith(true);
    // The parent owns the state, so nothing changes until it re-renders.
    expect(sidebarRoot(container)).toHaveAttribute('data-state', 'collapsed');
  });

  it('calls the trigger onClick before toggling', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <SidebarProvider>
        <SidebarTrigger onClick={onClick} />
      </SidebarProvider>,
    );

    await user.click(trigger());
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('renders a fixed sidebar when collapsible is none', () => {
    const { container } = render(
      <Example sidebar={{ collapsible: 'none', className: 'w-40' }} />,
    );

    const root = sidebarRoot(container);
    expect(root).toHaveClass('w-40');
    expect(root).not.toHaveAttribute('data-state');
  });

  it('applies the floating and inset variants', () => {
    const { container, unmount } = render(
      <Example sidebar={{ variant: 'floating' }} />,
    );
    expect(sidebarRoot(container)).toHaveAttribute('data-variant', 'floating');
    unmount();

    const inset = render(<Example sidebar={{ variant: 'inset' }} />);
    expect(sidebarRoot(inset.container)).toHaveAttribute(
      'data-variant',
      'inset',
    );
  });

  it('gives each skeleton a stable width between 50% and 90%', () => {
    const { container, rerender } = render(<Example />);

    const widths = () =>
      [
        ...container.querySelectorAll('[data-sidebar="menu-skeleton-text"]'),
      ].map((node) =>
        (node as HTMLElement).style.getPropertyValue('--skeleton-width'),
      );

    const first = widths();
    expect(first).toHaveLength(2);
    for (const width of first) {
      const percent = Number.parseInt(width, 10);
      expect(percent).toBeGreaterThanOrEqual(50);
      expect(percent).toBeLessThan(90);
    }

    rerender(<Example />);
    expect(widths()).toEqual(first);
  });
});

describe('Sidebar on mobile', () => {
  it('opens as a sheet from the trigger', async () => {
    setViewport(400);
    const user = userEvent.setup();
    render(<Example />);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    await user.click(trigger());
    const sheet = await screen.findByRole('dialog', { name: 'Sidebar' });
    expect(sheet).toHaveAttribute('data-mobile', 'true');
    expect(sheet).toHaveTextContent('Workspace');
  });
});

describe('useSidebar', () => {
  it('throws outside a SidebarProvider', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    function Probe() {
      useSidebar();
      return null;
    }

    expect(() => render(<Probe />)).toThrow(
      'useSidebar must be used within a SidebarProvider.',
    );
    errorSpy.mockRestore();
  });
});
