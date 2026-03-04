import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import tailwindcss from "@tailwindcss/vite";
import path from 'path';

export default defineConfig(({ mode }) => {
  const isProductionMode = mode === 'production';

  return {
    plugins: [
      vue(),
      tailwindcss()
    ],
    base: isProductionMode
      ? '/sites/s-denga/'
      : '/',
    build: {
      manifest: true,
      target: [
        'esnext',
        'chrome100',
        'edge100',
        'firefox100',
        'safari15'
      ]
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src')
      }
    }
  };
});
