import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert';

describe('Alert', () => {
  it('renders an alert with its title, description, and action', () => {
    render(
      <Alert>
        <AlertTitle>Sync is paused</AlertTitle>
        <AlertDescription>Reconnect to continue.</AlertDescription>
        <AlertAction>
          <button type="button">Retry</button>
        </AlertAction>
      </Alert>,
    );

    const alert = screen.getByRole('alert');
    expect(alert).toHaveAttribute('data-slot', 'alert');
    expect(alert).toHaveAttribute('data-variant', 'default');
    expect(screen.getByText('Sync is paused')).toHaveAttribute(
      'data-slot',
      'alert-title',
    );
    expect(screen.getByText('Reconnect to continue.')).toHaveAttribute(
      'data-slot',
      'alert-description',
    );
    expect(
      screen.getByRole('button', { name: 'Retry' }).parentElement,
    ).toHaveAttribute('data-slot', 'alert-action');
  });

  it('applies the destructive variant and lets className win', () => {
    render(
      <Alert className="bg-muted" variant="destructive">
        Failed
      </Alert>,
    );

    const alert = screen.getByRole('alert');
    expect(alert).toHaveAttribute('data-variant', 'destructive');
    expect(alert).toHaveClass('text-destructive', 'bg-muted');
    expect(alert).not.toHaveClass('bg-card');
  });
});
