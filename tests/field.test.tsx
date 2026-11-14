import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
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
  FieldTitle,
} from '@/components/ui/field';

describe('Field', () => {
  it('lays out a labeled control with help text', () => {
    render(
      <Field>
        <FieldLabel htmlFor="name">Name</FieldLabel>
        <input aria-describedby="name-help" id="name" />
        <FieldDescription id="name-help">Shown to everyone.</FieldDescription>
      </Field>,
    );

    const field = screen.getByRole('group');
    expect(field).toHaveAttribute('data-slot', 'field');
    expect(field).toHaveAttribute('data-orientation', 'vertical');

    const input = screen.getByLabelText('Name');
    expect(input).toHaveAccessibleDescription('Shown to everyone.');
    expect(screen.getByText('Name')).toHaveAttribute(
      'data-slot',
      'field-label',
    );
  });

  it('sets the orientation and lets className win', () => {
    render(
      <Field className="gap-6" orientation="horizontal">
        <FieldContent>
          <FieldTitle>Mentions</FieldTitle>
        </FieldContent>
      </Field>,
    );

    const field = screen.getByRole('group');
    expect(field).toHaveAttribute('data-orientation', 'horizontal');
    expect(field).toHaveClass('flex-row', 'gap-6');
    expect(field).not.toHaveClass('gap-2');
    expect(screen.getByText('Mentions').parentElement).toHaveAttribute(
      'data-slot',
      'field-content',
    );
  });

  it('groups fields in a fieldset named by its legend', () => {
    const { container } = render(
      <FieldSet>
        <FieldLegend variant="label">Notifications</FieldLegend>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="a">A</FieldLabel>
            <input id="a" />
          </Field>
          <FieldSeparator>Or</FieldSeparator>
          <FieldSeparator />
        </FieldGroup>
      </FieldSet>,
    );

    expect(
      screen.getByRole('group', { name: 'Notifications' }),
    ).toHaveAttribute('data-slot', 'field-set');
    expect(screen.getByText('Notifications')).toHaveAttribute(
      'data-variant',
      'label',
    );
    expect(
      container.querySelector('[data-slot="field-group"]'),
    ).toBeInTheDocument();

    const separators = container.querySelectorAll(
      '[data-slot="field-separator"]',
    );
    expect(separators[0]).toHaveAttribute('data-content', 'true');
    expect(separators[0]).toHaveTextContent('Or');
    expect(separators[1]).toHaveAttribute('data-content', 'false');
  });
});

describe('FieldError', () => {
  it('renders children as an alert', () => {
    render(<FieldError>Enter a name.</FieldError>);

    const error = screen.getByRole('alert');
    expect(error).toHaveTextContent('Enter a name.');
    expect(error).toHaveAttribute('data-slot', 'field-error');
  });

  it('renders nothing without content', () => {
    const { container, rerender } = render(<FieldError />);
    expect(container).toBeEmptyDOMElement();

    rerender(<FieldError errors={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders one message as text', () => {
    render(
      <FieldError
        errors={[{ message: 'Too short.' }, { message: 'Too short.' }]}
      />,
    );

    expect(screen.getByRole('alert')).toHaveTextContent('Too short.');
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });

  it('renders several messages as a list and skips empty ones', () => {
    render(
      <FieldError
        errors={[
          { message: 'Too short.' },
          undefined,
          { message: 'Add a number.' },
        ]}
      />,
    );

    const items = screen.getAllByRole('listitem');
    expect(items.map((item) => item.textContent)).toEqual([
      'Too short.',
      'Add a number.',
    ]);
  });
});
