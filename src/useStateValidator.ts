import { Dispatch, SetStateAction, useCallback, useEffect, useRef, useState } from 'react';

export type ValidityState = [boolean | undefined, ...any[]] | [undefined];

/**
 * A validator callback for `useStateValidator`.
 *
 * The dispatch mode is chosen at runtime based on `Function.length`
 * (the number of declared parameters), **not** on which overload TypeScript
 * resolves:
 *
 * - `length === 1` → return mode: the return value is passed to `setValidity`.
 * - `length >= 2` → dispatch mode: the second argument receives `setValidity`
 *   and the return value is ignored.
 *
 * **Footgun**: a function declared as `(state, _dispatch) => value` has
 * `length === 2` and will trigger dispatch mode even though it never calls
 * `_dispatch`, leaving validity state unchanged.
 */
export interface StateValidator<V, S> {
  (state: S): V;

  (state: S, dispatch: Dispatch<SetStateAction<V>>): void;
}

export type UseStateValidatorReturn<V> = [V, () => void];

export default function useStateValidator<V extends ValidityState, S>(
  state: S,
  validator: StateValidator<V, S>,
  initialState: V = [undefined] as V
): UseStateValidatorReturn<V> {
  const validatorInner = useRef(validator);
  const stateInner = useRef(state);

  validatorInner.current = validator;
  stateInner.current = state;

  const [validity, setValidity] = useState(initialState as V);

  const validate = useCallback(() => {
    if (validatorInner.current.length >= 2) {
      validatorInner.current(stateInner.current, setValidity as Dispatch<SetStateAction<V>>);
    } else {
      setValidity(validatorInner.current(stateInner.current));
    }
  }, [setValidity]);

  useEffect(() => {
    validate();
  }, [state]);

  return [validity, validate];
}
