import { act, renderHook } from '@testing-library/react-hooks';
import useMotion from '../src/useMotion';

it('should update motion state from devicemotion events', () => {
	const { result } = renderHook(() => useMotion());

	act(() => {
		window.dispatchEvent(
			Object.assign(new Event('devicemotion'), {
				acceleration: { x: 1, y: 2, z: 3 },
				accelerationIncludingGravity: { x: 4, y: 5, z: 6 },
				rotationRate: { alpha: 7, beta: 8, gamma: 9 },
				interval: 32,
			})
		);
	});

	expect(result.current).toEqual({
		acceleration: { x: 1, y: 2, z: 3 },
		accelerationIncludingGravity: { x: 4, y: 5, z: 6 },
		rotationRate: { alpha: 7, beta: 8, gamma: 9 },
		interval: 32,
	});
});
