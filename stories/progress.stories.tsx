import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from '@/components/ui/progress';

const meta = {
  title: 'Components/Progress',
  component: Progress,
  parameters: { layout: 'centered' },
  args: { value: 40 },
  argTypes: {
    value: {
      description: 'From 0 to 100. Pass `null` when the amount is unknown.',
      control: { type: 'range', min: 0, max: 100, step: 1 },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-72 max-w-[calc(100vw-2rem)]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Progress>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Without a visible label, name the bar with `aria-label`. */
export const Default: Story = {
  render: (args) => <Progress aria-label="Upload progress" {...args} />,
};

export const WithLabelAndValue: Story = {
  render: (args) => (
    <Progress {...args}>
      <ProgressLabel>Uploading</ProgressLabel>
      <ProgressValue />
    </Progress>
  ),
};

export const Complete: Story = {
  args: { value: 100 },
  render: (args) => (
    <Progress {...args}>
      <ProgressLabel>Uploaded</ProgressLabel>
      <ProgressValue />
    </Progress>
  ),
};
