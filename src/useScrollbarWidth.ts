import { useEffect, useState } from 'react';

const scrollbarWidth = (): number | undefined => {
  if (typeof document === 'undefined') {
    return undefined;
  }

  const outer = document.createElement('div');
  outer.style.visibility = 'hidden';
  outer.style.overflow = 'scroll';
  document.body.appendChild(outer);

  const inner = document.createElement('div');
  outer.appendChild(inner);
  const width = outer.offsetWidth - inner.offsetWidth;

  outer.parentNode?.removeChild(outer);
  return width;
};

export function useScrollbarWidth(): number | undefined {
  const [sbw, setSbw] = useState(scrollbarWidth());

  // this needed to ensure the scrollbar width in case hook called before the DOM is ready
  useEffect(() => {
    if (typeof sbw !== 'undefined') {
      return;
    }

    const raf = requestAnimationFrame(() => {
      setSbw(scrollbarWidth());
    });

    return () => cancelAnimationFrame(raf);
  }, []);

  return sbw;
}
