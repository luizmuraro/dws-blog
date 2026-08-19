import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config.ts';

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
      globals: true,
      setupFiles: ['./src/test/setup.ts'],
      css: false,
      include: ['src/**/*.test.{ts,tsx}'],
      restoreMocks: true,
      coverage: {
        provider: 'v8',
        reporter: ['text', 'html', 'lcov'],
        include: ['src/**/*.{ts,tsx}'],
        exclude: [
          'src/main.tsx',
          'src/routes.tsx',
          'src/test/**',
          'src/components/icons/**',
          'src/types/**',
          '**/*.stories.tsx',
          '**/*.d.ts',
        ],
        thresholds: {
          statements: 95,
          branches: 90,
          functions: 95,
          lines: 95,
        },
      },
    },
  }),
);
