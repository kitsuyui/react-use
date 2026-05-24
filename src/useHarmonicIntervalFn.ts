import { useEffect, useRef } from 'react';

const useHarmonicIntervalFn = (fn: Function, delay: number | null = 0) => {
  const latestCallback = useRef<Function>(() => {});

  useEffect(() => {
    latestCallback.current = fn;
  });

  useEffect(() => {
    if (delay !== null) {
      const interval = setInterval(() => latestCallback.current(), delay);
      return () => clearInterval(interval);
    }
    return undefined;
  }, [delay]);
};

export default useHarmonicIntervalFn;
