import { defineConfig } from 'vite';
import path from 'path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    port: 3000,   // Use port 3000 to avoid conflict with mockup on 5173
    strictPort: true,
  },
  resolve: {
    alias: {
      // @ maps to src/ — use @/features/..., @/shared/..., etc.
      '@': path.resolve(__dirname, './src'),
    },
  },
  assetsInclude: ['**/*.svg', '**/*.csv'],
  build: {
    // Ensure all assets are bundled locally (offline-safe)
    assetsInlineLimit: 0,
  },
});
