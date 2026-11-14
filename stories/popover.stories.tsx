import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from '@/components/ui/popover';

type PopoverStoryArgs = {
  /** Story-only: mounts the popover already open. */
  defaultOpen: boolean;
  /** `PopoverContent` side, relative to the trigger. */
  side: 'top' | 'right' | 'bottom' | 'left';
  /** `PopoverContent` alignment along that side. */
  align: 'start' | 'center' | 'end';
};

function PopoverExample({ defaultOpen, side, align }: PopoverStoryArgs) {
  return (
    <Popover defaultOpen={defaultOpen}>
      <PopoverTrigger render={<Button variant="outline" />}>
        Share
      </PopoverTrigger>
      <PopoverContent align={align} side={side}>
        <PopoverHeader>
          <PopoverTitle>Share this board</PopoverTitle>
          <PopoverDescription>
            Anyone with the link can view.
          </PopoverDescription>
        </PopoverHeader>
        <div className="grid gap-2">
          <Label htmlFor="share-link">Link</Label>
          <Input
            defaultValue="https://holocron.example/b/42"
            id="share-link"
            readOnly
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}

const meta = {
  title: 'Components/Popover',
  component: PopoverExample,
  parameters: { layout: 'centered' },
  args: { defaultOpen: false, side: 'bottom', align: 'center' },
  argTypes: {
    defaultOpen: { control: 'boolean' },
    side: {
      control: 'inline-radio',
      options: ['top', 'right', 'bottom', 'left'],
      table: { defaultValue: { summary: 'bottom' } },
    },
    align: {
      control: 'inline-radio',
      options: ['start', 'center', 'end'],
      table: { defaultValue: { summary: 'center' } },
    },
  },
  decorators: [
    // `defaultOpen` is mount-only, so remount when it changes.
    (Story, { args }) => (
      <div className="p-24">
        <Story key={String(args.defaultOpen)} />
      </div>
    ),
  ],
} satisfies Meta<typeof PopoverExample>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * A floating panel for content that is too rich for a tooltip and too small
 * for a dialog. It is not modal: the page behind stays usable.
 */
export const Default: Story = {};

export const Open: Story = {
  args: { defaultOpen: true },
  parameters: { controls: { include: ['side', 'align'] } },
};
