import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// Separate build target from vite.config.ts (which builds the demo/showcase app). This one
// produces the distributable player package: an ESM bundle with react/react-dom left external
// (peer deps, so the host app's own copy is used instead of bundling a second React) plus a
// standalone compiled CSS file, since every component here is styled with Tailwind utility
// classes that need to exist as real CSS for a host app that isn't running Tailwind itself.
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist-lib',
    sourcemap: true,
    cssCodeSplit: false,
    lib: {
      entry: path.resolve(__dirname, 'src/player/index.ts'),
      formats: ['es'],
      fileName: () => 'onilo-player.js',
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react-dom/client', 'react/jsx-runtime'],
      output: {
        assetFileNames: (asset) => (asset.names?.[0]?.endsWith('.css') ? 'onilo-player.css' : '[name][extname]'),
      },
    },
  },
});
