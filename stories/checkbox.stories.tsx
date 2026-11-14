import type { Meta, StoryObj } from '@storybook/react-vite';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

const meta = {
  title: 'Components/Checkbox',
  component: Checkbox,
  parameters: { layout: 'centered' },
  args: {
    'aria-label': 'Mark as done',
    defaultChecked: true,
    disabled: false,
  },
  argTypes: {
    defaultChecked: {
      description: 'Initial state when uncontrolled.',
      control: 'boolean',
      table: { defaultValue: { summary: 'false' } },
    },
    checked: {
      description: 'Controlled state. Pair it with `onCheckedChange`.',
      control: false,
    },
    disabled: {
      control: 'boolean',
      table: { defaultValue: { summary: 'false' } },
    },
    'aria-label': {
      description: 'Accessible name when there is no visible label.',
      control: 'text',
    },
    onCheckedChange: { action: 'checked changed', control: false },
    className: { table: { disable: true } },
  },
  decorators: [
    // `defaultChecked` is mount-only, so remount when it changes.
    (Story, { args }) => <Story key={String(args.defaultChecked)} />,
  ],
} satisfies Meta<typeof Checkbox>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithLabel: Story = {
  parameters: { controls: { include: ['defaultChecked', 'disabled'] } },
  render: (args) => (
    <div className="flex items-center gap-2">
      <Checkbox {...args} aria-label={undefined} id="terms" />
      <Label htmlFor="terms">Keep me signed in</Label>
    </div>
  ),
};

export const Unchecked: Story = {
  args: { defaultChecked: false },
  parameters: { controls: { include: [] } },
};

export const Disabled: Story = {
  args: { disabled: true },
  parameters: { controls: { include: ['defaultChecked'] } },
};
