import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Input } from '@/components/ui/input';

describe('Input', () => {
  it('renders a text field that accepts typing', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Input aria-label="Name" onChange={onChange} />);

    const input = screen.getByRole('textbox', { name: 'Name' });
    expect(input).toHaveAttribute('data-slot', 'input');
    await user.type(input, 'Din');
    expect(input).toHaveValue('Din');
    expect(onChange).toHaveBeenCalledTimes(3);
  });

  it('passes type, placeholder, and className through', () => {
    render(
      <Input className="w-40" placeholder="you@example.com" type="email" />,
    );

    const input = screen.getByPlaceholderText('you@example.com');
    expect(input).toHaveAttribute('type', 'email');
    expect(input).toHaveClass('w-40', 'border-input');
  });

  it('supports disabled and invalid states', () => {
    render(<Input aria-invalid aria-label="Code" disabled />);

    const input = screen.getByRole('textbox', { name: 'Code' });
    expect(input).toBeDisabled();
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });
});
