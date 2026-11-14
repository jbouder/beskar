/**
 * The two skills are documentation that an AI assistant acts on, so they must
 * not drift from the registry. These checks fail when an item is added
 * without a catalog entry, or when a skill names something that is gone.
 */
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

interface RegistryItem {
  name: string;
  type: string;
  files?: { path: string; type: string; target?: string }[];
}

const root = resolve(import.meta.dirname, '..');
const read = (path: string) => readFileSync(resolve(root, path), 'utf8');

const registry = JSON.parse(read('registry.json')) as {
  items: RegistryItem[];
};
const names = new Set(registry.items.map((item) => item.name));

const CONSUMER = 'registry/beskar/skills/beskar-ui/SKILL.md';
const CONTRIBUTOR = '.claude/skills/beskar-component/SKILL.md';

/** The `name` and `description` from a skill's YAML frontmatter. */
function frontmatter(source: string) {
  const match = source.match(/^---\n([\s\S]*?)\n---\n/);
  expect(match, 'the skill starts with YAML frontmatter').not.toBeNull();
  const body = match?.[1] ?? '';
  const name = body.match(/^name: (.+)$/m)?.[1];
  const description = body
    .slice(body.indexOf('description:') + 'description:'.length)
    .replace(/^\s*>-\s*/, '')
    .replace(/\s+/g, ' ')
    .trim();
  return { name, description };
}

describe.each([
  ['beskar-ui', CONSUMER],
  ['beskar-component', CONTRIBUTOR],
])('%s skill', (name, path) => {
  const source = read(path);

  it('has a name that matches its folder and a usable description', () => {
    const meta = frontmatter(source);
    expect(meta.name).toBe(name);
    expect(meta.description.length).toBeGreaterThan(80);
    // Claude Code truncates long descriptions in the skill listing.
    expect(meta.description.length).toBeLessThan(1024);
  });

  it('follows the writing style', () => {
    expect(source).not.toMatch(/—/);
    expect(source).not.toMatch(/\p{Extended_Pictographic}/u);
  });

  it('never uses the Tailwind v3 token syntax', () => {
    const lines = source
      .split('\n')
      .filter((line) => /(duration|ease)-\[--/.test(line))
      // The skills name the broken form once, to warn against it.
      .filter((line) => !/compiles to nothing|Never write/.test(line));
    expect(lines).toEqual([]);
  });
});

describe('beskar-ui skill catalog', () => {
  const source = read(CONSUMER);

  it('ships through the registry into the app skill folder', () => {
    const item = registry.items.find((entry) => entry.name === 'claude-skill');
    expect(item?.type).toBe('registry:file');
    expect(item?.files).toEqual([
      {
        path: CONSUMER,
        type: 'registry:file',
        target: '~/.claude/skills/beskar-ui/SKILL.md',
      },
    ]);
  });

  const documented = registry.items.filter(
    (item) => item.name !== 'claude-skill',
  );

  it.each(documented)('lists the $name item', (item) => {
    // Table cells may be padded, so allow spaces around the name.
    expect(source).toMatch(new RegExp(`\\|\\s*\`${item.name}\`\\s*\\|`));
  });

  // Low-level parts that apps do not compose directly.
  const INTERNAL =
    /(Portal|Overlay|ScrollUpButton|ScrollDownButton)$|^(ProgressTrack|ProgressIndicator|CalendarDayButton|tabsListVariants)$/;

  it('lists every export of every component', () => {
    const missing: string[] = [];
    for (const item of registry.items) {
      if (item.type !== 'registry:ui') continue;
      // Read the export block instead of importing, which is slow for 33 files.
      const file = read(`registry/beskar/ui/${item.name}.tsx`);
      const block = file.match(/export \{([^}]+)\}/)?.[1] ?? '';
      const exported = block
        .split(',')
        .map((name) => name.trim())
        .filter(Boolean);
      expect(exported.length, item.name).toBeGreaterThan(0);
      for (const name of exported) {
        if (INTERNAL.test(name)) continue;
        if (!source.includes(`\`${name}\``)) {
          missing.push(`${item.name}: ${name}`);
        }
      }
    }
    expect(missing).toEqual([]);
  });

  it('only installs items that exist', () => {
    const referenced = [...source.matchAll(/@beskar\/([a-z][a-z-]*)/g)].map(
      (match) => match[1],
    );
    expect(referenced.length).toBeGreaterThan(3);
    for (const name of referenced) {
      expect(names.has(name), `@beskar/${name}`).toBe(true);
    }
  });

  it('points at the deployed registry', () => {
    const wrangler = read('wrangler.jsonc');
    expect(wrangler).toContain('"name": "beskar"');
    expect(source).toContain(
      'https://beskar.vibeproject.workers.dev/r/{name}.json',
    );
  });
});

describe('beskar-component skill', () => {
  const source = read(CONTRIBUTOR);

  it('only points at files that exist', () => {
    const paths = [
      ...source.matchAll(/`((?:stories|tests|registry|scripts)\/[^`<*]+)`/g),
    ].map((match) => match[1]);
    expect(paths.length).toBeGreaterThan(5);
    for (const path of paths) {
      expect(existsSync(resolve(root, path)), path).toBe(true);
    }
  });

  it('names the same gate commands as package.json', () => {
    const scripts = JSON.parse(read('package.json')).scripts as Record<
      string,
      string
    >;
    const used = [...source.matchAll(/bun run ([a-z:]+)/g)].map(
      (match) => match[1],
    );
    for (const script of used) {
      expect(scripts[script], `bun run ${script}`).toBeDefined();
    }
  });
});
