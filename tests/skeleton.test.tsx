import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Skeleton } from '@/components/ui/skeleton';

describe('Skeleton', () => {
  it('renders a muted placeholder that only pulses when motion is allowed', () => {
    render(<Skeleton className="h-4 w-32" data-testid="skeleton" />);

    const skeleton = screen.getByTestId('skeleton');
    expect(skeleton).toHaveAttribute('data-slot', 'skeleton');
    expect(skeleton).toHaveClass(
      'bg-muted',
      'motion-safe:animate-pulse',
      'h-4',
      'w-32',
    );
    expect(skeleton).not.toHaveClass('animate-pulse');
  });
});
