import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';

const meta = {
  title: 'Components/Field',
  component: Field,
  parameters: { layout: 'centered' },
  decorators: [
    (Story) => (
      <div className="w-96 max-w-[calc(100vw-2rem)]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Field>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Tie the label to the control with `htmlFor`, and the help text with `aria-describedby`. */
export const Default: Story = {
  render: () => (
    <Field>
      <FieldLabel htmlFor="field-name">Board name</FieldLabel>
      <Input
        aria-describedby="field-name-help"
        id="field-name"
        placeholder="Sprint 42 retro"
      />
      <FieldDescription id="field-name-help">
        Everyone on the board sees this name.
      </FieldDescription>
    </Field>
  ),
};

/** Set `data-invalid` on the field and `aria-invalid` on the control. `FieldError` is announced when it appears. */
export const Invalid: Story = {
  render: () => (
    <Field data-invalid="true">
      <FieldLabel htmlFor="field-email">Email</FieldLabel>
      <Input
        aria-describedby="field-email-error"
        aria-invalid="true"
        defaultValue="mando@"
        id="field-email"
        type="email"
      />
      <FieldError id="field-email-error">
        Enter a full email address.
      </FieldError>
    </Field>
  ),
};

/** `FieldError` also takes an `errors` array, the shape form libraries return. Duplicates collapse. */
export const ErrorList: Story = {
  render: () => (
    <Field data-invalid="true">
      <FieldLabel htmlFor="field-password">Password</FieldLabel>
      <Input
        aria-describedby="field-password-error"
        aria-invalid="true"
        id="field-password"
        type="password"
      />
      <FieldError
        errors={[
          { message: 'Use at least 12 characters.' },
          { message: 'Add a number.' },
          { message: 'Add a number.' },
        ]}
        id="field-password-error"
      />
    </Field>
  ),
};

/** `orientation="horizontal"` puts the control beside its label. */
export const Horizontal: Story = {
  render: () => (
    <FieldGroup>
      <Field orientation="horizontal">
        <Checkbox id="field-digest" />
        <FieldContent>
          <FieldLabel htmlFor="field-digest">Weekly digest</FieldLabel>
          <FieldDescription>One email every Monday morning.</FieldDescription>
        </FieldContent>
      </Field>
      <Field orientation="horizontal">
        <FieldContent>
          <FieldLabel htmlFor="field-mentions">Mentions</FieldLabel>
          <FieldDescription>Notify me when someone tags me.</FieldDescription>
        </FieldContent>
        <Switch id="field-mentions" />
      </Field>
    </FieldGroup>
  ),
};

/** `FieldSet` and `FieldLegend` group related fields. `FieldGroup` spaces them. */
export const Form: Story = {
  render: () => (
    <form onSubmit={(event) => event.preventDefault()}>
      <FieldSet>
        <FieldLegend>New board</FieldLegend>
        <FieldDescription>Start a retro for your team.</FieldDescription>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="form-name">Name</FieldLabel>
            <Input id="form-name" />
          </Field>
          <Field>
            <FieldLabel htmlFor="form-notes">Notes</FieldLabel>
            <Textarea id="form-notes" />
          </Field>
          <FieldSeparator>Options</FieldSeparator>
          <Field orientation="horizontal">
            <Checkbox id="form-anonymous" />
            <FieldLabel htmlFor="form-anonymous">Anonymous cards</FieldLabel>
          </Field>
          <Field orientation="horizontal">
            <Button type="submit">Create</Button>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Field>
        </FieldGroup>
      </FieldSet>
    </form>
  ),
};
