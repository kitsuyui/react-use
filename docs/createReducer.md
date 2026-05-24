# `createReducer`

Factory for reducer hooks with custom middleware with an identical API as [React's `useReducer`](https://reactjs.org/docs/hooks-reference.html#usereducer). Compatible with [Redux middleware](https://redux.js.org/advanced/middleware).

## Usage

An example with small local middleware functions.

```jsx
import { createReducer } from '@kitsuyui/react-use';

const thunk = ({ dispatch }) => next => action =>
  typeof action === 'function' ? action(dispatch) : next(action);

const logger = () => next => action => {
  const result = next(action);
  console.log(action);
  return result;
};

const useThunkReducer = createReducer(thunk, logger);

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    case 'reset':
      return { count: action.payload };
    default:
      throw new Error();
  }
}

const Demo = ({ initialCount = 1 }) => {
  // Action creator to increment count, wait a second and then reset
  const addAndReset = React.useCallback(() => {
    return dispatch => {
      dispatch({ type: 'increment' });

      setTimeout(() => {
        dispatch({ type: 'reset', payload: initialCount });
      }, 1000);
    };
  }, [initialCount]);

  const [state, dispatch] = useThunkReducer(reducer, initialCount);

  return (
    <div>
      <p>count: {state.count}</p>
      <button onClick={() => dispatch(addAndReset())}>Add and reset</button>
      <button
        onClick={() => dispatch({ type: 'reset', payload: { count: initialCount }})}
      >
        Reset
      </button>
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
      <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
    </div>
  );
};
```

## Reference

```js
const useMiddlewareReducer = createReducer(...middlewares);
```
