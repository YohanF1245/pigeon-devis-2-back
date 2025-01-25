import { defineConfig } from 'vitest/config';
import swc from '@swc/core';

export default defineConfig({
  test: {
    globals: true,
    root: '.',
    environment: 'node',
    include: ['src/**/*.spec.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.ts'],
      exclude: ['src/**/*.spec.ts', 'src/**/*.d.ts'],
    },
    typecheck: {
      tsconfig: './tsconfig.json',
    },
    setupFiles: ['./vitest.setup.ts']
  },
  resolve: {
    alias: {
      '@src': '/src',
    },
  },
}); 