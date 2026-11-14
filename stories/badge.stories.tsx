import { CheckIcon } from '@phosphor-icons/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge } from '@/components/ui/badge';

const VARIANTS = [
  'default',
  'secondary',
  'outline',
  'destructive',
  'ghost',
  'link',
] as const;

const meta = {
  title: 'Components/Badge',
  component: Badge,
  parameters: { layout: 'centered' },
  args: { children: 'Badge', variant: 'default' },
  argTypes: {
    variant: {
      control: 'select',
      options: VARIANTS,
      table: { defaultValue: { summary: 'default' } },
    },
    children: { control: 'text' },
    render: {
      description:
        'Base UI render prop. Pass an `<a>` to make the badge a link.',
      control: false,
    },
    className: { table: { disable: true } },
  },
} satisfies Meta<typeof Badge>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Variants: Story = {
  parameters: { controls: { include: [] } },
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      {VARIANTS.map((variant) => (
        <Badge key={variant} variant={variant}>
          {variant}
        </Badge>
      ))}
    </div>
  ),
};

export const WithIcon: Story = {
  args: { variant: 'secondary' },
  parameters: { controls: { include: ['variant'] } },
  render: (args) => (
    <Badge {...args}>
      <CheckIcon aria-hidden data-icon="inline-start" />
      Verified
    </Badge>
  ),
};

/** Status and category colors come from the theme tokens through `className`. */
export const StatusAndTones: Story = {
  parameters: { controls: { include: [] } },
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Badge className="bg-ok text-ok-foreground">Deployed</Badge>
      <Badge className="bg-warn text-warn-foreground">Paused</Badge>
      <Badge className="bg-tone-violet-soft text-tone-violet">design</Badge>
      <Badge className="bg-tone-cyan-soft text-tone-cyan">frontend</Badge>
      <Badge className="bg-tone-green-soft text-tone-green">shipped</Badge>
      <Badge className="bg-tone-amber-soft text-tone-amber">review</Badge>
      <Badge className="bg-tone-red-soft text-tone-red">blocked</Badge>
      <Badge className="bg-tone-blue-soft text-tone-blue">backend</Badge>
    </div>
  ),
};

export const AsLink: Story = {
  parameters: { controls: { include: ['variant'] } },
  render: (args) => (
    <Badge {...args} render={<a href="#tags" />}>
      ui
    </Badge>
  ),
};
