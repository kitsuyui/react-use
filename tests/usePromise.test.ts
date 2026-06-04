import { renderHook } from '@testing-library/react-hooks';
import usePromise from '../src/usePromise';

describe('usePromise', () => {
	it('should be defined', () => {
		expect(usePromise).toBeDefined();
	});

	it('should return a function', () => {
		const hook = renderHook(() => usePromise());

		expect(typeof hook.result.current).toBe('function');
	});

	it('should resolve with wrapped promises while component is mounted', async () => {
		const hook = renderHook(() => usePromise());

		const mounted = hook.result.current;
		const res = await mounted(new Promise((r) => setTimeout(() => r(25), 10)));

		expect(res).toBe(25);
	});

	it('should reject when promise resolves after component is unmounted', async () => {
		const hook = renderHook(() => usePromise());

		const mounted = hook.result.current;
		const onFinally = jest.fn();
		const promise = mounted(new Promise((r) => setTimeout(() => r(25), 10))).finally(onFinally);

		hook.unmount();

		await expect(promise).rejects.toThrow('Component unmounted before promise settled');
		expect(onFinally).toHaveBeenCalledTimes(1);
	});

	it('should reject with the original error after component is unmounted', async () => {
		const hook = renderHook(() => usePromise());

		const mounted = hook.result.current;
		const error = new Error('source failure');
		const promise = mounted(new Promise((_, reject) => setTimeout(() => reject(error), 10)));

		hook.unmount();

		await expect(promise).rejects.toBe(error);
	});
});
