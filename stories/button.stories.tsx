import { ArrowRightIcon, PlusIcon, TrashIcon } from '@phosphor-icons/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button, buttonVariants } from '@/components/ui/button';

const VARIANTS = [
  'default',
  'outline',
  'secondary',
  'ghost',
  'destructive',
  'link',
] as const;
const SIZES = ['xs', 'sm', 'default', 'lg'] as const;

const meta = {
  title: 'Components/Button',
  component: Button,
  parameters: { layout: 'centered' },
  args: {
    children: 'Save changes',
    variant: 'default',
    size: 'default',
    disabled: false,
  },
  argTypes: {
    variant: {
      description:
        'Visual weight. One `default` button per view; the rest are quieter.',
      control: 'select',
      options: VARIANTS,
      table: { defaultValue: { summary: 'default' } },
    },
    size: {
      description:
        'Height and padding. The `icon-*` sizes are square, for icon-only buttons.',
      control: 'select',
      options: [...SIZES, 'icon-xs', 'icon-sm', 'icon', 'icon-lg'],
      table: { defaultValue: { summary: 'default' } },
    },
    disabled: {
      control: 'boolean',
      table: { defaultValue: { summary: 'false' } },
    },
    children: { control: 'text' },
    render: {
      description:
        'Base UI render prop. Swaps the rendered element and keeps button behavior. For a real link, put `buttonVariants()` on an `<a>` instead.',
      control: false,
    },
    onClick: { action: 'clicked', control: false },
    className: { table: { disable: true } },
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Variants: Story = {
  parameters: { controls: { include: ['size', 'disabled'] } },
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      {VARIANTS.map((variant) => (
        <Button key={variant} {...args} variant={variant}>
          {variant}
        </Button>
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  parameters: { controls: { include: ['variant', 'disabled'] } },
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      {SIZES.map((size) => (
        <Button key={size} {...args} size={size}>
          {size}
        </Button>
      ))}
    </div>
  ),
};

/** Mark the icon with `data-icon` so the button tightens the padding on that side. */
export const WithIcon: Story = {
  parameters: { controls: { include: ['variant', 'size', 'disabled'] } },
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      <Button {...args}>
        <PlusIcon aria-hidden data-icon="inline-start" />
        New note
      </Button>
      <Button {...args}>
        Continue
        <ArrowRightIcon aria-hidden data-icon="inline-end" />
      </Button>
    </div>
  ),
};

/** An icon-only button needs an accessible name on the button. */
export const IconOnly: Story = {
  args: { variant: 'outline' },
  parameters: { controls: { include: ['variant', 'disabled'] } },
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      {(['icon-xs', 'icon-sm', 'icon', 'icon-lg'] as const).map((size) => (
        <Button key={size} {...args} aria-label="Delete note" size={size}>
          <TrashIcon aria-hidden />
        </Button>
      ))}
    </div>
  ),
};

export const Disabled: Story = {
  args: { disabled: true },
  parameters: { controls: { include: ['variant', 'size'] } },
};

/** A navigation link that looks like a button: `buttonVariants()` on an anchor. */
export const AsLink: Story = {
  parameters: { controls: { include: [] } },
  render: () => (
    <a className={buttonVariants({ variant: 'outline' })} href="#docs">
      Read the docs
    </a>
  ),
};
