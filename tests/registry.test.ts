/**
 * Manifest checks that hold for every item, so a bad `registry.json` entry
 * fails here instead of at `shadcn add` time in a consumer app.
 */
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

interface RegistryItem {
  name: string;
  type: string;
  registryDependencies?: string[];
  files?: { path: string; type: string }[];
}

const root = resolve(import.meta.dirname, '..');
const registry = JSON.parse(
  readFileSync(resolve(root, 'registry.json'), 'utf8'),
) as { name: string; items: RegistryItem[] };
const names = new Set(registry.items.map((item) => item.name));

describe('registry.json', () => {
  it('is the beskar registry and has unique item names', () => {
    expect(registry.name).toBe('beskar');
    expect(names.size).toBe(registry.items.length);
  });

  it.each(registry.items)('$name: every file exists', (item) => {
    for (const file of item.files ?? []) {
      expect(existsSync(resolve(root, file.path)), file.path).toBe(true);
    }
  });

  // A bare name resolves against the default shadcn registry and 404s for
  // consumers, so in-repo dependencies must use the @beskar namespace.
  it.each(registry.items)(
    '$name: registry dependencies are namespaced and exist',
    (item) => {
      for (const dep of item.registryDependencies ?? []) {
        expect(dep, dep).toMatch(/^@beskar\//);
        expect(names.has(dep.replace('@beskar/', '')), dep).toBe(true);
      }
    },
  );

  // Apps with React Server Components (acolyte) need the directive on every
  // component that upstream shadcn marks as a client component. The shadcn
  // CLI strips it when it installs into an app with `rsc: false`, which is
  // how these files were first fetched, so it is easy to lose.
  const CLIENT_COMPONENTS = new Set([
    'alert-dialog',
    'avatar',
    'calendar',
    'checkbox',
    'combobox',
    'command',
    'dialog',
    'dropdown-menu',
    'field',
    'input-group',
    'label',
    'popover',
    'progress',
    'select',
    'separator',
    'sheet',
    'sidebar',
    'sonner',
    'switch',
    'table',
    'tabs',
    'toggle',
    'toggle-group',
    'tooltip',
  ]);
  const SERVER_SAFE = new Set([
    'alert',
    'badge',
    'button',
    'card',
    'empty',
    'input',
    'skeleton',
    'spinner',
    'textarea',
  ]);

  it.each(registry.items.filter((item) => item.type === 'registry:ui'))(
    '$name: has the use client directive when it needs one',
    (item) => {
      const listed =
        CLIENT_COMPONENTS.has(item.name) || SERVER_SAFE.has(item.name);
      expect(
        listed,
        `add ${item.name} to CLIENT_COMPONENTS or SERVER_SAFE, matching upstream shadcn`,
      ).toBe(true);

      const source = readFileSync(
        resolve(root, `registry/beskar/ui/${item.name}.tsx`),
        'utf8',
      );
      expect(source.startsWith("'use client';")).toBe(
        CLIENT_COMPONENTS.has(item.name),
      );
    },
  );
});
