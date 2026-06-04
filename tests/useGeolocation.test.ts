import { renderHook } from '@testing-library/react-hooks';
import useGeolocation from '../src/useGeolocation';

const originalGeolocation = Object.getOwnPropertyDescriptor(navigator, 'geolocation');

const setGeolocation = (geolocation: Geolocation | undefined) => {
  Object.defineProperty(navigator, 'geolocation', {
    configurable: true,
    value: geolocation,
  });
};

const restoreGeolocation = () => {
  if (originalGeolocation) {
    Object.defineProperty(navigator, 'geolocation', originalGeolocation);
  } else {
    delete (navigator as Partial<Navigator>).geolocation;
  }
};

const createPosition = (overrides: Partial<GeolocationCoordinates> = {}): GeolocationPosition =>
  ({
    coords: {
      accuracy: 1,
      altitude: null,
      altitudeAccuracy: null,
      heading: null,
      latitude: 35,
      longitude: 139,
      speed: null,
      ...overrides,
    },
    timestamp: 123,
  }) as GeolocationPosition;

afterEach(() => {
  restoreGeolocation();
  jest.clearAllMocks();
});

it('should not throw when geolocation is not supported', () => {
  setGeolocation(undefined);

  const { result } = renderHook(() => useGeolocation());

  expect(result.current.loading).toBe(false);
  expect(result.current.error).toBeInstanceOf(Error);
  expect(result.current.error?.message).toBe('Geolocation is not supported');
});

it('should read the current position and start watching for updates', () => {
  const options = { enableHighAccuracy: true };
  const position = createPosition({ latitude: 51.5, longitude: -0.12 });
  const geolocation = {
    getCurrentPosition: vi.fn((success: PositionCallback) => {
      success(position);
    }),
    watchPosition: vi.fn(() => 42),
    clearWatch: vi.fn(),
  } as unknown as Geolocation;
  setGeolocation(geolocation);

  const { result, unmount } = renderHook(() => useGeolocation(options));

  expect(geolocation.getCurrentPosition).toHaveBeenCalledWith(
    expect.any(Function),
    expect.any(Function),
    options
  );
  expect(geolocation.watchPosition).toHaveBeenCalledWith(
    expect.any(Function),
    expect.any(Function),
    options
  );
  expect(result.current.loading).toBe(false);
  expect(result.current.latitude).toBe(51.5);
  expect(result.current.longitude).toBe(-0.12);

  unmount();

  expect(geolocation.clearWatch).toHaveBeenCalledWith(42);
});

it('should expose geolocation errors without throwing', () => {
  const error = {
    code: 1,
    message: 'Permission denied',
    PERMISSION_DENIED: 1,
    POSITION_UNAVAILABLE: 2,
    TIMEOUT: 3,
  };
  const geolocation = {
    getCurrentPosition: vi.fn((_success: PositionCallback, failure?: PositionErrorCallback | null) => {
      failure?.(error as GeolocationPositionError);
    }),
    watchPosition: vi.fn(() => 7),
    clearWatch: vi.fn(),
  } as unknown as Geolocation;
  setGeolocation(geolocation);

  const { result } = renderHook(() => useGeolocation());

  expect(result.current.loading).toBe(false);
  expect(result.current.error).toBe(error);
});
