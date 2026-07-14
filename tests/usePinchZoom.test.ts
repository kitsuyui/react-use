import { createRef } from 'react';
import { act, renderHook } from '@testing-library/react-hooks';
import usePinchZoom, { ZoomState } from '../src/usePinchZoom';

it('should detect zooming in from pointer movement', () => {
	const ref = createRef<HTMLDivElement>();
	ref.current = document.createElement('div');

	const { result } = renderHook(() => usePinchZoom(ref));

	act(() => {
		ref.current!.onpointerdown?.({ pointerId: 1, clientX: 10 } as PointerEvent);
		ref.current!.onpointerdown?.({ pointerId: 2, clientX: 20 } as PointerEvent);
		ref.current!.onpointermove?.({ pointerId: 1, clientX: 10 } as PointerEvent);
		ref.current!.onpointermove?.({ pointerId: 2, clientX: 35 } as PointerEvent);
		ref.current!.onpointermove?.({ pointerId: 1, clientX: 10 } as PointerEvent);
		ref.current!.onpointermove?.({ pointerId: 2, clientX: 50 } as PointerEvent);
	});

	expect(result.current).toEqual({
		zoomingState: ZoomState.ZOOMING_IN,
		pinchState: 40,
	});
});
