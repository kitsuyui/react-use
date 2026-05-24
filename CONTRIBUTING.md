# Contributing

Thanks for contributing to `@kitsuyui/react-use`.

This repository is a maintained fork of `react-use`. Please open issues and
pull requests against `kitsuyui/react-use`, not against upstream projects, unless
the problem is independently reproducible there.

## Project setup

1. Clone this repository.
2. Run `bun install` to install dependencies.
3. Create a branch for your change.

## Development

This library is a collection of React hooks. Prefer small, dependency-light
changes and keep public API changes explicit.

### Creating a new hook

1. Create `src/useYourHookName.ts`.
2. Add tests in `tests/useYourHookName.test.ts`.
3. Add docs in `docs/useYourHookName.md`.
4. Export the hook from `src/index.ts` and add it to `README.md`.

Stories are useful for manual examples, but tests and docs are the required
parts of a new hook.

### Updating an existing hook

1. Update tests for the behavior change.
2. Update docs when the public API changes.
3. Run the verification commands before opening a PR.

## Verification

Run the relevant checks locally:

```sh
bun run lint
bun run test
bun run build
```

For changes that affect coverage or release artifacts, also run:

```sh
bun run test:coverage
bun run validate
```

## Commit messages

This repo uses semantic-release and conventional commit messages. Use prefixes
such as `fix:`, `feat:`, `docs:`, or `chore:` when the change should be
classified in release notes.
