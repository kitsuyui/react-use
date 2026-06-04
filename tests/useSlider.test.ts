import { renderHook, act } from '@testing-library/react-hooks';
import { vi } from 'vitest';
import useSlider from '../src/useSlider';

const installImmediateRaf = () => {
	const requestAnimationFrame = vi.fn((callback: FrameRequestCallback) => {
		callback(0);
		return 1;
	});
	const cancelAnimationFrame = vi.fn();

	Object.assign(globalThis, { requestAnimationFrame, cancelAnimationFrame });
	Object.assign(window, { requestAnimationFrame, cancelAnimationFrame });
};

const createSliderElement = () => {
	const element = document.createElement('div');
	vi.spyOn(element, 'getBoundingClientRect').mockReturnValue({
		bottom: 100,
		height: 100,
		left: 0,
		right: 100,
		top: 0,
		width: 100,
		x: 0,
		y: 0,
		toJSON: () => ({}),
	});
	return element;
};

beforeEach(() => {
	installImmediateRaf();
});

afterEach(() => {
	vi.restoreAllMocks();
});

it('uses the latest reverse option while an active slide is bound to document events', () => {
	const element = createSliderElement();
	const ref = { current: element };
	const onScrub = vi.fn();

	const { result, rerender } = renderHook(({ reverse }) => useSlider(ref, { onScrub, reverse }), {
		initialProps: { reverse: false },
	});

	act(() => {
		element.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, clientX: 25 }));
	});

	expect(result.current).toMatchObject({ isSliding: true, value: 0.25 });
	expect(onScrub).toHaveBeenLastCalledWith(0.25);

	rerender({ reverse: true });

	act(() => {
		document.dispatchEvent(new MouseEvent('mousemove', { bubbles: true, clientX: 25 }));
	});

	expect(result.current.value).toBe(0.75);
	expect(onScrub).toHaveBeenLastCalledWith(0.75);

	act(() => {
		document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
	});

	expect(result.current.isSliding).toBe(false);
});
