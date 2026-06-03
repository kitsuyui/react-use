import { act, renderHook } from '@testing-library/react-hooks';
import useMouseWheel from '../src/useMouseWheel';

const dispatchWheel = (deltaY: number, deltaMode = 0) => {
	const event = new Event('wheel') as WheelEvent;

	Object.defineProperties(event, {
		deltaMode: {
			value: deltaMode,
		},
		deltaY: {
			value: deltaY,
		},
	});

	window.dispatchEvent(event);
};

describe('useMouseWheel', () => {
	it('should normalize wheel delta modes to pixels before accumulating', () => {
		const originalInnerHeight = window.innerHeight;

		Object.defineProperty(window, 'innerHeight', {
			configurable: true,
			value: 800,
		});

		const { result } = renderHook(() => useMouseWheel());

		act(() => {
			dispatchWheel(2);
			dispatchWheel(3, 1);
			dispatchWheel(1, 2);
		});

		expect(result.current).toBe(850);

		Object.defineProperty(window, 'innerHeight', {
			configurable: true,
			value: originalInnerHeight,
		});
	});

	it('should round fractional pixel accumulation', () => {
		const { result } = renderHook(() => useMouseWheel());

		act(() => {
			dispatchWheel(0.1);
			dispatchWheel(0.2);
		});

		expect(result.current).toBe(0.3);
	});
});
