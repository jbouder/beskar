import type { Meta, StoryObj } from '@storybook/react-vite';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const meta = {
  title: 'Components/Textarea',
  component: Textarea,
  parameters: { layout: 'centered' },
  args: {
    'aria-label': 'Notes',
    placeholder: 'What happened today?',
    disabled: false,
  },
  argTypes: {
    placeholder: { control: 'text' },
    disabled: {
      control: 'boolean',
      table: { defaultValue: { summary: 'false' } },
    },
    'aria-invalid': { control: 'boolean' },
    'aria-label': { control: 'text' },
    className: { table: { disable: true } },
  },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Textarea>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Grows with its content, from a three-line minimum. */
export const Default: Story = {};

export const WithLabel: Story = {
  parameters: { controls: { include: ['disabled', 'placeholder'] } },
  render: (args) => (
    <div className="grid gap-2">
      <Label htmlFor="summary">Summary</Label>
      <Textarea {...args} aria-label={undefined} id="summary" />
    </div>
  ),
};

export const Invalid: Story = {
  args: { 'aria-invalid': true, defaultValue: 'Too short.' },
  parameters: { controls: { include: [] } },
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: 'Locked while the meeting is live.' },
  parameters: { controls: { include: [] } },
};
