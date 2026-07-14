import { act, renderHook } from '@testing-library/react-hooks';
import useDrop from '../src/useDrop';

it('should track drag state and forward dropped uris', () => {
	const onUri = jest.fn();
	const { result } = renderHook(() => useDrop({ onUri }));

	const dragEnter = new Event('dragenter', { bubbles: true, cancelable: true });
	const drop = Object.assign(new Event('drop', { bubbles: true, cancelable: true }), {
		dataTransfer: {
			files: [],
			getData: (type: string) => (type === 'text/uri-list' ? 'https://example.com' : ''),
		},
	});

	act(() => {
		document.dispatchEvent(dragEnter);
	});
	expect(result.current.over).toBe(true);

	act(() => {
		document.dispatchEvent(drop);
	});

	expect(result.current.over).toBe(false);
	expect(onUri).toHaveBeenCalledWith('https://example.com', expect.any(Event));
});
