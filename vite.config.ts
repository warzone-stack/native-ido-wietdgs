import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': {},
    global: 'globalThis',
  },
  resolve: {
    alias: {
      // Buffer: 'buffer',
      util: 'rollup-plugin-node-polyfills/polyfills/util',
      assert: 'rollup-plugin-node-polyfills/polyfills/assert',
      process: 'rollup-plugin-node-polyfills/polyfills/process-es6',
      stream: 'rollup-plugin-node-polyfills/polyfills/stream',
      // 其他需要的 polyfill
    },
  },
});
