import react from '@vitejs/plugin-react';
import { defineConfig } from 'electron-vite';
import path from 'path';

export default defineConfig({
  main: {},
  preload: {},
  renderer: {
    plugins: [react()],
    resolve: {
      alias: {
        '@shared': path.resolve(__dirname, 'src/shared'),
        '@components': path.resolve(__dirname, 'src/renderer/src/components'),
        '@pages': path.resolve(__dirname, 'src/renderer/src/pages'),
        '@hooks': path.resolve(__dirname, 'src/renderer/src/hooks'),
        '@assets': path.resolve(__dirname, 'src/renderer/src/assets'),
      },
    },
  },
});
