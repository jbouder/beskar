import type { Meta, StoryObj } from '@storybook/react-vite';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const PRIORITIES = [
  { label: 'Low', value: 'low' },
  { label: 'Medium', value: 'medium' },
  { label: 'High', value: 'high' },
  { label: 'Urgent', value: 'urgent' },
];

type SelectStoryArgs = {
  /** Story-only: mounts the list already open. */
  defaultOpen: boolean;
  /** `SelectTrigger` height. */
  size: 'default' | 'sm';
  disabled: boolean;
  /** Story-only: starts with no value, so the placeholder shows. */
  empty: boolean;
};

function SelectExample({
  defaultOpen,
  size,
  disabled,
  empty,
}: SelectStoryArgs) {
  return (
    <div className="grid gap-2">
      <Label id="priority-label">Priority</Label>
      <Select
        defaultOpen={defaultOpen}
        defaultValue={empty ? null : 'medium'}
        disabled={disabled}
        items={PRIORITIES}
      >
        <SelectTrigger
          aria-labelledby="priority-label"
          className="w-44"
          size={size}
        >
          <SelectValue placeholder="Pick a priority" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Routine</SelectLabel>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
          </SelectGroup>
          <SelectSeparator />
          <SelectGroup>
            <SelectLabel>Needs attention</SelectLabel>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="urgent">Urgent</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}

const meta = {
  title: 'Components/Select',
  component: SelectExample,
  parameters: { layout: 'centered' },
  args: { defaultOpen: false, size: 'default', disabled: false, empty: false },
  argTypes: {
    defaultOpen: { control: 'boolean' },
    size: {
      control: 'inline-radio',
      options: ['default', 'sm'],
      table: { defaultValue: { summary: 'default' } },
    },
    disabled: { control: 'boolean' },
    empty: { control: 'boolean' },
  },
  decorators: [
    // `defaultOpen` and the starting value are mount-only, so remount on change.
    (Story, { args }) => (
      <div className="px-24 pt-8 pb-56">
        <Story key={`${args.defaultOpen}-${args.empty}`} />
      </div>
    ),
  ],
} satisfies Meta<typeof SelectExample>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Pick one option from a short, fixed list. Pass `items` to the root so the
 * trigger can show the selected label. For a long or searchable list, use a
 * combobox.
 */
export const Default: Story = {};

export const Open: Story = {
  args: { defaultOpen: true },
  parameters: { controls: { include: ['size'] } },
};

export const Placeholder: Story = {
  args: { empty: true },
  parameters: { controls: { include: ['size', 'disabled'] } },
};

export const Small: Story = {
  args: { size: 'sm' },
  parameters: { controls: { include: [] } },
};

export const Disabled: Story = {
  args: { disabled: true },
  parameters: { controls: { include: [] } },
};
