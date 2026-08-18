import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        // Rolldown (this project's bundler as of Vite 8) only supports the function form of
        // manualChunks, not Rollup's older { chunkName: [...moduleIds] } object shorthand --
        // same chunking groups as before, just expressed as id-matching instead. Module ids
        // are normalized to forward slashes by the bundler regardless of host OS, so match
        // against '/' literally rather than path.sep (which is '\' on Windows and never
        // matches here).
        manualChunks(id) {
          if (!id.includes('node_modules')) return;
          if (id.includes('/node_modules/@vidstack/react/')) return 'vidstack';
          if (id.includes('/node_modules/framer-motion/')) return 'framer';
          if (
            id.includes('/node_modules/react/') ||
            id.includes('/node_modules/react-dom/') ||
            id.includes('/node_modules/react-router-dom/')
          ) {
            return 'vendor';
          }
        },
      },
    },
  },
});
