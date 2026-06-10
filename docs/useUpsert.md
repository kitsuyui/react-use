# `useUpsert`

> DEPRECATED!
> Use `useList` hook's upsert action instead. `useUpsert` is planned for removal in v18.0.0.

Superset of [`useList`](./useList.md). Provides an additional method to upsert (update or insert) an element into the list.

## Usage

```jsx
import {useUpsert} from '@kitsuyui/react-use';

const Demo = () => {
  const comparisonFunction = (a: DemoType, b: DemoType) => {
    return a.id === b.id;
  };
  const [list, { set, upsert, removeAt }] = useUpsert(comparisonFunction, initialItems);

  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column' }}>
      {list.map((item: DemoType, index: number) => (
        <div key={item.id}>
          <input value={item.text} onChange={e => upsert({ ...item, text: e.target.value })} />
          <button onClick={() => removeAt(index)}>Remove</button>
        </div>
      ))}
      <button onClick={() => upsert({ id: (list.length + 1).toString(), text: '' })}>Add item</button>
      <button onClick={() => set([])}>Reset</button>
    </div>
  );
};
```

## Related hooks

- [useList](./useList.md)
