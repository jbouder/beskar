import type { Meta, StoryObj } from '@storybook/react-vite';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/sonner';

const meta = {
  title: 'Components/Sonner',
  component: Toaster,
  parameters: { layout: 'centered' },
  args: { position: 'bottom-right', richColors: false, closeButton: false },
  argTypes: {
    position: {
      control: 'select',
      options: [
        'top-left',
        'top-center',
        'top-right',
        'bottom-left',
        'bottom-center',
        'bottom-right',
      ],
      table: { defaultValue: { summary: 'bottom-right' } },
    },
    richColors: { control: 'boolean' },
    closeButton: { control: 'boolean' },
  },
} satisfies Meta<typeof Toaster>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Mount one `Toaster` at the app root, then call `toast()` from anywhere. It
 * follows the `.dark` class, so it needs no theme provider. Toasts are for
 * confirmation. Do not put the only copy of an error in one: it disappears.
 */
export const Default: Story = {
  render: (args) => (
    <>
      <Toaster {...args} />
      <div className="flex flex-wrap gap-2">
        <Button onClick={() => toast('Note saved')} variant="outline">
          Default
        </Button>
        <Button onClick={() => toast.success('Deployed')} variant="outline">
          Success
        </Button>
        <Button
          onClick={() => toast.warning('Storage is almost full')}
          variant="outline"
        >
          Warning
        </Button>
        <Button
          onClick={() => toast.error('Could not reach the server')}
          variant="outline"
        >
          Error
        </Button>
        <Button
          onClick={() =>
            toast('Note deleted', {
              description: 'It is in the trash for 30 days.',
              action: { label: 'Undo', onClick: () => toast('Restored') },
            })
          }
          variant="outline"
        >
          With action
        </Button>
      </div>
    </>
  ),
};
