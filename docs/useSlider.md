# `useSlider`

React UI hook that provides slide behavior over any HTML element. Supports both mouse and touch events.

## Usage

```jsx
import {useSlider} from '@kitsuyui/react-use';

const Demo = () => {
  const ref = React.useRef(null);
  const {isSliding, value, pos, length} = useSlider(ref);

  return (
    <div>
      <div ref={ref} style={{ position: 'relative' }}>
        <p style={{ textAlign: 'center', color: isSliding ? 'red' : 'green' }}>
          {Math.round(value * 100)}%
        </p>
        <div style={{ position: 'absolute', left: pos }}>🎚</div>
      </div>
    </div>
  );
};
```
