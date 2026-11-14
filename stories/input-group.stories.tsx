import { CopyIcon, MagnifyingGlassIcon } from '@phosphor-icons/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from '@/components/ui/input-group';

const meta = {
  title: 'Components/Input Group',
  component: InputGroup,
  parameters: { layout: 'centered' },
  argTypes: {
    children: { control: false },
    className: { table: { disable: true } },
  },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof InputGroup>;

export default meta;

type Story = StoryObj<typeof meta>;

/** An icon in front of the field. Clicking the addon focuses the input. */
export const Default: Story = {
  render: () => (
    <InputGroup>
      <InputGroupAddon>
        <MagnifyingGlassIcon aria-hidden />
      </InputGroupAddon>
      <InputGroupInput aria-label="Search notes" placeholder="Search notes" />
    </InputGroup>
  ),
};

export const WithText: Story = {
  render: () => (
    <InputGroup>
      <InputGroupAddon>
        <InputGroupText>https://</InputGroupText>
      </InputGroupAddon>
      <InputGroupInput aria-label="Site address" placeholder="example" />
      <InputGroupAddon align="inline-end">
        <InputGroupText>.dev</InputGroupText>
      </InputGroupAddon>
    </InputGroup>
  ),
};

export const WithButton: Story = {
  render: () => (
    <InputGroup>
      <InputGroupInput
        aria-label="Share link"
        defaultValue="https://holocron.example/b/42"
        readOnly
      />
      <InputGroupAddon align="inline-end">
        <InputGroupButton aria-label="Copy link" size="icon-xs">
          <CopyIcon aria-hidden />
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  ),
};

/** Block addons sit above or below a textarea. */
export const WithTextarea: Story = {
  render: () => (
    <InputGroup>
      <InputGroupTextarea aria-label="Message" placeholder="Write a message" />
      <InputGroupAddon align="block-end">
        <InputGroupText>0 / 280</InputGroupText>
        <InputGroupButton className="ml-auto" size="sm" variant="default">
          Send
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  ),
};

export const Invalid: Story = {
  render: () => (
    <InputGroup>
      <InputGroupAddon>
        <InputGroupText>@</InputGroupText>
      </InputGroupAddon>
      <InputGroupInput
        aria-invalid
        aria-label="Handle"
        defaultValue="not a handle"
      />
    </InputGroup>
  ),
};
