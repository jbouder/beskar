import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

function Example(props: { onRename?: () => void }) {
  const [pinned, setPinned] = useState(false);
  const [sort, setSort] = useState('recent');
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>Options</DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel inset>Note</DropdownMenuLabel>
          <DropdownMenuItem inset onClick={props.onRename}>
            Rename
            <DropdownMenuShortcut>R</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem checked={pinned} onCheckedChange={setPinned}>
          Pinned
        </DropdownMenuCheckboxItem>
        <DropdownMenuRadioGroup onValueChange={setSort} value={sort}>
          <DropdownMenuRadioItem value="recent">Recent</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="name">Name</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Move to</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem>Archive</DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

describe('DropdownMenu', () => {
  it('opens a menu with labelled, slotted parts', async () => {
    const user = userEvent.setup();
    render(<Example />);

    await user.click(screen.getByRole('button', { name: 'Options' }));
    const menu = await screen.findByRole('menu');
    expect(menu).toHaveAttribute('data-slot', 'dropdown-menu-content');
    expect(menu).toHaveClass('w-56');

    expect(screen.getByText('Note')).toHaveAttribute(
      'data-slot',
      'dropdown-menu-label',
    );
    expect(screen.getByText('R')).toHaveAttribute(
      'data-slot',
      'dropdown-menu-shortcut',
    );
    expect(screen.getByRole('menuitem', { name: 'Delete' })).toHaveAttribute(
      'data-variant',
      'destructive',
    );
    expect(
      menu.querySelector('[data-slot="dropdown-menu-separator"]'),
    ).not.toBeNull();
  });

  it('runs an item handler and closes', async () => {
    const user = userEvent.setup();
    const onRename = vi.fn();
    render(<Example onRename={onRename} />);

    await user.click(screen.getByRole('button', { name: 'Options' }));
    await user.click(await screen.findByRole('menuitem', { name: /Rename/ }));
    expect(onRename).toHaveBeenCalledTimes(1);
    await waitFor(() =>
      expect(screen.queryByRole('menu')).not.toBeInTheDocument(),
    );
  });

  it('toggles a checkbox item and picks a radio item', async () => {
    const user = userEvent.setup();
    render(<Example />);

    await user.click(screen.getByRole('button', { name: 'Options' }));
    const pinned = await screen.findByRole('menuitemcheckbox', {
      name: 'Pinned',
    });
    expect(pinned).toHaveAttribute('aria-checked', 'false');
    await user.click(pinned);
    expect(pinned).toHaveAttribute('aria-checked', 'true');

    const name = screen.getByRole('menuitemradio', { name: 'Name' });
    await user.click(name);
    expect(name).toHaveAttribute('aria-checked', 'true');
    expect(
      screen.getByRole('menuitemradio', { name: 'Recent' }),
    ).toHaveAttribute('aria-checked', 'false');
  });

  it('opens a submenu from the keyboard', async () => {
    const user = userEvent.setup();
    render(<Example />);

    await user.click(screen.getByRole('button', { name: 'Options' }));
    const sub = await screen.findByRole('menuitem', { name: 'Move to' });
    expect(sub).toHaveAttribute('data-slot', 'dropdown-menu-sub-trigger');
    sub.focus();
    await user.keyboard('{ArrowRight}');
    expect(
      await screen.findByRole('menuitem', { name: 'Archive' }),
    ).toBeInTheDocument();
  });
});
