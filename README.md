# Beskar

Design system for my vibe projects (holocron, holotable, datapad, acolyte, pulse).

Beskar is a [shadcn registry](https://ui.shadcn.com/docs/registry). Components ship as source that you copy into an app with the `shadcn` CLI. There is no npm package.

- Style: shadcn `base-lyra` on [Base UI](https://base-ui.com)
- Fonts: Oxanium for UI and headings, JetBrains Mono for code
- Icons: Phosphor
- Corners: square

## Status

Under construction. The theme, the Style Guide, and the first twelve components are in place. Overlays and menus land next.

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

## License

MIT
