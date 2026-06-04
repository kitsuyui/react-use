# `useMediatedState`

A lot like the standard `useState`, but with mediation process.

## Usage
```ts
import * as React from 'react';
import { useMediatedState } from '../useMediatedState';

const inputMediator = s => s.replace(/[\s]+/g, ' ');
const Demo = () => {
  const [state, setState] = useMediatedState(inputMediator, '');

  return (
    <div>
      <div>You will not be able to enter more than one space</div>
      <input type="text" min="0" max="10"
             value={state}
             onChange={(ev: React.ChangeEvent<HTMLInputElement>) => {
               setState(ev.target.value);
             }}
      />
    </div>
  );
};
```

## Reference
```ts
const [state, setState] = useMediatedState<S=any>(
  mediator: StateMediator<S>,
  initialState?: S
);
```

> Initial state will be set as-is.

The dispatch mode is determined at runtime by the mediator's `Function.length` (the number of declared parameters):

- **1 parameter** (`length === 1`): the mediator's return value is passed to the internal state setter.
- **2 parameters** (`length === 2`): the internal state setter is passed as the second argument and the return value is ignored. Useful for async mediators.

**Note**: a function declared as `(newState, _unused) => value` has `length === 2` and triggers dispatch mode even if `_unused` is never called, leaving state unchanged.
>This hook will not cancel previous mediation when new one been invoked, you have to handle it yourself._
