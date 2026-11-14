import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type TabsStoryArgs = {
  /** `TabsList` look: a filled track, or an underline. */
  variant: 'default' | 'line';
  orientation: 'horizontal' | 'vertical';
  /** Disables the third tab. */
  disableFiles: boolean;
};

function TabsExample({ variant, orientation, disableFiles }: TabsStoryArgs) {
  return (
    <Tabs className="w-96" defaultValue="notes" orientation={orientation}>
      <TabsList variant={variant}>
        <TabsTrigger value="notes">Notes</TabsTrigger>
        <TabsTrigger value="tasks">Tasks</TabsTrigger>
        <TabsTrigger disabled={disableFiles} value="files">
          Files
        </TabsTrigger>
      </TabsList>
      <TabsContent value="notes">
        Meeting notes and scratch thoughts.
      </TabsContent>
      <TabsContent value="tasks">Open tasks, sorted by due date.</TabsContent>
      <TabsContent value="files">Attachments for this project.</TabsContent>
    </Tabs>
  );
}

const meta = {
  title: 'Components/Tabs',
  component: TabsExample,
  parameters: { layout: 'centered' },
  args: { variant: 'default', orientation: 'horizontal', disableFiles: false },
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: ['default', 'line'],
      table: { defaultValue: { summary: 'default' } },
    },
    orientation: {
      control: 'inline-radio',
      options: ['horizontal', 'vertical'],
      table: { defaultValue: { summary: 'horizontal' } },
    },
    disableFiles: { control: 'boolean' },
  },
} satisfies Meta<typeof TabsExample>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Arrow keys move between tabs. Tab moves into the panel. */
export const Default: Story = {};

export const Line: Story = {
  args: { variant: 'line' },
  parameters: { controls: { include: ['orientation', 'disableFiles'] } },
};

export const Vertical: Story = {
  args: { orientation: 'vertical' },
  parameters: { controls: { include: ['variant', 'disableFiles'] } },
};

export const WithDisabledTab: Story = {
  args: { disableFiles: true },
  parameters: { controls: { include: ['variant'] } },
};
