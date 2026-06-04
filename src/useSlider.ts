import { CSSProperties, RefObject, useEffect, useRef } from 'react';
import { isBrowser, noop, off, on } from './misc/util';
import useLatest from './useLatest';
import useMountedState from './useMountedState';
import useSetState from './useSetState';

export interface State {
  isSliding: boolean;
  value: number;
}

export interface Options {
  onScrub: (value: number) => void;
  onScrubStart: () => void;
  onScrubStop: (value: number) => void;
  reverse: boolean;
  styles: boolean | CSSProperties;
  vertical?: boolean;
}

const useSlider = (ref: RefObject<HTMLElement>, options: Partial<Options> = {}): State => {
  const isMounted = useMountedState();
  const isSliding = useRef(false);
  const valueRef = useRef(0);
  const frame = useRef(0);
  const optionsRef = useLatest(options);
  const [state, setState] = useSetState<State>({
    isSliding: false,
    value: 0,
  });

  valueRef.current = state.value;

  useEffect(() => {
    if (isBrowser) {
      const styles = options.styles === undefined ? true : options.styles;

      if (ref.current && styles) {
        ref.current.style.userSelect = 'none';
      }
    }
  }, [ref, options.styles]);

  useEffect(() => {
    if (isBrowser) {
      const element = ref.current;

      const startScrubbing = () => {
        if (!isSliding.current && isMounted()) {
          (optionsRef.current.onScrubStart || noop)();
          isSliding.current = true;
          setState({ isSliding: true });
          bindEvents();
        }
      };

      const stopScrubbing = () => {
        if (isSliding.current && isMounted()) {
          (optionsRef.current.onScrubStop || noop)(valueRef.current);
          isSliding.current = false;
          setState({ isSliding: false });
          unbindEvents();
        }
      };

      const onMouseDown = (event: MouseEvent) => {
        startScrubbing();
        onMouseMove(event);
      };
      const onMouseMove = (event: MouseEvent) => onScrub(event.clientX, event.clientY);

      const onTouchStart = (event: TouchEvent) => {
        startScrubbing();
        onTouchMove(event);
      };
      const onTouchMove = (event: TouchEvent) => {
        const touch = event.changedTouches[0];
        onScrub(touch.clientX, touch.clientY);
      };

      const bindEvents = () => {
        on(document, 'mousemove', onMouseMove);
        on(document, 'mouseup', stopScrubbing);

        on(document, 'touchmove', onTouchMove);
        on(document, 'touchend', stopScrubbing);
      };

      const unbindEvents = () => {
        off(document, 'mousemove', onMouseMove);
        off(document, 'mouseup', stopScrubbing);

        off(document, 'touchmove', onTouchMove);
        off(document, 'touchend', stopScrubbing);
      };

      const onScrub = (clientX: number, clientY: number) => {
        cancelAnimationFrame(frame.current);

        frame.current = requestAnimationFrame(() => {
          if (isMounted() && ref.current) {
            const { onScrub, reverse: latestReverse = false, vertical } = optionsRef.current;
            const rect = ref.current.getBoundingClientRect();
            const pos = vertical ? rect.top : rect.left;
            const length = vertical ? rect.height : rect.width;

            // Prevent returning 0 when element is hidden by CSS
            if (!length) {
              return;
            }

            const clientXY = vertical ? clientY : clientX;
            let value = (clientXY - pos) / length;

            if (value > 1) {
              value = 1;
            } else if (value < 0) {
              value = 0;
            }

            if (latestReverse) {
              value = 1 - value;
            }

            setState({
              value,
            });

            (onScrub || noop)(value);
          }
        });
      };

      on(element, 'mousedown', onMouseDown);
      on(element, 'touchstart', onTouchStart);

      return () => {
        off(element, 'mousedown', onMouseDown);
        off(element, 'touchstart', onTouchStart);
        unbindEvents();
      };
    } else {
      return undefined;
    }
  }, [ref, optionsRef, isMounted, setState]);

  return state;
};

export default useSlider;
