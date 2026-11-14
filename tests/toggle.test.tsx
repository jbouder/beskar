import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Toggle } from '@/components/ui/toggle';

describe('Toggle', () => {
  it('flips aria-pressed on click and with the keyboard', async () => {
    const user = userEvent.setup();
    const onPressedChange = vi.fn();
    render(<Toggle onPressedChange={onPressedChange}>Bold</Toggle>);

    const toggle = screen.getByRole('button', { name: 'Bold' });
    expect(toggle).toHaveAttribute('aria-pressed', 'false');

    await user.click(toggle);
    expect(toggle).toHaveAttribute('aria-pressed', 'true');
    expect(onPressedChange.mock.calls[0][0]).toBe(true);

    await user.keyboard(' ');
    expect(toggle).toHaveAttribute('aria-pressed', 'false');
  });

  it('sets slot, variant, and size, and lets className win', () => {
    render(
      <Toggle className="h-12" size="lg" variant="outline">
        Bold
      </Toggle>,
    );

    const toggle = screen.getByRole('button', { name: 'Bold' });
    expect(toggle).toHaveAttribute('data-slot', 'toggle');
    expect(toggle).toHaveAttribute('data-variant', 'outline');
    expect(toggle).toHaveAttribute('data-size', 'lg');
    expect(toggle).toHaveClass('border', 'h-12');
    expect(toggle).not.toHaveClass('h-9');
  });

  it('does not toggle when disabled', async () => {
    const user = userEvent.setup();
    render(<Toggle disabled>Bold</Toggle>);

    const toggle = screen.getByRole('button', { name: 'Bold' });
    await user.click(toggle);
    expect(toggle).toHaveAttribute('aria-pressed', 'false');
  });
});
