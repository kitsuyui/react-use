import { renderHook } from '@testing-library/react-hooks';
import useMediaDevices from '../src/useMediaDevices';

it('should expose the mock fallback when mediaDevices is unavailable', () => {
	const { result } = renderHook(() => useMediaDevices());

	expect(result.current).toEqual({});
});
