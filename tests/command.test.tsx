import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@/components/ui/command';

function Palette(props: { onSelect?: (value: string) => void }) {
  return (
    <>
      <CommandInput placeholder="Search commands" />
      <CommandList>
        <CommandEmpty>No results.</CommandEmpty>
        <CommandGroup heading="Notes">
          <CommandItem onSelect={props.onSelect}>
            New note
            <CommandShortcut>N</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={props.onSelect}>Search notes</CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Theme">
          <CommandItem onSelect={props.onSelect}>Toggle theme</CommandItem>
        </CommandGroup>
      </CommandList>
    </>
  );
}

describe('Command', () => {
  it('filters items as you type and shows the empty state', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <Command className="w-80">
        <Palette />
      </Command>,
    );

    expect(container.querySelector('[data-slot="command"]')).toHaveClass(
      'bg-popover',
      'w-80',
    );
    expect(screen.getAllByRole('option')).toHaveLength(3);
    expect(screen.getByText('N')).toHaveAttribute(
      'data-slot',
      'command-shortcut',
    );

    // The separator is presentational, so the listbox holds only valid children.
    const separator = () =>
      container.querySelector('[data-slot="command-separator"]');
    expect(separator()).toHaveAttribute('role', 'none');

    const input = screen.getByPlaceholderText('Search commands');
    await user.type(input, 'theme');
    expect(separator()).toBeNull();
    expect(screen.getAllByRole('option').map((o) => o.textContent)).toEqual([
      'Toggle theme',
    ]);

    await user.clear(input);
    await user.type(input, 'zzz');
    expect(screen.getByText('No results.')).toBeInTheDocument();
  });

  it('runs onSelect from a click and from Enter', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(
      <Command>
        <Palette onSelect={onSelect} />
      </Command>,
    );

    await user.click(screen.getByRole('option', { name: 'Search notes' }));
    expect(onSelect).toHaveBeenLastCalledWith('Search notes');

    await user.type(screen.getByPlaceholderText('Search commands'), 'toggle');
    await user.keyboard('{Enter}');
    expect(onSelect).toHaveBeenLastCalledWith('Toggle theme');
  });

  it('renders inside a dialog with a hidden title', async () => {
    render(
      <CommandDialog open title="Command menu">
        <Command>
          <Palette />
        </Command>
      </CommandDialog>,
    );

    const dialog = await screen.findByRole('dialog');
    expect(dialog).toHaveAttribute('data-slot', 'dialog-content');
    expect(screen.getByText('Command menu')).toHaveAttribute(
      'data-slot',
      'dialog-title',
    );
    expect(screen.getAllByRole('option')).toHaveLength(3);
  });
});
