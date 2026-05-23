import { renderHook, act } from '@testing-library/react-hooks';
import { useCookie } from '../src';

const setup = (cookieName: string) => renderHook(() => useCookie(cookieName));

afterEach(() => {
  document.cookie.split(';').forEach((cookie) => {
    document.cookie = cookie.replace(/^ +/, '').replace(/=.*/, '=;expires=' + new Date(0).toUTCString());
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
