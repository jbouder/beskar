import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from '@/components/ui/popover';

describe('Popover', () => {
  it('opens from the trigger and closes on Escape', async () => {
    const user = userEvent.setup();
    render(
      <Popover>
        <PopoverTrigger>Share</PopoverTrigger>
        <PopoverContent className="w-80" side="top">
          <PopoverHeader>
            <PopoverTitle>Share this board</PopoverTitle>
            <PopoverDescription>
              Anyone with the link can view.
            </PopoverDescription>
          </PopoverHeader>
        </PopoverContent>
      </Popover>,
    );

    const trigger = screen.getByRole('button', { name: 'Share' });
    expect(trigger).toHaveAttribute('data-slot', 'popover-trigger');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');

    await user.click(trigger);
    const popover = await screen.findByRole('dialog', {
      name: 'Share this board',
    });
    expect(popover).toHaveAttribute('data-slot', 'popover-content');
    expect(popover).toHaveClass('bg-popover', 'w-80');
    expect(popover).toHaveAccessibleDescription(
      'Anyone with the link can view.',
    );
    expect(
      popover.querySelector('[data-slot="popover-header"]'),
    ).not.toBeNull();
    expect(trigger).toHaveAttribute('aria-expanded', 'true');

    await user.keyboard('{Escape}');
    await waitFor(() =>
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument(),
    );
  });
});
