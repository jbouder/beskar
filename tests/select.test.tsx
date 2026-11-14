import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const ITEMS = [
  { label: 'Low', value: 'low' },
  { label: 'Medium', value: 'medium' },
  { label: 'High', value: 'high' },
];

function Example(props: {
  onValueChange?: (value: unknown) => void;
  size?: 'sm' | 'default';
}) {
  return (
    <Select
      defaultValue="low"
      items={ITEMS}
      onValueChange={props.onValueChange}
    >
      <SelectTrigger aria-label="Priority" className="w-40" size={props.size}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Priority</SelectLabel>
          {ITEMS.slice(0, 2).map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectGroup>
        <SelectSeparator />
        <SelectItem value="high">High</SelectItem>
      </SelectContent>
    </Select>
  );
}

describe('Select', () => {
  it('shows the selected label on a sized trigger', () => {
    render(<Example size="sm" />);

    const trigger = screen.getByRole('combobox', { name: 'Priority' });
    expect(trigger).toHaveAttribute('data-slot', 'select-trigger');
    expect(trigger).toHaveAttribute('data-size', 'sm');
    expect(trigger).toHaveClass('w-40');
    expect(trigger).toHaveTextContent('Low');
  });

  it('opens a listbox and selects an option', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Example onValueChange={onValueChange} />);

    const trigger = screen.getByRole('combobox', { name: 'Priority' });
    await user.click(trigger);

    const listbox = await screen.findByRole('listbox');
    expect(listbox.closest('[data-slot="select-content"]')).not.toBeNull();
    expect(screen.getByText('Priority')).toHaveAttribute(
      'data-slot',
      'select-label',
    );
    expect(
      document.querySelector('[data-slot="select-separator"]'),
    ).not.toBeNull();
    expect(screen.getByRole('option', { name: 'Low' })).toHaveAttribute(
      'aria-selected',
      'true',
    );

    await user.click(screen.getByRole('option', { name: 'High' }));
    expect(onValueChange).toHaveBeenLastCalledWith('high', expect.anything());
    await waitFor(() => expect(trigger).toHaveTextContent('High'));
  });
});
