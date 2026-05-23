import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['./src/**/*.ts', './src/**/*.tsx'],
  format: ['cjs', 'esm'],
  target: 'es2020',
  platform: 'browser',
  dts: true,
  sourcemap: true,
  clean: true,
  treeshake: true,
  external: ['react', 'react-dom'],
})
