import type { Meta, StoryObj } from '@storybook/react-vite';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const meta = {
  title: 'Components/Input',
  component: Input,
  parameters: { layout: 'centered' },
  args: {
    'aria-label': 'Project name',
    placeholder: 'Project name',
    type: 'text',
    disabled: false,
  },
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'search', 'file'],
      table: { defaultValue: { summary: 'text' } },
    },
    placeholder: { control: 'text' },
    disabled: {
      control: 'boolean',
      table: { defaultValue: { summary: 'false' } },
    },
    'aria-invalid': {
      description: 'Marks the field as invalid and turns the border red.',
      control: 'boolean',
    },
    'aria-label': {
      description:
        'Accessible name for a field with no visible label. Prefer a `Label`.',
      control: 'text',
    },
    className: { table: { disable: true } },
  },
  decorators: [
    (Story) => (
      <div className="w-72">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Input>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithLabel: Story = {
  parameters: { controls: { include: ['disabled', 'placeholder'] } },
  render: (args) => (
    <div className="grid gap-2">
      <Label htmlFor="email">Email</Label>
      <Input
        {...args}
        aria-label={undefined}
        id="email"
        placeholder="you@example.com"
        type="email"
      />
    </div>
  ),
};

export const Invalid: Story = {
  parameters: { controls: { include: [] } },
  render: (args) => (
    <div className="grid gap-2">
      <Label htmlFor="slug">Slug</Label>
      <Input
        {...args}
        aria-describedby="slug-error"
        aria-invalid
        aria-label={undefined}
        defaultValue="my project"
        id="slug"
      />
      <p className="text-destructive text-xs" id="slug-error">
        Use letters, numbers, and dashes only.
      </p>
    </div>
  ),
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: 'Read only for now' },
  parameters: { controls: { include: [] } },
};

export const File: Story = {
  args: { type: 'file', 'aria-label': 'Attachment' },
  parameters: { controls: { include: ['disabled'] } },
};
