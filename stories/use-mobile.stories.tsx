import { DesktopIcon, DeviceMobileIcon } from '@phosphor-icons/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge } from '@/components/ui/badge';
import { useIsMobile } from '@/hooks/use-mobile';

/** Demonstration of `useIsMobile` choosing between two layouts. */
function IsMobileDemo() {
  const isMobile = useIsMobile();
  const Icon = isMobile ? DeviceMobileIcon : DesktopIcon;

  return (
    <div className="flex flex-col items-center gap-3 text-xs">
      <Icon aria-hidden="true" className="size-8" />
      <p aria-live="polite">
        <code className="font-mono">useIsMobile()</code> returns{' '}
        <Badge variant={isMobile ? 'default' : 'secondary'}>
          {String(isMobile)}
        </Badge>
      </p>
      <p className="max-w-64 text-center text-muted-foreground">
        Resize the window, or pick a viewport in the toolbar. The value flips at
        768px, the `md` breakpoint.
      </p>
    </div>
  );
}

const meta = {
  title: 'Hooks/useIsMobile',
  component: IsMobileDemo,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof IsMobileDemo>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * True when the viewport is narrower than 768px. It is false on the server
 * and on the first client render, then updates. `Sidebar` uses it to become a
 * sheet on small screens.
 */
export const Default: Story = {};
