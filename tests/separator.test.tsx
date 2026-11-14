import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Separator } from '@/components/ui/separator';

describe('Separator', () => {
  it('is horizontal by default', () => {
    render(<Separator />);

    const separator = screen.getByRole('separator');
    expect(separator).toHaveAttribute('data-slot', 'separator');
    expect(separator).toHaveAttribute('aria-orientation', 'horizontal');
    expect(separator).toHaveClass('bg-border');
  });

  it('supports vertical orientation and className', () => {
    render(<Separator className="mx-2" orientation="vertical" />);

    const separator = screen.getByRole('separator');
    expect(separator).toHaveAttribute('aria-orientation', 'vertical');
    expect(separator).toHaveClass('mx-2');
  });
});
