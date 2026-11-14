import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

function Example() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>Copy</TooltipTrigger>
        <TooltipContent className="max-w-40">Copy the link</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

describe('Tooltip', () => {
  it('is hidden until the trigger is focused, and closes on Escape', async () => {
    const user = userEvent.setup();
    render(<Example />);

    const trigger = screen.getByRole('button', { name: 'Copy' });
    expect(trigger).toHaveAttribute('data-slot', 'tooltip-trigger');
    expect(screen.queryByText('Copy the link')).not.toBeInTheDocument();

    await user.tab();
    expect(trigger).toHaveFocus();
    const content = await screen.findByText('Copy the link');
    expect(content).toHaveAttribute('data-slot', 'tooltip-content');
    expect(content).toHaveClass('bg-foreground', 'text-background', 'max-w-40');

    await user.keyboard('{Escape}');
    expect(screen.queryByText('Copy the link')).not.toBeInTheDocument();
  });

  it('opens on hover', async () => {
    const user = userEvent.setup();
    render(<Example />);

    await user.hover(screen.getByRole('button', { name: 'Copy' }));
    expect(await screen.findByText('Copy the link')).toBeInTheDocument();
  });
});
