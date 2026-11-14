import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Switch } from '@/components/ui/switch';

describe('Switch', () => {
  it('toggles on click and reports the new state', async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(<Switch aria-label="Motion" onCheckedChange={onCheckedChange} />);

    const control = screen.getByRole('switch', { name: 'Motion' });
    expect(control).toHaveAttribute('data-slot', 'switch');
    expect(control).toHaveAttribute('data-size', 'default');
    expect(control).toHaveAttribute('aria-checked', 'false');

    await user.click(control);
    expect(control).toHaveAttribute('aria-checked', 'true');
    expect(onCheckedChange).toHaveBeenLastCalledWith(true, expect.anything());
  });

  it('supports the small size and className', () => {
    render(<Switch aria-label="Motion" className="ml-2" size="sm" />);

    const control = screen.getByRole('switch', { name: 'Motion' });
    expect(control).toHaveAttribute('data-size', 'sm');
    expect(control).toHaveClass('ml-2');
    expect(control.querySelector('[data-slot="switch-thumb"]')).not.toBeNull();
  });

  it('does not toggle when disabled', async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(
      <Switch aria-label="Motion" disabled onCheckedChange={onCheckedChange} />,
    );

    await user.click(screen.getByRole('switch', { name: 'Motion' }));
    expect(onCheckedChange).not.toHaveBeenCalled();
  });
});
