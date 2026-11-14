import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxCollection,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
  ComboboxSeparator,
  ComboboxValue,
  useComboboxAnchor,
} from '@/components/ui/combobox';

const APPS = ['Holocron', 'Holotable', 'Datapad', 'Acolyte', 'Pulse'];

function Single(props: { onValueChange?: (value: unknown) => void }) {
  return (
    <Combobox items={APPS} onValueChange={props.onValueChange}>
      <ComboboxInput aria-label="App" placeholder="Pick an app" showClear />
      <ComboboxContent>
        <ComboboxEmpty>No apps found.</ComboboxEmpty>
        <ComboboxList>
          {(item: string) => (
            <ComboboxItem key={item} value={item}>
              {item}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}

const GROUPS = [
  { label: 'Live', items: ['Holocron', 'Datapad'] },
  { label: 'Building', items: ['Beskar'] },
];

function Multiple() {
  const anchor = useComboboxAnchor();
  return (
    <Combobox defaultValue={['Holocron']} items={GROUPS} multiple>
      <ComboboxChips ref={anchor}>
        <ComboboxValue>
          {(values: string[]) => (
            <>
              {values.map((value) => (
                <ComboboxChip key={value}>{value}</ComboboxChip>
              ))}
              <ComboboxChipsInput aria-label="Apps" />
            </>
          )}
        </ComboboxValue>
      </ComboboxChips>
      <ComboboxContent anchor={anchor}>
        <ComboboxList>
          {(group: (typeof GROUPS)[number], index: number) => (
            <ComboboxGroup items={group.items} key={group.label}>
              {index > 0 ? <ComboboxSeparator /> : null}
              <ComboboxLabel>{group.label}</ComboboxLabel>
              <ComboboxCollection>
                {(item: string) => (
                  <ComboboxItem key={item} value={item}>
                    {item}
                  </ComboboxItem>
                )}
              </ComboboxCollection>
            </ComboboxGroup>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}

describe('Combobox', () => {
  it('filters as you type and selects an option', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Single onValueChange={onValueChange} />);

    const input = screen.getByRole('combobox', { name: 'App' });
    // The caret is named, and out of the tab order: the input opens the list.
    expect(
      screen.getByRole('button', { name: 'Show options' }),
    ).toHaveAttribute('tabindex', '-1');

    await user.click(input);
    expect(await screen.findAllByRole('option')).toHaveLength(5);

    await user.type(input, 'holo');
    expect(screen.getAllByRole('option').map((o) => o.textContent)).toEqual([
      'Holocron',
      'Holotable',
    ]);

    await user.click(screen.getByRole('option', { name: 'Holotable' }));
    expect(onValueChange).toHaveBeenLastCalledWith(
      'Holotable',
      expect.anything(),
    );
    expect(input).toHaveValue('Holotable');
  });

  it('shows the empty state when nothing matches', async () => {
    const user = userEvent.setup();
    render(<Single />);

    await user.type(screen.getByRole('combobox', { name: 'App' }), 'zzz');
    expect(await screen.findByText('No apps found.')).toHaveAttribute(
      'data-slot',
      'combobox-empty',
    );
  });

  it('supports multiple selection with chips and groups', async () => {
    const user = userEvent.setup();
    const { container } = render(<Multiple />);

    expect(
      container.querySelector('[data-slot="combobox-chip"]'),
    ).toHaveTextContent('Holocron');

    await user.click(screen.getByRole('combobox', { name: 'Apps' }));
    await user.click(await screen.findByRole('option', { name: 'Beskar' }));
    expect(
      container.querySelectorAll('[data-slot="combobox-chip"]'),
    ).toHaveLength(2);
    expect(screen.getByText('Building')).toHaveAttribute(
      'data-slot',
      'combobox-label',
    );
    expect(
      document.querySelector('[data-slot="combobox-separator"]'),
    ).not.toBeNull();

    // Multiple selection keeps the list open. Close it to reach the chips.
    await user.keyboard('{Escape}');
    await user.click(
      await screen.findByRole('button', { name: 'Remove Holocron' }),
    );
    expect(
      container.querySelectorAll('[data-slot="combobox-chip"]'),
    ).toHaveLength(1);
  });
});
