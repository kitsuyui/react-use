import { useCallback, useState } from 'react';
import useLifecycles from './useLifecycles';
import { isBrowser, off, on } from './misc/util';

/**
 * read and write url hash, response to url hash change
 */
export const useHash = () => {
  const [hash, setHash] = useState(() => (isBrowser ? window.location.hash : ''));

  const onHashChange = useCallback(() => {
    if (!isBrowser) {
      return;
    }
    setHash(window.location.hash);
  }, []);

  useLifecycles(
    () => {
      if (!isBrowser) {
        return;
      }
      on(window, 'hashchange', onHashChange);
    },
    () => {
      if (!isBrowser) {
        return;
      }
      off(window, 'hashchange', onHashChange);
    }
  );

  const _setHash = useCallback(
    (newHash: string) => {
      if (!isBrowser) {
        return;
      }
      if (newHash !== hash) {
        window.location.hash = newHash;
      }
    },
    [hash]
  );

  return [hash, _setHash] as const;
};
