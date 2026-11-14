---
name: beskar-component
description: >-
  House recipe for adding or changing a component in the Beskar shadcn
  registry. Use when asked to "add a component to beskar", "port the shadcn
  <name> component", "scaffold a component in registry/beskar/ui", "add a
  registry hook", "add a token to the theme", or "add a story or test for a
  beskar component". Covers fetching the stock base-lyra source, the
  adaptation rules, the registry.json entry, the story and test templates,
  the SSR probe, theme edits, and the verification gate.
---

# Authoring a Beskar registry component

A component is four coordinated edits: the component file, a `registry.json`
entry, a story, and a test. `AGENTS.md` has the rules. This skill is the
step-by-step recipe.

## Step 0: start from stock shadcn

Do not write a primitive from scratch when shadcn covers it. Fetch the
`base-lyra` source into a throwaway app outside the repo:

```sh
mkdir /tmp/stock && cd /tmp/stock
bun init -y
cat > components.json <<'JSON'
{"$schema":"https://ui.shadcn.com/schema.json","style":"base-lyra","rsc":false,"tsx":true,"tailwind":{"config":"","css":"src/index.css","baseColor":"neutral","cssVariables":true,"prefix":""},"iconLibrary":"phosphor","aliases":{"components":"@/components","ui":"@/components/ui","lib":"@/lib","utils":"@/lib/utils","hooks":"@/hooks"}}
JSON
mkdir -p src && touch src/index.css
bunx shadcn add <name> --yes
```

Copy `src/components/ui/<name>.tsx` to `registry/beskar/ui/<name>.tsx`. Copy
any hook it brought along to `registry/beskar/hooks/`.

## Step 1: adapt the component

Keep the diff from stock small. Make these changes and stop.

1. **`cn` import.** The fetched file may say `from "cn"`. Change it to
   `import { cn } from '@/lib/utils'`.
2. **Sibling imports.** `@/components/ui/<name>` and `@/hooks/<name>`. Never
   `@/ui/<name>`.
3. **Motion tokens.** Every `transition-*` gets a duration and an easing:

   | Stock                                                  | Beskar                                                  |
   | ------------------------------------------------------ | ------------------------------------------------------- |
   | `transition-colors`, `transition-all` with no duration | add `duration-(--duration-fast) ease-(--ease-standard)` |
   | `duration-100`, `duration-150`                         | `duration-(--duration-fast)`                            |
   | `duration-200`                                         | `duration-(--duration-base)`                            |
   | `ease-in-out`                                          | `ease-(--ease-emphasized)`                              |

   Never write `duration-[--token]`. It compiles to nothing in Tailwind v4 and
   CI rejects it. Gate decorative animation with `motion-safe:`.
4. **Data attributes.** `data-slot="<name>"` on every part. A part with
   variants also sets `data-variant` and `data-size`.
5. **Caller classes win.** Write `cn(xVariants({ variant, size }), className)`.
   Stock sometimes passes `className` into the `cva` call. Move it out.
6. **No `asChild`, no `forwardRef`.** Composition is Base UI's `render` prop.
   React 19 passes `ref` as a prop.
7. **Tokens only.** No hard-coded colors, fonts, radii, or durations.
8. **Icon-only parts** ship a default `aria-label` the caller can override.

Then run `bun run check:fix`. Biome owns formatting. When Biome flags stock
code, prefer a real fix. Use `biome-ignore` only with a reason a reader can
check.

### Fix stock bugs in the component

Stock shadcn has bugs. The tests find them. Fix each one in the component and
leave a short comment that says what stock does and why it is wrong. Do not
disable an axe rule or skip a test. Past examples:

- Combobox buttons with no accessible name.
- A calendar day button that created a ref and never attached it.
- A sidebar skeleton that used `Math.random` in render and broke hydration.
- Components defined inside a render function, which remount every render.

## Step 2: the `registry.json` entry

```json
{
  "name": "toggle",
  "type": "registry:ui",
  "title": "Toggle",
  "description": "A button that switches between on and off.",
  "dependencies": ["@base-ui/react", "class-variance-authority"],
  "registryDependencies": ["@beskar/utils", "@beskar/theme"],
  "files": [{ "path": "registry/beskar/ui/toggle.tsx", "type": "registry:ui" }]
}
```

