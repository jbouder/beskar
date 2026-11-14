/**
 * SSR-safety check for every `registry:ui` component.
 *
 * Auto-discovers items from `registry.json` and verifies each one renders to
 * non-empty HTML with `renderToString` and does not emit React's
 * "useLayoutEffect does nothing on the server" warning.
 *
 * Runs in the `ssr` Vitest project (Node, no jsdom) so the test surface matches
 * what a real SSR renderer sees. `registry:hook` items need a render probe
 * each. Add those here when the first hook lands.
 */
import { readFileSync } from 'node:fs';
import { createElement } from 'react';
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
      const Component = mod[componentName] as React.ComponentType | undefined;

      expect(
        Component,
        `@/components/ui/${item.name} does not export "${componentName}"`,
      ).toBeDefined();

      // biome-ignore lint/style/noNonNullAssertion: guarded by the toBeDefined assertion above
      const html = renderToString(createElement(Component!));

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
