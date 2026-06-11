# `useInterval`

A declarative interval hook based on [Dan Abramov's article on overreacted.io](https://overreacted.io/making-setinterval-declarative-with-react-hooks). The interval can be paused by setting the delay to `null`.

## Usage

```jsx
import * as React from 'react';
import {useInterval} from '@kitsuyui/react-use';

const Demo = () => {
  const [count, setCount] = React.useState(0);
  const [delayMs, setDelayMs] = React.useState(1000);
  const [isRunning, toggleIsRunning] = useBoolean(true);

  useInterval(
    () => {
      setCount(count + 1);
    },
    isRunning ? delayMs : null
  );

  return (
    <div>
      <div>
        delay (ms): <input value={delayMs} onChange={event => setDelayMs(Number(event.target.value))} />
      </div>
      <h1>count: {count}</h1>
      <div>
        <button onClick={toggleIsRunning}>{isRunning ? 'stop' : 'start'}</button>
      </div>
    </div>
  );
};
```

## Reference

```js
useInterval(callback, delayMs?: number | null)
```

- `delayMs` defaults to `0` when omitted.
- Set `delayMs` to `null` to pause the interval.
- The latest callback is used without recreating the interval unless `delayMs` changes.
