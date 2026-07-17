import { act, renderHook } from '@testing-library/react-hooks';
import type useNetworkStateType from '../src/useNetworkState';

type UseNetworkState = typeof useNetworkStateType;

type MockConnection = EventTarget & {
	downlink: number;
	downlinkMax: number;
	effectiveType: 'slow-2g' | '2g' | '3g' | '4g';
	rtt: number;
	saveData: boolean;
	type: 'bluetooth' | 'cellular' | 'ethernet' | 'none' | 'wifi' | 'wimax' | 'other' | 'unknown';
};

const originalOnLine = Object.getOwnPropertyDescriptor(window.navigator, 'onLine');
const originalConnection = Object.getOwnPropertyDescriptor(window.navigator, 'connection');

const setOnline = (online: boolean) => {
	Object.defineProperty(window.navigator, 'onLine', {
		configurable: true,
		value: online,
	});
};

const setConnection = (connection: MockConnection | undefined) => {
	Object.defineProperty(window.navigator, 'connection', {
		configurable: true,
		value: connection,
	});
};

const restoreNavigator = () => {
	if (originalOnLine) {
		Object.defineProperty(window.navigator, 'onLine', originalOnLine);
	} else {
		delete (window.navigator as Navigator & { onLine?: boolean }).onLine;
	}

	if (originalConnection) {
		Object.defineProperty(window.navigator, 'connection', originalConnection);
	} else {
		delete (window.navigator as Navigator & { connection?: MockConnection }).connection;
	}
};

const loadUseNetworkState = async (): Promise<UseNetworkState> => {
	vi.resetModules();
	const module = await import('../src/useNetworkState');
	return module.default;
};

const createConnection = (overrides: Partial<MockConnection> = {}): MockConnection =>
	Object.assign(new EventTarget(), {
		downlink: 10,
		downlinkMax: 20,
		effectiveType: '4g' as const,
		rtt: 50,
		saveData: false,
		type: 'wifi' as const,
		...overrides,
	});

afterEach(() => {
	restoreNavigator();
	vi.useRealTimers();
	vi.clearAllMocks();
});

describe('useNetworkState', () => {
	it('should be defined', async () => {
		setOnline(true);
		setConnection(createConnection());

		const useNetworkState = await loadUseNetworkState();

		expect(useNetworkState).toBeDefined();
	});

	it('should expose the expected state shape', async () => {
		setOnline(true);
		setConnection(createConnection());

		const useNetworkState = await loadUseNetworkState();
		const hook = renderHook(() => useNetworkState(), { initialProps: false });

		expect(typeof hook.result.current).toBe('object');
		expect(Object.keys(hook.result.current)).toEqual([
			'online',
			'previous',
			'since',
			'downlink',
			'downlinkMax',
			'effectiveType',
			'rtt',
			'saveData',
			'type',
		]);
	});

	it('should update previous and since deterministically across network events', async () => {
		vi.useFakeTimers();

		const initialSince = new Date('2026-07-16T09:00:00.000Z');
		const offlineSince = new Date('2026-07-16T09:05:00.000Z');
		const onlineSince = new Date('2026-07-16T09:10:00.000Z');
		const connection = createConnection();

		setOnline(true);
		setConnection(connection);
		vi.setSystemTime(initialSince);

		const useNetworkState = await loadUseNetworkState();
		const { result } = renderHook(() => useNetworkState());

		expect(result.current).toMatchObject({
			online: true,
			previous: undefined,
			since: initialSince,
			downlink: 10,
			downlinkMax: 20,
			effectiveType: '4g',
			rtt: 50,
			saveData: false,
			type: 'wifi',
		});

		vi.setSystemTime(offlineSince);
		act(() => {
			setOnline(false);
			window.dispatchEvent(new Event('offline'));
		});

		expect(result.current.online).toBe(false);
		expect(result.current.previous).toBe(true);
		expect(result.current.since).toEqual(offlineSince);

		const persistedSince = result.current.since;

		vi.setSystemTime(new Date('2026-07-16T09:07:00.000Z'));
		act(() => {
			connection.downlink = 2;
			connection.effectiveType = '3g';
			connection.dispatchEvent(new Event('change'));
		});

		expect(result.current.online).toBe(false);
		expect(result.current.previous).toBe(false);
		expect(result.current.since).toBe(persistedSince);
		expect(result.current.downlink).toBe(2);
		expect(result.current.effectiveType).toBe('3g');

		vi.setSystemTime(onlineSince);
		act(() => {
			setOnline(true);
			window.dispatchEvent(new Event('online'));
		});

		expect(result.current.online).toBe(true);
		expect(result.current.previous).toBe(false);
		expect(result.current.since).toEqual(onlineSince);
	});
});
