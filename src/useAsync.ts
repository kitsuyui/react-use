import { DependencyList, useEffect } from 'react';
import useAsyncFn from './useAsyncFn';
import { FunctionReturningPromise } from './misc/types';

export type { AsyncState, AsyncFnReturn } from './useAsyncFn';

export default function useAsync<T extends FunctionReturningPromise>(
  fn: T,
  deps: DependencyList = []
) {
  const [state, callback] = useAsyncFn(fn, deps, {
    loading: true,
  });

  useEffect(() => {
    // useAsyncFn's callback now re-throws on rejection, so the promise it
    // returns rejects when fn rejects. useAsync surfaces errors via
    // state.error rather than the promise, so swallow the rejection here to
    // avoid an unhandled promise rejection.
    callback().catch(() => {});
  }, [callback]);

  return state;
}
