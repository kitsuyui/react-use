import { useState } from 'react';
import useIsomorphicLayoutEffect from './useIsomorphicLayoutEffect';

const useRaf = (durationMs: number = 1e12, delayMs: number = 0): number => {
  const [elapsed, set] = useState<number>(0);

  useIsomorphicLayoutEffect(() => {
    let raf = 0;
    let timerStop;
    let start: DOMHighResTimeStamp | undefined;

    const onFrame = (timestamp: DOMHighResTimeStamp) => {
      start = start ?? timestamp;
      const time = Math.min(1, (timestamp - start) / durationMs);
      set(time);
      loop();
    };
    const loop = () => {
      raf = requestAnimationFrame(onFrame);
    };
    const onStart = () => {
      timerStop = setTimeout(() => {
        cancelAnimationFrame(raf);
        set(1);
      }, durationMs);
      loop();
    };
    const timerDelay = setTimeout(onStart, delayMs);

    return () => {
      clearTimeout(timerStop);
      clearTimeout(timerDelay);
      cancelAnimationFrame(raf);
    };
  }, [durationMs, delayMs]);

  return elapsed;
};

export default useRaf;
