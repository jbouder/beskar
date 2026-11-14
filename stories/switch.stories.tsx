import type { Meta, StoryObj } from '@storybook/react-vite';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

const meta = {
  title: 'Components/Switch',
  component: Switch,
  parameters: { layout: 'centered' },
  args: {
    'aria-label': 'Reduce motion',
    defaultChecked: true,
    size: 'default',
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
    size: {
      control: 'inline-radio',
      options: ['default', 'sm'],
      table: { defaultValue: { summary: 'default' } },
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
} satisfies Meta<typeof Switch>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithLabel: Story = {
  parameters: { controls: { include: ['defaultChecked', 'size', 'disabled'] } },
  render: (args) => (
    <div className="flex items-center gap-2">
      <Switch {...args} aria-label={undefined} id="compact" />
      <Label htmlFor="compact">Compact rows</Label>
    </div>
  ),
};

export const Off: Story = {
  args: { defaultChecked: false },
  parameters: { controls: { include: [] } },
};

export const Small: Story = {
  args: { size: 'sm' },
  parameters: { controls: { include: ['defaultChecked'] } },
};

export const Disabled: Story = {
  args: { disabled: true },
  parameters: { controls: { include: ['defaultChecked'] } },
};
