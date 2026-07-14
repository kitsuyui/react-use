import { createRef } from 'react';
import { act, renderHook } from '@testing-library/react-hooks';
import { replaceRaf } from 'raf-stub';
import useScroll from '../src/useScroll';

declare var requestAnimationFrame: {
	reset: () => void;
	step: (steps?: number, duration?: number) => void;
};

beforeAll(() => {
	replaceRaf();
});

afterEach(() => {
	requestAnimationFrame.reset();
});

it('should report scroll coordinates from the target element', () => {
	const ref = createRef<HTMLDivElement>();
	const element = document.createElement('div');
	ref.current = element;

	const { result } = renderHook(() => useScroll(ref));

	act(() => {
		element.scrollLeft = 12;
		element.scrollTop = 34;
		element.dispatchEvent(new Event('scroll'));
		requestAnimationFrame.step();
	});

	expect(result.current).toEqual({ x: 12, y: 34 });
});
