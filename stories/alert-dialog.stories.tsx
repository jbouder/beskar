import { TrashIcon } from '@phosphor-icons/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

type AlertDialogStoryArgs = {
  /** Story-only: mounts the dialog already open. */
  defaultOpen: boolean;
  /** `AlertDialogContent` width. */
  size: 'default' | 'sm';
  /** Story-only: shows an `AlertDialogMedia` icon above the title. */
  withMedia: boolean;
};

function AlertDialogExample({
  defaultOpen,
  size,
  withMedia,
}: AlertDialogStoryArgs) {
  return (
    <AlertDialog defaultOpen={defaultOpen}>
      <AlertDialogTrigger render={<Button variant="destructive" />}>
        Delete note
      </AlertDialogTrigger>
      <AlertDialogContent size={size}>
        <AlertDialogHeader>
          {withMedia ? (
            <AlertDialogMedia>
              <TrashIcon aria-hidden />
            </AlertDialogMedia>
          ) : null}
          <AlertDialogTitle>Delete this note?</AlertDialogTitle>
          <AlertDialogDescription>
            The note and its history are removed for everyone. This cannot be
            undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Keep note</AlertDialogCancel>
          <AlertDialogAction variant="destructive">Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

const meta = {
  title: 'Components/Alert Dialog',
  component: AlertDialogExample,
  parameters: { layout: 'centered' },
  args: { defaultOpen: false, size: 'default', withMedia: false },
  argTypes: {
    defaultOpen: { control: 'boolean' },
    size: {
      control: 'inline-radio',
      options: ['default', 'sm'],
      table: { defaultValue: { summary: 'default' } },
    },
    withMedia: { control: 'boolean' },
  },
  decorators: [
    // `defaultOpen` is mount-only, so remount when it changes.
    (Story, { args }) => <Story key={String(args.defaultOpen)} />,
  ],
} satisfies Meta<typeof AlertDialogExample>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Confirms an action that cannot be undone. Unlike a dialog, a press outside
 * does not dismiss it: the person must choose. Name both buttons after what
 * they do, not "Yes" and "No".
 */
export const Default: Story = {};

export const Open: Story = {
  args: { defaultOpen: true },
  parameters: { controls: { include: ['size', 'withMedia'] } },
};

export const WithMedia: Story = {
  args: { defaultOpen: true, withMedia: true },
  parameters: { controls: { include: ['size'] } },
};
