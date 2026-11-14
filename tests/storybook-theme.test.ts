import { describe, expect, it, vi } from 'vitest';
import { managerThemes } from '../.storybook/manager';
import { GLOBALS_UPDATED, syncPreviewTheme } from '../.storybook/theme';

const manager = vi.hoisted(() => {
  const listeners = new Map<string, (payload: unknown) => void>();
  const api = {
    getGlobals: vi.fn(() => ({ theme: 'light' })),
    getChannel: vi.fn(() => ({
      on: vi.fn((event: string, listener: (payload: unknown) => void) => {
        listeners.set(event, listener);
      }),
    })),
  };

  return {
    api,
    listeners,
    register: vi.fn((_id: string, setup: (value: typeof api) => void) => {
      setup(api);
    }),
    setConfig: vi.fn(),
  };
});

vi.mock('storybook/manager-api', () => ({
  addons: {
    register: manager.register,
    setConfig: manager.setConfig,
  },
}));

describe('Storybook manager theme', () => {
  it('follows the preview theme global', () => {
    expect(manager.register).toHaveBeenCalledWith(
      'beskar/theme-sync',
      expect.any(Function),
    );
    expect(manager.setConfig).toHaveBeenLastCalledWith({
      theme: managerThemes.light,
    });

    manager.listeners.get(GLOBALS_UPDATED)?.({
      globals: { theme: 'dark' },
    });

    expect(manager.setConfig).toHaveBeenLastCalledWith({
      theme: managerThemes.dark,
    });
  });

  it('updates the preview outside story decorators', () => {
    const listeners = new Map<string, (payload: unknown) => void>();
    syncPreviewTheme({
      on: (event, listener) => {
        listeners.set(event, listener as (payload: unknown) => void);
      },
    });

    expect(document.documentElement).not.toHaveClass('dark');

    listeners.get(GLOBALS_UPDATED)?.({
      globals: { theme: 'dark' },
    });

    expect(document.documentElement).toHaveClass('dark');
    expect(document.body).toHaveStyle({
      backgroundColor: 'var(--background)',
    });
  });
});
