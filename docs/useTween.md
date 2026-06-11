# `useTween`

React animation hook that tweens a number between 0 and 1.


## Usage

```jsx
import {useTween} from '@kitsuyui/react-use';

const Demo = () => {
  const t = useTween();

  return (
    <div>
      Tween: {t}
    </div>
  );
};
```

## Reference

```ts
useTween(easing?: string, durationMs?: number, delayMs?: number): number
```

Returns a number that begins with 0 and ends with 1 when animation ends.

- `easing` &mdash; one of the built-in easing names, defaults to `inCirc`.
- `durationMs` &mdash; milliseconds for how long to keep re-rendering component, defaults to `200`.
- `delayMs` &mdash; delay in milliseconds after which to start re-rendering component, defaults to `0`.
