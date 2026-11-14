/**
 * Storybook's packages must all be on one exact version. A caret range lets
 * `storybook` drift ahead of its addons, and the Storybook browser tests then
 * fail to load with an unrelated-looking module error.
 */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const pkg = JSON.parse(
  readFileSync(resolve(import.meta.dirname, '../package.json'), 'utf8'),
) as { devDependencies: Record<string, string> };

describe('package.json', () => {
  it('pins every Storybook package to the same exact version', () => {
    const versions = Object.entries(pkg.devDependencies).filter(
      ([name]) => name === 'storybook' || name.startsWith('@storybook/'),
    );

    expect(versions.length).toBeGreaterThan(1);
    for (const [name, version] of versions) {
      expect(version, name).toMatch(/^\d+\.\d+\.\d+$/);
      expect(version, name).toBe(pkg.devDependencies.storybook);
    }
  });
});
