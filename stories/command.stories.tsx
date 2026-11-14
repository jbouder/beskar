import {
  MagnifyingGlassIcon,
  MoonIcon,
  NotePencilIcon,
} from '@phosphor-icons/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@/components/ui/command';

function Palette() {
  return (
    <>
      <CommandInput placeholder="Type a command or search" />
      <CommandList>
        <CommandEmpty>No results.</CommandEmpty>
        <CommandGroup heading="Notes">
          <CommandItem>
            <NotePencilIcon aria-hidden />
            New note
            <CommandShortcut>N</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <MagnifyingGlassIcon aria-hidden />
            Search notes
            <CommandShortcut>/</CommandShortcut>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Appearance">
          <CommandItem>
            <MoonIcon aria-hidden />
            Toggle theme
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </>
  );
}

const meta = {
  title: 'Components/Command',
  component: Command,
  parameters: { layout: 'centered' },
  argTypes: {
    label: {
      description: 'Accessible name for the search field.',
      control: 'text',
    },
    className: { table: { disable: true } },
  },
  args: { label: 'Command menu' },
} satisfies Meta<typeof Command>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * A searchable list of actions. Typing filters, arrow keys move, and Enter
 * runs the highlighted item.
 */
export const Default: Story = {
  render: (args) => (
    <Command {...args} className="w-80 border border-border">
      <Palette />
    </Command>
  ),
};

function DialogExample({ label }: { label?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)} variant="outline">
        Open command menu
      </Button>
      <CommandDialog onOpenChange={setOpen} open={open} title="Command menu">
        <Command label={label}>
          <Palette />
        </Command>
      </CommandDialog>
    </>
  );
}

/** The usual home for a command palette: a dialog opened by a shortcut. */
export const InDialog: Story = {
  parameters: { controls: { include: [] } },
  render: (args) => <DialogExample label={args.label} />,
};
