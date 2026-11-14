import { FolderOpenIcon } from '@phosphor-icons/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '@/components/ui/button';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';

const meta = {
  title: 'Components/Empty',
  component: Empty,
  parameters: { layout: 'centered' },
  decorators: [
    (Story) => (
      <div className="flex w-96 max-w-[calc(100vw-2rem)]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Empty>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Say what is missing, then offer the next step. */
export const Default: Story = {
  render: () => (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <FolderOpenIcon aria-hidden="true" />
        </EmptyMedia>
        <EmptyTitle>No boards yet</EmptyTitle>
        <EmptyDescription>
          Boards you create or join show up here.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button>Create a board</Button>
      </EmptyContent>
    </Empty>
  ),
};

/** Add `border` to draw the dashed outline. */
export const Outlined: Story = {
  render: () => (
    <Empty className="border">
      <EmptyHeader>
        <EmptyTitle>No results</EmptyTitle>
        <EmptyDescription>
          Nothing matches that search. <a href="#clear">Clear the filters</a>
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  ),
};
