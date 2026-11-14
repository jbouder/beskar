import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

describe('Table', () => {
  it('renders a semantic table inside a scroll container', () => {
    render(
      <Table className="w-64">
        <TableCaption>Invoices</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Invoice</TableHead>
            <TableHead>Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow data-state="selected">
            <TableCell>INV-001</TableCell>
            <TableCell>$250.00</TableCell>
          </TableRow>
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell>Total</TableCell>
            <TableCell>$250.00</TableCell>
          </TableRow>
        </TableFooter>
      </Table>,
    );

    const table = screen.getByRole('table', { name: 'Invoices' });
    expect(table).toHaveAttribute('data-slot', 'table');
    expect(table).toHaveClass('w-64');
    expect(table.parentElement).toHaveAttribute('data-slot', 'table-container');
    expect(table.parentElement).toHaveClass('overflow-x-auto');

    expect(screen.getAllByRole('columnheader')).toHaveLength(2);
    expect(screen.getAllByRole('row')).toHaveLength(3);
    expect(screen.getByRole('cell', { name: 'INV-001' })).toHaveAttribute(
      'data-slot',
      'table-cell',
    );
    expect(screen.getByText('Invoices')).toHaveAttribute(
      'data-slot',
      'table-caption',
    );
    expect(table.querySelector('thead')).toHaveAttribute(
      'data-slot',
      'table-header',
    );
    expect(table.querySelector('tbody')).toHaveAttribute(
      'data-slot',
      'table-body',
    );
    expect(table.querySelector('tfoot')).toHaveAttribute(
      'data-slot',
      'table-footer',
    );
    expect(screen.getAllByRole('row')[1]).toHaveClass(
      'data-[state=selected]:bg-muted',
    );
  });
});
