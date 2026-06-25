# Misc Helpers

`src/misc/` contains small internal helpers that do not fit a narrower hook or factory directory. Use this directory for shared primitives that are imported across unrelated hooks, or for legacy helpers whose callers already depend on this location.

## Contents

- `util.ts`: browser and DOM event helpers such as `on`, `off`, `noop`, `isBrowser`, and `isNavigator`.
- `hookState.ts`: shared hook-state action types and `resolveHookState`.
- `isDeepEqual.ts`: deep equality helper used by deep-compare hooks.
- `types.ts`: promise-related shared type aliases.
- `parseTimeRanges.ts`: HTML media `TimeRanges` conversion used by `factory/createHTMLMediaHook.ts`.

New helpers that belong to a single hook or factory should stay next to that feature unless they are intentionally shared.
