import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

describe('Card', () => {
  it('renders every part with its data-slot', () => {
    render(
      <Card data-testid="card">
        <CardHeader>
          <CardTitle>Title</CardTitle>
          <CardDescription>Description</CardDescription>
          <CardAction>Action</CardAction>
        </CardHeader>
        <CardContent>Content</CardContent>
        <CardFooter>Footer</CardFooter>
      </Card>,
    );

    const card = screen.getByTestId('card');
    expect(card).toHaveAttribute('data-slot', 'card');
    expect(card).toHaveAttribute('data-size', 'default');
    expect(card).toHaveClass('bg-card', 'text-card-foreground');

    for (const [text, slot] of [
      ['Title', 'card-title'],
      ['Description', 'card-description'],
      ['Action', 'card-action'],
      ['Content', 'card-content'],
      ['Footer', 'card-footer'],
    ]) {
      expect(screen.getByText(text)).toHaveAttribute('data-slot', slot);
    }
    expect(card.querySelector('[data-slot="card-header"]')).not.toBeNull();
  });

  it('supports the small size and merges className', () => {
    render(
      <Card className="max-w-sm" data-testid="card" size="sm">
        Body
      </Card>,
    );

    const card = screen.getByTestId('card');
    expect(card).toHaveAttribute('data-size', 'sm');
    expect(card).toHaveClass('max-w-sm');
  });
});
