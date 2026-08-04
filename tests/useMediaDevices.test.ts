import { act, renderHook } from '@testing-library/react-hooks';
import type useMediaDevicesType from '../src/useMediaDevices';

type UseMediaDevices = typeof useMediaDevicesType;

type MockMediaDevices = EventTarget & {
	enumerateDevices: () => Promise<MediaDeviceInfo[]>;
};

const originalMediaDevices = Object.getOwnPropertyDescriptor(window.navigator, 'mediaDevices');

const setMediaDevices = (mediaDevices: MockMediaDevices | undefined) => {
	Object.defineProperty(window.navigator, 'mediaDevices', {
		configurable: true,
		value: mediaDevices,
	});
};

const restoreMediaDevices = () => {
	if (originalMediaDevices) {
		Object.defineProperty(window.navigator, 'mediaDevices', originalMediaDevices);
	} else {
		delete (window.navigator as Navigator & { mediaDevices?: MockMediaDevices }).mediaDevices;
	}
};

const loadUseMediaDevices = async (): Promise<UseMediaDevices> => {
	vi.resetModules();
	const module = await import('../src/useMediaDevices');
	return module.default;
};

const createDevice = (overrides: Partial<MediaDeviceInfo> = {}): MediaDeviceInfo =>
	({
		deviceId: 'default',
		groupId: 'group-1',
		kind: 'audioinput',
		label: 'Default microphone',
		toJSON: () => ({}),
		...overrides,
	}) as MediaDeviceInfo;

const createMediaDevices = (devices: MediaDeviceInfo[]): MockMediaDevices =>
	Object.assign(new EventTarget(), {
		enumerateDevices: vi.fn().mockResolvedValue(devices),
	});

afterEach(() => {
	restoreMediaDevices();
	vi.clearAllMocks();
});

describe('useMediaDevices', () => {
	it('should expose the mock fallback when mediaDevices is unavailable', async () => {
		setMediaDevices(undefined);

		const useMediaDevices = await loadUseMediaDevices();
		const { result } = renderHook(() => useMediaDevices());

		expect(result.current).toEqual({});
	});

	it('should populate devices from enumerateDevices on mount', async () => {
		const devices = [createDevice({ deviceId: 'mic-1' }), createDevice({ deviceId: 'cam-1', kind: 'videoinput' })];
		const mediaDevices = createMediaDevices(devices);
		setMediaDevices(mediaDevices);

		const useMediaDevices = await loadUseMediaDevices();
		const { result } = renderHook(() => useMediaDevices());

		expect(mediaDevices.enumerateDevices).toHaveBeenCalledTimes(1);

		await act(async () => {
			await Promise.resolve();
		});

		expect(result.current).toEqual({
			devices: [
				{ deviceId: 'mic-1', groupId: 'group-1', kind: 'audioinput', label: 'Default microphone' },
				{ deviceId: 'cam-1', groupId: 'group-1', kind: 'videoinput', label: 'Default microphone' },
			],
		});
	});

	it('should re-fetch devices when devicechange fires and stop listening on unmount', async () => {
		const initialDevices = [createDevice({ deviceId: 'mic-1' })];
		const updatedDevices = [createDevice({ deviceId: 'mic-1' }), createDevice({ deviceId: 'mic-2' })];
		const mediaDevices = createMediaDevices(initialDevices);
		setMediaDevices(mediaDevices);

		const useMediaDevices = await loadUseMediaDevices();
		const { result, unmount } = renderHook(() => useMediaDevices());

		await act(async () => {
			await Promise.resolve();
		});

		expect(result.current).toEqual({
			devices: [{ deviceId: 'mic-1', groupId: 'group-1', kind: 'audioinput', label: 'Default microphone' }],
		});

		mediaDevices.enumerateDevices = vi.fn().mockResolvedValue(updatedDevices);

		await act(async () => {
			mediaDevices.dispatchEvent(new Event('devicechange'));
			await Promise.resolve();
		});

		expect(mediaDevices.enumerateDevices).toHaveBeenCalledTimes(1);
		expect(result.current).toEqual({
			devices: [
				{ deviceId: 'mic-1', groupId: 'group-1', kind: 'audioinput', label: 'Default microphone' },
				{ deviceId: 'mic-2', groupId: 'group-1', kind: 'audioinput', label: 'Default microphone' },
			],
		});

		unmount();

		await act(async () => {
			mediaDevices.dispatchEvent(new Event('devicechange'));
			await Promise.resolve();
		});

		expect(mediaDevices.enumerateDevices).toHaveBeenCalledTimes(1);
	});

	it('should not update state after unmount while enumerateDevices is still pending', async () => {
		let resolveDevices: (devices: MediaDeviceInfo[]) => void = () => {};
		const mediaDevices = Object.assign(new EventTarget(), {
			enumerateDevices: vi.fn(
				() =>
					new Promise<MediaDeviceInfo[]>((resolve) => {
						resolveDevices = resolve;
					})
			),
		});
		setMediaDevices(mediaDevices);

		const useMediaDevices = await loadUseMediaDevices();
		const { result, unmount } = renderHook(() => useMediaDevices());

		unmount();

		await act(async () => {
			resolveDevices([createDevice()]);
			await Promise.resolve();
		});

		expect(result.current).toEqual({});
	});
});
