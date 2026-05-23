import { vi } from 'vitest';
import { isBrowser } from '../src/misc/util';

const useFakeTimers: typeof vi.useFakeTimers = ((...args: Parameters<typeof vi.useFakeTimers>) => {
  vi.useFakeTimers(...args);
  vi.spyOn(globalThis, 'setTimeout');
  vi.spyOn(globalThis, 'clearTimeout');
  vi.spyOn(globalThis, 'setInterval');
  vi.spyOn(globalThis, 'clearInterval');
  return vi;
}) as typeof vi.useFakeTimers;

Object.assign(globalThis, { jest: { ...vi, useFakeTimers } });

const store: Record<string, string> = {};

if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'localStorage', {
    value: {
      __STORE__: store,
      get length() {
        return Object.keys(store).length;
      },
      key(index: number) {
        return Object.keys(store)[index] ?? null;
      },
      getItem(key: string) {
        return Object.prototype.hasOwnProperty.call(store, key) ? store[key] : null;
      },
      setItem(key: string, value: string) {
        store[key] = String(value);
      },
      removeItem(key: string) {
        delete store[key];
      },
      clear() {
        for (const key of Object.keys(store)) {
          delete store[key];
        }
      },
    },
    configurable: true,
  });
}

if (isBrowser) {
  (window as any).ResizeObserver = class ResizeObserver {
    observe() {}

    disconnect() {}
  };
}
