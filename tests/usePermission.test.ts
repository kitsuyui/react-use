import { act, renderHook } from '@testing-library/react-hooks';
import usePermission from '../src/usePermission';

it('should resolve the current permission state', async () => {
	const permissionStatus = Object.assign(new EventTarget(), {
		state: 'granted' as PermissionState,
	});
	Object.defineProperty(navigator, 'permissions', {
		configurable: true,
		value: {
			query: jest.fn().mockResolvedValue(permissionStatus),
		},
	});

	const { result } = renderHook(() => usePermission({ name: 'camera' }));

	await act(async () => {
		await Promise.resolve();
	});

	expect(result.current).toBe('granted');
});
