# `useMeasure`

React sensor hook that tracks dimensions of an HTML element using the [Resize Observer API](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver).

## Usage

```jsx
import { useMeasure } from "react-use";

const Demo = () => {
  const [ref, { x, y, width, height, top, right, bottom, left }] = useMeasure();

  return (
    <div ref={ref}>
      <div>x: {x}</div>	
      <div>y: {y}</div>
      <div>width: {width}</div>
      <div>height: {height}</div>
      <div>top: {top}</div>
      <div>right: {right}</div>
      <div>bottom: {bottom}</div>
      <div>left: {left}</div>
    </div>
  );
};
```

This hook uses the [`ResizeObserver` API][resize-observer]. If you need to
support an environment without `ResizeObserver`, provide an implementation at
your app boundary before this hook runs.

```js
if (!window.ResizeObserver) {
  // Assign a ResizeObserver implementation here.
}
```


## Related hooks

- [useSize](./useSize.md)


[resize-observer]: https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver
