import { act, renderHook } from '@testing-library/react-hooks';
import useDropArea from '../src/useDropArea';

it('should toggle over state and forward dropped text', () => {
	const onUri = jest.fn();
	const { result } = renderHook(() => useDropArea({ onUri }));

	const [bond] = result.current;

	act(() => {
		bond.onDragEnter({ preventDefault() {} } as any);
	});
	expect(result.current[1].over).toBe(true);

	act(() => {
		result.current[0].onDrop({
			preventDefault() {},
			persist() {},
			dataTransfer: {
				files: [],
				items: [],
				getData(type: string) {
					return type === 'text/uri-list' ? 'https://example.com/drop' : '';
				},
			},
		} as any);
	});

	expect(result.current[1].over).toBe(false);
	expect(onUri).toHaveBeenCalledWith('https://example.com/drop', expect.anything());
});
