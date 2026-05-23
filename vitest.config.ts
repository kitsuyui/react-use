import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		clearMocks: true,
		environment: 'jsdom',
		globals: true,
		include: ['tests/**/*.test.{ts,tsx}'],
		setupFiles: ['./tests/setupTests.ts'],
		coverage: {
			include: ['src/**/*.{ts,tsx}'],
			exclude: ['src/**/*.story.tsx'],
		},
	},
	clearScreen: false,
});
