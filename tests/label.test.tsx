import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

describe('Label', () => {
  it('names its control and focuses it on click', async () => {
    const user = userEvent.setup();
    render(
      <>
        <Label className="font-medium" htmlFor="email">
          Email
        </Label>
        <Input id="email" />
      </>,
    );

    const label = screen.getByText('Email');
    expect(label).toHaveAttribute('data-slot', 'label');
    expect(label).toHaveClass('font-medium');

    await user.click(label);
    expect(screen.getByRole('textbox', { name: 'Email' })).toHaveFocus();
  });
});
