import { defineConfig } from 'vite';
import path from 'path';
import react from '@vitejs/plugin-react';

console.log(path.resolve(__dirname, './src'));
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      {
        find: '@',
        replacement: path.resolve(__dirname, './src'),
      },
    ],
  },
  build: {
    assetsInlineLimit: '102400' // 100kb
  },
});

