import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';

const meta = {
  title: 'Components/Spinner',
  component: Spinner,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Spinner>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Announces "Loading" to screen readers. It holds still when the OS asks for less motion. */
export const Default: Story = {};

/** Size it with a `size-*` utility. It takes the current text color. */
export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Spinner className="size-3" />
      <Spinner />
      <Spinner className="size-6" />
      <Spinner className="size-8 text-tone-cyan" />
    </div>
  ),
};

/** Inside a button, the button text already says what is happening, so hide the spinner from screen readers. */
export const InButton: Story = {
  render: () => (
    <Button disabled>
      <Spinner aria-hidden="true" data-icon="inline-start" />
      Saving
    </Button>
  ),
};
