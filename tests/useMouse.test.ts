import { act, renderHook } from '@testing-library/react-hooks';
import { createRef } from 'react';
import { replaceRaf } from 'raf-stub';
import useMouse from '../src/useMouse';

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

it('should map mouse coordinates relative to the referenced element', () => {
	const ref = createRef<HTMLDivElement>();
	const element = document.createElement('div');
	element.getBoundingClientRect = () =>
		({
			left: 10,
			top: 20,
			width: 100,
			height: 40,
		}) as DOMRect;
	ref.current = element;

	const { result } = renderHook(() => useMouse(ref));
	const event = new MouseEvent('mousemove', { bubbles: true });
	Object.defineProperties(event, {
		pageX: { value: 50 },
		pageY: { value: 80 },
	});

	act(() => {
		document.dispatchEvent(event);
		requestAnimationFrame.step();
	});

	expect(result.current).toEqual({
		docX: 50,
		docY: 80,
		posX: 10,
		posY: 20,
		elX: 40,
		elY: 60,
		elH: 40,
		elW: 100,
	});
});
