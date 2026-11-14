import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge } from '@/components/ui/badge';
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

const ROWS = [
  { id: 'INV-001', status: 'Paid', method: 'Card', amount: 250 },
  { id: 'INV-002', status: 'Pending', method: 'Transfer', amount: 150 },
  { id: 'INV-003', status: 'Paid', method: 'Card', amount: 350 },
  { id: 'INV-004', status: 'Overdue', method: 'Transfer', amount: 450 },
];

const meta = {
  title: 'Components/Table',
  component: Table,
  parameters: { layout: 'centered' },
  decorators: [
    (Story) => (
      <div className="w-[32rem] max-w-[calc(100vw-2rem)]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Table>;

export default meta;

type Story = StoryObj<typeof meta>;

/** The table scrolls sideways inside its own container on narrow screens. */
export const Default: Story = {
  render: () => (
    <Table>
      <TableCaption>Invoices from the last 30 days.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Invoice</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Method</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {ROWS.map((row) => (
          <TableRow key={row.id}>
            <TableCell className="font-medium">{row.id}</TableCell>
            <TableCell>
              <Badge variant={row.status === 'Paid' ? 'secondary' : 'outline'}>
                {row.status}
              </Badge>
            </TableCell>
            <TableCell>{row.method}</TableCell>
            <TableCell className="text-right tabular-nums">
              ${row.amount.toFixed(2)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell className="text-right tabular-nums">$1,200.00</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  ),
};

/** Mark a selected row with `data-state="selected"`. */
export const SelectedRow: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Invoice</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {ROWS.slice(0, 3).map((row, index) => (
          <TableRow
            aria-selected={index === 1}
            data-state={index === 1 ? 'selected' : undefined}
            key={row.id}
          >
            <TableCell className="font-medium">{row.id}</TableCell>
            <TableCell className="text-right tabular-nums">
              ${row.amount.toFixed(2)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};
