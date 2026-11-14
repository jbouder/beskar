import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from '@/components/ui/progress';

describe('Progress', () => {
  it('exposes the value to assistive tech', () => {
    render(<Progress aria-label="Upload" value={40} />);

    const bar = screen.getByRole('progressbar', { name: 'Upload' });
    expect(bar).toHaveAttribute('aria-valuenow', '40');
    expect(bar).toHaveAttribute('data-slot', 'progress');
  });

  it('renders the track, the indicator, a label, and the value text', () => {
    const { container } = render(
      <Progress value={65}>
        <ProgressLabel>Uploading</ProgressLabel>
        <ProgressValue />
      </Progress>,
    );

    expect(
      screen.getByRole('progressbar', { name: 'Uploading' }),
    ).toBeInTheDocument();
    expect(screen.getByText('65%')).toHaveAttribute(
      'data-slot',
      'progress-value',
    );
    expect(
      container.querySelector('[data-slot="progress-track"]'),
    ).toBeInTheDocument();
    expect(
      container.querySelector('[data-slot="progress-indicator"]'),
    ).toHaveClass('duration-(--duration-fast)');
  });

  it('supports an unknown amount', () => {
    render(<Progress aria-label="Working" value={null} />);

    expect(screen.getByRole('progressbar')).not.toHaveAttribute(
      'aria-valuenow',
    );
  });
});
