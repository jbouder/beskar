import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Textarea } from '@/components/ui/textarea';

describe('Textarea', () => {
  it('renders a multi-line field that accepts typing', async () => {
    const user = userEvent.setup();
    render(<Textarea aria-label="Notes" className="min-h-24" />);

    const textarea = screen.getByRole('textbox', { name: 'Notes' });
    expect(textarea.tagName).toBe('TEXTAREA');
    expect(textarea).toHaveAttribute('data-slot', 'textarea');
    expect(textarea).toHaveClass('min-h-24');

    await user.type(textarea, 'one{Enter}two');
    expect(textarea).toHaveValue('one\ntwo');
  });

  it('supports the disabled state', () => {
    render(<Textarea aria-label="Notes" disabled />);
    expect(screen.getByRole('textbox', { name: 'Notes' })).toBeDisabled();
  });
});
