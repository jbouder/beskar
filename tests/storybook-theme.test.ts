import { describe, expect, it, vi } from 'vitest';
import { managerThemes } from '../.storybook/manager';
import { GLOBALS_UPDATED, syncPreviewTheme } from '../.storybook/theme';

// The manager registers its addon at import time, before any test runs. Vitest
// clears mock call history before each test, so record what happened in plain
// arrays instead of asserting on `vi.fn()` calls.
const manager = vi.hoisted(() => {
  const listeners = new Map<string, (payload: unknown) => void>();
  const registered: string[] = [];
  const configs: { theme: unknown }[] = [];
  const api = {
    getGlobals: () => ({ theme: 'light' }),
    getChannel: () => ({
      on: (event: string, listener: (payload: unknown) => void) => {
        listeners.set(event, listener);
      },
    }),
  };

  return { api, configs, listeners, registered };
});

vi.mock('storybook/manager-api', () => ({
  addons: {
    register: (id: string, setup: (value: typeof manager.api) => void) => {
      manager.registered.push(id);
      setup(manager.api);
    },
    setConfig: (config: { theme: unknown }) => {
      manager.configs.push(config);
    },
  },
}));

describe('Storybook manager theme', () => {
  it('follows the preview theme global', () => {
    expect(manager.registered).toEqual(['beskar/theme-sync']);
    expect(manager.configs.at(-1)).toEqual({ theme: managerThemes.light });

    manager.listeners.get(GLOBALS_UPDATED)?.({
      globals: { theme: 'dark' },
    });

    expect(manager.configs.at(-1)).toEqual({ theme: managerThemes.dark });
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
    // Read the inline style directly. jsdom does not resolve `var()` in
    // computed styles, which is what `toHaveStyle` compares.
    expect(document.body.style.backgroundColor).toBe('var(--background)');
  });
});
