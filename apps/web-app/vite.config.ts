import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@headless-media/core': path.resolve(__dirname, '../../packages/media-core/src'),
      '@headless-media/react': path.resolve(__dirname, '../../packages/media-react/src'),
      '@headless-media/ui-react': path.resolve(__dirname, '../../packages/media-ui-react/src'),
    },
  },
  server: {
    port: 3000,
    open: false,
  },
});
