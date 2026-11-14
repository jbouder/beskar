import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';

describe('Empty', () => {
  it('renders every part with its slot', () => {
    const { container } = render(
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">icon</EmptyMedia>
          <EmptyTitle>No boards yet</EmptyTitle>
          <EmptyDescription>Create one to start.</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <button type="button">Create</button>
        </EmptyContent>
      </Empty>,
    );

    for (const slot of ['empty', 'empty-header', 'empty-content']) {
      expect(
        container.querySelector(`[data-slot="${slot}"]`),
      ).toBeInTheDocument();
    }
    expect(screen.getByText('No boards yet')).toHaveAttribute(
      'data-slot',
      'empty-title',
    );
    expect(screen.getByText('Create one to start.')).toHaveAttribute(
      'data-slot',
      'empty-description',
    );
    expect(screen.getByText('icon')).toHaveAttribute('data-variant', 'icon');
  });

  it('defaults the media variant and lets className win', () => {
    render(<EmptyMedia className="mb-0">art</EmptyMedia>);

    const media = screen.getByText('art');
    expect(media).toHaveAttribute('data-variant', 'default');
    expect(media).toHaveClass('mb-0');
    expect(media).not.toHaveClass('mb-2');
  });
});
