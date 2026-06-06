import { useEffect, useRef } from 'react';

const useHarmonicIntervalFn = (fn: Function, delayMs: number | null = 0) => {
  const latestCallback = useRef<Function>(() => {});

  useEffect(() => {
    latestCallback.current = fn;
  });

  useEffect(() => {
    if (delayMs !== null) {
      const interval = setInterval(() => latestCallback.current(), delayMs);
      return () => clearInterval(interval);
    }
    return undefined;
  }, [delayMs]);
};

export default useHarmonicIntervalFn;
