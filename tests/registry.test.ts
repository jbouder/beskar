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
});
