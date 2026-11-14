import { TextBIcon } from '@phosphor-icons/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Toggle } from '@/components/ui/toggle';

const meta = {
  title: 'Components/Toggle',
  component: Toggle,
  parameters: { layout: 'centered' },
  args: { variant: 'default', size: 'default', disabled: false },
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: ['default', 'outline'],
      table: { defaultValue: { summary: 'default' } },
    },
    size: {
      control: 'inline-radio',
      options: ['sm', 'default', 'lg'],
      table: { defaultValue: { summary: 'default' } },
    },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof Toggle>;

export default meta;

type Story = StoryObj<typeof meta>;

/** An icon-only toggle needs an `aria-label`. */
export const Default: Story = {
  render: (args) => (
    <Toggle aria-label="Bold" {...args}>
      <TextBIcon aria-hidden="true" />
    </Toggle>
  ),
};

export const Pressed: Story = {
  render: (args) => (
    <Toggle aria-label="Bold" defaultPressed {...args}>
      <TextBIcon aria-hidden="true" />
    </Toggle>
  ),
};

export const Outline: Story = {
  args: { variant: 'outline' },
  render: (args) => (
    <Toggle {...args}>
      <TextBIcon aria-hidden="true" data-icon="inline-start" />
      Bold
    </Toggle>
  ),
};

export const Disabled: Story = {
  args: { disabled: true },
  render: (args) => (
    <Toggle aria-label="Bold" {...args}>
      <TextBIcon aria-hidden="true" />
    </Toggle>
  ),
};
