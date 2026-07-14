import { renderHook } from '@testing-library/react-hooks';
import useKey from '../src/useKey';

it('should invoke the handler only for matching keys', () => {
	const handler = jest.fn();

	renderHook(() => useKey('a', handler));

	document.dispatchEvent(new KeyboardEvent('keydown', { key: 'b', bubbles: true }));
	document.dispatchEvent(new KeyboardEvent('keydown', { key: 'a', bubbles: true }));

	expect(handler).toHaveBeenCalledTimes(1);
	expect(handler.mock.calls[0][0].key).toBe('a');
});
