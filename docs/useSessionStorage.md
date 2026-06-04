# `useSessionStorage`

React side-effect hook that manages a single `sessionStorage` key.


## Usage

```jsx
import {useSessionStorage} from '@kitsuyui/react-use';

const Demo = () => {
  const [value, setValue] = useSessionStorage('my-key', 'foo');

  return (
    <div>
      <div>Value: {value}</div>
      <button onClick={() => setValue('bar')}>bar</button>
      <button onClick={() => setValue('baz')}>baz</button>
    </div>
  );
};
```


## Reference

```js
useSessionStorage(key);
useSessionStorage(key, initialValue);
useSessionStorage(key, initialValue, raw);
```

- `key` &mdash; `sessionStorage` key to manage.
- `initialValue` &mdash; initial value to set, if value in `sessionStorage` is empty.
- `raw` &mdash; boolean, if set to `true`, hook will not attempt to JSON serialize stored values.

The hook writes to `sessionStorage` on mount and when `key`, `raw`, or the stored state changes.
