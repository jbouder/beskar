import {
  TextAlignCenterIcon,
  TextAlignLeftIcon,
  TextAlignRightIcon,
  TextBIcon,
  TextItalicIcon,
  TextUnderlineIcon,
} from '@phosphor-icons/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

const meta = {
  title: 'Components/Toggle Group',
  component: ToggleGroup,
  parameters: { layout: 'centered' },
  args: { variant: 'default', size: 'default', spacing: 2, disabled: false },
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
    spacing: {
      description: 'Gap between items, on the spacing scale. `0` joins them.',
      control: { type: 'number', min: 0, max: 4 },
    },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof ToggleGroup>;

export default meta;

type Story = StoryObj<typeof meta>;

/** One value at a time. Arrow keys move between items. */
export const Single: Story = {
  render: (args) => (
    <ToggleGroup aria-label="Text alignment" defaultValue={['left']} {...args}>
      <ToggleGroupItem aria-label="Align left" value="left">
        <TextAlignLeftIcon aria-hidden="true" />
      </ToggleGroupItem>
      <ToggleGroupItem aria-label="Align center" value="center">
        <TextAlignCenterIcon aria-hidden="true" />
      </ToggleGroupItem>
      <ToggleGroupItem aria-label="Align right" value="right">
        <TextAlignRightIcon aria-hidden="true" />
      </ToggleGroupItem>
    </ToggleGroup>
  ),
};

/** `multiple` lets several items stay on. */
export const Multiple: Story = {
  render: (args) => (
    <ToggleGroup
      aria-label="Text style"
      defaultValue={['bold', 'italic']}
      multiple
      {...args}
    >
      <ToggleGroupItem aria-label="Bold" value="bold">
        <TextBIcon aria-hidden="true" />
      </ToggleGroupItem>
      <ToggleGroupItem aria-label="Italic" value="italic">
        <TextItalicIcon aria-hidden="true" />
      </ToggleGroupItem>
      <ToggleGroupItem aria-label="Underline" value="underline">
        <TextUnderlineIcon aria-hidden="true" />
      </ToggleGroupItem>
    </ToggleGroup>
  ),
};

/** `spacing={0}` with the outline variant makes a segmented control. */
export const Joined: Story = {
  args: { variant: 'outline', spacing: 0 },
  render: (args) => (
    <ToggleGroup aria-label="View" defaultValue={['board']} {...args}>
      <ToggleGroupItem value="board">Board</ToggleGroupItem>
      <ToggleGroupItem value="list">List</ToggleGroupItem>
      <ToggleGroupItem value="table">Table</ToggleGroupItem>
    </ToggleGroup>
  ),
};

export const Vertical: Story = {
  args: { variant: 'outline', spacing: 0, orientation: 'vertical' },
  render: (args) => (
    <ToggleGroup aria-label="View" defaultValue={['board']} {...args}>
      <ToggleGroupItem value="board">Board</ToggleGroupItem>
      <ToggleGroupItem value="list">List</ToggleGroupItem>
      <ToggleGroupItem value="table">Table</ToggleGroupItem>
    </ToggleGroup>
  ),
};
