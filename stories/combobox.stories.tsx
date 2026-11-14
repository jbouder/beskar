import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from '@/components/ui/combobox';
import { Label } from '@/components/ui/label';

const APPS = ['Acolyte', 'Beskar', 'Datapad', 'Holocron', 'Holotable', 'Pulse'];

type ComboboxStoryArgs = {
  /** Story-only: mounts the list already open. */
  defaultOpen: boolean;
  /** `ComboboxInput`: a button that clears the value. */
  showClear: boolean;
  disabled: boolean;
};

function ComboboxExample({
  defaultOpen,
  showClear,
  disabled,
}: ComboboxStoryArgs) {
  return (
    <div className="grid w-60 gap-2">
      <Label htmlFor="app">App</Label>
      <Combobox defaultOpen={defaultOpen} disabled={disabled} items={APPS}>
        <ComboboxInput
          disabled={disabled}
          id="app"
          placeholder="Pick an app"
          showClear={showClear}
        />
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
    </div>
  );
}

function MultipleExample() {
  const anchor = useComboboxAnchor();
  return (
    <div className="grid w-72 gap-2">
      <Label htmlFor="apps">Apps</Label>
      <Combobox defaultValue={['Holocron', 'Datapad']} items={APPS} multiple>
        <ComboboxChips ref={anchor}>
          <ComboboxValue>
            {(values: string[]) => (
              <>
                {values.map((value) => (
                  <ComboboxChip key={value}>{value}</ComboboxChip>
                ))}
                <ComboboxChipsInput id="apps" />
              </>
            )}
          </ComboboxValue>
        </ComboboxChips>
        <ComboboxContent anchor={anchor}>
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
    </div>
  );
}

const meta = {
  title: 'Components/Combobox',
  component: ComboboxExample,
  parameters: { layout: 'centered' },
  args: { defaultOpen: false, showClear: false, disabled: false },
  argTypes: {
    defaultOpen: { control: 'boolean' },
    showClear: {
      control: 'boolean',
      table: { defaultValue: { summary: 'false' } },
    },
    disabled: { control: 'boolean' },
  },
  decorators: [
    // `defaultOpen` is mount-only, so remount when it changes.
    (Story, { args }) => (
      <div className="px-24 pt-8 pb-64">
        <Story key={String(args.defaultOpen)} />
      </div>
    ),
  ],
} satisfies Meta<typeof ComboboxExample>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * A text field that filters a list as you type. Use it when the list is long
 * or the person already knows what they are looking for.
 */
export const Default: Story = {};

export const Open: Story = {
  args: { defaultOpen: true },
  parameters: { controls: { include: ['showClear'] } },
};

export const Disabled: Story = {
  args: { disabled: true },
  parameters: { controls: { include: [] } },
};

/** Selected values show as chips. Backspace removes the last one. */
export const Multiple: Story = {
  parameters: { controls: { include: [] } },
  render: () => <MultipleExample />,
};
