import { renderHook } from '@testing-library/react-hooks';
import useBattery from '../src/useBattery';

it('should expose the unsupported fallback when Battery API is unavailable', () => {
	const { result } = renderHook(() => useBattery());

	expect(result.current).toEqual({ isSupported: false });
});
