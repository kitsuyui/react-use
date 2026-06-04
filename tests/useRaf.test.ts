import { act, renderHook } from '@testing-library/react-hooks';
import { vi } from 'vitest';
import useRaf from '../src/useRaf';

/**
 * New requestAnimationFrame after being replaced with raf-stub for testing purposes.
 */
interface RequestAnimationFrame {
	reset(): void;

	step(timestamp?: DOMHighResTimeStamp): void;
}

declare var requestAnimationFrame: RequestAnimationFrame;

const fixedStart = 1564949709496;

const installRafStub = () => {
	let id = 0;
	let timestamp: DOMHighResTimeStamp = fixedStart;
	const callbacks = new Map<number, FrameRequestCallback>();
	const raf = Object.assign(
		vi.fn((callback: FrameRequestCallback) => {
			id += 1;
			callbacks.set(id, callback);
			return id;
		}),
		{
			reset() {
				id = 0;
				timestamp = fixedStart;
				callbacks.clear();
			},
			step(nextTimestamp = timestamp) {
				timestamp = nextTimestamp;
				const pendingCallbacks = [...callbacks.values()];
				callbacks.clear();
				for (const callback of pendingCallbacks) {
					callback(timestamp);
				}
			},
		}
	);
	const cancelRaf = vi.fn((rafId: number) => {
		callbacks.delete(rafId);
	});

	Object.assign(globalThis, { requestAnimationFrame: raf, cancelAnimationFrame: cancelRaf });
	Object.assign(window, { requestAnimationFrame: raf, cancelAnimationFrame: cancelRaf });
};

beforeEach(() => {
	jest.useFakeTimers();
	vi.setSystemTime(fixedStart);
	installRafStub();
	requestAnimationFrame.reset();
});

afterEach(() => {
	jest.clearAllTimers();
	requestAnimationFrame.reset();
});

const startRaf = () => {
	jest.runOnlyPendingTimers(); // start after delay
	requestAnimationFrame.step(fixedStart);
};

it('should init percentage of time elapsed', () => {
	const { result } = renderHook(() => useRaf());
	const timeElapsed = result.current;

	expect(timeElapsed).toBe(0);
});

it('should return corresponding percentage of time elapsed for default ms', () => {
	const { result } = renderHook(() => useRaf());
	expect(result.current).toBe(0);

	act(() => {
		startRaf();
		requestAnimationFrame.step(fixedStart + 1e12 * 0.25); // 25%
	});
	expect(result.current).toBe(0.25);

	act(() => {
		requestAnimationFrame.step(fixedStart + 1e12 * 0.5); // 50%
	});
	expect(result.current).toBe(0.5);

	act(() => {
		requestAnimationFrame.step(fixedStart + 1e12 * 0.75); // 75%
	});
	expect(result.current).toBe(0.75);

	act(() => {
		requestAnimationFrame.step(fixedStart + 1e12); // 100%
	});
	expect(result.current).toBe(1);
});

it('should return corresponding percentage of time elapsed for custom ms', () => {
	const customMs = 2000;

	const { result } = renderHook(() => useRaf(customMs));
	expect(result.current).toBe(0);

	act(() => {
		startRaf();
		requestAnimationFrame.step(fixedStart + customMs * 0.25); // 25%
	});
	expect(result.current).toBe(0.25);

	act(() => {
		requestAnimationFrame.step(fixedStart + customMs * 0.5); // 50%
	});
	expect(result.current).toBe(0.5);

	act(() => {
		requestAnimationFrame.step(fixedStart + customMs * 0.75); // 75%
	});
	expect(result.current).toBe(0.75);

	act(() => {
		requestAnimationFrame.step(fixedStart + customMs); // 100%
	});
	expect(result.current).toBe(1);
});

it('should calculate elapsed percentage from RAF timestamps instead of wall clock time', () => {
	const customMs = 2000;

	const { result } = renderHook(() => useRaf(customMs));
	expect(result.current).toBe(0);

	act(() => {
		startRaf();
		vi.setSystemTime(fixedStart + customMs * 10);
		requestAnimationFrame.step(fixedStart + customMs * 0.25);
	});
	expect(result.current).toBe(0.25);

	act(() => {
		vi.setSystemTime(fixedStart - customMs * 10);
		requestAnimationFrame.step(fixedStart + customMs * 0.5);
	});
	expect(result.current).toBe(0.5);
});

it('should return always 1 after corresponding ms reached', () => {
	const { result } = renderHook(() => useRaf());
	expect(result.current).toBe(0);

	act(() => {
		startRaf();
		requestAnimationFrame.step(fixedStart + 1e12); // 100%
	});
	expect(result.current).toBe(1);

	act(() => {
		requestAnimationFrame.step(fixedStart + 1e12 * 1.1); // 110%
	});
	expect(result.current).toBe(1);

	act(() => {
		requestAnimationFrame.step(fixedStart + 1e12 * 3); // 300%
	});
	expect(result.current).toBe(1);
});

it('should wait until delay reached to start calculating elapsed percentage', () => {
	const { result } = renderHook(() => useRaf(undefined, 500));

	expect(result.current).toBe(0);

	act(() => {
		jest.advanceTimersByTime(250); // fast-forward only half of custom delay
	});
	expect(result.current).toBe(0);

	act(() => {
		jest.advanceTimersByTime(249); // fast-forward 1ms less than custom delay
	});
	expect(result.current).toBe(0);

	act(() => {
		jest.advanceTimersByTime(1); // fast-forward exactly to custom delay
		requestAnimationFrame.step(fixedStart);
		requestAnimationFrame.step(fixedStart + 1);
	});
	expect(result.current).not.toBe(0);
});

it('should clear pending timers on unmount', () => {
	const spyRafStop = jest.spyOn(global, 'cancelAnimationFrame' as any);
	const { unmount } = renderHook(() => useRaf());

	expect(clearTimeout).not.toHaveBeenCalled();
	expect(spyRafStop).not.toHaveBeenCalled();

	unmount();

	expect(clearTimeout).toHaveBeenCalledTimes(2);
	expect(spyRafStop).toHaveBeenCalledTimes(1);
});
