# `useRaf`

React animation hook that forces component to re-render on each `requestAnimationFrame`,
returns percentage of time elapsed.


## Usage

```jsx
import {useRaf} from '@kitsuyui/react-use';

const Demo = () => {
  const elapsed = useRaf(5000, 1000);

  return (
    <div>
      Elapsed: {elapsed}
    </div>
  );
};
```


## Reference

```ts
useRaf(durationMs?: number, delayMs?: number): number;
```

- `durationMs` &mdash; milliseconds for how long to keep re-rendering component, defaults to `1e12`.
- `delayMs` &mdash; delay in milliseconds after which to start re-rendering component, defaults to `0`.
