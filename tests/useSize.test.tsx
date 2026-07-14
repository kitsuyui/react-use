import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import useSize from '../src/useSize';

it('should return a sized element and the initial dimensions', () => {
	const { result } = renderHook(() => useSize(<div />, { width: 120, height: 80 }));
	const [element, state] = result.current;

	expect(element.type).toBe('div');
	expect(state).toEqual({ width: 120, height: 80 });
	expect(React.Children.toArray(element.props.children)[0]).toMatchObject({
		type: 'iframe',
	});
});
