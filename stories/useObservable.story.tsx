import { storiesOf } from '@storybook/react';
import * as React from 'react';
import { useObservable } from '../src';
import ShowDocs from './util/ShowDocs';

class BehaviorSubject<T> {
  private listeners = new Set<(value: T) => void>();

  constructor(private value: T) {}

  next(value: T) {
    this.value = value;
    for (const listener of this.listeners) {
      listener(value);
    }
  }

  subscribe(listener: (value: T) => void) {
    listener(this.value);
    this.listeners.add(listener);
    return {
      unsubscribe: () => {
        this.listeners.delete(listener);
      },
    };
  }
}

const counter$ = new BehaviorSubject(0);
const Demo = () => {
  const value = useObservable(counter$, 0);

  return <button onClick={() => counter$.next(value! + 1)}>Clicked {value} times</button>;
};

storiesOf('State/useObservable', module)
  .add('Docs', () => <ShowDocs md={require('../docs/useObservable.md')} />)
  .add('Demo', () => <Demo />);
