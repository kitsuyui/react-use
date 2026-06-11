import { useEffect, useRef } from 'react';

const useInterval = (callback: Function, delayMs?: number | null) => {
  const savedCallback = useRef<Function>(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delayMs !== null) {
      const interval = setInterval(() => savedCallback.current(), delayMs ?? 0);
      return () => clearInterval(interval);
    }

    return undefined;
  }, [delayMs]);
};

export default useInterval;
