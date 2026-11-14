import { InfoIcon, WarningIcon } from '@phosphor-icons/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

const meta = {
  title: 'Components/Alert',
  component: Alert,
  parameters: { layout: 'centered' },
  args: { variant: 'default' },
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: ['default', 'destructive'],
      table: { defaultValue: { summary: 'default' } },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-96 max-w-[calc(100vw-2rem)]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Alert>;

export default meta;

type Story = StoryObj<typeof meta>;

/** An alert has `role="alert"`, so screen readers announce it when it appears. */
export const Default: Story = {
  render: (args) => (
    <Alert {...args}>
      <InfoIcon aria-hidden="true" />
      <AlertTitle>Sync is paused</AlertTitle>
      <AlertDescription>
        Changes stay on this device until you reconnect.
      </AlertDescription>
    </Alert>
  ),
};

export const Destructive: Story = {
  args: { variant: 'destructive' },
  render: (args) => (
    <Alert {...args}>
      <WarningIcon aria-hidden="true" />
      <AlertTitle>Could not save the board</AlertTitle>
      <AlertDescription>
        The server did not respond. Try again in a minute.
      </AlertDescription>
    </Alert>
  ),
};

export const TitleOnly: Story = {
  render: (args) => (
    <Alert {...args}>
      <AlertTitle>Your export is ready.</AlertTitle>
    </Alert>
  ),
};

/** `AlertAction` pins a control to the top right corner. */
export const WithAction: Story = {
  render: (args) => (
    <Alert {...args}>
      <InfoIcon aria-hidden="true" />
      <AlertTitle>A new version is available</AlertTitle>
      <AlertDescription>Reload to get the latest changes.</AlertDescription>
      <AlertAction>
        <Button size="xs" variant="outline">
          Reload
        </Button>
      </AlertAction>
    </Alert>
  ),
};
