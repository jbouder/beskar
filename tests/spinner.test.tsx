import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Spinner } from '@/components/ui/spinner';

describe('Spinner', () => {
  it('announces loading and spins only when motion is allowed', () => {
    render(<Spinner className="size-6" />);

    const spinner = screen.getByRole('status', { name: 'Loading' });
    expect(spinner).toHaveAttribute('data-slot', 'spinner');
    expect(spinner).toHaveClass('motion-safe:animate-spin', 'size-6');
    expect(spinner).not.toHaveClass('size-4');
  });

  it('takes a custom label', () => {
    render(<Spinner aria-label="Saving" />);

    expect(screen.getByRole('status', { name: 'Saving' })).toBeInTheDocument();
  });
});
