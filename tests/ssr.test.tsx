/**
 * SSR-safety check for every `registry:ui` component.
 *
 * Auto-discovers items from `registry.json` and verifies each one renders to
 * non-empty HTML with `renderToString` and does not emit React's
 * "useLayoutEffect does nothing on the server" warning.
 *
 * Runs in the `ssr` Vitest project (Node, no jsdom) so the test surface matches
 * what a real SSR renderer sees.
 *
 * A component is rendered bare by default. One that renders nothing without
 * children gets an entry in `PROBES`. Every `registry:hook` file is imported,
 * and each hook has an explicit render probe at the bottom.
 */
import { readFileSync } from 'node:fs';
import { createElement, type ReactElement } from 'react';
import { renderToString } from 'react-dom/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

interface RegistryItem {
  name: string;
  type: string;
  files: { path: string; type: string }[];
}

const registry = JSON.parse(
  readFileSync(new URL('../registry.json', import.meta.url), 'utf-8'),
) as { items: RegistryItem[] };

const uiItems = registry.items.filter((item) => item.type === 'registry:ui');
const hookItems = registry.items.filter(
  (item) => item.type === 'registry:hook',
);

type Module = Record<string, React.ComponentType<Record<string, unknown>>>;

const h = createElement;

/** A closed overlay: the root, its trigger, and its content. */
function overlay(root: string, trigger: string, content: string) {
  return (mod: Module) =>
    h(
      mod[root],
      null,
      h(mod[trigger], null, 'Open'),
      h(mod[content], null, 'Content'),
    );
}

/**
 * Components that render nothing when bare, or whose export is not the
 * PascalCase of the item name: build a meaningful tree instead.
 */
const PROBES: Record<string, (mod: Module) => ReactElement> = {
  tooltip: (mod) =>
    h(
      mod.TooltipProvider,
      null,
      overlay('Tooltip', 'TooltipTrigger', 'TooltipContent')(mod),
    ),
  dialog: overlay('Dialog', 'DialogTrigger', 'DialogContent'),
  'alert-dialog': overlay(
    'AlertDialog',
    'AlertDialogTrigger',
    'AlertDialogContent',
  ),
  sheet: overlay('Sheet', 'SheetTrigger', 'SheetContent'),
  popover: overlay('Popover', 'PopoverTrigger', 'PopoverContent'),
  'dropdown-menu': overlay(
    'DropdownMenu',
    'DropdownMenuTrigger',
    'DropdownMenuContent',
  ),
  select: (mod) =>
    h(
      mod.Select,
      null,
      h(mod.SelectTrigger, { 'aria-label': 'Pick' }, h(mod.SelectValue)),
      h(mod.SelectContent, null, h(mod.SelectItem, { value: 'a' }, 'A')),
    ),
  combobox: (mod) =>
    h(
      mod.Combobox,
      { items: ['a'] },
      h(mod.ComboboxInput, { 'aria-label': 'Pick' }),
      h(mod.ComboboxContent, null, h(mod.ComboboxList)),
    ),
  // The toaster renders nothing until a toast exists, so give it a wrapper.
  sonner: (mod) => h('div', null, h(mod.Toaster)),
};

/** Convert a kebab-case registry name to the PascalCase export name. */
function toPascalCase(name: string): string {
  return name
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

describe('SSR safety', () => {
  let errorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    errorSpy.mockRestore();
  });

  it('runs without a DOM', () => {
    expect(typeof window).toBe('undefined');
    expect(typeof document).toBe('undefined');
  });

  for (const item of uiItems) {
    const componentName = toPascalCase(item.name);

    it(`${item.name} (${componentName}) renders to non-empty HTML without useLayoutEffect warnings`, async () => {
      const mod = await import(`@/components/ui/${item.name}.tsx`);
      const probe = PROBES[item.name];
      const Component = mod[componentName] as React.ComponentType | undefined;

      if (!probe) {
        expect(
          Component,
          `@/components/ui/${item.name} does not export "${componentName}"`,
        ).toBeDefined();
      }

      const html = renderToString(
        // biome-ignore lint/style/noNonNullAssertion: guarded by the toBeDefined assertion above
        probe ? probe(mod) : createElement(Component!),
      );

      expect(
        html.trim(),
        `${componentName} produced empty HTML on the server`,
      ).not.toBe('');

      const hasLayoutEffectWarning = errorSpy.mock.calls.some(
        (args: unknown[]) =>
          args.some(
            (arg: unknown) =>
              typeof arg === 'string' &&
              arg.includes('useLayoutEffect does nothing on the server'),
          ),
      );
      expect(
        hasLayoutEffectWarning,
        `${componentName} emitted "useLayoutEffect does nothing on the server"`,
      ).toBe(false);
    });
  }
});

describe('SSR safety: hooks', () => {
  // Import-time safety: a hook file that touches `window`, `document`, or
  // `localStorage` at module scope throws here, because Node has none.
  for (const item of hookItems) {
    for (const file of item.files) {
      const importPath = file.path.replace(/^registry\/beskar/, '@');

      it(`${file.path} imports on the server`, async () => {
        await expect(import(importPath)).resolves.toBeDefined();
      });
    }
  }

  it('useThemePreference renders on the server with system defaults', async () => {
    const { useThemePreference } = await import('@/hooks/use-theme-preference');

    function Probe() {
      const { themeMode, isDarkMode } = useThemePreference();
      return createElement('div', null, `${themeMode}:${isDarkMode}`);
    }

    // Without a window there is no stored preference and no OS signal.
    expect(renderToString(createElement(Probe))).toContain('system:false');
  });

  it('ThemeProvider and useTheme render on the server', async () => {
    const { ThemeProvider, useTheme } = await import('@/hooks/theme-provider');

    function Probe() {
      const { themeMode, isDarkMode } = useTheme();
      return createElement('div', null, `${themeMode}:${isDarkMode}`);
    }

    expect(
      renderToString(createElement(ThemeProvider, null, createElement(Probe))),
    ).toContain('system:false');
  });
});
