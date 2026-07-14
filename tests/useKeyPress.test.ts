import { act, renderHook } from '@testing-library/react-hooks';
import useKeyPress from '../src/useKeyPress';

it('should report pressed state for the matching key', () => {
	const { result } = renderHook(() => useKeyPress('a'));

	act(() => {
		document.dispatchEvent(new KeyboardEvent('keydown', { key: 'a', bubbles: true }));
	});
	expect(result.current[0]).toBe(true);
	expect(result.current[1]?.key).toBe('a');

	act(() => {
		document.dispatchEvent(new KeyboardEvent('keyup', { key: 'a', bubbles: true }));
	});
	expect(result.current[0]).toBe(false);
	expect(result.current[1]?.key).toBe('a');
});
