import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@headless-media/core': path.resolve(__dirname, 'packages/media-core/src/index.ts'),
      '@headless-media/react': path.resolve(__dirname, 'packages/media-react/src/index.ts'),
      '@headless-media/ui-react': path.resolve(__dirname, 'packages/media-ui-react/src/index.ts'),
      '@headless-media/native': path.resolve(__dirname, 'packages/media-native/src/index.ts'),
      '@headless-media/ui-native': path.resolve(__dirname, 'packages/media-ui-native/src/index.ts'),
    },
  },
  test: {
    globals: true,
    environment: 'happy-dom',
    include: ['packages/**/*.test.{ts,tsx}', 'apps/**/*.test.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
  },
});
