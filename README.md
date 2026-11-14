# Beskar

Design system for my vibe projects (holocron, holotable, datapad, acolyte, pulse).

Beskar is a [shadcn registry](https://ui.shadcn.com/docs/registry). Components ship as source that you copy into an app with the `shadcn` CLI. There is no npm package.

- Style: shadcn `base-lyra` on [Base UI](https://base-ui.com)
- Fonts: Oxanium for UI and headings, JetBrains Mono for code
- Icons: Phosphor
- Corners: square

## Status

Under construction. The theme, the Style Guide, and all 33 components are in place. The AI skills are next.

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

Then add items by name:

```sh
bunx shadcn add @beskar/button
```

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

See [AGENTS.md](./AGENTS.md) for the repo layout and rules.

## Deploy

Merges to `main` deploy to Cloudflare Workers after CI passes. Storybook is at the root and the registry JSON is under `/r`.

The deploy needs two repository secrets:

- `CLOUDFLARE_API_TOKEN`: a token with the "Edit Cloudflare Workers" template
- `CLOUDFLARE_ACCOUNT_ID`

Without them the deploy job is skipped and the run stays green.

## License

MIT
