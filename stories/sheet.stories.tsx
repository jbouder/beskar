import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Switch } from '@/components/ui/switch';

type SheetStoryArgs = {
  /** Story-only: mounts the sheet already open. */
  defaultOpen: boolean;
  /** `SheetContent`: the edge it slides in from. */
  side: 'top' | 'right' | 'bottom' | 'left';
  /** `SheetContent`: the corner close button. */
  showCloseButton: boolean;
};

function SheetExample({ defaultOpen, side, showCloseButton }: SheetStoryArgs) {
  return (
    <Sheet defaultOpen={defaultOpen}>
      <SheetTrigger render={<Button variant="outline" />}>
        Preferences
      </SheetTrigger>
      <SheetContent showCloseButton={showCloseButton} side={side}>
        <SheetHeader>
          <SheetTitle>Preferences</SheetTitle>
          <SheetDescription>Changes apply right away.</SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 px-4">
          <div className="flex items-center justify-between gap-4">
            <Label htmlFor="pref-compact">Compact rows</Label>
            <Switch id="pref-compact" />
          </div>
          <div className="flex items-center justify-between gap-4">
            <Label htmlFor="pref-motion">Reduce motion</Label>
            <Switch defaultChecked id="pref-motion" />
          </div>
        </div>
        <SheetFooter>
          <SheetClose render={<Button variant="outline" />}>Done</SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

const meta = {
  title: 'Components/Sheet',
  component: SheetExample,
  parameters: { layout: 'centered' },
  args: { defaultOpen: false, side: 'right', showCloseButton: true },
  argTypes: {
    defaultOpen: { control: 'boolean' },
    side: {
      control: 'inline-radio',
      options: ['top', 'right', 'bottom', 'left'],
      table: { defaultValue: { summary: 'right' } },
    },
    showCloseButton: {
      control: 'boolean',
      table: { defaultValue: { summary: 'true' } },
    },
  },
  decorators: [
    // `defaultOpen` is mount-only, so remount when it changes.
    (Story, { args }) => <Story key={String(args.defaultOpen)} />,
  ],
} satisfies Meta<typeof SheetExample>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * A modal panel on an edge of the screen. Use it for settings, filters, and
 * navigation on small screens. It is a dialog, so the same focus rules apply.
 */
export const Default: Story = {};

export const Open: Story = {
  args: { defaultOpen: true },
  parameters: { controls: { include: ['side', 'showCloseButton'] } },
};

export const Bottom: Story = {
  args: { defaultOpen: true, side: 'bottom' },
  parameters: { controls: { include: [] } },
};
