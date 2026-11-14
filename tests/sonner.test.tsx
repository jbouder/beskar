import { act, render, screen } from '@testing-library/react';
import { toast } from 'sonner';
import { afterEach, describe, expect, it } from 'vitest';
import { Toaster } from '@/components/ui/sonner';

afterEach(() => {
  document.documentElement.classList.remove('dark');
  toast.dismiss();
});

describe('Toaster', () => {
  it('shows a toast with a status icon', async () => {
    render(<Toaster />);

    act(() => {
      toast.success('Note saved');
    });

    const message = await screen.findByText('Note saved');
    const item = message.closest('[data-sonner-toast]');
    expect(item).toHaveClass('cn-toast');
    expect(item?.querySelector('svg')).not.toBeNull();
  });

  it('follows the .dark class on <html>', async () => {
    render(<Toaster />);
    act(() => {
      toast('Theme check');
    });
    await screen.findByText('Theme check');

    const toaster = () => document.querySelector('[data-sonner-toaster]');
    expect(toaster()).toHaveAttribute('data-sonner-theme', 'light');

    await act(async () => {
      document.documentElement.classList.add('dark');
      // MutationObserver callbacks run as microtasks.
      await Promise.resolve();
    });
    expect(toaster()).toHaveAttribute('data-sonner-theme', 'dark');
  });
});
