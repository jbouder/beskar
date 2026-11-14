/**
 * Guards the contract between `registry/beskar/globals.css` and the installable
 * `theme` item, and proves that `npx shadcn add @beskar/theme` is idempotent
 * against a stylesheet that already carries the theme (nebari-design#151).
 *
 * The CLI tests run the real `shadcn` binary (the pinned devDependency) against
 * a throwaway consumer project, because the merge behavior under test, where
 * keyframes land, which `:root` gets appended to, which radius steps get added,
 * when existing values are overwritten, lives in the CLI, not in this repo.
 */
import { execFileSync } from 'node:child_process';
import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import postcss, { type ChildNode, type Container } from 'postcss';
import { afterAll, describe, expect, it } from 'vitest';
import { deriveThemeItem } from '../scripts/derive-theme-item';

const repoRoot = resolve(import.meta.dirname, '..');
const globalsCss = readFileSync(
  resolve(repoRoot, 'registry/beskar/globals.css'),
  'utf8',
);
const registry = JSON.parse(
  readFileSync(resolve(repoRoot, 'registry.json'), 'utf8'),
) as {
  items: {
    name: string;
    type: string;
    css?: unknown;
    cssVars?: unknown;
    [key: string]: unknown;
  }[];
};
const themeItem = registry.items.find((item) => item.name === 'theme');
if (!themeItem) throw new Error('registry.json has no `theme` item');

// ---------------------------------------------------------------------------
// Normalisation: compare stylesheets structurally, ignoring comments and
// whitespace (the CLI re-indents what it rewrites) and declaration order.
// ---------------------------------------------------------------------------

type Shape =
  | { kind: 'decl'; prop: string; value: string }
  | { kind: 'rule'; selector: string; nodes: Shape[] }
  | { kind: 'atrule'; name: string; params: string; nodes: Shape[] | null };

function shapeOf(container: Container): Shape[] {
  const shapes: Shape[] = [];
  for (const node of container.nodes ?? []) {
    const shape = shapeOfNode(node);
    if (shape) shapes.push(shape);
  }
  return shapes.sort((a, b) =>
    JSON.stringify(a).localeCompare(JSON.stringify(b)),
  );
}

function shapeOfNode(node: ChildNode): Shape | null {
  const squash = (s: string) => s.replace(/\s+/g, ' ').trim();
  switch (node.type) {
    case 'decl':
      return { kind: 'decl', prop: node.prop, value: squash(node.value) };
    case 'rule':
      return {
        kind: 'rule',
        selector: squash(node.selector),
        nodes: shapeOf(node),
      };
    case 'atrule':
      return {
        kind: 'atrule',
        name: node.name,
        params: squash(node.params),
        nodes: node.nodes ? shapeOf(node) : null,
      };
    default:
      return null;
  }
}

function normalise(css: string, omit: (shape: Shape) => boolean = () => false) {
  return shapeOf(postcss.parse(css)).filter((shape) => !omit(shape));
}

// ---------------------------------------------------------------------------
// A minimal Tailwind v4 consumer the CLI is happy to write into.
// ---------------------------------------------------------------------------

const shadcnBin = resolve(repoRoot, 'node_modules/.bin/shadcn');
const tempDirs: string[] = [];

function createConsumer(stylesheet: string) {
  const dir = mkdtempSync(join(tmpdir(), 'beskar-theme-'));
  tempDirs.push(dir);
  mkdirSync(join(dir, 'src/lib'), { recursive: true });
  writeFileSync(
    join(dir, 'package.json'),
    JSON.stringify({
      name: 'consumer',
      private: true,
      type: 'module',
      dependencies: {
        react: '^19.1.0',
        'react-dom': '^19.1.0',
        tailwindcss: '^4.1.13',
      },
    }),
  );
  writeFileSync(
    join(dir, 'tsconfig.json'),
    JSON.stringify({
      compilerOptions: {
        jsx: 'react-jsx',
        baseUrl: '.',
        paths: { '@/*': ['./src/*'] },
      },
    }),
  );
  writeFileSync(
    join(dir, 'components.json'),
    JSON.stringify({
      $schema: 'https://ui.shadcn.com/schema.json',
      style: 'base-lyra',
      rsc: false,
      tsx: true,
      tailwind: {
        config: '',
        css: 'src/index.css',
        baseColor: 'neutral',
        cssVariables: true,
        prefix: '',
      },
      iconLibrary: 'phosphor',
      aliases: {
        components: '@/components',
        ui: '@/components/ui',
        lib: '@/lib',
        utils: '@/lib/utils',
        hooks: '@/hooks',
      },
    }),
  );
  writeFileSync(join(dir, 'src/lib/utils.ts'), 'export {};\n');
  writeFileSync(join(dir, 'src/index.css'), stylesheet);
  // The built item is the registry entry plus the item schema (it has no files).
  writeFileSync(
    join(dir, 'theme.json'),
    JSON.stringify({
      $schema: 'https://ui.shadcn.com/schema/registry-item.json',
      ...themeItem,
    }),
  );
  return {
    dir,
    applyTheme() {
      execFileSync(
        shadcnBin,
        ['add', '--yes', '--overwrite', join(dir, 'theme.json')],
        {
          cwd: dir,
          stdio: 'pipe',
        },
      );
      return readFileSync(join(dir, 'src/index.css'), 'utf8');
    },
  };
}

