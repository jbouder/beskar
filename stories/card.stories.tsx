import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const meta = {
  title: 'Components/Card',
  component: Card,
  parameters: { layout: 'centered' },
  args: { size: 'default' },
  argTypes: {
    size: {
      description: 'Inner spacing. `sm` suits dense grids.',
      control: 'inline-radio',
      options: ['default', 'sm'],
      table: { defaultValue: { summary: 'default' } },
    },
    children: { control: false },
    className: { table: { disable: true } },
  },
} satisfies Meta<typeof Card>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Card {...args} className="w-80">
      <CardHeader>
        <CardTitle>Holocron</CardTitle>
        <CardDescription>Retro board for the team.</CardDescription>
      </CardHeader>
      <CardContent>
        Three columns, live cursors, and a timer. Last deployed two hours ago.
      </CardContent>
    </Card>
  ),
};

export const WithActionAndFooter: Story = {
  render: (args) => (
    <Card {...args} className="w-80">
      <CardHeader>
        <CardTitle>Datapad</CardTitle>
        <CardDescription>Notes, tasks, and meetings.</CardDescription>
        <CardAction>
          <Badge className="bg-ok text-ok-foreground">Live</Badge>
        </CardAction>
      </CardHeader>
      <CardContent>12 open tasks. 3 due today.</CardContent>
      <CardFooter className="justify-end gap-2">
        <Button size="sm" variant="ghost">
          Dismiss
        </Button>
        <Button size="sm">Open</Button>
      </CardFooter>
    </Card>
  ),
};

export const Small: Story = {
  args: { size: 'sm' },
  parameters: { controls: { include: [] } },
  render: (args) => (
    <Card {...args} className="w-64">
      <CardHeader>
        <CardTitle>Pulse</CardTitle>
        <CardDescription>Project activity.</CardDescription>
      </CardHeader>
      <CardContent>42 commits this week.</CardContent>
    </Card>
  ),
};
