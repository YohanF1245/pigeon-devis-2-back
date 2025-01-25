import { defineConfig } from 'vitest/config';
import swc from '@swc/core';

export default defineConfig({
  test: {
    globals: true,
    root: '.',
    environment: 'node',
    include: ['test/**/*.e2e-spec.ts', 'src/**/*.spec.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
    typecheck: {
      tsconfig: './tsconfig.json',
    },
    setupFiles: ['./test/setup.ts'],
    deps: {
      inline: [/@nestjs/],
    },
    testTimeout: 30000,
  },
  esbuild: false,
  resolve: {
    alias: {
      '@src': '/src',
      '@test': '/test',
    },
  },
}); 