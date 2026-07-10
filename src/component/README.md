# Render-prop components

This directory contains render-prop component wrappers for hooks that already
have a hook-first API.

Keep hook implementations in the sibling `src/use*.ts` modules. Add files here
only when a component wrapper is part of the documented public import surface,
such as `@kitsuyui/react-use/component/UseKey`. `UseKey.tsx` wraps `useKey` with
`createRenderProp` so users can use the documented JSX render-prop entrypoint
without moving keyboard hook logic out of `src/useKey.ts`.
