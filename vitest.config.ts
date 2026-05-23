import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    clearMocks: true,
    environment: 'jsdom',
    exclude: [
      // These suites still rely on Jest-specific fake timers, done callbacks,
      // or hoisted module mocks. Keep them explicit while the suite migrates.
      'tests/useAsync.test.tsx',
      'tests/useCopyToClipboard.test.ts',
      'tests/useIntersection.test.tsx',
      'tests/useInterval.test.ts',
      'tests/useRaf.test.ts',
      'tests/useSpring.test.ts',
      'tests/useThrottle.test.ts',
      'tests/useThrottleFn.test.ts',
      'tests/useTimeout.test.ts',
    ],
    globals: true,
    include: ['tests/**/*.test.{ts,tsx}'],
    setupFiles: ['./tests/setupTests.ts'],
    coverage: {
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/**/*.story.tsx'],
    },
  },
  clearScreen: false,
})
