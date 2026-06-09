import { renderHook, act } from '@testing-library/react-hooks';
import { useCookie } from '../src';

const setup = (cookieName: string) => renderHook(() => useCookie(cookieName));

afterEach(() => {
	vi.restoreAllMocks();
	vi.useRealTimers();

	document.cookie.split(';').forEach((cookie) => {
		document.cookie = cookie
			.replace(/^ +/, '')
			.replace(/=.*/, '=;expires=' + new Date(0).toUTCString());
	});
});

it('should have initial value of null if no cookie exists', () => {
	const { result } = setup('some-cookie');

	expect(result.current[0]).toBeNull();
});

it('should have initial value of the cookie if it exists', () => {
	const cookieName = 'some-cookie';
	const value = 'some-value';
	document.cookie = `${cookieName}=${value}`;

	const { result } = setup(cookieName);

	expect(result.current[0]).toBe(value);
});

it('should update the cookie on call to updateCookie', () => {
	const cookieName = 'some-cookie';
	const { result } = setup(cookieName);

	const newValue = 'some-new-value';
	act(() => {
		result.current[1](newValue);
	});

	expect(result.current[0]).toBe(newValue);
	expect(document.cookie).toContain(`${cookieName}=${newValue}`);
});

it('should treat numeric expires as days when updating the cookie', () => {
	const cookieName = 'some-cookie';
	const now = new Date('2026-06-03T00:00:00.000Z');
	vi.useFakeTimers();
	vi.setSystemTime(now);
	const cookieSetter = vi.spyOn(Document.prototype, 'cookie', 'set');
	const { result } = setup(cookieName);

	act(() => {
		result.current[1]('some-new-value', { expires: 1 });
	});

	const lastCookieWrite = cookieSetter.mock.calls[cookieSetter.mock.calls.length - 1]?.[0];
	const expectedExpires = new Date(now.getTime() + 864e5).toUTCString();

	expect(lastCookieWrite).toContain(`${cookieName}=some-new-value`);
	expect(lastCookieWrite).toContain(`expires=${expectedExpires}`);
});

it('should throw when path contains a semicolon', () => {
	const { result } = setup('some-cookie');

	expect(() => {
		act(() => {
			result.current[1]('value', { path: '/app; SameSite=None; Secure' });
		});
	}).toThrow('Invalid cookie attribute "path"');
});

it('should throw when domain contains a semicolon', () => {
	const { result } = setup('some-cookie');

	expect(() => {
		act(() => {
			result.current[1]('value', { domain: 'example.com; SameSite=None' });
		});
	}).toThrow('Invalid cookie attribute "domain"');
});

it('should throw when path contains a newline', () => {
	const { result } = setup('some-cookie');

	expect(() => {
		act(() => {
			result.current[1]('value', { path: '/app\r\nSet-Cookie: injected=1' });
		});
	}).toThrow('Invalid cookie attribute "path"');
});

it('should delete the cookie on call to deleteCookie', () => {
	const cookieName = 'some-cookie';
	const value = 'some-value';
	document.cookie = `${cookieName}=${value}`;

	const { result } = setup(cookieName);

	expect(result.current[0]).toBe(value);

	act(() => {
		result.current[2]();
	});

	expect(result.current[0]).toBeNull();
	expect(document.cookie).not.toContain(`${cookieName}=`);
});
