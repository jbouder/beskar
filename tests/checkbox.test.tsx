import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Checkbox } from '@/components/ui/checkbox';

describe('Checkbox', () => {
  it('toggles on click and on Space', async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(<Checkbox aria-label="Done" onCheckedChange={onCheckedChange} />);

    const checkbox = screen.getByRole('checkbox', { name: 'Done' });
    expect(checkbox).toHaveAttribute('data-slot', 'checkbox');
    expect(checkbox).toHaveAttribute('aria-checked', 'false');

    await user.click(checkbox);
    expect(checkbox).toHaveAttribute('aria-checked', 'true');
    expect(onCheckedChange).toHaveBeenLastCalledWith(true, expect.anything());

    checkbox.focus();
    await user.keyboard(' ');
    expect(checkbox).toHaveAttribute('aria-checked', 'false');
  });

  it('shows the check mark only when checked', () => {
    const { container, rerender } = render(<Checkbox aria-label="Done" />);
    expect(
      container.querySelector('[data-slot="checkbox-indicator"]'),
    ).toBeNull();

    rerender(<Checkbox aria-label="Done" defaultChecked key="checked" />);
    expect(
      container.querySelector('[data-slot="checkbox-indicator"] svg'),
    ).not.toBeNull();
  });

  it('does not toggle when disabled', async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(
      <Checkbox
        aria-label="Done"
        className="size-5"
        disabled
        onCheckedChange={onCheckedChange}
      />,
    );

    const checkbox = screen.getByRole('checkbox', { name: 'Done' });
    await user.click(checkbox);
    expect(onCheckedChange).not.toHaveBeenCalled();
    expect(checkbox).toHaveClass('size-5');
  });
});
