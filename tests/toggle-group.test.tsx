import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

function Example(props: React.ComponentProps<typeof ToggleGroup>) {
  return (
    <ToggleGroup aria-label="View" {...props}>
      <ToggleGroupItem value="board">Board</ToggleGroupItem>
      <ToggleGroupItem value="list">List</ToggleGroupItem>
      <ToggleGroupItem value="table">Table</ToggleGroupItem>
    </ToggleGroup>
  );
}

const pressed = (name: string) =>
  screen.getByRole('button', { name }).getAttribute('aria-pressed');

describe('ToggleGroup', () => {
  it('keeps one item on at a time by default', async () => {
    const user = userEvent.setup();
    render(<Example defaultValue={['board']} />);

    expect(pressed('Board')).toBe('true');
    await user.click(screen.getByRole('button', { name: 'List' }));
    expect(pressed('List')).toBe('true');
    expect(pressed('Board')).toBe('false');
  });

  it('keeps several items on with multiple', async () => {
    const user = userEvent.setup();
    render(<Example defaultValue={['board']} multiple />);

    await user.click(screen.getByRole('button', { name: 'List' }));
    expect(pressed('Board')).toBe('true');
    expect(pressed('List')).toBe('true');
  });

  it('moves focus between items with the arrow keys', async () => {
    const user = userEvent.setup();
    render(<Example />);

    screen.getByRole('button', { name: 'Board' }).focus();
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('button', { name: 'List' })).toHaveFocus();
  });

  it('passes variant, size, and spacing down to the items', () => {
    render(
      <Example
        orientation="vertical"
        size="sm"
        spacing={0}
        variant="outline"
      />,
    );

    const group = screen.getByRole('group', { name: 'View' });
    expect(group).toHaveAttribute('data-slot', 'toggle-group');
    expect(group).toHaveAttribute('data-variant', 'outline');
    expect(group).toHaveAttribute('data-size', 'sm');
    expect(group).toHaveAttribute('data-spacing', '0');
    expect(group).toHaveAttribute('data-orientation', 'vertical');

    const item = screen.getByRole('button', { name: 'Board' });
    expect(item).toHaveAttribute('data-slot', 'toggle-group-item');
    expect(item).toHaveAttribute('data-variant', 'outline');
    expect(item).toHaveAttribute('data-size', 'sm');
    expect(item).toHaveClass('border', 'h-7');
  });

  it('falls back to the item variant and size outside a styled group', () => {
    render(
      <ToggleGroup aria-label="View">
        <ToggleGroupItem size="lg" value="board" variant="outline">
          Board
        </ToggleGroupItem>
      </ToggleGroup>,
    );

    const item = screen.getByRole('button', { name: 'Board' });
    expect(item).toHaveAttribute('data-variant', 'outline');
    expect(item).toHaveAttribute('data-size', 'lg');
  });
});
