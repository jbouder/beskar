# AGENTS.md

Guidance for coding agents working in **Beskar**, the design system for
jbouder's vibe projects (holocron, holotable, datapad, acolyte, pulse).

## What this repo is

A [shadcn component registry](https://ui.shadcn.com/docs/registry), **not** a
published component library. Components ship as **source** that apps copy in
with `bunx shadcn add @beskar/<name>`. Storybook and the registry JSON are one
static Cloudflare Worker: Storybook at `https://beskar.vibeproject.workers.dev/` and the
registry at `https://beskar.vibeproject.workers.dev/r/`.
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
bun run build:pages         # full site build (Storybook at /, registry at /r)

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

## Deploy

`.github/workflows/deploy.yml` deploys `main` to Cloudflare after CI passes. It
needs the `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` repository
secrets, and skips the deploy (staying green) without them. Deploy through CI,
not from a local `wrangler login`. `wrangler.jsonc` has no single-page
fallback on purpose: an unknown registry item must return 404.

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

## Theme

`registry/beskar/globals.css` is the single source of truth for tokens. The
installable `theme` item in `registry.json` is **derived** from it. Never edit
the item's `css` or `cssVars` by hand.

```sh
bun run sync:theme    # after any edit to globals.css
```

`tests/theme.test.ts` fails when the two drift. It also runs the real `shadcn`
CLI against a throwaway app to prove that installing the theme reproduces
`globals.css` and that installing it twice changes nothing.

Rules for `globals.css`:

- Exactly one `:root`, one `.dark`, and one `@theme inline` block. The CLI
  merges into the first match of each.
- A color token needs three lines: the value in `:root`, the value in `.dark`,
  and `--color-<name>: var(--<name>)` in `@theme inline`. That mapping is what
  makes it a Tailwind color.
- Non-color tokens (durations, easings) live in `:root` only.
- Write a multi-part selector on one line inside `@layer` and `@media` blocks.
  The CLI matches selectors as written, so a wrapped one is duplicated on
  reinstall.
- Every text-on-surface pairing must hold 4.5:1 in both themes. Add new
  pairings to `tests/contrast.test.ts`.
- Status colors are `ok`, `warn`, and `destructive`. Categorical colors are the
  six `tone-*` inks, each paired with its `tone-*-soft` fill.

The Style Guide stories (`stories/Colors`, `Typography`, `Icons`, `Motion`)
read token values live. Add a new token to the matching story.

## Authoring a component

A component is **four coordinated edits**: the component file, a
`registry.json` entry, a story, and a test.

- **Start from shadcn.** Take the `base-lyra` source for the component and
  adapt it. Do not write a primitive from scratch when shadcn covers it. Keep
  the diff from stock small: swap the `cn` import, add the motion tokens to
  every `transition-*`, add the data attributes, and stop.
- **Links.** `Button` keeps button semantics even through `render`. For a
  navigation link that looks like a button, put `buttonVariants()` on an `<a>`.
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
  with no DOM. The PascalCase of the item name must be a named export. A
  component that renders nothing when bare (a tooltip, a dialog) gets a probe
  in that file's `PROBES` map. A new `registry:hook` gets a render probe there
  too.
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
