# `useLogger`

React lifecycle hook that console logs parameters outside production builds as component transitions through lifecycles.

## Usage

```jsx
import {useLogger} from '@kitsuyui/react-use';

const Demo = (props) => {
  useLogger('Demo', props);
  return null;
};
```

## Example Output

`useLogger` is silent when `process.env.NODE_ENV === 'production'`.

```
Demo mounted {}
Demo updated {}
Demo unmounted
```

## Reference

```js
useLogger(componentName: string, ...rest);
```

- `componentName` &mdash; component name.
- `...rest` &mdash; parameters to log.
