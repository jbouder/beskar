import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Badge } from '@/components/ui/badge';

describe('Badge', () => {
  it('renders a span with the default variant', () => {
    render(<Badge>New</Badge>);

    const badge = screen.getByText('New');
    expect(badge.tagName).toBe('SPAN');
    expect(badge).toHaveAttribute('data-slot', 'badge');
    expect(badge).toHaveAttribute('data-variant', 'default');
    expect(badge).toHaveClass('bg-primary');
  });

  it('applies the variant and merges className', () => {
    render(
      <Badge className="bg-tone-blue-soft" variant="outline">
        Draft
      </Badge>,
    );

    const badge = screen.getByText('Draft');
    expect(badge).toHaveAttribute('data-variant', 'outline');
    expect(badge).toHaveClass('border-border', 'bg-tone-blue-soft');
  });

  it('composes as a link through the render prop', () => {
    render(<Badge render={<a href="/tags/ui" />}>ui</Badge>);

    const link = screen.getByRole('link', { name: 'ui' });
    expect(link).toHaveAttribute('data-slot', 'badge');
    expect(link).toHaveClass('bg-primary');
  });
});
