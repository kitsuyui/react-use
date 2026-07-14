import { act, renderHook } from '@testing-library/react-hooks';
import useLocation from '../src/useLocation';

it('should update location state when history.pushState runs', () => {
	const { result } = renderHook(() => useLocation());

	act(() => {
		window.history.pushState({ from: 'test' }, '', '/hooks?tab=location#push');
	});

	expect(result.current.trigger).toBe('pushstate');
	expect(result.current.pathname).toBe('/hooks');
	expect(result.current.search).toBe('?tab=location');
	expect(result.current.hash).toBe('#push');
	expect(result.current.state).toEqual({ from: 'test' });
});
