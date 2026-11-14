import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import type { DateRange } from 'react-day-picker';
import { Calendar } from '@/components/ui/calendar';

// A fixed month keeps the story, and its screenshot, the same every day.
const MONTH = new Date(2026, 10, 1);

const meta = {
  title: 'Components/Calendar',
  component: Calendar,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Calendar>;

export default meta;

type Story = StoryObj<typeof meta>;

function SingleExample() {
  const [date, setDate] = useState<Date | undefined>(new Date(2026, 10, 14));
  return (
    <Calendar
      className="border"
      defaultMonth={MONTH}
      mode="single"
      onSelect={setDate}
      selected={date}
    />
  );
}

/** Arrow keys move between days. Page Up and Page Down change the month. */
export const Single: Story = { render: () => <SingleExample /> };

function RangeExample() {
  const [range, setRange] = useState<DateRange | undefined>({
    from: new Date(2026, 10, 9),
    to: new Date(2026, 10, 18),
  });
  return (
    <Calendar
      className="border"
      defaultMonth={MONTH}
      mode="range"
      onSelect={setRange}
      selected={range}
    />
  );
}

export const Range: Story = { render: () => <RangeExample /> };

/** `captionLayout="dropdown"` swaps the month label for month and year pickers. */
export const WithDropdowns: Story = {
  render: () => (
    <Calendar
      captionLayout="dropdown"
      className="border"
      defaultMonth={MONTH}
      endMonth={new Date(2030, 11)}
      mode="single"
      startMonth={new Date(2020, 0)}
    />
  ),
};

export const DisabledDays: Story = {
  render: () => (
    <Calendar
      className="border"
      defaultMonth={MONTH}
      disabled={{ dayOfWeek: [0, 6] }}
      mode="single"
    />
  ),
};