afterAll(() => {
  for (const dir of tempDirs) rmSync(dir, { recursive: true, force: true });
});

// ---------------------------------------------------------------------------

describe('theme item ↔ globals.css contract', () => {
  it('registry.json `theme` is exactly what globals.css derives to (run `bun run sync:theme`)', () => {
    const derived = deriveThemeItem(globalsCss);
    expect(themeItem.css).toEqual(derived.css);
    expect(themeItem.cssVars).toEqual(derived.cssVars);
  });

  it('ships every semantic token for both light and dark', () => {
    const { light, dark } = deriveThemeItem(globalsCss).cssVars;
    const lightOnly = Object.keys(light).filter((k) => !(k in dark));
    expect(lightOnly).toEqual(['radius']);
    expect(Object.keys(dark).filter((k) => !(k in light))).toEqual([]);
  });

  it('keeps motion tokens as plain variables, not Tailwind colors', () => {
    const { css, cssVars } = deriveThemeItem(globalsCss);
    const primitives = Object.keys(css[':root']);
    expect(primitives).toContain('--duration-base');
    expect(primitives).toContain('--ease-standard');
    for (const prop of primitives) {
      expect(cssVars.light).not.toHaveProperty(prop.replace(/^--/, ''));
    }
  });

  it('carries the imports, the extra variant, and the reduced-motion block', () => {
    const { css } = deriveThemeItem(globalsCss);
    expect(Object.keys(css)).toEqual(
      expect.arrayContaining([
        '@import "tw-animate-css"',
        '@import "shadcn/tailwind.css"',
        '@custom-variant hover-none (@media (hover: none))',
        '@layer base',
        '@media (prefers-reduced-motion: reduce)',
      ]),
    );
  });
});

describe('theme item dependencies', () => {
  // The CLI copies each `@import` into the app's stylesheet. If the package
  // behind it is not a dependency of the theme, the app's CSS build fails.
  it('lists every package that globals.css imports', () => {
    const css = readFileSync(
      resolve(import.meta.dirname, '../registry/beskar/globals.css'),
      'utf8',
    );
    const manifest = JSON.parse(
      readFileSync(resolve(import.meta.dirname, '../registry.json'), 'utf8'),
    ) as { items: { name: string; dependencies?: string[] }[] };
    const dependencies =
      manifest.items.find((item) => item.name === 'theme')?.dependencies ?? [];

    const packages = [...css.matchAll(/^@import "([^"]+)";/gm)]
      .map((match) => match[1])
      // The package name is the first segment, or the first two when scoped.
      .map((specifier) =>
        specifier
          .split('/')
          .slice(0, specifier.startsWith('@') ? 2 : 1)
          .join('/'),
      )
      // Every shadcn app already has Tailwind.
      .filter((name) => name !== 'tailwindcss');

    expect(packages.length).toBeGreaterThan(0);
    for (const name of packages) {
      expect(dependencies, name).toContain(name);
    }
  });
});

describe('shadcn add @beskar/theme', () => {
  const cliTimeout = 120_000;

  it(
    'is a no-op on a stylesheet that already carries the theme',
    () => {
      const consumer = createConsumer(globalsCss);
      const applied = consumer.applyTheme();
      expect(normalise(applied)).toEqual(normalise(globalsCss));
    },
    cliTimeout,
  );

  it(
    'reaches a fixed point: applying twice produces the same bytes as applying once',
    () => {
      const consumer = createConsumer(globalsCss);
      const once = consumer.applyTheme();
      const twice = consumer.applyTheme();
      expect(twice).toBe(once);
    },
    cliTimeout,
  );

  it(
    'produces the globals.css structure on a fresh Tailwind stylesheet',
    () => {
      const consumer = createConsumer('@import "tailwindcss";\n');
      const applied = consumer.applyTheme();
      expect(normalise(applied)).toEqual(normalise(globalsCss));

      const root = postcss.parse(applied);
      const keyframes = root.nodes.filter(
        (n) => n.type === 'atrule' && n.name === 'keyframes',
      );
      expect(keyframes, 'keyframes belong inside @theme inline').toHaveLength(
        0,
      );
      expect(
        root.nodes.filter((n) => n.type === 'rule' && n.selector === ':root'),
      ).toHaveLength(1);
    },
    cliTimeout,
  );
});
