import type { Mock as VitestMock } from 'vitest';
import type { vi } from 'vitest';

declare global {
  const jest: typeof vi;

  namespace jest {
    type Mock = VitestMock;
  }

  interface Storage {
    __STORE__: Record<string, string>;
  }
}
