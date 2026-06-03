# `usePromise`

React Lifecycle hook that returns a helper function for wrapping promises.
Promises wrapped with this function resolve only while the component is mounted.
If the component unmounts before the wrapped promise resolves, the wrapper rejects
so awaiting callers can run `catch` and `finally` handlers instead of staying
pending forever. Source promise rejections are forwarded as-is.


## Usage

```jsx
import {usePromise} from '@kitsuyui/react-use';

const Demo = ({promise}) => {
  const mounted = usePromise();
  const [value, setValue] = useState();

  useEffect(() => {
    (async () => {
      try {
        const value = await mounted(promise);
        setValue(value);
      } catch (error) {
        // Handle source errors and unmount-before-resolve cancellation.
      }
    })();
  });
};
```
