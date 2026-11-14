import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

function Example(props: {
  side?: 'top' | 'right' | 'bottom' | 'left';
  showCloseButton?: boolean;
}) {
  return (
    <Sheet>
      <SheetTrigger>Filters</SheetTrigger>
      <SheetContent showCloseButton={props.showCloseButton} side={props.side}>
        <SheetHeader>
          <SheetTitle>Filters</SheetTitle>
          <SheetDescription>Narrow the list.</SheetDescription>
        </SheetHeader>
        <SheetFooter>
          <SheetClose>Apply</SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

describe('Sheet', () => {
  it('opens on the right by default and closes from the corner button', async () => {
    const user = userEvent.setup();
    render(<Example />);

    await user.click(screen.getByRole('button', { name: 'Filters' }));
    const sheet = await screen.findByRole('dialog', { name: 'Filters' });
    expect(sheet).toHaveAttribute('data-slot', 'sheet-content');
    expect(sheet).toHaveAttribute('data-side', 'right');
    expect(sheet).toHaveAccessibleDescription('Narrow the list.');
    expect(
      document.querySelector('[data-slot="sheet-overlay"]'),
    ).not.toBeNull();

    await user.click(screen.getByRole('button', { name: 'Close' }));
    await waitFor(() =>
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument(),
    );
  });

  it.each(['top', 'bottom', 'left'] as const)(
    'opens on the %s',
    async (side) => {
      const user = userEvent.setup();
      render(<Example showCloseButton={false} side={side} />);

      await user.click(screen.getByRole('button', { name: 'Filters' }));
      const sheet = await screen.findByRole('dialog');
      expect(sheet).toHaveAttribute('data-side', side);
      expect(
        sheet.querySelector('[data-slot="sheet-close"]'),
      ).toHaveTextContent('Apply');

      await user.click(screen.getByRole('button', { name: 'Apply' }));
      await waitFor(() =>
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument(),
      );
    },
  );
});
