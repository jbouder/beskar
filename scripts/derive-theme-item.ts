/**
 * Derives the installable `theme` registry item from
 * `registry/beskar/globals.css`.
 *
 * `globals.css` is the single source of truth for tokens. The shadcn CLI can only
 * ship flat key/value maps (`cssVars`) plus generic CSS (`css`), and it decides
 * where each lands: `cssVars.light` → the first `:root`, `cssVars.dark` → `.dark`,
 * `cssVars.theme` → `@theme inline`, `css["@keyframes …"]` → inside
 * `@theme inline`, and any other `css` selector is upserted in place. This module
 * maps the stylesheet onto those buckets so the built item re-creates the same
 * structure, and `tests/theme.test.ts` fails when `registry.json` drifts from it.
 *
 * Classification rules:
 *   - A `:root` variable is *semantic* (→ `cssVars.light`) when `@theme inline`
 *     exposes it as a Tailwind color (`--color-X: var(--X)`), or when it is
 *     `--radius`. Everything else in `:root` is a *primitive* (→ `css[":root"]`),
 *     which keeps primitives out of `@theme` — they must not become utilities.
 *   - Every `.dark` variable → `cssVars.dark`.
 *   - Every `@theme inline` variable that is not a `--color-*` mapping or a
 *     `--radius-*` step → `cssVars.theme` (fonts, motion tokens, `--animate-*`).
 *     The CLI derives the `--color-*` mappings and the radius steps itself.
 *   - Every `@keyframes` inside `@theme inline` → `css["@keyframes <name>"]`.
 *   - Every `@import` except `tailwindcss` → `css["@import <params>"]`.
 *   - Every `@custom-variant` except `dark` (the CLI adds that one itself) →
 *     `css["@custom-variant <params>"]`.
 *   - Every top-level `@layer` and `@media` block → `css["@<name> <params>"]`,
 *     with its rules nested inside. `@apply` lines ride along as keys.
 */
import postcss, { type AtRule, type Container, type Rule } from 'postcss';

type CssBlock = { [key: string]: string | CssBlock };

export type ThemeItemCss = {
  css: Record<string, CssBlock>;
  cssVars: {
    theme: Record<string, string>;
    light: Record<string, string>;
    dark: Record<string, string>;
  };
};

function declarations(container: Container): Record<string, string> {
  const out: Record<string, string> = {};
  for (const node of container.nodes ?? []) {
    if (node.type === 'decl') {
      out[node.prop] = node.value;
    }
  }
  return out;
}

/** A rule or at-rule body as the nested object shape the CLI writes back. */
function block(container: Container): CssBlock {
  const out: CssBlock = {};
  for (const node of container.nodes ?? []) {
    if (node.type === 'decl') {
      out[node.prop] = node.important ? `${node.value} !important` : node.value;
    } else if (node.type === 'rule') {
      out[node.selector.replace(/\s+/g, ' ')] = block(node);
    } else if (node.type === 'atrule') {
      out[`@${node.name} ${node.params}`] = node.nodes ? block(node) : {};
    }
  }
  return out;
}

function stripDashes(vars: Record<string, string>): Record<string, string> {
  return Object.fromEntries(
    Object.entries(vars).map(([prop, value]) => [
      prop.replace(/^--/, ''),
      value,
    ]),
  );
}

function only<T>(nodes: T[], what: string): T {
  if (nodes.length !== 1) {
    throw new Error(
      `globals.css must contain exactly one ${what} (found ${nodes.length}); the shadcn CLI merges into the first match and appends to it.`,
    );
  }
  return nodes[0];
}

export function deriveThemeItem(globalsCss: string): ThemeItemCss {
  const root = postcss.parse(globalsCss);
  const nodes = root.nodes ?? [];

  const rootRule = only(
    nodes.filter((n): n is Rule => n.type === 'rule' && n.selector === ':root'),
    '`:root` rule',
  );
  const darkRule = only(
    nodes.filter((n): n is Rule => n.type === 'rule' && n.selector === '.dark'),
    '`.dark` rule',
  );
  const themeNode = only(
    nodes.filter(
      (n): n is AtRule =>
        n.type === 'atrule' && n.name === 'theme' && n.params === 'inline',
    ),
    '`@theme inline` block',
  );
  const strayKeyframes = nodes.filter(
    (n): n is AtRule => n.type === 'atrule' && n.name === 'keyframes',
  );
  if (strayKeyframes.length > 0) {
    throw new Error(
      `globals.css has top-level @keyframes (${strayKeyframes
        .map((k) => k.params)
        .join(
          ', ',
        )}); the shadcn CLI writes keyframes inside \`@theme inline\`, so they must live there to be deduplicated.`,
    );
  }

  const themeDecls = declarations(themeNode);
  const semanticNames = new Set<string>(['radius']);
  for (const [prop, value] of Object.entries(themeDecls)) {
    const match = prop.match(/^--color-(.+)$/);
    if (match && value === `var(--${match[1]})`) {
      semanticNames.add(match[1]);
    }
  }

  const light: Record<string, string> = {};
  const primitives: Record<string, string> = {};
  for (const [prop, value] of Object.entries(declarations(rootRule))) {
    const name = prop.replace(/^--/, '');
    if (semanticNames.has(name)) {
      light[name] = value;
    } else {
      primitives[prop] = value;
    }
  }

  const theme: Record<string, string> = {};
  for (const [prop, value] of Object.entries(themeDecls)) {
    if (/^--color-/.test(prop) || /^--radius-/.test(prop)) continue;
    theme[prop.replace(/^--/, '')] = value;
  }

  const css: ThemeItemCss['css'] = {};
  for (const node of nodes) {
    if (node.type !== 'atrule') continue;
    const isExtraImport =
      node.name === 'import' && !/^["']tailwindcss["']$/.test(node.params);
    const isExtraVariant =
      node.name === 'custom-variant' && !/^dark\b/.test(node.params);
    if (isExtraImport || isExtraVariant) {
      css[`@${node.name} ${node.params}`] = {};
    }
  }
  css[':root'] = primitives;
  for (const node of nodes) {
    if (node.type !== 'atrule') continue;
    if (node.name === 'layer' || node.name === 'media') {
      css[`@${node.name} ${node.params}`] = block(node);
    }
  }
  for (const node of themeNode.nodes ?? []) {
    if (node.type !== 'atrule' || node.name !== 'keyframes') continue;
    const steps: Record<string, Record<string, string>> = {};
    for (const step of node.nodes ?? []) {
      if (step.type !== 'rule') continue;
      steps[step.selector.replace(/\s*,\s*/g, ', ')] = declarations(step);
    }
    css[`@keyframes ${node.params}`] = steps;
  }

  return {
    css,
    cssVars: { theme, light, dark: stripDashes(declarations(darkRule)) },
  };
}
