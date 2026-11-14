import { CopyIcon } from '@phosphor-icons/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

type TooltipStoryArgs = {
  /** `TooltipContent` side, relative to the trigger. */
  side: 'top' | 'right' | 'bottom' | 'left';
  /** `TooltipContent` gap from the trigger, in pixels. */
  sideOffset: number;
  /** `TooltipProvider` delay before opening, in milliseconds. */
  delay: number;
  /** Story-only: keeps the tooltip open so it can be inspected. */
  open: boolean;
  label: string;
};

function TooltipExample({
  side,
  sideOffset,
  delay,
  open,
  label,
}: TooltipStoryArgs) {
  return (
    <TooltipProvider delay={delay}>
      <Tooltip open={open ? true : undefined}>
        <TooltipTrigger
          render={
            <Button aria-label="Copy link" size="icon" variant="outline" />
          }
        >
          <CopyIcon aria-hidden />
        </TooltipTrigger>
        <TooltipContent side={side} sideOffset={sideOffset}>
          {label}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

const meta = {
  title: 'Components/Tooltip',
  component: TooltipExample,
  parameters: { layout: 'centered' },
  args: {
    side: 'top',
    sideOffset: 4,
    delay: 0,
    open: false,
    label: 'Copy link',
  },
  argTypes: {
    side: {
      control: 'inline-radio',
      options: ['top', 'right', 'bottom', 'left'],
      table: { defaultValue: { summary: 'top' } },
    },
    sideOffset: {
      control: { type: 'number', min: 0, max: 24 },
      table: { defaultValue: { summary: '4' } },
    },
    delay: {
      control: { type: 'number', min: 0, max: 1000, step: 100 },
      table: { defaultValue: { summary: '0' } },
    },
    open: { control: 'boolean' },
    label: { control: 'text' },
  },
  decorators: [
    (Story) => (
      <div className="p-16">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TooltipExample>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Opens on hover and on keyboard focus. A tooltip repeats or expands a label.
 * It never holds the only copy of information, and never holds controls.
 */
export const Default: Story = {};

export const Open: Story = {
  args: { open: true },
  parameters: { controls: { include: ['side', 'sideOffset', 'label'] } },
};

export const Sides: Story = {
  parameters: { controls: { include: [] } },
  render: () => (
    <TooltipProvider>
      <div className="flex gap-3">
        {(['top', 'right', 'bottom', 'left'] as const).map((side) => (
          <Tooltip key={side}>
            <TooltipTrigger render={<Button variant="outline" />}>
              {side}
            </TooltipTrigger>
            <TooltipContent side={side}>On the {side}</TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  ),
};
