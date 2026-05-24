import { renderHook } from '@testing-library/react-hooks';
import { useScrollbarWidth } from '../src';

describe('useScrollbarWidth', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(useScrollbarWidth).toBeDefined();
  });

  it('should return value of scrollbarWidth result', () => {
    jest
      .spyOn(HTMLElement.prototype, 'offsetWidth', 'get')
      .mockReturnValueOnce(42)
      .mockReturnValueOnce(21);
    const { result } = renderHook(() => useScrollbarWidth());

    expect(result.current).toBe(21);
  });
});
