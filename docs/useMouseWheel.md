# `useMouseWheel`
React Hook to get the accumulated vertical wheel delta in CSS pixels.

## Usage

```jsx
import { useMouseWheel } from '@kitsuyui/react-use';

const Demo = () => {
  const mouseWheel = useMouseWheel()
  return (
    <>
      <h3>delta Y Scrolled: {mouseWheel}</h3>
    </>
  );
};
```

## Reference

```ts
const mouseWheel = useMouseWheel();
```

The returned value accumulates `WheelEvent.deltaY` in CSS pixels. Wheel events reported in line mode are converted with `16px` per line, and page mode events are converted with the current viewport height. Fractional pixel totals are rounded to avoid floating-point drift during long scrolling sessions.
