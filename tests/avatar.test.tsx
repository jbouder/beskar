import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from '@/components/ui/avatar';

describe('Avatar', () => {
  it('shows the fallback until the image loads', () => {
    const { container } = render(
      <Avatar>
        <AvatarImage alt="Din Djarin" src="/missing.png" />
        <AvatarFallback>DD</AvatarFallback>
      </Avatar>,
    );

    // jsdom never loads images, so the fallback is what renders.
    expect(screen.getByText('DD')).toHaveAttribute(
      'data-slot',
      'avatar-fallback',
    );
    expect(screen.queryByRole('img')).not.toBeInTheDocument();

    const root = container.querySelector('[data-slot="avatar"]');
    expect(root).toHaveAttribute('data-size', 'default');
  });

  it('sets the size and renders a badge', () => {
    const { container } = render(
      <Avatar className="size-12" size="lg">
        <AvatarFallback>BK</AvatarFallback>
        <AvatarBadge aria-label="Online" role="img" />
      </Avatar>,
    );

    const root = container.querySelector('[data-slot="avatar"]');
    expect(root).toHaveAttribute('data-size', 'lg');
    expect(root).toHaveClass('size-12');
    expect(screen.getByRole('img', { name: 'Online' })).toHaveAttribute(
      'data-slot',
      'avatar-badge',
    );
  });

  it('stacks avatars in a group with a count', () => {
    const { container } = render(
      <AvatarGroup>
        <Avatar size="sm">
          <AvatarFallback>A</AvatarFallback>
        </Avatar>
        <AvatarGroupCount>+3</AvatarGroupCount>
      </AvatarGroup>,
    );

    expect(
      container.querySelector('[data-slot="avatar-group"]'),
    ).toBeInTheDocument();
    expect(screen.getByText('+3')).toHaveAttribute(
      'data-slot',
      'avatar-group-count',
    );
  });
});