- `dependencies`: the npm packages the file imports. Leave out `react`,
  `react-dom`, and `tailwindcss`. `clsx` and `tailwind-merge` belong to
  `utils`.
- `registryDependencies`: every Beskar item the file imports, as
  `@beskar/<name>`. A bare name resolves against the default shadcn registry
  and breaks `shadcn add` for apps. Always include `@beskar/utils` and
  `@beskar/theme` for a component.
- A hook is `registry:hook`, with files under `registry/beskar/hooks/`.
- Put `registry:ui` items before the hooks. The `theme` item stays last.
- Add the component to the catalog in
  `registry/beskar/skills/beskar-ui/SKILL.md`. `tests/skills.test.ts` fails
  until you do.

## Step 3: the story

`stories/<name>.stories.tsx`, CSF3, titled `Components/<Title>`.

```tsx
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Toggle } from '@/components/ui/toggle';

const meta = {
  title: 'Components/Toggle',
  component: Toggle,
  parameters: { layout: 'centered' },
  args: { variant: 'default', size: 'default' },
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: ['default', 'outline'],
      table: { defaultValue: { summary: 'default' } },
    },
  },
} satisfies Meta<typeof Toggle>;

export default meta;

type Story = StoryObj<typeof meta>;

/** An icon-only toggle needs an `aria-label`. */
export const Default: Story = {
  render: (args) => <Toggle aria-label="Bold" {...args} />,
};
```

- Give every variant and size a control with its options listed.
- For a multi-part component, write a small example component, type its
  story args, and use that as `component`. See `stories/tabs.stories.tsx`.
- Add a story for each state that matters: disabled, invalid, loading, empty.
- **Anything that opens gets an open-state story** with `defaultOpen`, so axe
  checks the popup and not only the trigger.
- Use a JSDoc comment on a story to say the one thing a user must know.
- Keep stories free of the network and the clock. Inline images as data URIs.
  Pin dates.
- Size a story frame with `max-w-[calc(100vw-2rem)]` so it fits a phone.
- A hook gets a story too, under `Hooks/`. See
  `stories/use-theme-preference.stories.tsx`.

Every story runs through axe in Chromium. A violation fails the test run.

## Step 4: the test

`tests/<name>.test.tsx`, with Testing Library and `userEvent`.

Cover:

- The behavior a user depends on: click, keyboard, open and close, selection.
- Roles and accessible names. Query by role first.
- `data-slot`, `data-variant`, and `data-size` on each part.
- That a caller's `className` wins over a variant class.
- Each branch in code you changed from stock.

jsdom gaps to know:

- No `matchMedia`. Stub it with `vi.stubGlobal`. See `tests/use-mobile.test.tsx`.
- `ResizeObserver` and `scrollIntoView` are stubbed in `tests/setup.ts`.
- Images never load, so an avatar shows its fallback.
- `var()` does not resolve. Assert the class or the inline style.
- Vitest clears mock calls before each test. Do not assert on calls made at
  import time through a mock.

### The SSR probe

`tests/ssr.test.tsx` renders every `registry:ui` item in Node. By default it
renders the export named after the item in PascalCase, with no props. Add an
entry to `PROBES` when that export needs children, context, or props to
render. Give a new hook a render probe at the bottom of the file.

## Step 5: theme changes

Only when the component needs a token that does not exist.

1. Edit `registry/beskar/globals.css`. A color needs the value in `:root`, the
   value in `.dark`, and `--color-<name>: var(--<name>)` in `@theme inline`.
2. Run `bun run sync:theme`. Never edit the `theme` item by hand.
3. Add each new text and surface pair to `tests/contrast.test.ts`.
4. Add the token to the matching Style Guide story.

## Step 6: the verification gate

All four must pass before the change is done.

```sh
bun run build:registry
bun run check
bunx tsc --noEmit
bun run test:coverage
```

Coverage of `registry/beskar` must stay above 80%. New code should be close
to 100%.

## Step 7: the pull request

- One conventional commit subject, like `feat(toggle): add the toggle component`.
- The PR says what changed, why, and how to test, in bullets.
- List every change from stock shadcn and why.
- Add desktop and phone screenshots in light and dark.
- Follow the writing style in `AGENTS.md`: American English, short sentences,
  no em dashes, no emoji.
