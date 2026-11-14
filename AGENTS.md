# AGENTS.md

Guidance for coding agents working in **Beskar**, the design system for
jbouder's vibe projects (holocron, holotable, datapad, acolyte, pulse).

## What this repo is

A [shadcn component registry](https://ui.shadcn.com/docs/registry), **not** a
published component library. Components ship as **source** that apps copy in
with `bunx shadcn add @beskar/<name>`. The registry JSON is served from GitHub
Pages at `https://jbouder.github.io/beskar/r/`, next to the Storybook site.
There is no compiled package output. Do not add a library build step and do not
`npm publish` components.

The design language:

- shadcn style `base-lyra`, built on Base UI (`@base-ui/react`). No Radix.
- Oxanium Variable for UI and headings. JetBrains Mono Variable for code.
- Phosphor icons (`@phosphor-icons/react`). No lucide.
- Square corners: `--radius` is 0.

## Setup and commands

The package manager is **Bun**. Use `bun` / `bunx`, never npm or yarn.

```sh
bun install                 # install deps (CI uses --frozen-lockfile)

bun run storybook           # dev: Storybook on :6006
bun run build:registry      # build registry items into public/r
bun run build:pages         # full Pages build (Storybook at /, registry at /r)

bun run check               # Biome: format + lint + import order
bun run check:fix           # same, and apply fixes
bunx tsc --noEmit           # type check
bun run test                # Vitest: unit + SSR + Storybook a11y
bun run test:coverage       # same, with the 80% coverage gate
```

### Verification gate

Run all four before calling any change done. All four must pass.

```sh
bun run build:registry
bun run check
bunx tsc --noEmit
bun run test
```

Let `bun run check:fix` own formatting and import order. Do not hand-format.
The Storybook test project needs Chromium once: `bunx playwright install chromium`.

Storybook's packages (`storybook` and every `@storybook/*`) are pinned to one
exact version and must move together. Dependabot ignores them, so bump them by
hand. `tests/tooling.test.ts` fails if they drift apart.

## Repo structure

```
registry/beskar/
  ui/<name>.tsx        # components (kebab-case filenames)
  hooks/<name>.ts      # shared non-visual logic (registry:hook)
  lib/utils.ts         # cn() helper
  globals.css          # theme source of truth: tokens, light and .dark, @theme inline
  skills/beskar-ui/    # consumer skill, shipped through the registry
stories/<name>.stories.tsx   # Storybook stories. Top-level, not co-located.
tests/<name>.test.tsx        # Vitest tests. Top-level, not co-located.
scripts/               # theme sync and other repo scripts
.claude/skills/beskar-component/   # contributor skill: how to author a component
.storybook/            # Storybook config and the light/dark theme sync
registry.json          # registry manifest: one item per component, lib, hook, theme
components.json        # shadcn config (style base-lyra, phosphor icons, aliases)
```

Some of these folders do not exist yet. They arrive with the phase that needs
them.

### Path alias

`@/*` resolves to `registry/beskar/*`, and the more specific `@/components/ui/*`
resolves to `registry/beskar/ui/*`. The mapping lives in four places that must
stay in step: `tsconfig.json`, `vite.config.ts`, `vitest.config.ts`, and
`.storybook/main.ts`. There is no `src/`.

Always import registry siblings as `@/components/ui/<name>`, never `@/ui/<name>`
(Biome's `noRestrictedImports` rejects it). That is the path the shadcn CLI
emits for a consumer with default aliases, so an installed file is
byte-identical to its registry source and a plain `diff` detects drift.

## Authoring a component

A component is **four coordinated edits**: the component file, a
`registry.json` entry, a story, and a test.

- **Start from shadcn.** Take the `base-lyra` source for the component and
  adapt it. Do not write a primitive from scratch when shadcn covers it.
- **Location and naming.** Component at `registry/beskar/ui/<name>.tsx`. Story
  at `stories/<name>.stories.tsx` (CSF3). Test at `tests/<name>.test.tsx`.
- **Variants through `cva`.** Export the `*Variants` function next to the
  component. Type props with `VariantProps<typeof xVariants>`.
- **Stable data hooks.** Set `data-slot="<name>"` on the root. Components with
  variants also emit `data-variant` and `data-size`.
- **`cn()` merging.** Always `cn(xVariants({...}), className)` so the caller's
  `className` wins. Import `cn` from `@/lib/utils`.
- **Composition uses Base UI's `render` prop.** Do not add an `asChild` API.
- **Function components, named exports, no `forwardRef`.** React 19 passes
  `ref` as a normal prop.
- **SSR-safe.** `tests/ssr.test.tsx` renders every `registry:ui` item in Node
  with no DOM. The PascalCase of the item name must be a named export.
- **Tokens only.** No hard-coded colors, fonts, radii, or durations. Use the
  semantic tokens from `globals.css`.
- **Motion.** Use `duration-(--token)` and `ease-(--token)`. The Tailwind v3
  form `duration-[--token]` compiles to nothing under v4 and CI rejects it.
  Gate non-essential motion with `motion-safe:`.
- **Accessible.** Every story runs through axe in a real browser, and any
  violation fails the test run.

### `registry.json` entry

- `dependencies` lists the npm packages the file imports. Leave out `react`,
  `react-dom`, and `tailwindcss`. `clsx` and `tailwind-merge` belong to `utils`.
- `registryDependencies` lists other registry items. Anything that calls `cn()`
  lists `"@beskar/utils"`. Anything that needs tokens lists `"@beskar/theme"`.
- **Reference in-repo items as `@beskar/<name>`, never by bare name.** The
  shadcn CLI resolves a bare name against the default registry, which 404s and
  aborts `shadcn add` for consumers. `tests/registry.test.ts` enforces this.

## Writing style

American English. Short, direct sentences. No em dashes and no emoji in docs,
comments, commits, or PR text.

## Commits and PRs

Conventional commit prefixes (`feat`, `fix`, `docs`, `chore`, `refactor`,
`test`), with a scope when there is a natural one, like `feat(button): ...`.
Imperative subject under 72 characters, no trailing period. PR descriptions
say what changed, why, and how to test, in bullets.
