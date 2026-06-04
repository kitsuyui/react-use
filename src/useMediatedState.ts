import { Dispatch, SetStateAction, useCallback, useRef, useState } from 'react';

/**
 * A mediator callback for `useMediatedState`.
 *
 * The dispatch mode is chosen at runtime based on `Function.length`
 * (the number of declared parameters), **not** on which overload TypeScript
 * resolves:
 *
 * - `length === 1` → return mode: the return value is passed to the internal
 *   state setter.
 * - `length === 2` → dispatch mode: the second argument receives the state
 *   setter and the return value is ignored.
 *
 * **Footgun**: a function declared as `(newState, _dispatch) => value` has
 * `length === 2` and will trigger dispatch mode even though it never calls
 * `_dispatch`, leaving state unchanged.
 */
export interface StateMediator<S = any> {
  (newState: any): S;

  (newState: any, dispatch: Dispatch<SetStateAction<S>>): void;
}

export type UseMediatedStateReturn<S = any> = [S, Dispatch<SetStateAction<S>>];

export function useMediatedState<S = undefined>(
  mediator: StateMediator<S | undefined>
): UseMediatedStateReturn<S | undefined>;
export function useMediatedState<S = any>(
  mediator: StateMediator<S>,
  initialState: S
): UseMediatedStateReturn<S>;

export function useMediatedState<S = any>(
  mediator: StateMediator<S>,
  initialState?: S
): UseMediatedStateReturn<S> {
  const mediatorFn = useRef(mediator);

  const [state, setMediatedState] = useState<S>(initialState!);
  const setState = useCallback(
    (newState: any) => {
      if (mediatorFn.current.length === 2) {
        mediatorFn.current(newState, setMediatedState);
      } else {
        setMediatedState(mediatorFn.current(newState));
      }
    },
    [state]
  );

  return [state, setState];
}
