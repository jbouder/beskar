# Beskar

Design system for my vibe projects (holocron, holotable, datapad, acolyte, pulse).

Beskar is a [shadcn registry](https://ui.shadcn.com/docs/registry). Components ship as source that you copy into an app with the `shadcn` CLI. There is no npm package.

- Style: shadcn `base-lyra` on [Base UI](https://base-ui.com)
- Fonts: Oxanium for UI and headings, JetBrains Mono for code
- Icons: Phosphor
- Corners: square

## What is in it

- **Theme:** neutral light and dark palettes, status and tone colors, fonts, and motion tokens.
- **33 components:** form basics, overlays and menus, and app pieces like sidebar, table, and calendar.
- **Hooks:** theme preference (light, dark, system) and the mobile breakpoint.
- **Skills:** one that teaches Claude Code to use Beskar in an app, and one for contributing here.

## Use it

Storybook: <https://beskar.vibeproject.workers.dev>

Add the registry to your app's `components.json`:

```json
{
  "registries": {
    "@beskar": "https://beskar.vibeproject.workers.dev/r/{name}.json"
  }
}
```

Install the theme once, then add items by name:

```sh
bunx shadcn add @beskar/theme
bunx shadcn add @beskar/button @beskar/dialog
```

Each component pulls in the theme, `utils`, and the components it builds on.

### Claude Code skill

If you build the app with [Claude Code](https://docs.claude.com/en/docs/claude-code/skills), install the Beskar skill:

```sh
bunx shadcn add @beskar/claude-skill
```

It lands at `.claude/skills/beskar-ui/SKILL.md` in the app. It covers setup, the component catalog, composition, theming, motion, and the accessibility rules. Run the command again to update it.

## Develop

```sh
bun install
bun run storybook        # Storybook on :6006
bun run build:registry   # registry JSON into public/r
bun run sync:theme       # after editing registry/beskar/globals.css
```

Before calling a change done:

```sh
bun run build:registry && bun run check && bunx tsc --noEmit && bun run test
```

See [AGENTS.md](./AGENTS.md) for the repo layout and rules. To add a component, follow the recipe in [.claude/skills/beskar-component](./.claude/skills/beskar-component/SKILL.md). Claude Code loads it in this repo as `/beskar-component`.

## Deploy

Merges to `main` deploy to Cloudflare Workers after CI passes. Storybook is at the root and the registry JSON is under `/r`.

The deploy needs two repository secrets:

- `CLOUDFLARE_API_TOKEN`: a token with the "Edit Cloudflare Workers" template
- `CLOUDFLARE_ACCOUNT_ID`

Without them the deploy job is skipped and the run stays green.

## License

MIT
