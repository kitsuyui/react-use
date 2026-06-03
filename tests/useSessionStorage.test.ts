import { act, renderHook } from '@testing-library/react-hooks';
import useSessionStorage from '../src/useSessionStorage';

describe(useSessionStorage, () => {
  afterEach(() => {
    sessionStorage.clear();
    vi.restoreAllMocks();
  });

  it('does not write unchanged state to sessionStorage on rerender', () => {
    const setItem = vi.spyOn(Storage.prototype, 'setItem');
    const { rerender } = renderHook(() => useSessionStorage('foo', 'bar'));
    const writesAfterMount = setItem.mock.calls.length;

    rerender();
    rerender();

    expect(setItem).toHaveBeenCalledTimes(writesAfterMount);
  });

  it('writes to sessionStorage when state changes', () => {
    const setItem = vi.spyOn(Storage.prototype, 'setItem');
    const { result } = renderHook(() => useSessionStorage('foo', 'bar'));
    const writesAfterMount = setItem.mock.calls.length;

    act(() => result.current[1]('baz'));

    expect(sessionStorage.getItem('foo')).toBe('"baz"');
    expect(setItem.mock.calls.length).toBeGreaterThan(writesAfterMount);
  });
});
