import {
  DotsThreeIcon,
  PencilSimpleIcon,
  TrashIcon,
} from '@phosphor-icons/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type DropdownMenuStoryArgs = {
  /** Story-only: mounts the menu already open. */
  defaultOpen: boolean;
  /** `DropdownMenuContent` side, relative to the trigger. */
  side: 'top' | 'right' | 'bottom' | 'left';
  /** `DropdownMenuContent` alignment along that side. */
  align: 'start' | 'center' | 'end';
};

function DropdownMenuExample({
  defaultOpen,
  side,
  align,
}: DropdownMenuStoryArgs) {
  const [pinned, setPinned] = useState(true);
  const [sort, setSort] = useState('recent');

  return (
    <DropdownMenu defaultOpen={defaultOpen}>
      <DropdownMenuTrigger
        render={
          <Button aria-label="Note actions" size="icon" variant="outline" />
        }
      >
        <DotsThreeIcon aria-hidden />
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} className="w-52" side={side}>
        <DropdownMenuGroup>
          <DropdownMenuLabel>Note</DropdownMenuLabel>
          <DropdownMenuItem>
            <PencilSimpleIcon aria-hidden />
            Rename
            <DropdownMenuShortcut>R</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Move to</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem>Inbox</DropdownMenuItem>
              <DropdownMenuItem>Archive</DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem checked={pinned} onCheckedChange={setPinned}>
          Pinned
        </DropdownMenuCheckboxItem>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuLabel>Sort by</DropdownMenuLabel>
          <DropdownMenuRadioGroup onValueChange={setSort} value={sort}>
            <DropdownMenuRadioItem value="recent">Recent</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="name">Name</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">
          <TrashIcon aria-hidden />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const meta = {
  title: 'Components/Dropdown Menu',
  component: DropdownMenuExample,
  parameters: { layout: 'centered' },
  args: { defaultOpen: false, side: 'bottom', align: 'start' },
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
      table: { defaultValue: { summary: 'start' } },
    },
  },
  decorators: [
    // `defaultOpen` is mount-only, so remount when it changes.
    (Story, { args }) => (
      <div className="px-32 pt-8 pb-80">
        <Story key={String(args.defaultOpen)} />
      </div>
    ),
  ],
} satisfies Meta<typeof DropdownMenuExample>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * A menu of actions. Arrow keys move, typing jumps to a match, and Escape
 * closes. Checkbox and radio items keep the menu open so several can change.
 */
export const Default: Story = {};

export const Open: Story = {
  args: { defaultOpen: true },
  parameters: { controls: { include: ['side', 'align'] } },
};
