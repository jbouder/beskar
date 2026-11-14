import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from '@/components/ui/input-group';

describe('InputGroup', () => {
  it('groups an input with addons, and an addon click focuses the input', async () => {
    const user = userEvent.setup();
    render(
      <InputGroup className="w-72">
        <InputGroupAddon>
          <InputGroupText>https://</InputGroupText>
        </InputGroupAddon>
        <InputGroupInput aria-label="Site" />
        <InputGroupAddon align="inline-end">.dev</InputGroupAddon>
      </InputGroup>,
    );

    const group = screen.getAllByRole('group')[0];
    expect(group).toHaveAttribute('data-slot', 'input-group');
    expect(group).toHaveClass('w-72');

    const input = screen.getByRole('textbox', { name: 'Site' });
    expect(input).toHaveAttribute('data-slot', 'input-group-control');

    const prefix = screen.getByText('https://');
    expect(prefix.closest('[data-slot="input-group-addon"]')).toHaveAttribute(
      'data-align',
      'inline-start',
    );
    expect(screen.getByText('.dev')).toHaveAttribute(
      'data-align',
      'inline-end',
    );

    await user.click(prefix);
    expect(input).toHaveFocus();
  });

  it('runs a button without stealing focus to the input', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <InputGroup>
        <InputGroupInput aria-label="Link" />
        <InputGroupAddon align="inline-end">
          <InputGroupButton onClick={onClick} size="sm">
            Copy
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>,
    );

    const button = screen.getByRole('button', { name: 'Copy' });
    expect(button).toHaveAttribute('type', 'button');
    expect(button).toHaveAttribute('data-size', 'sm');
    await user.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('textbox', { name: 'Link' })).not.toHaveFocus();
  });

  it('supports a textarea with block addons', async () => {
    const user = userEvent.setup();
    render(
      <InputGroup>
        <InputGroupAddon align="block-start">Message</InputGroupAddon>
        <InputGroupTextarea aria-label="Message body" />
        <InputGroupAddon align="block-end">0 / 280</InputGroupAddon>
      </InputGroup>,
    );

    const textarea = screen.getByRole('textbox', { name: 'Message body' });
    expect(textarea.tagName).toBe('TEXTAREA');
    await user.type(textarea, 'hi');
    expect(textarea).toHaveValue('hi');
    expect(screen.getByText('0 / 280')).toHaveAttribute(
      'data-align',
      'block-end',
    );
  });
});
