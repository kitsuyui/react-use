import { act, renderHook } from '@testing-library/react-hooks';
import useKeyPressEvent from '../src/useKeyPressEvent';

it('should route matching keydown and keyup events to callbacks', () => {
	const keydown = jest.fn();
	const keyup = jest.fn();

	renderHook(() => useKeyPressEvent('a', keydown, keyup));

	act(() => {
		document.dispatchEvent(new KeyboardEvent('keydown', { key: 'a', bubbles: true }));
	});
	act(() => {
		document.dispatchEvent(new KeyboardEvent('keyup', { key: 'a', bubbles: true }));
	});

	expect(keydown).toHaveBeenCalledTimes(1);
	expect(keyup).toHaveBeenCalledTimes(1);
});
