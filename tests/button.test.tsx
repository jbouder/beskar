import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Button, buttonVariants } from '@/components/ui/button';

describe('Button', () => {
  it('renders a button with default variant and size data attributes', () => {
    render(<Button>Save</Button>);

    const button = screen.getByRole('button', { name: 'Save' });
    expect(button).toHaveAttribute('data-slot', 'button');
    expect(button).toHaveAttribute('data-variant', 'default');
    expect(button).toHaveAttribute('data-size', 'default');
    expect(button).toHaveClass('bg-primary', 'h-8');
  });

  it('applies variant and size classes', () => {
    render(
      <Button size="lg" variant="outline">
        Cancel
      </Button>,
    );

    const button = screen.getByRole('button', { name: 'Cancel' });
    expect(button).toHaveAttribute('data-variant', 'outline');
    expect(button).toHaveAttribute('data-size', 'lg');
    expect(button).toHaveClass('border-border', 'h-9');
  });

  it("lets the caller's className win over a variant class", () => {
    render(<Button className="h-12">Tall</Button>);

    const button = screen.getByRole('button', { name: 'Tall' });
    expect(button).toHaveClass('h-12');
    expect(button).not.toHaveClass('h-8');
  });

  it('calls onClick, and not when disabled', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const { rerender } = render(<Button onClick={onClick}>Go</Button>);

    await user.click(screen.getByRole('button', { name: 'Go' }));
    expect(onClick).toHaveBeenCalledTimes(1);

    rerender(
      <Button disabled onClick={onClick}>
        Go
      </Button>,
    );
    await user.click(screen.getByRole('button', { name: 'Go' }));
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('button', { name: 'Go' })).toBeDisabled();
  });

  it('swaps the element through the render prop and keeps button semantics', () => {
    render(
      <Button nativeButton={false} render={<div />}>
        Custom
      </Button>,
    );

    const button = screen.getByRole('button', { name: 'Custom' });
    expect(button.tagName).toBe('DIV');
    expect(button).toHaveAttribute('data-slot', 'button');
    expect(button).toHaveClass('bg-primary');
  });

  it('styles a real link with buttonVariants', () => {
    render(
      <a className={buttonVariants({ variant: 'outline' })} href="/home">
        Home
      </a>,
    );

    expect(screen.getByRole('link', { name: 'Home' })).toHaveClass(
      'border-border',
      'h-8',
    );
  });

  it('uses motion tokens for its transition', () => {
    expect(buttonVariants()).toContain('duration-(--duration-fast)');
    expect(buttonVariants()).toContain('ease-(--ease-standard)');
  });
});
