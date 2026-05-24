import useRaf from './useRaf';

export type Easing = (t: number) => number;

export const easing: Record<string, Easing> = {
  inCirc: (t) => 1 - Math.sqrt(1 - t * t),
  outCirc: (t) => Math.sqrt(1 - (t - 1) * (t - 1)),
};

const useTween = (easingName: string = 'inCirc', ms: number = 200, delay: number = 0): number => {
  const fn: Easing = easing[easingName];
  const t = useRaf(ms, delay);

  if (process.env.NODE_ENV !== 'production') {
    if (typeof fn !== 'function') {
      console.error(
        'useTween() expected "easingName" property to be a valid easing function name, like:' +
          '"' +
          Object.keys(easing).join('", "') +
          '".'
      );
      console.trace();
      return 0;
    }
  }

  return fn(t);
};

export default useTween;
