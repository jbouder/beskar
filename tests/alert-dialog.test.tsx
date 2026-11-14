import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

function Example(props: { onConfirm?: () => void; size?: 'default' | 'sm' }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger>Delete</AlertDialogTrigger>
      <AlertDialogContent size={props.size}>
        <AlertDialogHeader>
          <AlertDialogMedia>!</AlertDialogMedia>
          <AlertDialogTitle>Delete this note?</AlertDialogTitle>
          <AlertDialogDescription>
            This cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={props.onConfirm}>
            Delete note
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

describe('AlertDialog', () => {
  it('opens as an alertdialog with a title and description', async () => {
    const user = userEvent.setup();
    render(<Example size="sm" />);

    await user.click(screen.getByRole('button', { name: 'Delete' }));
    const dialog = await screen.findByRole('alertdialog', {
      name: 'Delete this note?',
    });
    expect(dialog).toHaveAttribute('data-slot', 'alert-dialog-content');
    expect(dialog).toHaveAttribute('data-size', 'sm');
    expect(dialog).toHaveAccessibleDescription('This cannot be undone.');
    expect(
      dialog.querySelector('[data-slot="alert-dialog-media"]'),
    ).toHaveTextContent('!');
    expect(
      document.querySelector('[data-slot="alert-dialog-overlay"]'),
    ).not.toBeNull();
  });

  it('closes from Cancel, which defaults to the outline variant', async () => {
    const user = userEvent.setup();
    render(<Example />);

    await user.click(screen.getByRole('button', { name: 'Delete' }));
    await screen.findByRole('alertdialog');

    const cancel = screen.getByRole('button', { name: 'Cancel' });
    expect(cancel).toHaveAttribute('data-variant', 'outline');
    await user.click(cancel);
    await waitFor(() =>
      expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument(),
    );
  });

  it('runs the action handler', async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    render(<Example onConfirm={onConfirm} />);

    await user.click(screen.getByRole('button', { name: 'Delete' }));
    const action = await screen.findByRole('button', { name: 'Delete note' });
    expect(action).toHaveAttribute('data-slot', 'alert-dialog-action');
    await user.click(action);
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });
});
