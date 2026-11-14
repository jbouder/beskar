import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

function Example(props: {
  variant?: 'default' | 'line';
  orientation?: 'horizontal' | 'vertical';
}) {
  return (
    <Tabs defaultValue="notes" orientation={props.orientation}>
      <TabsList variant={props.variant}>
        <TabsTrigger value="notes">Notes</TabsTrigger>
        <TabsTrigger value="tasks">Tasks</TabsTrigger>
        <TabsTrigger disabled value="files">
          Files
        </TabsTrigger>
      </TabsList>
      <TabsContent value="notes">Notes panel</TabsContent>
      <TabsContent value="tasks">Tasks panel</TabsContent>
      <TabsContent value="files">Files panel</TabsContent>
    </Tabs>
  );
}

describe('Tabs', () => {
  it('shows the default panel and switches on click', async () => {
    const user = userEvent.setup();
    render(<Example />);

    expect(screen.getByRole('tab', { name: 'Notes' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Notes panel');

    await user.click(screen.getByRole('tab', { name: 'Tasks' }));
    expect(screen.getByRole('tab', { name: 'Tasks' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Tasks panel');
  });

  it('moves between tabs with the arrow keys', async () => {
    const user = userEvent.setup();
    render(<Example />);

    screen.getByRole('tab', { name: 'Notes' }).focus();
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'Tasks' })).toHaveFocus();
  });

  it('sets slots, the list variant, and orientation', () => {
    const { container } = render(
      <Example orientation="vertical" variant="line" />,
    );

    const root = container.querySelector('[data-slot="tabs"]');
    expect(root).toHaveAttribute('data-orientation', 'vertical');

    const list = screen.getByRole('tablist');
    expect(list).toHaveAttribute('data-slot', 'tabs-list');
    expect(list).toHaveAttribute('data-variant', 'line');
    expect(screen.getByRole('tab', { name: 'Notes' })).toHaveAttribute(
      'data-slot',
      'tabs-trigger',
    );
    expect(screen.getByRole('tabpanel')).toHaveAttribute(
      'data-slot',
      'tabs-content',
    );
  });
});
