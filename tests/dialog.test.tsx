import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

function Example(props: { showCloseButton?: boolean; footerClose?: boolean }) {
  return (
    <Dialog>
      <DialogTrigger>Rename</DialogTrigger>
      <DialogContent
        className="max-w-md"
        showCloseButton={props.showCloseButton}
      >
        <DialogHeader>
          <DialogTitle>Rename project</DialogTitle>
          <DialogDescription>Pick a short name.</DialogDescription>
        </DialogHeader>
        <DialogFooter showCloseButton={props.footerClose}>
          <DialogClose>Done</DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

describe('Dialog', () => {
  it('opens from the trigger with a labelled, described dialog', async () => {
    const user = userEvent.setup();
    render(<Example />);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Rename' }));

    const dialog = await screen.findByRole('dialog', {
      name: 'Rename project',
    });
    expect(dialog).toHaveAttribute('data-slot', 'dialog-content');
    expect(dialog).toHaveClass('bg-popover', 'max-w-md');
    expect(dialog).toHaveAccessibleDescription('Pick a short name.');
    expect(
      document.querySelector('[data-slot="dialog-overlay"]'),
    ).not.toBeNull();
    for (const slot of ['dialog-header', 'dialog-footer', 'dialog-title']) {
      expect(dialog.querySelector(`[data-slot="${slot}"]`)).not.toBeNull();
    }
  });

  it('closes from the corner button and on Escape', async () => {
    const user = userEvent.setup();
    render(<Example />);

    await user.click(screen.getByRole('button', { name: 'Rename' }));
    await user.click(await screen.findByRole('button', { name: 'Close' }));
    await waitFor(() =>
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument(),
    );

    await user.click(screen.getByRole('button', { name: 'Rename' }));
    await screen.findByRole('dialog');
    await user.keyboard('{Escape}');
    await waitFor(() =>
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument(),
    );
  });

  it('can hide the corner button and show a footer Close instead', async () => {
    const user = userEvent.setup();
    const { unmount } = render(<Example showCloseButton={false} />);

    await user.click(screen.getByRole('button', { name: 'Rename' }));
    await screen.findByRole('dialog');
    expect(
      screen.queryByRole('button', { name: 'Close' }),
    ).not.toBeInTheDocument();
    unmount();

    render(<Example footerClose showCloseButton={false} />);
    await user.click(screen.getByRole('button', { name: 'Rename' }));
    await user.click(await screen.findByRole('button', { name: 'Close' }));
    await waitFor(() =>
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument(),
    );
  });
});
