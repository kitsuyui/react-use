import { act, renderHook } from '@testing-library/react-hooks';
import { createRef } from 'react';
import useScrolling from '../src/useScrolling';

it('cleans up the scroll timer on unmount', () => {
  jest.useFakeTimers();
  const ref = createRef<HTMLDivElement>();
  ref.current = document.createElement('div');

  const { result, unmount } = renderHook(() => useScrolling(ref));

  expect(result.current).toBe(false);

  act(() => {
    ref.current?.dispatchEvent(new Event('scroll'));
  });
  expect(result.current).toBe(true);

  unmount();
  jest.runAllTimers();
  jest.useRealTimers();
});
