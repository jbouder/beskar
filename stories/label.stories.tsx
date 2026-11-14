import type { Meta, StoryObj } from '@storybook/react-vite';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const meta = {
  title: 'Components/Label',
  component: Label,
  parameters: { layout: 'centered' },
  args: { children: 'Display name' },
  argTypes: {
    children: { control: 'text' },
    htmlFor: {
      description: 'The `id` of the control this label names.',
      control: false,
    },
    className: { table: { disable: true } },
  },
} satisfies Meta<typeof Label>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div className="grid w-72 gap-2">
      <Label {...args} htmlFor="display-name" />
      <Input id="display-name" />
    </div>
  ),
};

/** Wrap a checkbox in the label, or point `htmlFor` at it, so the text is clickable. */
export const WithCheckbox: Story = {
  args: { children: 'Email me when a deploy fails' },
  render: (args) => (
    <div className="flex items-center gap-2">
      <Checkbox id="notify" />
      <Label {...args} htmlFor="notify" />
    </div>
  ),
};
