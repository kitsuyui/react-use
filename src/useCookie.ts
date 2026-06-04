import { useCallback, useState } from 'react';

export interface CookieAttributes {
  /**
   * Cookie expiration. A number is interpreted as days from now; a Date is used
   * as the exact expiration timestamp.
   */
  expires?: number | Date;
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
}

const encode = encodeURIComponent;
const decode = decodeURIComponent;
const millisecondsPerDay = 864e5;

const getCookie = (cookieName: string): string | null => {
  if (typeof document === 'undefined') {
    return null;
  }

  const prefix = `${encode(cookieName)}=`;
  const cookie = document.cookie
    .split('; ')
    .find((item) => item.startsWith(prefix));

  return cookie ? decode(cookie.slice(prefix.length)) : null;
};

const setCookie = (cookieName: string, value: string, options: CookieAttributes = {}) => {
  if (typeof document === 'undefined') {
    return;
  }

  let cookie = `${encode(cookieName)}=${encode(value)}`;
  if (typeof options.expires === 'number') {
    const date = new Date();
    date.setTime(date.getTime() + options.expires * millisecondsPerDay);
    cookie += `; expires=${date.toUTCString()}`;
  } else if (options.expires instanceof Date) {
    cookie += `; expires=${options.expires.toUTCString()}`;
  }
  if (options.path) cookie += `; path=${options.path}`;
  if (options.domain) cookie += `; domain=${options.domain}`;
  if (options.sameSite) cookie += `; SameSite=${options.sameSite}`;
  if (options.secure) cookie += '; secure';

  document.cookie = cookie;
};

const removeCookie = (cookieName: string) => {
  setCookie(cookieName, '', { expires: new Date(0) });
};

const useCookie = (
  cookieName: string
): [string | null, (newValue: string, options?: CookieAttributes) => void, () => void] => {
  const [value, setValue] = useState<string | null>(() => getCookie(cookieName));

  const updateCookie = useCallback(
    (newValue: string, options?: CookieAttributes) => {
      setCookie(cookieName, newValue, options);
      setValue(newValue);
    },
    [cookieName]
  );

  const deleteCookie = useCallback(() => {
    removeCookie(cookieName);
    setValue(null);
  }, [cookieName]);

  return [value, updateCookie, deleteCookie];
};

export default useCookie;
