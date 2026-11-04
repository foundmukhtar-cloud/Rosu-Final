import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          src: 'public/assets/rosu',
          dest: 'assets/rosu',
        },
        {
          src: 'public/assets/rosu/**',
          dest: 'assets/rosu',
        },
      ],
    }),
  ],
  server: {
    port: 5173,
  },
});
