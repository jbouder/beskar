import { CheckIcon, PlusIcon } from '@phosphor-icons/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from '@/components/ui/avatar';

// A tiny inline image, so the story does not depend on the network.
const PORTRAIT = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><rect width="40" height="40" fill="#3f6f8f"/><circle cx="20" cy="15" r="7" fill="#e6eef3"/><path d="M6 40a14 14 0 0 1 28 0z" fill="#e6eef3"/></svg>',
)}`;

const meta = {
  title: 'Components/Avatar',
  component: Avatar,
  parameters: { layout: 'centered' },
  args: { size: 'default' },
  argTypes: {
    size: {
      control: 'inline-radio',
      options: ['sm', 'default', 'lg'],
      table: { defaultValue: { summary: 'default' } },
    },
  },
} satisfies Meta<typeof Avatar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Avatar {...args}>
      <AvatarImage alt="Din Djarin" src={PORTRAIT} />
      <AvatarFallback>DD</AvatarFallback>
    </Avatar>
  ),
};

/** The fallback shows while the image loads, and stays if it fails. */
export const Fallback: Story = {
  render: (args) => (
    <Avatar {...args}>
      <AvatarFallback>BK</AvatarFallback>
    </Avatar>
  ),
};

export const Sizes: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex items-center gap-3">
      {(['sm', 'default', 'lg'] as const).map((size) => (
        <Avatar key={size} size={size}>
          <AvatarFallback>BK</AvatarFallback>
        </Avatar>
      ))}
    </div>
  ),
};

/** The badge hides its icon at the small size. Give it a label when it carries meaning. */
export const WithBadge: Story = {
  args: { size: 'lg' },
  render: (args) => (
    <Avatar {...args}>
      <AvatarImage alt="Din Djarin" src={PORTRAIT} />
      <AvatarFallback>DD</AvatarFallback>
      <AvatarBadge aria-label="Verified" role="img">
        <CheckIcon aria-hidden="true" weight="bold" />
      </AvatarBadge>
    </Avatar>
  ),
};

export const Group: Story = {
  render: (args) => (
    <AvatarGroup>
      <Avatar {...args}>
        <AvatarImage alt="Din Djarin" src={PORTRAIT} />
        <AvatarFallback>DD</AvatarFallback>
      </Avatar>
      <Avatar {...args}>
        <AvatarFallback>BK</AvatarFallback>
      </Avatar>
      <Avatar {...args}>
        <AvatarFallback>AT</AvatarFallback>
      </Avatar>
      <AvatarGroupCount>
        <PlusIcon aria-hidden="true" />
        <span className="sr-only">3 more</span>
      </AvatarGroupCount>
    </AvatarGroup>
  ),
};
