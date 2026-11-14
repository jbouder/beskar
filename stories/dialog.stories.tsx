import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type DialogStoryArgs = {
  /** Story-only: mounts the dialog already open. */
  defaultOpen: boolean;
  /** `DialogContent`: the corner close button. */
  showCloseButton: boolean;
};

function DialogExample({ defaultOpen, showCloseButton }: DialogStoryArgs) {
  return (
    <Dialog defaultOpen={defaultOpen}>
      <DialogTrigger render={<Button variant="outline" />}>
        Rename project
      </DialogTrigger>
      <DialogContent showCloseButton={showCloseButton}>
        <DialogHeader>
          <DialogTitle>Rename project</DialogTitle>
          <DialogDescription>
            The name shows in the sidebar and in shared links.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-2">
          <Label htmlFor="project-name">Name</Label>
          <Input defaultValue="Holocron" id="project-name" />
        </div>
        <DialogFooter>
          <DialogClose render={<Button variant="ghost" />}>Cancel</DialogClose>
          <DialogClose render={<Button />}>Save</DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

const meta = {
  title: 'Components/Dialog',
  component: DialogExample,
  parameters: { layout: 'centered' },
  args: { defaultOpen: false, showCloseButton: true },
  argTypes: {
    defaultOpen: { control: 'boolean' },
    showCloseButton: {
      control: 'boolean',
      table: { defaultValue: { summary: 'true' } },
    },
  },
  decorators: [
    // `defaultOpen` is mount-only, so remount when it changes.
    (Story, { args }) => <Story key={String(args.defaultOpen)} />,
  ],
} satisfies Meta<typeof DialogExample>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * A modal for one focused task. Focus moves into it and returns to the trigger
 * on close. Escape and a press outside both close it.
 */
export const Default: Story = {};

export const Open: Story = {
  args: { defaultOpen: true },
  parameters: { controls: { include: ['showCloseButton'] } },
};

export const WithoutCloseButton: Story = {
  args: { defaultOpen: true, showCloseButton: false },
  parameters: { controls: { include: [] } },
};
