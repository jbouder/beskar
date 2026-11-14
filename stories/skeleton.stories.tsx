import type { Meta, StoryObj } from '@storybook/react-vite';
import { Skeleton } from '@/components/ui/skeleton';

const meta = {
  title: 'Components/Skeleton',
  component: Skeleton,
  parameters: { layout: 'centered' },
  argTypes: {
    className: {
      description:
        'Size the placeholder with utilities, like `h-4 w-48`. It has no size of its own.',
      control: false,
    },
  },
} satisfies Meta<typeof Skeleton>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Pulses only when the OS allows motion. */
export const Default: Story = {
  render: () => <Skeleton className="h-4 w-48" />,
};

/** Match the shape of the content that is loading. */
export const CardPlaceholder: Story = {
  render: () => (
    <div
      aria-busy="true"
      aria-label="Loading project"
      className="flex w-72 items-center gap-3"
      role="status"
    >
      <Skeleton className="size-10" />
      <div className="grid flex-1 gap-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  ),
};
