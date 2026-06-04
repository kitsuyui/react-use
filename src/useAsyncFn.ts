import { DependencyList, useCallback, useRef, useState } from 'react';
import useMountedState from './useMountedState';
import { FunctionReturningPromise, PromiseType } from './misc/types';

export type AsyncState<T> =
  | {
      loading: boolean;
      error?: undefined;
      value?: undefined;
    }
  | {
      loading: true;
      error?: undefined;
      value?: T;
    }
  | {
      loading: false;
      error: Error;
      value?: undefined;
    }
  | {
      loading: false;
      error?: undefined;
      value: T;
    };

type StateFromFunctionReturningPromise<T extends FunctionReturningPromise> = AsyncState<
  PromiseType<ReturnType<T>>
>;

export type AsyncFnReturn<T extends FunctionReturningPromise = FunctionReturningPromise> = [
  StateFromFunctionReturningPromise<T>,
  T
];

export default function useAsyncFn<T extends FunctionReturningPromise>(
  fn: T,
  deps: DependencyList = [],
  initialState: StateFromFunctionReturningPromise<T> = { loading: false }
): AsyncFnReturn<T> {
  const lastCallId = useRef(0);
  const isMounted = useMountedState();
  const [state, set] = useState<StateFromFunctionReturningPromise<T>>(initialState);

  const callback = useCallback((...args: Parameters<T>): ReturnType<T> => {
    const callId = ++lastCallId.current;

    if (!state.loading) {
      set((prevState) => ({ ...prevState, loading: true, error: undefined }));
    }

    const onResolve = (value: PromiseType<ReturnType<T>>) => {
      isMounted() && callId === lastCallId.current && set({ value, loading: false });

      return value;
    };
    const recordError = (error) => {
      isMounted() && callId === lastCallId.current && set({ error, loading: false });
    };
    const onReject = (error) => {
      recordError(error);

      throw error;
    };

    try {
      return fn(...args).then(onResolve, onReject) as ReturnType<T>;
    } catch (error) {
      recordError(error);

      return Promise.resolve() as ReturnType<T>;
    }
  }, deps);

  return [state, callback as unknown as T];
}
