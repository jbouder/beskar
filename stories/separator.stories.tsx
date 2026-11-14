import type { Meta, StoryObj } from '@storybook/react-vite';
import { Separator } from '@/components/ui/separator';

const meta = {
  title: 'Components/Separator',
  component: Separator,
  parameters: { layout: 'centered' },
  args: { orientation: 'horizontal' },
  argTypes: {
    orientation: {
      control: 'inline-radio',
      options: ['horizontal', 'vertical'],
      table: { defaultValue: { summary: 'horizontal' } },
    },
    className: { table: { disable: true } },
  },
} satisfies Meta<typeof Separator>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div className="flex h-24 w-72 items-center justify-center">
      <Separator {...args} />
    </div>
  ),
};

export const InContent: Story = {
  parameters: { controls: { include: [] } },
  render: () => (
    <div className="w-72 text-sm">
      <p className="font-medium">Beskar</p>
      <p className="text-muted-foreground">Design system for vibe projects.</p>
      <Separator className="my-3" />
      <div className="flex h-5 items-center gap-3">
        <span>Docs</span>
        <Separator orientation="vertical" />
        <span>Source</span>
        <Separator orientation="vertical" />
        <span>Changelog</span>
      </div>
    </div>
  ),
};
