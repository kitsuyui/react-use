import { act, renderHook } from '@testing-library/react-hooks';
import { expectTypeOf } from 'vitest';
import useQueue from '../src/useQueue';

const setUp = (initialQueue?: any[]) => renderHook(() => useQueue(initialQueue));

it('takes initial state', () => {
  const { result } = setUp([1, 2, 3]);
  const { first, last, size } = result.current;
  expect(first).toEqual(1);
  expect(last).toEqual(3);
  expect(size).toEqual(3);
});

it('appends new member', () => {
  const { result } = setUp([1, 2]);
  act(() => {
    result.current.add(3);
  });
  const { first, last, size } = result.current;
  expect(first).toEqual(1);
  expect(last).toEqual(3);
  expect(size).toEqual(3);
});

it('pops oldest member', () => {
  const { result } = setUp([1, 2]);
  act(() => {
    result.current.remove();
  });
  const { first, size } = result.current;
  expect(first).toEqual(2);
  expect(size).toEqual(1);
});

it('returns undefined when removing from an empty queue', () => {
  const { result } = setUp();
  let value;
  act(() => {
    value = result.current.remove();
  });

  expect(value).toBeUndefined();
  expect(result.current.size).toBe(0);
});

it('types remove as possibly undefined', () => {
  const { result } = renderHook(() => useQueue<number>());

  expectTypeOf(result.current.remove).returns.toEqualTypeOf<number | undefined>();
});
