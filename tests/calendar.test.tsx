import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Calendar } from '@/components/ui/calendar';

const MONTH = new Date(2026, 10, 1);

describe('Calendar', () => {
  it('renders the month grid and selects a day on click', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    const { container } = render(
      <Calendar defaultMonth={MONTH} mode="single" onSelect={onSelect} />,
    );

    expect(
      container.querySelector('[data-slot="calendar"]'),
    ).toBeInTheDocument();
    expect(screen.getByText('November 2026')).toBeInTheDocument();

    const grid = screen.getByRole('grid');
    const day = within(grid).getByRole('button', { name: /November 14, 2026/ });
    await user.click(day);

    expect(onSelect).toHaveBeenCalledTimes(1);
    const selected = onSelect.mock.calls[0][0] as Date;
    expect(selected.getDate()).toBe(14);
    expect(selected.getMonth()).toBe(10);
  });

  it('names each day with the visible number, today, and selection', () => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date(2026, 10, 14, 12));
    render(
      <Calendar
        defaultMonth={MONTH}
        mode="single"
        selected={new Date(2026, 10, 14)}
      />,
    );
    vi.useRealTimers();

    expect(
      screen.getByRole('button', {
        name: 'Today, Saturday, November 14, 2026, selected',
      }),
    ).toHaveTextContent('14');
    expect(
      screen.getByRole('button', { name: 'Sunday, November 1, 2026' }),
    ).toHaveTextContent('1');
  });

  it('marks a selected single day', () => {
    const { container } = render(
      <Calendar
        defaultMonth={MONTH}
        mode="single"
        selected={new Date(2026, 10, 14)}
      />,
    );

    const selected = container.querySelector('[data-selected-single="true"]');
    expect(selected).toHaveTextContent('14');
  });

  it('marks the start, middle, and end of a range', () => {
    const { container } = render(
      <Calendar
        defaultMonth={MONTH}
        mode="range"
        selected={{ from: new Date(2026, 10, 9), to: new Date(2026, 10, 11) }}
      />,
    );

    expect(
      container.querySelector('[data-range-start="true"]'),
    ).toHaveTextContent('9');
    expect(
      container.querySelector('[data-range-middle="true"]'),
    ).toHaveTextContent('10');
    expect(
      container.querySelector('[data-range-end="true"]'),
    ).toHaveTextContent('11');
  });

  it('moves to the next and previous month', async () => {
    const user = userEvent.setup();
    render(<Calendar defaultMonth={MONTH} mode="single" />);

    await user.click(screen.getByRole('button', { name: /next month/i }));
    expect(screen.getByText('December 2026')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /previous month/i }));
    await user.click(screen.getByRole('button', { name: /previous month/i }));
    expect(screen.getByText('October 2026')).toBeInTheDocument();
  });

  it('moves focus between days with the arrow keys', async () => {
    const user = userEvent.setup();
    render(<Calendar defaultMonth={MONTH} mode="single" />);

    screen.getByRole('button', { name: /November 14, 2026/ }).focus();
    await user.keyboard('{ArrowRight}');
    expect(
      screen.getByRole('button', { name: /November 15, 2026/ }),
    ).toHaveFocus();
  });

  it('renders month and year dropdowns and week numbers', () => {
    render(
      <Calendar
        captionLayout="dropdown"
        defaultMonth={MONTH}
        endMonth={new Date(2027, 11)}
        mode="single"
        showWeekNumber
        startMonth={new Date(2025, 0)}
      />,
    );

    const month = screen.getByRole('combobox', { name: /month/i });
    expect(within(month).getByRole('option', { name: 'Nov' })).toBeVisible();
    expect(screen.getByRole('combobox', { name: /year/i })).toHaveValue('2026');
    expect(screen.getAllByRole('rowheader').length).toBeGreaterThan(3);
  });
});
